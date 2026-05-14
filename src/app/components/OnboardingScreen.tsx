import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { motion, AnimatePresence } from "motion/react";
import { useUserProfile } from "../hooks/useUserProfile";
import { ChevronRight, Sparkles } from "lucide-react";

const SKIN_TYPES = [
  { id: "oily", label: "Oily", desc: "Shiny by midday, large pores", emoji: "💧" },
  { id: "dry", label: "Dry", desc: "Tight, flaky, rough patches", emoji: "🌵" },
  { id: "combination", label: "Combination", desc: "Oily T-zone, dry cheeks", emoji: "☯️" },
  { id: "normal", label: "Normal", desc: "Balanced, minimal concerns", emoji: "✨" },
  { id: "sensitive", label: "Sensitive", desc: "Reacts easily, prone to redness", emoji: "🌸" },
];

const CONCERNS = [
  { id: "acne", label: "Acne & Breakouts", emoji: "🔴" },
  { id: "dark_spots", label: "Dark Spots", emoji: "🔆" },
  { id: "dullness", label: "Dullness", emoji: "💫" },
  { id: "fine_lines", label: "Fine Lines", emoji: "🕰️" },
  { id: "large_pores", label: "Large Pores", emoji: "🔬" },
  { id: "redness", label: "Redness", emoji: "🌹" },
  { id: "uneven_texture", label: "Uneven Texture", emoji: "🌊" },
  { id: "dehydration", label: "Dehydration", emoji: "💦" },
];

export function OnboardingScreen() {
  const navigate = useNavigate();
  const { session } = useAuth();
  const { profile, loading, completeOnboarding } = useUserProfile();
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [skinType, setSkinType] = useState("");
  const [concerns, setConcerns] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (!session) {
        navigate("/login", { replace: true });
      } else if (profile.onboarded) {
        console.log("[Onboarding] User already onboarded, redirecting to /home");
        navigate("/home", { replace: true });
      }
    }
  }, [session, loading, profile.onboarded, navigate]);

  const toggleConcern = (id: string) => {
    setConcerns((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const handleNext = async () => {
    if (step < 2) setStep((s) => s + 1);
    else {
      setSaving(true);
      // CRITICAL: await the Supabase write before navigating
      await completeOnboarding(name, skinType, concerns);
      navigate("/home");
    }
  };

  const canProceed =
    (step === 0 && name.trim().length >= 2) ||
    (step === 1 && skinType) ||
    (step === 2 && concerns.length >= 1);

  const steps = ["Your Name", "Skin Type", "Your Concerns"];

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#F8F5FF" }}>
      {/* Header */}
      <div className="px-6 pt-14 pb-4">
        {/* Progress bar */}
        <div className="flex items-center gap-1.5 mb-6">
          {steps.map((_, i) => (
            <motion.div
              key={i}
              className="h-1.5 rounded-full transition-all duration-500"
              style={{
                flex: i === step ? 2 : 1,
                background: i <= step
                  ? "linear-gradient(90deg, #7B3FC4, #A855F7)"
                  : "rgba(123, 63, 196, 0.15)",
              }}
            />
          ))}
        </div>
        <p
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: 12,
            color: "#A9A4C0",
            letterSpacing: 1.5,
            textTransform: "uppercase",
          }}
        >
          Step {step + 1} of 3 · {steps[step]}
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 overflow-y-auto pb-32">
        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div
              key="step0"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.35 }}
            >
              <div className="mb-8 mt-2">
                <h2
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: 32,
                    color: "#1A1040",
                    lineHeight: 1.3,
                  }}
                >
                  Let's Personalize<br />
                  <span
                    style={{
                      background: "linear-gradient(135deg, #7B3FC4 0%, #A855F7 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    Your Experience ✦
                  </span>
                </h2>
                <p
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: 15,
                    color: "#6B6880",
                    marginTop: 12,
                    lineHeight: 1.6,
                  }}
                >
                  Tell us a bit about you. First — what should I call you?
                </p>
              </div>

              <div
                className="rounded-2xl overflow-hidden"
                style={{
                  background: "#FFFFFF",
                  border: "1.5px solid rgba(123, 63, 196, 0.2)",
                  boxShadow: "0 4px 20px rgba(123, 63, 196, 0.08)",
                }}
              >
                <input
                  type="text"
                  placeholder="Your first name..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-transparent px-5 py-4 outline-none"
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: 20,
                    color: "#1A1040",
                    caretColor: "#7B3FC4",
                  }}
                  autoFocus
                />
              </div>

              {name.trim().length >= 2 && (
                <motion.p
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4"
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: 14,
                    color: "#7B3FC4",
                    fontWeight: 500,
                  }}
                >
                  ✨ Beautiful name, {name}!
                </motion.p>
              )}

              {/* Feature preview */}
              <div className="mt-8 grid grid-cols-2 gap-3">
                {[
                  { icon: "🤖", label: "AI Chat", sub: "Ask anything" },
                  { icon: "🔬", label: "Skin Analysis", sub: "Know your skin" },
                  { icon: "📋", label: "Routine Planner", sub: "Personalized for you" },
                  { icon: "📊", label: "Progress Tracker", sub: "Track your glow" },
                ].map((f) => (
                  <div
                    key={f.label}
                    className="rounded-2xl p-3 flex items-center gap-2"
                    style={{
                      background: "#FFFFFF",
                      border: "1px solid rgba(123, 63, 196, 0.08)",
                      boxShadow: "0 2px 12px rgba(123, 63, 196, 0.06)",
                    }}
                  >
                    <span style={{ fontSize: 20 }}>{f.icon}</span>
                    <div>
                      <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, fontWeight: 600, color: "#1A1040" }}>
                        {f.label}
                      </p>
                      <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, color: "#A9A4C0" }}>
                        {f.sub}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.35 }}
            >
              <div className="mb-8 mt-2">
                <h2
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: 30,
                    color: "#1A1040",
                    lineHeight: 1.3,
                  }}
                >
                  What's your<br />
                  <span
                    style={{
                      background: "linear-gradient(135deg, #7B3FC4 0%, #A855F7 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    skin type, {name}?
                  </span>
                </h2>
                <p
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: 14,
                    color: "#6B6880",
                    marginTop: 8,
                  }}
                >
                  This helps me tailor every recommendation just for you.
                </p>
              </div>

              <div className="flex flex-col gap-3">
                {SKIN_TYPES.map((type) => (
                  <motion.button
                    key={type.id}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setSkinType(type.id)}
                    className="flex items-center gap-4 px-5 py-4 rounded-2xl text-left transition-all duration-300"
                    style={{
                      background: skinType === type.id
                        ? "linear-gradient(135deg, rgba(123, 63, 196, 0.08) 0%, rgba(168, 85, 247, 0.1) 100%)"
                        : "#FFFFFF",
                      border: skinType === type.id
                        ? "1.5px solid #7B3FC4"
                        : "1.5px solid rgba(123, 63, 196, 0.1)",
                      boxShadow: skinType === type.id
                        ? "0 4px 20px rgba(123, 63, 196, 0.15)"
                        : "0 2px 10px rgba(0,0,0,0.04)",
                    }}
                  >
                    <span style={{ fontSize: 26 }}>{type.emoji}</span>
                    <div>
                      <p style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, color: skinType === type.id ? "#7B3FC4" : "#1A1040", fontSize: 15 }}>
                        {type.label}
                      </p>
                      <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#A9A4C0" }}>
                        {type.desc}
                      </p>
                    </div>
                    {skinType === type.id && (
                      <div
                        className="ml-auto w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ background: "linear-gradient(135deg, #7B3FC4, #A855F7)" }}
                      >
                        <span style={{ color: "white", fontSize: 12 }}>✓</span>
                      </div>
                    )}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.35 }}
            >
              <div className="mb-8 mt-2">
                <h2
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: 30,
                    color: "#1A1040",
                    lineHeight: 1.3,
                  }}
                >
                  What are your<br />
                  <span
                    style={{
                      background: "linear-gradient(135deg, #7B3FC4 0%, #A855F7 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    main concerns?
                  </span>
                </h2>
                <p
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: 14,
                    color: "#6B6880",
                    marginTop: 8,
                  }}
                >
                  Select all that apply — I'll address each one.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {CONCERNS.map((concern) => {
                  const selected = concerns.includes(concern.id);
                  return (
                    <motion.button
                      key={concern.id}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => toggleConcern(concern.id)}
                      className="flex flex-col items-center gap-2 px-4 py-4 rounded-2xl transition-all duration-300"
                      style={{
                        background: selected
                          ? "linear-gradient(135deg, rgba(123, 63, 196, 0.08), rgba(168, 85, 247, 0.1))"
                          : "#FFFFFF",
                        border: selected
                          ? "1.5px solid #7B3FC4"
                          : "1.5px solid rgba(123, 63, 196, 0.1)",
                        boxShadow: selected
                          ? "0 4px 16px rgba(123, 63, 196, 0.15)"
                          : "0 2px 10px rgba(0,0,0,0.04)",
                      }}
                    >
                      <span style={{ fontSize: 22 }}>{concern.emoji}</span>
                      <p
                        style={{
                          fontFamily: "'Inter', sans-serif",
                          fontSize: 12,
                          color: selected ? "#7B3FC4" : "#4A4A6A",
                          fontWeight: selected ? 600 : 400,
                          textAlign: "center",
                          lineHeight: 1.3,
                        }}
                      >
                        {concern.label}
                      </p>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom CTA */}
      <div
        className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full px-6 pb-10 pt-6"
        style={{
          maxWidth: 430,
          background: "linear-gradient(to top, #F8F5FF 70%, transparent)",
        }}
      >
        <motion.button
          whileTap={{ scale: 0.97 }}
          disabled={!canProceed || saving}
          onClick={handleNext}
          className="w-full py-4 rounded-2xl flex items-center justify-center gap-2 transition-all duration-300"
          style={{
            background: canProceed
              ? "linear-gradient(135deg, #7B3FC4 0%, #5421B5 100%)"
              : "rgba(123, 63, 196, 0.12)",
            boxShadow: canProceed ? "0 8px 32px rgba(123, 63, 196, 0.35)" : "none",
          }}
        >
          {step === 2 ? (
            <>
              <Sparkles size={18} color={canProceed ? "white" : "#A9A4C0"} />
              <span style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, color: canProceed ? "white" : "#A9A4C0", fontSize: 16 }}>
                Reveal My Aura ✦
              </span>
            </>
          ) : (
            <>
              <span style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, color: canProceed ? "white" : "#A9A4C0", fontSize: 16 }}>
                Continue
              </span>
              <ChevronRight size={18} color={canProceed ? "white" : "#A9A4C0"} />
            </>
          )}
        </motion.button>
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: "#B0AEC8", textAlign: "center", marginTop: 10 }}>
          🔒 Your data is private & secure. We don't store your photos without permission.
        </p>
      </div>
    </div>
  );
}
