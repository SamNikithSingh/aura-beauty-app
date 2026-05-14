import { useState, useRef, useEffect } from "react";
import { motion } from "motion/react";
import { Sparkles, RotateCcw } from "lucide-react";
import { useChat } from "../hooks/useChat";
import { useUsageLimits } from "../hooks/useUsageLimits";
import { useUserProfile } from "../hooks/useUserProfile";
import { ChatBubble, TypingIndicator } from "../components/chat/ChatBubble";
import { ChatInput } from "../components/chat/ChatInput";
import { PremiumPopup } from "../components/chat/PremiumPopup";

const SUGGESTED = [
  "What makeup suits me?",
  "Outfit ideas for a date",
  "Best hairstyle for my face",
  "Give me a glow-up plan",
];

export function ChatScreen() {
  const { profile } = useUserProfile();
  const { messages, sending, loading, sendMessage, uploadImage, newSession } = useChat("beauty");
  const { usage, incrementText, incrementImage } = useUsageLimits("beauty", { text: 10, image: 3 });
  const [showPremium, setShowPremium] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, sending]);

  const handleSend = async (text: string, imageUrl?: string | null) => {
    if (!usage.canSendText) {
      setShowPremium(true);
      return;
    }
    await sendMessage(text, imageUrl);
    await incrementText();
    if (imageUrl) await incrementImage();
  };

  const handleUpload = async (file: File) => {
    if (!usage.canUploadImage) {
      setShowPremium(true);
      return null;
    }
    return await uploadImage(file);
  };

  const welcomeMessage = {
    id: "welcome",
    role: "assistant" as const,
    content: `Hey ${profile.name || "gorgeous"}! 💄✨\n\nI'm **Aura Beauty AI** — your all-in-one beauty companion! I can help with:\n\n• Makeup advice & tutorials\n• Outfit recommendations\n• Hairstyle suggestions\n• Glow-up plans\n• Beauty analysis\n• Skincare tips\n\nWhat would you like to explore today? 💜`,
    imageUrl: null,
    createdAt: new Date().toISOString(),
  };

  const allMessages = messages.length === 0 ? [welcomeMessage] : messages;

  return (
    <div className="flex flex-col h-screen" style={{ background: "#F8F5FF" }}>
      {/* Header */}
      <div
        className="flex items-center gap-3 px-5 pt-14 pb-4 flex-shrink-0"
        style={{
          background: "#FFFFFF",
          borderBottom: "1px solid rgba(123, 63, 196, 0.08)",
          boxShadow: "0 2px 16px rgba(123, 63, 196, 0.06)",
        }}
      >
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
          style={{
            background: "linear-gradient(135deg, #7B3FC4 0%, #5421B5 100%)",
            boxShadow: "0 4px 12px rgba(123, 63, 196, 0.35)",
          }}
        >
          <span style={{ fontSize: 18, color: "white" }}>✦</span>
        </div>
        <div className="flex-1">
          <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, fontWeight: 600, color: "#1A1040" }}>
            Aura Beauty AI
          </p>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: "#7B3FC4", fontWeight: 500 }}>
            ● Your beauty companion
          </p>
        </div>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={newSession}
          className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background: "rgba(123, 63, 196, 0.08)", border: "1px solid rgba(123, 63, 196, 0.12)" }}
        >
          <RotateCcw size={15} color="#7B3FC4" />
        </motion.button>
      </div>

      {/* Loading state */}
      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#7B3FC4] border-t-transparent" />
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#A9A4C0" }}>
              Loading your chats...
            </p>
          </div>
        </div>
      ) : (
        <>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4" style={{ minHeight: 0 }}>
            {allMessages.map((msg) => (
              <ChatBubble key={msg.id} message={msg} avatarIcon="✦" />
            ))}
            {sending && <TypingIndicator avatarIcon="✦" />}

            {/* Suggested questions */}
            {messages.length === 0 && (
              <div className="pt-2">
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: "#A9A4C0", marginBottom: 8 }}>
                  Try asking...
                </p>
                <div className="flex flex-wrap gap-2">
                  {SUGGESTED.map((q) => (
                    <button
                      key={q}
                      onClick={() => handleSend(q)}
                      className="px-3 py-1.5 rounded-full"
                      style={{
                        background: "#FFFFFF",
                        border: "1.5px solid rgba(123, 63, 196, 0.2)",
                        fontFamily: "'Inter', sans-serif",
                        fontSize: 11,
                        color: "#7B3FC4",
                        fontWeight: 500,
                        boxShadow: "0 2px 8px rgba(123, 63, 196, 0.08)",
                      }}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <ChatInput
            onSend={handleSend}
            onUploadImage={handleUpload}
            sending={sending}
            canSendText={usage.canSendText}
            canUploadImage={usage.canUploadImage}
            textRemaining={usage.textRemaining}
            imageRemaining={usage.imageRemaining}
            onLimitHit={() => setShowPremium(true)}
            placeholder="Ask Aura anything..."
          />
        </>
      )}

      {/* Premium popup */}
      <PremiumPopup
        isOpen={showPremium}
        onClose={() => setShowPremium(false)}
        title="Beauty Chat Limit Reached"
        message="You've used your 5 free beauty chats today. Upgrade to Aura Premium for unlimited beauty advice, image analysis, and more!"
      />
    </div>
  );
}
