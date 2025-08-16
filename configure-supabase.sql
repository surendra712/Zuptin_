-- =====================================================
-- SUPABASE CONFIGURATION FOR ZUPTIN
-- =====================================================
-- Run this in Supabase SQL Editor to configure the project

-- 1. Create avatars storage bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'avatars',
  'avatars',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

-- 2. Create RLS policies for avatars bucket
CREATE POLICY "Avatar images are publicly accessible" ON storage.objects
  FOR SELECT USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload their own avatar" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'avatars' 
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can update their own avatar" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'avatars' 
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can delete their own avatar" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'avatars' 
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- 3. Create delete user function
CREATE OR REPLACE FUNCTION delete_user()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_uuid uuid;
BEGIN
  -- Get the current user's ID
  user_uuid := auth.uid();
  
  -- Check if user is authenticated
  IF user_uuid IS NULL THEN
    RAISE EXCEPTION 'User not authenticated';
  END IF;
  
  -- Delete user data in correct order (respecting foreign key constraints)
  DELETE FROM public.user_activity WHERE user_id = user_uuid;
  DELETE FROM public.platform_usage WHERE user_id = user_uuid;
  DELETE FROM public.user_preferences WHERE user_id = user_uuid;
  DELETE FROM public.profiles WHERE user_id = user_uuid;
END;
$$;

-- 4. Update the handle_new_user function to be more robust
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- Insert profile
    INSERT INTO public.profiles (id, user_id, email, full_name, phone_number)
    VALUES (
        NEW.id, 
        NEW.id, 
        NEW.email, 
        COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
        COALESCE(NEW.raw_user_meta_data->>'phone_number', '')
    )
    ON CONFLICT (user_id) DO UPDATE SET
        email = EXCLUDED.email,
        full_name = COALESCE(EXCLUDED.full_name, profiles.full_name),
        phone_number = COALESCE(EXCLUDED.phone_number, profiles.phone_number),
        updated_at = NOW();
    
    -- Insert user preferences
    INSERT INTO public.user_preferences (user_id, default_platform)
    VALUES (NEW.id, 'blinkit')
    ON CONFLICT (user_id) DO NOTHING;
    
    RETURN NEW;
END;
$$;

-- 5. Ensure the trigger exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 6. Create function to update user email in profiles when auth email changes
CREATE OR REPLACE FUNCTION public.handle_user_email_update()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- Update email in profiles table when auth email changes
    UPDATE public.profiles 
    SET 
        email = NEW.email,
        updated_at = NOW()
    WHERE user_id = NEW.id;
    
    RETURN NEW;
END;
$$;

-- 7. Create trigger for email updates
DROP TRIGGER IF EXISTS on_auth_user_email_updated ON auth.users;
CREATE TRIGGER on_auth_user_email_updated
    AFTER UPDATE OF email ON auth.users
    FOR EACH ROW 
    WHEN (OLD.email IS DISTINCT FROM NEW.email)
    EXECUTE FUNCTION public.handle_user_email_update();

-- =====================================================
-- CONFIGURATION COMPLETE
-- =====================================================

-- Verify setup
SELECT 'Setup verification:' as status;
SELECT 'Buckets:' as check, count(*) as count FROM storage.buckets WHERE id = 'avatars';
SELECT 'Functions:' as check, count(*) as count FROM pg_proc WHERE proname IN ('delete_user', 'handle_new_user', 'handle_user_email_update');
SELECT 'Tables:' as check, count(*) as count FROM information_schema.tables WHERE table_schema = 'public' AND table_name IN ('profiles', 'user_preferences', 'user_activity', 'platform_usage');