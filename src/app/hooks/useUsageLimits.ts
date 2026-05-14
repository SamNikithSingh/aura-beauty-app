import { useState, useEffect, useCallback } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "./useAuth";
import type { ChatType } from "./useChat";

interface UsageLimits {
  textCount: number;
  imageCount: number;
  textMax: number;
  imageMax: number;
  canSendText: boolean;
  canUploadImage: boolean;
  textRemaining: number;
  imageRemaining: number;
}

interface UsageLimitConfig {
  text: number;
  image: number;
}

export function useUsageLimits(chatType: ChatType, limits: UsageLimitConfig) {
  const { user } = useAuth();
  const userId = user?.id ?? null;

  const [textCount, setTextCount] = useState(0);
  const [imageCount, setImageCount] = useState(0);
  const [loaded, setLoaded] = useState(false);

  const fetchLimits = useCallback(async () => {
    if (!userId) return;

    const today = new Date().toISOString().split("T")[0];

    const { data, error } = await supabase
      .from("usage_limits")
      .select("*")
      .eq("user_id", userId)
      .eq("chat_type", chatType)
      .maybeSingle();

    if (error) {
      console.error("[useUsageLimits] Fetch error:", error);
      setLoaded(true);
      return;
    }

    if (!data) {
      // No record exists — create one
      await supabase.from("usage_limits").upsert(
        { user_id: userId, chat_type: chatType, text_count: 0, image_count: 0, reset_date: today },
        { onConflict: "user_id,chat_type" }
      );
      setTextCount(0);
      setImageCount(0);
    } else if (data.reset_date !== today) {
      // New day — reset counters
      await supabase
        .from("usage_limits")
        .update({ text_count: 0, image_count: 0, reset_date: today })
        .eq("id", data.id);
      setTextCount(0);
      setImageCount(0);
    } else {
      setTextCount(data.text_count);
      setImageCount(data.image_count);
    }

    setLoaded(true);
  }, [userId, chatType]);

  useEffect(() => {
    fetchLimits();
  }, [fetchLimits]);

  const incrementText = useCallback(async () => {
    if (!userId) return;
    const newCount = textCount + 1;
    setTextCount(newCount);

    await supabase
      .from("usage_limits")
      .update({ text_count: newCount })
      .eq("user_id", userId)
      .eq("chat_type", chatType);
  }, [userId, chatType, textCount]);

  const incrementImage = useCallback(async () => {
    if (!userId) return;
    const newCount = imageCount + 1;
    setImageCount(newCount);

    await supabase
      .from("usage_limits")
      .update({ image_count: newCount })
      .eq("user_id", userId)
      .eq("chat_type", chatType);
  }, [userId, chatType, imageCount]);

  const usage: UsageLimits = {
    textCount,
    imageCount,
    textMax: limits.text,
    imageMax: limits.image,
    canSendText: textCount < limits.text,
    canUploadImage: imageCount < limits.image,
    textRemaining: Math.max(0, limits.text - textCount),
    imageRemaining: Math.max(0, limits.image - imageCount),
  };

  return { usage, loaded, incrementText, incrementImage };
}
