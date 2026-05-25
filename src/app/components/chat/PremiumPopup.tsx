import { useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import { Crown, X, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface PremiumPopupProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
}

export function PremiumPopup({
  isOpen,
  onClose,
  title = "Daily Limit Reached",
  message = "You've used all your free messages for today. Upgrade to Aura Premium for unlimited chats, image analysis, and personalized AI advice!",
}: PremiumPopupProps) {
  const navigate = useNavigate();

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleEsc, true);
    return () => window.removeEventListener("keydown", handleEsc, true);
  }, [isOpen, onClose]);

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 flex items-center justify-center px-6"
          style={{ 
            background: "rgba(26, 16, 64, 0.7)", 
            backdropFilter: "blur(12px)", 
            WebkitBackdropFilter: "blur(12px)",
            zIndex: 999999, // Extremely high z-index
            pointerEvents: "auto"
          }}
          onClick={(e) => {
            console.log("Overlay clicked");
            onClose();
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: "spring", stiffness: 450, damping: 30 }}
            className="w-full max-w-sm rounded-[32px] overflow-hidden relative"
            style={{ 
              background: "#FFFFFF", 
              boxShadow: "0 32px 100px rgba(0, 0, 0, 0.4)",
              pointerEvents: "auto"
            }}
            onClick={(e) => {
              console.log("Modal content clicked");
              e.stopPropagation();
            }}
          >
            {/* Close Button - Placed at the top for highest hit priority */}
            <button
              type="button"
              onPointerDown={(e) => e.stopPropagation()} // Stop pointer down
              onClick={(e) => {
                console.log("X button clicked");
                e.stopPropagation();
                onClose();
              }}
              className="absolute top-4 right-4 w-12 h-12 rounded-full flex items-center justify-center cursor-pointer transition-all active:scale-90 hover:bg-black/5"
              style={{ 
                background: "rgba(240, 240, 255, 0.8)", 
                zIndex: 100,
                border: "none",
                outline: "none",
                display: "flex",
                pointerEvents: "auto"
              }}
              aria-label="Close"
            >
              <X size={24} color="#7B3FC4" strokeWidth={2.5} />
            </button>

            {/* Purple header gradient */}
            <div
              className="relative px-6 pt-12 pb-8 text-center"
              style={{
                background: "linear-gradient(135deg, #7B3FC4 0%, #5421B5 100%)",
              }}
            >
              <div className="absolute top-0 right-0 w-40 h-40 rounded-full blur-3xl opacity-20 pointer-events-none"
                style={{ background: "radial-gradient(circle, #E879F9, transparent)", transform: "translate(30%, -30%)" }} />

              <div
                className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5 relative"
                style={{ background: "rgba(255,255,255,0.15)", border: "2.5px solid rgba(255,255,255,0.3)" }}
              >
                <Crown size={36} color="white" />
              </div>

              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, fontWeight: 700, color: "white" }}>
                {title}
              </h2>
            </div>

            {/* Content */}
            <div className="px-7 py-8">
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14.5, color: "#4A4A6A", lineHeight: 1.6, textAlign: "center", marginBottom: 28 }}>
                {message}
              </p>

              {/* Features list */}
              <div className="space-y-4 mb-8">
                {[
                  "Unlimited text messages",
                  "Unlimited image analysis",
                  "Priority AI responses",
                  "Exclusive skincare routines",
                ].map((feature) => (
                  <div key={feature} className="flex items-center gap-4">
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ background: "rgba(123, 63, 196, 0.12)" }}
                    >
                      <Sparkles size={13} color="#7B3FC4" />
                    </div>
                    <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 13.5, color: "#1A1040", fontWeight: 500 }}>
                      {feature}
                    </span>
                  </div>
                ))}
              </div>

              {/* CTA buttons */}
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={(e) => {
                  e.stopPropagation();
                  onClose();
                  navigate("/premium");
                }}
                className="w-full py-4 rounded-2xl flex items-center justify-center gap-2"
                style={{
                  background: "linear-gradient(135deg, #7B3FC4 0%, #5421B5 100%)",
                  boxShadow: "0 10px 30px rgba(123, 63, 196, 0.4)",
                  border: "none",
                  cursor: "pointer",
                  pointerEvents: "auto"
                }}
              >
                <Crown size={18} color="white" />
                <span style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: 15, color: "white" }}>
                  Upgrade to Premium
                </span>
              </motion.button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onClose();
                }}
                className="w-full mt-4 py-3 rounded-xl border-none bg-transparent cursor-pointer"
                style={{ fontFamily: "'Inter', sans-serif", fontSize: 13.5, color: "#A9A4C0", fontWeight: 600 }}
              >
                Maybe later
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return createPortal(modalContent, document.body);
}
