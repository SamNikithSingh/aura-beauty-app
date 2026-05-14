import { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Send, ImagePlus, X, Sparkles } from "lucide-react";

interface ChatInputProps {
  onSend: (text: string, imageUrl?: string | null) => void;
  onUploadImage: (file: File) => Promise<string | null>;
  disabled?: boolean;
  sending?: boolean;
  canSendText: boolean;
  canUploadImage: boolean;
  textRemaining: number;
  imageRemaining: number;
  onLimitHit: () => void;
  placeholder?: string;
}

export function ChatInput({
  onSend,
  onUploadImage,
  disabled = false,
  sending = false,
  canSendText,
  canUploadImage,
  textRemaining,
  imageRemaining,
  onLimitHit,
  placeholder = "Type a message...",
}: ChatInputProps) {
  const [input, setInput] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSend = async () => {
    if ((!input.trim() && !imageFile) || disabled || sending) return;

    if (!canSendText) {
      onLimitHit();
      return;
    }

    let uploadedUrl: string | null = null;
    if (imageFile) {
      if (!canUploadImage) {
        onLimitHit();
        return;
      }
      setUploading(true);
      uploadedUrl = await onUploadImage(imageFile);
      setUploading(false);
    }

    onSend(input.trim() || "📸 Image shared", uploadedUrl);
    setInput("");
    setImagePreview(null);
    setImageFile(null);
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!canUploadImage) {
      onLimitHit();
      return;
    }

    setImageFile(file);
    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    setImageFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const isActive = (input.trim() || imageFile) && !disabled && !sending;

  return (
    <div
      className="px-4 py-3 flex-shrink-0"
      style={{ borderTop: "1px solid rgba(123, 63, 196, 0.08)", background: "#FFFFFF" }}
    >
      {/* Image preview */}
      <AnimatePresence>
        {imagePreview && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-3"
          >
            <div className="relative inline-block">
              <img
                src={imagePreview}
                alt="Preview"
                className="rounded-xl max-h-28 object-cover"
                style={{ border: "2px solid rgba(123, 63, 196, 0.2)" }}
              />
              <button
                onClick={removeImage}
                className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center"
                style={{
                  background: "linear-gradient(135deg, #EF4444, #DC2626)",
                  boxShadow: "0 2px 8px rgba(239, 68, 68, 0.4)",
                }}
              >
                <X size={12} color="white" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-end gap-2">
        {/* Image upload button */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => fileInputRef.current?.click()}
          className="flex-shrink-0 w-11 h-11 rounded-2xl flex items-center justify-center"
          style={{
            background: canUploadImage ? "rgba(123, 63, 196, 0.08)" : "rgba(200, 200, 200, 0.15)",
            border: `1.5px solid ${canUploadImage ? "rgba(123, 63, 196, 0.15)" : "rgba(200, 200, 200, 0.3)"}`,
          }}
        >
          <ImagePlus size={18} color={canUploadImage ? "#7B3FC4" : "#C5C2D4"} />
        </motion.button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageSelect}
          className="hidden"
        />

        {/* Text input */}
        <div
          className="flex-1 flex items-end rounded-2xl px-4 py-2.5"
          style={{
            background: "#F8F5FF",
            border: "1.5px solid rgba(123, 63, 196, 0.15)",
            minHeight: 44,
          }}
        >
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
            placeholder={placeholder}
            disabled={disabled || sending}
            className="flex-1 bg-transparent outline-none resize-none"
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 13.5,
              color: "#1A1040",
              lineHeight: 1.5,
            }}
          />
        </div>

        {/* Send button */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={handleSend}
          disabled={!isActive}
          className="flex-shrink-0 w-11 h-11 rounded-2xl flex items-center justify-center"
          style={{
            background: isActive
              ? "linear-gradient(135deg, #7B3FC4 0%, #5421B5 100%)"
              : "rgba(123, 63, 196, 0.08)",
            boxShadow: isActive ? "0 4px 16px rgba(123, 63, 196, 0.35)" : "none",
            transition: "all 0.2s ease",
          }}
        >
          {sending || uploading ? (
            <Sparkles size={16} color="#A9A4C0" />
          ) : (
            <Send size={16} color={isActive ? "white" : "#A9A4C0"} />
          )}
        </motion.button>
      </div>

      {/* Usage counter */}
      <div className="flex items-center justify-between mt-2 px-1">
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, color: "#C5C2D4" }}>
          💬 {textRemaining} texts · 📷 {imageRemaining} images left today
        </p>
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, color: "#C5C2D4" }}>
          🔒 Private & secure
        </p>
      </div>
    </div>
  );
}
