// src/lib/userActions.ts
import { supabase } from '../integrations/supabase/client';

type ProfileUpdates = {
  full_name?: string;
  phone?: string;
  avatar_url?: string;
  bio?: string;
};

export async function updateProfile(userId: string, updates: ProfileUpdates) {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    console.error('Error updating profile:', errorMessage);
    return { success: false, error: errorMessage };
  }
}

export async function updateEmail(newEmail: string) {
  try {
    const { data, error } = await supabase.auth.updateUser({ email: newEmail });
    if (error) throw error;

    return { success: true, data };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    console.error('Error updating email:', errorMessage);
    return { success: false, error: errorMessage };
  }
}

export async function changePassword(newPassword: string) {
  try {
    const { data, error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) throw error;

    return { success: true, data };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    console.error('Error changing password:', errorMessage);
    return { success: false, error: errorMessage };
  }
}

export async function deleteAccount() {
  try {
    // Force cast to avoid TypeScript error on rpc
    const { error } = await (supabase as any).rpc('delete_user');
    if (error) throw error;

    await supabase.auth.signOut();
    return { success: true };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    console.error('Error deleting account:', errorMessage);
    return { success: false, error: errorMessage };
  }
}
