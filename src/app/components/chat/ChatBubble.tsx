import { motion } from "motion/react";
import type { ChatMessage } from "../../hooks/useChat";

function formatMessage(content: string) {
  const parts = content.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i} style={{ color: "#1A1040", fontWeight: 600 }}>{part.slice(2, -2)}</strong>;
    }
    return <span key={i}>{part}</span>;
  });
}

interface ChatBubbleProps {
  message: ChatMessage;
  avatarIcon?: string;
}

export function ChatBubble({ message, avatarIcon = "✦" }: ChatBubbleProps) {
  const isUser = message.role === "user";
  const time = new Date(message.createdAt).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex ${isUser ? "justify-end" : "justify-start"} gap-2`}
    >
      {!isUser && (
        <div
          className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center mt-0.5"
          style={{
            background: "linear-gradient(135deg, #7B3FC4 0%, #5421B5 100%)",
            boxShadow: "0 2px 8px rgba(123, 63, 196, 0.3)",
            fontSize: 13,
            color: "white",
          }}
        >
          {avatarIcon}
        </div>
      )}
      <div className="max-w-[80%] flex flex-col gap-1.5">
        {/* Image preview */}
        {message.imageUrl && (
          <div
            className="rounded-2xl overflow-hidden"
            style={{
              border: isUser ? "none" : "1px solid rgba(123, 63, 196, 0.08)",
              boxShadow: isUser
                ? "0 4px 16px rgba(123, 63, 196, 0.3)"
                : "0 2px 12px rgba(0,0,0,0.05)",
            }}
          >
            <img
              src={message.imageUrl}
              alt="Uploaded"
              className="w-full max-h-48 object-cover"
              style={{ borderRadius: 16 }}
            />
          </div>
        )}
        {/* Text bubble */}
        <div
          className="rounded-2xl px-4 py-3"
          style={
            isUser
              ? {
                  background: "linear-gradient(135deg, #7B3FC4 0%, #5421B5 100%)",
                  borderBottomRightRadius: 4,
                  boxShadow: "0 4px 16px rgba(123, 63, 196, 0.3)",
                }
              : {
                  background: "#FFFFFF",
                  border: "1px solid rgba(123, 63, 196, 0.08)",
                  borderBottomLeftRadius: 4,
                  boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
                }
          }
        >
          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 13.5,
              color: isUser ? "white" : "#1A1040",
              lineHeight: 1.65,
              whiteSpace: "pre-line",
            }}
          >
            {isUser ? message.content : formatMessage(message.content)}
          </p>
          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 10,
              color: isUser ? "rgba(255,255,255,0.5)" : "#B0AEC8",
              marginTop: 4,
            }}
          >
            {time}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export function TypingIndicator({ avatarIcon = "✦" }: { avatarIcon?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex gap-2 items-start"
    >
      <div
        className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center"
        style={{
          background: "linear-gradient(135deg, #7B3FC4 0%, #5421B5 100%)",
          fontSize: 13,
          color: "white",
        }}
      >
        {avatarIcon}
      </div>
      <div
        className="rounded-2xl px-4 py-3"
        style={{
          background: "#FFFFFF",
          border: "1px solid rgba(123, 63, 196, 0.08)",
          borderBottomLeftRadius: 4,
          boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
        }}
      >
        <div className="flex items-center gap-1.5">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 rounded-full"
              style={{ background: "#7B3FC4" }}
              animate={{ y: [0, -5, 0], opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}
