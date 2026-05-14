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

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center px-6"
          style={{ background: "rgba(26, 16, 64, 0.5)", backdropFilter: "blur(8px)" }}
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="w-full max-w-sm rounded-3xl overflow-hidden relative"
            style={{ background: "#FFFFFF", boxShadow: "0 24px 64px rgba(84, 33, 181, 0.25)" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Purple header gradient */}
            <div
              className="relative px-6 pt-8 pb-6 text-center"
              style={{
                background: "linear-gradient(135deg, #7B3FC4 0%, #5421B5 60%, #3D0D9E 100%)",
              }}
            >
              <div className="absolute top-0 right-0 w-40 h-40 rounded-full blur-3xl opacity-20"
                style={{ background: "radial-gradient(circle, #E879F9, transparent)", transform: "translate(30%, -30%)" }} />

              <button
                onClick={onClose}
                className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center"
                style={{ background: "rgba(255,255,255,0.15)" }}
              >
                <X size={16} color="white" />
              </button>

              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ background: "rgba(255,255,255,0.15)", border: "2px solid rgba(255,255,255,0.25)" }}
              >
                <Crown size={28} color="white" />
              </div>

              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 600, color: "white" }}>
                {title}
              </h2>
            </div>

            {/* Content */}
            <div className="px-6 py-6">
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13.5, color: "#4A4A6A", lineHeight: 1.7, textAlign: "center" }}>
                {message}
              </p>

              {/* Features list */}
              <div className="mt-5 space-y-3">
                {[
                  "Unlimited text messages",
                  "Unlimited image analysis",
                  "Priority AI responses",
                  "Exclusive skincare routines",
                ].map((feature) => (
                  <div key={feature} className="flex items-center gap-3">
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ background: "rgba(123, 63, 196, 0.1)" }}
                    >
                      <Sparkles size={12} color="#7B3FC4" />
                    </div>
                    <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#1A1040" }}>
                      {feature}
                    </span>
                  </div>
                ))}
              </div>

              {/* CTA buttons */}
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  onClose();
                  navigate("/premium");
                }}
                className="w-full mt-6 py-3.5 rounded-2xl flex items-center justify-center gap-2"
                style={{
                  background: "linear-gradient(135deg, #7B3FC4 0%, #5421B5 100%)",
                  boxShadow: "0 8px 24px rgba(123, 63, 196, 0.35)",
                }}
              >
                <Crown size={16} color="white" />
                <span style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: 14, color: "white" }}>
                  Upgrade to Premium
                </span>
              </motion.button>

              <button
                onClick={onClose}
                className="w-full mt-3 py-2.5 rounded-xl"
                style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#A9A4C0", fontWeight: 500 }}
              >
                Maybe later
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
