import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "./useAuth";

export type ChatType = "skincare" | "beauty";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  imageUrl: string | null;
  createdAt: string;
}

export interface ChatSession {
  id: string;
  chatType: ChatType;
  title: string;
  createdAt: string;
}

// Placeholder responses based on chat type
const SKINCARE_RESPONSES = [
  "Based on your skin type, I'd recommend starting with a gentle cleanser followed by a **niacinamide serum** — it's great for controlling oil and reducing dark spots! 💧\n\nWant me to suggest a full routine?",
  "Great question! For **acne-prone skin**, try these steps:\n\n1. **Salicylic acid cleanser** (morning)\n2. **Niacinamide 10% serum** (AM & PM)\n3. **Oil-free moisturizer**\n4. **SPF 50** (morning only)\n\nConsistency is key — give it 4-6 weeks! ✨",
  "Dark spots can be stubborn, but **Vitamin C** in the morning + **retinol** at night works wonders! 🌟\n\nStart with a low-concentration retinol (0.25%) and work your way up. Always use sunscreen during the day!",
  "For a **glow routine**, I'd suggest:\n\n☀️ **Morning**: Vitamin C serum → moisturizer → SPF\n🌙 **Night**: Double cleanse → hyaluronic acid → retinol → rich moisturizer\n\nYou'll notice a difference in 2-3 weeks! 💜",
];

const BEAUTY_RESPONSES = [
  "Love that you're thinking about your overall look! 💄\n\nFor a **natural glam** look, try:\n1. Dewy foundation or tinted moisturizer\n2. Cream blush on the cheeks\n3. Neutral eyeshadow palette\n4. Clear lip gloss or your-lips-but-better shade\n\nEffortlessly beautiful! ✨",
  "For your **hair type**, I'd suggest trying a layered cut — it adds volume and movement! 💇‍♀️\n\nPro tip: Use a **heat protectant** before any styling, and try air-drying with a curl cream for natural waves.",
  "Here's a **glow-up checklist** that works wonders:\n\n✅ Consistent skincare routine\n✅ Drink 2L water daily\n✅ 7-8 hours of sleep\n✅ Find your signature scent\n✅ Wardrobe capsule in your color palette\n\nSmall changes = big impact! 🌸",
  "For **outfit recommendations**, consider the **color season analysis**:\n\n🌷 **Spring**: Warm, light colors (peach, coral)\n☀️ **Summer**: Cool, muted tones (lavender, dusty rose)\n🍂 **Autumn**: Warm, deep hues (burgundy, olive)\n❄️ **Winter**: Bold, cool colors (emerald, berry)\n\nWant me to help find your season? 💜",
];

export function useChat(chatType: ChatType) {
  const { user } = useAuth();
  const [session, setSession] = useState<ChatSession | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const responseIndexRef = useRef(0);

  const userId = user?.id ?? null;

  // Load or create a chat session
  const initSession = useCallback(async () => {
    if (!userId) return;
    setLoading(true);

    try {
      // Try to find the most recent session of this type
      const { data: existing, error } = await supabase
        .from("chat_sessions")
        .select("*")
        .eq("user_id", userId)
        .eq("chat_type", chatType)
        .order("updated_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error("[useChat] Error fetching session:", error);
      }

      if (existing) {
        setSession({
          id: existing.id,
          chatType: existing.chat_type,
          title: existing.title,
          createdAt: existing.created_at,
        });

        // Load messages for this session
        const { data: msgs } = await supabase
          .from("chat_messages")
          .select("*")
          .eq("session_id", existing.id)
          .order("created_at", { ascending: true });

        if (msgs) {
          setMessages(
            msgs.map((m: any) => ({
              id: m.id,
              role: m.role,
              content: m.content,
              imageUrl: m.image_url,
              createdAt: m.created_at,
            }))
          );
        }
      } else {
        // Create a new session
        const title = chatType === "skincare" ? "Skin Care Chat" : "Beauty Chat";
        const { data: created, error: createErr } = await supabase
          .from("chat_sessions")
          .insert({ user_id: userId, chat_type: chatType, title })
          .select()
          .single();

        if (createErr) {
          console.error("[useChat] Error creating session:", createErr);
        } else if (created) {
          setSession({
            id: created.id,
            chatType: created.chat_type,
            title: created.title,
            createdAt: created.created_at,
          });
        }
      }
    } finally {
      setLoading(false);
    }
  }, [userId, chatType]);

  useEffect(() => {
    initSession();
  }, [initSession]);

  // Send a text message
  const sendMessage = useCallback(
    async (content: string, imageUrl?: string | null) => {
      if (!session || !userId || sending) return;
      setSending(true);

      const userMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: "user",
        content,
        imageUrl: imageUrl ?? null,
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, userMsg]);

      // Save user message to Supabase
      await supabase.from("chat_messages").insert({
        session_id: session.id,
        user_id: userId,
        role: "user",
        content,
        image_url: imageUrl ?? null,
      });

      // Update session timestamp
      await supabase
        .from("chat_sessions")
        .update({ updated_at: new Date().toISOString() })
        .eq("id", session.id);

      // Generate placeholder AI response
      const responses = chatType === "skincare" ? SKINCARE_RESPONSES : BEAUTY_RESPONSES;
      const aiContent = responses[responseIndexRef.current % responses.length];
      responseIndexRef.current++;

      // Simulate typing delay
      await new Promise((r) => setTimeout(r, 1200 + Math.random() * 800));

      const aiMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: aiContent,
        imageUrl: null,
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, aiMsg]);

      // Save AI message to Supabase
      await supabase.from("chat_messages").insert({
        session_id: session.id,
        user_id: userId,
        role: "assistant",
        content: aiContent,
        image_url: null,
      });

      setSending(false);
    },
    [session, userId, sending, chatType]
  );

  // Upload an image to Supabase Storage
  const uploadImage = useCallback(
    async (file: File): Promise<string | null> => {
      if (!userId) return null;

      const ext = file.name.split(".").pop();
      const filePath = `${userId}/${crypto.randomUUID()}.${ext}`;

      const { error } = await supabase.storage
        .from("chat-uploads")
        .upload(filePath, file);

      if (error) {
        console.error("[useChat] Upload error:", error);
        return null;
      }

      const { data } = supabase.storage
        .from("chat-uploads")
        .getPublicUrl(filePath);

      return data.publicUrl;
    },
    [userId]
  );

  // Start a new chat session
  const newSession = useCallback(async () => {
    if (!userId) return;
    setMessages([]);
    setSession(null);
    setLoading(true);

    const title = chatType === "skincare" ? "Skin Care Chat" : "Beauty Chat";
    const { data: created, error } = await supabase
      .from("chat_sessions")
      .insert({ user_id: userId, chat_type: chatType, title })
      .select()
      .single();

    if (!error && created) {
      setSession({
        id: created.id,
        chatType: created.chat_type,
        title: created.title,
        createdAt: created.created_at,
      });
    }
    setLoading(false);
  }, [userId, chatType]);

  return {
    session,
    messages,
    loading,
    sending,
    sendMessage,
    uploadImage,
    newSession,
  };
}
