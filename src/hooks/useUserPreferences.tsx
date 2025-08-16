import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

interface UserPreferences {
  id: string;
  user_id: string;
  show_ads: boolean;
  push_notifications: boolean;
  default_platform: string;
  created_at: string;
  updated_at: string;
}

export const useUserPreferences = () => {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchUserPreferences();
    } else {
      setPreferences(null);
      setLoading(false);
    }
  }, [user]);

  const fetchUserPreferences = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("user_preferences")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error("Error fetching preferences:", error);
        return;
      }

      if (!data) {
        // Create default preferences if they don't exist
        const { data: newPrefs, error: createError } = await supabase
          .from("user_preferences")
          .insert({
            user_id: user.id,
            show_ads: true,
            push_notifications: true,
            default_platform: 'blinkit'
          })
          .select()
          .single();

        if (createError) {
          console.error("Error creating preferences:", createError);
          return;
        }

        setPreferences(newPrefs);
      } else {
        setPreferences(data);
      }
    } catch (error) {
      console.error("Error with preferences:", error);
    } finally {
      setLoading(false);
    }
  };

  const updatePreferences = async (updates: Partial<UserPreferences>) => {
    if (!user || !preferences) return;

    try {
      const { data, error } = await supabase
        .from("user_preferences")
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", user.id)
        .select()
        .single();

      if (error) throw error;

      setPreferences(data);
      return data;
    } catch (error) {
      console.error("Error updating preferences:", error);
      throw error;
    }
  };

  return {
    preferences,
    loading,
    updatePreferences,
    fetchUserPreferences,
  };
};