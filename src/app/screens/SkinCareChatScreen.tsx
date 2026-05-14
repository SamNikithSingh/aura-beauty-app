import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowLeft, Droplets, RotateCcw } from "lucide-react";
import { useChat } from "../hooks/useChat";
import { useUsageLimits } from "../hooks/useUsageLimits";
import { useUserProfile } from "../hooks/useUserProfile";
import { ChatBubble, TypingIndicator } from "../components/chat/ChatBubble";
import { ChatInput } from "../components/chat/ChatInput";
import { PremiumPopup } from "../components/chat/PremiumPopup";

const SUGGESTED = [
  "How to clear acne fast?",
  "Best serum for dark spots",
  "Morning routine for oily skin",
  "Glow-up routine for tonight",
];

export function SkinCareChatScreen() {
  const navigate = useNavigate();
  const { profile } = useUserProfile();
  const { messages, sending, loading, sendMessage, uploadImage, newSession } = useChat("skincare");
  const { usage, incrementText, incrementImage } = useUsageLimits("skincare", { text: 10, image: 3 });
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
    content: `Hi ${profile.name || "beautiful"}! 🧴✨\n\nI'm your **Skin Care AI assistant**. I specialize in:\n\n• Acne & breakout solutions\n• Dark spot treatments\n• Skincare routines for your skin type\n• Product recommendations\n• Glow-up plans\n\nWhat skin concern can I help with today? 💜`,
    imageUrl: null,
    createdAt: new Date().toISOString(),
  };

  const allMessages = messages.length === 0 ? [welcomeMessage] : messages;

  return (
    <div className="flex flex-col h-screen" style={{ background: "#F8F5FF" }}>
      {/* Header */}
      <div
        className="flex items-center gap-3 px-4 pt-14 pb-4 flex-shrink-0"
        style={{
          background: "#FFFFFF",
          borderBottom: "1px solid rgba(123, 63, 196, 0.08)",
          boxShadow: "0 2px 16px rgba(123, 63, 196, 0.06)",
        }}
      >
        <motion.button whileTap={{ scale: 0.9 }} onClick={() => navigate("/home")}>
          <ArrowLeft size={20} color="#7B3FC4" />
        </motion.button>
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
          style={{
            background: "linear-gradient(135deg, #06B6D4 0%, #0891B2 100%)",
            boxShadow: "0 4px 12px rgba(6, 182, 212, 0.35)",
          }}
        >
          <Droplets size={18} color="white" />
        </div>
        <div className="flex-1">
          <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, fontWeight: 600, color: "#1A1040" }}>
            Skin Care Chat
          </p>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: "#06B6D4", fontWeight: 500 }}>
            ● Skincare AI specialist
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
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#7B3FC4] border-t-transparent" />
        </div>
      ) : (
        <>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4" style={{ minHeight: 0 }}>
            {allMessages.map((msg) => (
              <ChatBubble key={msg.id} message={msg} avatarIcon="🧴" />
            ))}
            {sending && <TypingIndicator avatarIcon="🧴" />}

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
                        border: "1.5px solid rgba(6, 182, 212, 0.25)",
                        fontFamily: "'Inter', sans-serif",
                        fontSize: 11,
                        color: "#0891B2",
                        fontWeight: 500,
                        boxShadow: "0 2px 8px rgba(6, 182, 212, 0.08)",
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
            placeholder="Ask about skincare..."
          />
        </>
      )}

      {/* Premium popup */}
      <PremiumPopup
        isOpen={showPremium}
        onClose={() => setShowPremium(false)}
        title="Skin Care Limit Reached"
        message="You've used your 10 free skincare chats today. Upgrade to Premium for unlimited expert skincare advice!"
      />
    </div>
  );
}
