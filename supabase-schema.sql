-- =====================================================
-- ZUPTIN APPLICATION - REMOTE DATABASE SCHEMA
-- =====================================================
-- This represents the current state of the remote database
-- Project ID: zrlleoiqdojhavohneed
-- =====================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =====================================================
-- CREATE TABLES
-- =====================================================

-- Profiles table for user information
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT,
    full_name TEXT,
    phone_number TEXT,
    avatar_url TEXT,
    bio TEXT,
    website TEXT,
    location TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- User preferences table for app settings
CREATE TABLE IF NOT EXISTS public.user_preferences (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    show_ads BOOLEAN DEFAULT true,
    push_notifications BOOLEAN DEFAULT true,
    email_notifications BOOLEAN DEFAULT true,
    default_platform TEXT DEFAULT 'blinkit',
    theme TEXT DEFAULT 'system',
    language TEXT DEFAULT 'en',
    currency TEXT DEFAULT 'INR',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- User activity table for tracking user actions
CREATE TABLE IF NOT EXISTS public.user_activity (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    activity_type TEXT NOT NULL,
    activity_data JSONB,
    platform TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Platform usage table for analytics
CREATE TABLE IF NOT EXISTS public.platform_usage (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    platform_name TEXT NOT NULL,
    usage_count INTEGER DEFAULT 1,
    last_used TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(user_id, platform_name)
);

-- =====================================================
-- ENABLE ROW LEVEL SECURITY
-- =====================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_activity ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.platform_usage ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- CREATE SECURITY POLICIES
-- =====================================================

-- Profiles policies
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can insert own profile" ON public.profiles
    FOR INSERT WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can delete own profile" ON public.profiles
    FOR DELETE USING ((SELECT auth.uid()) = user_id);

-- User preferences policies
CREATE POLICY "Users can view own preferences" ON public.user_preferences
    FOR SELECT USING ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can insert own preferences" ON public.user_preferences
    FOR INSERT WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can update own preferences" ON public.user_preferences
    FOR UPDATE USING ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can delete own preferences" ON public.user_preferences
    FOR DELETE USING ((SELECT auth.uid()) = user_id);

-- User activity policies
CREATE POLICY "Users can view own activity" ON public.user_activity
    FOR SELECT USING ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can insert own activity" ON public.user_activity
    FOR INSERT WITH CHECK ((SELECT auth.uid()) = user_id);

-- Platform usage policies
CREATE POLICY "Users can view own platform usage" ON public.platform_usage
    FOR SELECT USING ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can insert own platform usage" ON public.platform_usage
    FOR INSERT WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can update own platform usage" ON public.platform_usage
    FOR UPDATE USING ((SELECT auth.uid()) = user_id);

-- =====================================================
-- CREATE FUNCTIONS
-- =====================================================

-- Function to handle new user signup
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

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$;

-- Function to track platform usage
CREATE OR REPLACE FUNCTION public.track_platform_usage(platform_name TEXT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    INSERT INTO public.platform_usage (user_id, platform_name, usage_count, last_used)
    VALUES ((SELECT auth.uid()), platform_name, 1, NOW())
    ON CONFLICT (user_id, platform_name)
    DO UPDATE SET 
        usage_count = platform_usage.usage_count + 1,
        last_used = NOW(),
        updated_at = NOW();
END;
$$;

-- Function to log user activity
CREATE OR REPLACE FUNCTION public.log_user_activity(
    activity_type TEXT,
    activity_data JSONB DEFAULT NULL,
    platform TEXT DEFAULT NULL
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    INSERT INTO public.user_activity (user_id, activity_type, activity_data, platform)
    VALUES ((SELECT auth.uid()), activity_type, activity_data, platform);
END;
$$;

-- Function to safely delete user account
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

-- Function to update user email in profiles when auth email changes
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

-- =====================================================
-- CREATE TRIGGERS
-- =====================================================

-- Trigger to automatically create profile and preferences on signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Triggers for updated_at timestamps
CREATE TRIGGER handle_updated_at_profiles 
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_updated_at_preferences 
    BEFORE UPDATE ON public.user_preferences
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_updated_at_platform_usage 
    BEFORE UPDATE ON public.platform_usage
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Trigger for email updates
CREATE TRIGGER on_auth_user_email_updated
    AFTER UPDATE OF email ON auth.users
    FOR EACH ROW 
    WHEN (OLD.email IS DISTINCT FROM NEW.email)
    EXECUTE FUNCTION public.handle_user_email_update();

-- =====================================================
-- CREATE INDEXES FOR PERFORMANCE
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_user_preferences_user_id ON public.user_preferences(user_id);
CREATE INDEX IF NOT EXISTS idx_user_activity_user_id ON public.user_activity(user_id);
CREATE INDEX IF NOT EXISTS idx_user_activity_created_at ON public.user_activity(created_at);
CREATE INDEX IF NOT EXISTS idx_platform_usage_user_id ON public.platform_usage(user_id);
CREATE INDEX IF NOT EXISTS idx_platform_usage_platform_name ON public.platform_usage(platform_name);

-- =====================================================
-- SCHEMA COMPLETE
-- =====================================================