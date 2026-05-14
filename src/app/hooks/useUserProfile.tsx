import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "./useAuth";

export interface UserProfile {
  name: string;
  skinType: string;
  concerns: string[];
  onboardingSelections: any;
  glowScore: number;
  onboarded: boolean;
  apiKey: string;
  privacySave: boolean;
  routineChecks: { [key: string]: boolean };
  referralCode: string;
  joinDate: string;
  chatCount: number;
  sessionTime: number;
}

const DEFAULT_PROFILE: UserProfile = {
  name: "",
  skinType: "",
  concerns: [],
  onboardingSelections: {},
  glowScore: 65,
  onboarded: false,
  apiKey: "",
  privacySave: false,
  routineChecks: {},
  referralCode: "",
  joinDate: new Date().toISOString(),
  chatCount: 0,
  sessionTime: 0,
};

interface ProfileContextType {
  profile: UserProfile;
  loading: boolean;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  completeOnboarding: (name: string, skinType: string, concerns: string[]) => Promise<void>;
  toggleRoutineCheck: (id: string) => Promise<void>;
  incrementChatCount: () => Promise<void>;
  resetProfile: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

const mapFromSupabase = (data: any): UserProfile => ({
  name: data.full_name ?? DEFAULT_PROFILE.name,
  skinType: data.skin_type ?? DEFAULT_PROFILE.skinType,
  concerns: data.beauty_preferences ?? DEFAULT_PROFILE.concerns,
  onboardingSelections: data.onboarding_selections ?? DEFAULT_PROFILE.onboardingSelections,
  glowScore: data.glow_score ?? DEFAULT_PROFILE.glowScore,
  onboarded: data.onboarded ?? DEFAULT_PROFILE.onboarded,
  apiKey: data.api_key ?? DEFAULT_PROFILE.apiKey,
  privacySave: data.privacy_save ?? DEFAULT_PROFILE.privacySave,
  routineChecks: data.routine_checks ?? DEFAULT_PROFILE.routineChecks,
  referralCode: data.referral_code ?? DEFAULT_PROFILE.referralCode,
  joinDate: data.created_at ?? DEFAULT_PROFILE.joinDate,
  chatCount: data.chat_count ?? DEFAULT_PROFILE.chatCount,
  sessionTime: data.session_time ?? DEFAULT_PROFILE.sessionTime,
});

const mapToSupabase = (profile: Partial<UserProfile>) => {
  const mapped: any = {};
  if (profile.name !== undefined) mapped.full_name = profile.name;
  if (profile.skinType !== undefined) mapped.skin_type = profile.skinType;
  if (profile.concerns !== undefined) mapped.beauty_preferences = profile.concerns;
  if (profile.onboardingSelections !== undefined) mapped.onboarding_selections = profile.onboardingSelections;
  if (profile.glowScore !== undefined) mapped.glow_score = profile.glowScore;
  if (profile.onboarded !== undefined) mapped.onboarded = profile.onboarded;
  if (profile.apiKey !== undefined) mapped.api_key = profile.apiKey;
  if (profile.privacySave !== undefined) mapped.privacy_save = profile.privacySave;
  if (profile.routineChecks !== undefined) mapped.routine_checks = profile.routineChecks;
  if (profile.referralCode !== undefined) mapped.referral_code = profile.referralCode;
  if (profile.chatCount !== undefined) mapped.chat_count = profile.chatCount;
  if (profile.sessionTime !== undefined) mapped.session_time = profile.sessionTime;
  return mapped;
};

export const ProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);

  // Tracks which user ID we have successfully loaded a profile for.
  // null = no profile loaded, string = loaded for that user ID.
  const [loadedForUserId, setLoadedForUserId] = useState<string | null>(null);

  // Ref to track the last user ID we started fetching for, to avoid duplicate fetches
  // for the same user when Supabase fires multiple auth events with new object references.
  const lastFetchedIdRef = useRef<string | null>(null);

  // Derive the current user ID as a stable string (avoids object-identity rerenders)
  const userId = user?.id ?? null;

  // loading = true until auth resolves AND we have loaded the profile for the current user
  const loading = authLoading || (userId !== null && loadedForUserId !== userId);

  const fetchProfile = useCallback(async (uid: string) => {
    console.log("[ProfileProvider] fetchProfile START for:", uid);

    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", uid)
        .single();

      if (error && error.code === "PGRST116") {
        // No profile row → create one
        console.log("[ProfileProvider] No profile found, creating default for:", uid);
        const newProfileData = mapToSupabase(DEFAULT_PROFILE);
        const { data: created, error: createError } = await supabase
          .from("profiles")
          .upsert({ id: uid, ...newProfileData }, { onConflict: "id" })
          .select()
          .single();

        if (createError) {
          console.error("[ProfileProvider] Error creating profile:", createError);
        } else if (created) {
          const mapped = mapFromSupabase(created);
          console.log("[ProfileProvider] Created profile, onboarded =", mapped.onboarded);
          setProfile(mapped);
        }
      } else if (error) {
        console.error("[ProfileProvider] Error fetching profile:", error);
        console.error("[ProfileProvider] Error details — code:", error.code, "message:", error.message);
      } else if (data) {
        const mapped = mapFromSupabase(data);
        console.log("[ProfileProvider] Fetched profile from Supabase:", JSON.stringify({
          onboarded: mapped.onboarded,
          name: mapped.name,
          skinType: mapped.skinType,
        }));
        setProfile(mapped);
      }
    } catch (err) {
      console.error("[ProfileProvider] Exception:", err);
    } finally {
      // Mark this user's profile as loaded
      setLoadedForUserId(uid);
      console.log("[ProfileProvider] fetchProfile DONE for:", uid, "— loading will become false");
    }
  }, []);

  // React to auth user changes — but only fetch if the USER ID actually changed
  useEffect(() => {
    if (userId) {
      // Only fetch if we haven't already fetched (or started fetching) for this user
      if (lastFetchedIdRef.current !== userId) {
        lastFetchedIdRef.current = userId;
        console.log("[ProfileProvider] New user detected:", userId);
        fetchProfile(userId);
      } else {
        console.log("[ProfileProvider] Same user, skipping re-fetch:", userId);
      }
    } else {
      // User logged out
      lastFetchedIdRef.current = null;
      setLoadedForUserId(null);
      setProfile(DEFAULT_PROFILE);
      console.log("[ProfileProvider] User logged out, reset to default");
    }
  }, [userId, fetchProfile]);

  const updateProfile = async (updates: Partial<UserProfile>) => {
    // 1. Update local state immediately
    setProfile((prev) => ({ ...prev, ...updates }));

    // 2. Persist to Supabase
    if (userId) {
      const mapped = mapToSupabase(updates);
      console.log("[ProfileProvider] Persisting to Supabase:", JSON.stringify(mapped));
      const { error } = await supabase
        .from("profiles")
        .upsert({ id: userId, ...mapped }, { onConflict: "id" });

      if (error) {
        console.error("[ProfileProvider] FAILED to persist:", error.message);
      } else {
        console.log("[ProfileProvider] Successfully persisted to Supabase ✓");
      }
    } else {
      console.warn("[ProfileProvider] updateProfile called but no user is logged in!");
    }
  };

  const completeOnboarding = async (name: string, skinType: string, concerns: string[]) => {
    const prefix = name.slice(0, 3).toUpperCase() || "AUR";
    const suffix = Math.random().toString(36).substring(2, 7).toUpperCase();
    const code = `${prefix}-${suffix}`;
    const newScore = 60 + Math.floor(Math.random() * 15);

    console.log("[ProfileProvider] completeOnboarding called — will set onboarded=true");

    await updateProfile({
      name,
      skinType,
      concerns,
      onboarded: true,
      referralCode: code,
      glowScore: newScore,
      onboardingSelections: { name, skinType, concerns, completedAt: new Date().toISOString() },
    });

    console.log("[ProfileProvider] completeOnboarding DONE ✓");
  };

  const toggleRoutineCheck = async (id: string) => {
    const checks = { ...profile.routineChecks };
    checks[id] = !checks[id];
    const completedCount = Object.values(checks).filter(Boolean).length;
    const newScore = Math.min(100, 65 + completedCount);
    await updateProfile({ routineChecks: checks, glowScore: newScore });
  };

  const incrementChatCount = async () => {
    await updateProfile({ chatCount: profile.chatCount + 1 });
  };

  const resetProfile = async () => {
    setProfile(DEFAULT_PROFILE);
  };

  const refreshProfile = async () => {
    if (userId) {
      lastFetchedIdRef.current = null; // force re-fetch
      setLoadedForUserId(null);
      await fetchProfile(userId);
    }
  };

  return (
    <ProfileContext.Provider value={{
      profile,
      loading,
      updateProfile,
      completeOnboarding,
      toggleRoutineCheck,
      incrementChatCount,
      resetProfile,
      refreshProfile
    }}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useUserProfile = () => {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error("useUserProfile must be used within a ProfileProvider");
  }
  return context;
};
