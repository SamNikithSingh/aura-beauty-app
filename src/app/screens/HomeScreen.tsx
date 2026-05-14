import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { MessageCircle, Sun, ShoppingBag, TrendingUp, Crown, LogOut, ChevronRight, Sparkles, Droplets } from "lucide-react";
import { useUserProfile } from "../hooks/useUserProfile";
import { useAuth } from "../hooks/useAuth";

const QUICK_ACTIONS = [
  { icon: MessageCircle, label: "Ask Aura", sub: "AI Chat", path: "/chat", color: "#7B3FC4" },
  { icon: Droplets, label: "Skin Care", sub: "Routine & acne help", path: "/skincare-chat", color: "#06B6D4" },
  { icon: Sun, label: "Routine", sub: "Today's steps", path: "/routine", color: "#9333EA" },
  { icon: ShoppingBag, label: "Products", sub: "Picks for you", path: "/products", color: "#7C3AED" },
  { icon: TrendingUp, label: "Progress", sub: "Your glow", path: "/progress", color: "#6D28D9" },
];

const TIPS = [
  "💧 Always apply serums before moisturizer for max absorption.",
  "☀️ SPF is your #1 anti-aging tool — never skip it.",
  "🌙 Your skin repairs itself at night — use your best actives then.",
  "🫧 Double cleanse at night to remove sunscreen completely.",
  "✨ Vitamin C works best on clean skin in the morning.",
];

function GlowRing({ score }: { score: number }) {
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center" style={{ width: 130, height: 130 }}>
      <svg width="130" height="130" viewBox="0 0 130 130" style={{ position: "absolute", top: 0, left: 0, transform: "rotate(-90deg)" }}>
        {/* Track */}
        <circle cx="65" cy="65" r={radius} fill="none" stroke="rgba(123, 63, 196, 0.1)" strokeWidth="8" />
        {/* Progress */}
        <motion.circle
          cx="65"
          cy="65"
          r={radius}
          fill="none"
          stroke="url(#glowGradLight)"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference - progress }}
          transition={{ duration: 1.4, ease: "easeOut", delay: 0.4 }}
        />
        <defs>
          <linearGradient id="glowGradLight" x1="0" y1="0" x2="1" y2="0">
            <stop key="ggl-s1" offset="0%" stopColor="#A855F7" />
            <stop key="ggl-s2" offset="100%" stopColor="#7B3FC4" />
          </linearGradient>
        </defs>
      </svg>
      {/* Center */}
      <div className="flex flex-col items-center">
        <motion.span
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 32,
            fontWeight: 700,
            color: "#1A1040",
            lineHeight: 1,
          }}
        >
          {score}
        </motion.span>
        <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 9, color: "#A9A4C0", letterSpacing: 1, textTransform: "uppercase" }}>
          /100
        </span>
      </div>
    </div>
  );
}

export function HomeScreen() {
  const navigate = useNavigate();
  const { profile, resetProfile } = useUserProfile();
  const { signOut } = useAuth();
  const tipIndex = new Date().getDay();
  const tip = TIPS[tipIndex % TIPS.length];

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  const handleLogout = async () => {
    await signOut();
    resetProfile();
    navigate("/login");
  };

  const concernLabels: Record<string, string> = {
// ...
    acne: "Acne",
    dark_spots: "Dark Spots",
    dullness: "Dullness",
    fine_lines: "Fine Lines",
    large_pores: "Large Pores",
    redness: "Redness",
    uneven_texture: "Texture",
    dehydration: "Hydration",
  };

  return (
    <div className="min-h-screen" style={{ background: "#F8F5FF", paddingBottom: 8 }}>
      {/* Header */}
      <div className="px-5 pt-14 pb-4">
        <div className="flex items-start justify-between mb-1">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#A9A4C0", letterSpacing: 0.3 }}>
              {greeting} ✨
            </p>
            <h1
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 28,
                fontWeight: 600,
                color: "#1A1040",
                lineHeight: 1.2,
                marginTop: 2,
              }}
            >
              Hello, {profile.name || "Beautiful"} 👋
            </h1>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#6B6880", marginTop: 2 }}>
              Glow starts with you.
            </p>
          </motion.div>
          <div className="flex gap-2">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => navigate("/premium")}
              className="flex items-center justify-center rounded-full"
              style={{ width: 38, height: 38, background: "rgba(123, 63, 196, 0.08)", border: "1px solid rgba(123, 63, 196, 0.15)" }}
            >
              <Crown size={16} color="#7B3FC4" />
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleLogout}
              className="flex items-center justify-center rounded-full"
              style={{ width: 38, height: 38, background: "#FFFFFF", border: "1px solid rgba(123, 63, 196, 0.1)", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}
            >
              <LogOut size={16} color="#A9A4C0" />
            </motion.button>
          </div>
        </div>

        {/* Skin type tags */}
        {profile.skinType && (
          <div className="flex flex-wrap gap-2 mt-3">
            <span
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: 11,
                color: "#7B3FC4",
                background: "rgba(123, 63, 196, 0.1)",
                border: "1px solid rgba(123, 63, 196, 0.2)",
                borderRadius: 99,
                padding: "4px 12px",
                fontWeight: 500,
              }}
            >
              {profile.skinType.charAt(0).toUpperCase() + profile.skinType.slice(1)} Skin
            </span>
            {profile.concerns.slice(0, 2).map((c) => (
              <span
                key={c}
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 11,
                  color: "#6B6880",
                  background: "#FFFFFF",
                  border: "1px solid rgba(123, 63, 196, 0.08)",
                  borderRadius: 99,
                  padding: "4px 12px",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
                }}
              >
                {concernLabels[c] || c}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Glow Score Card */}
      <div className="px-5 mb-5">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="rounded-3xl p-5 overflow-hidden relative"
          style={{
            background: "linear-gradient(135deg, #7B3FC4 0%, #5421B5 60%, #3D0D9E 100%)",
            boxShadow: "0 12px 40px rgba(123, 63, 196, 0.35)",
          }}
        >
          {/* BG decor */}
          <div className="absolute top-0 right-0 w-40 h-40 rounded-full blur-3xl opacity-20"
            style={{ background: "radial-gradient(circle, #E879F9, transparent)", transform: "translate(30%, -30%)" }} />
          <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full blur-3xl opacity-15"
            style={{ background: "radial-gradient(circle, #C084FC, transparent)", transform: "translate(-20%, 30%)" }} />

          <div className="flex items-center justify-between relative z-10">
            <div>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "rgba(255,255,255,0.65)", letterSpacing: 0.5 }}>
                TODAY'S GLOW SCORE
              </p>
              <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, color: "white", marginTop: 6, lineHeight: 1.3 }}>
                {profile.glowScore >= 80 ? "You're glowing! ✨" : profile.glowScore >= 65 ? "Looking healthy 🌸" : "Keep it up! 💜"}
              </p>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "rgba(255,255,255,0.6)", marginTop: 4, lineHeight: 1.5 }}>
                Keep up your routine for<br />even better results!
              </p>
              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={() => navigate("/progress")}
                className="mt-4 flex items-center gap-1.5 px-4 py-2 rounded-full"
                style={{
                  background: "rgba(255,255,255,0.2)",
                  border: "1px solid rgba(255,255,255,0.3)",
                  backdropFilter: "blur(8px)",
                }}
              >
                <Sparkles size={13} color="white" />
                <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, fontWeight: 600, color: "white" }}>
                  View Progress
                </span>
              </motion.button>
            </div>
            {/* Score ring - white themed */}
            <div className="relative flex items-center justify-center" style={{ width: 110, height: 110 }}>
              <svg width="110" height="110" viewBox="0 0 110 110" style={{ position: "absolute", transform: "rotate(-90deg)" }}>
                <circle cx="55" cy="55" r="44" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="7" />
                <motion.circle
                  cx="55" cy="55" r="44"
                  fill="none" stroke="white" strokeWidth="7" strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * 44}
                  initial={{ strokeDashoffset: 2 * Math.PI * 44 }}
                  animate={{ strokeDashoffset: 2 * Math.PI * 44 * (1 - profile.glowScore / 100) }}
                  transition={{ duration: 1.4, ease: "easeOut", delay: 0.4 }}
                />
              </svg>
              <div className="flex flex-col items-center">
                <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 700, color: "white", lineHeight: 1 }}>
                  {profile.glowScore}
                </span>
                <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, color: "rgba(255,255,255,0.6)", textTransform: "uppercase", letterSpacing: 0.5 }}>
                  /100
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Daily Routine Summary */}
      <div className="px-5 mb-5">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.4 }}
          className="rounded-2xl p-4"
          style={{
            background: "#FFFFFF",
            border: "1px solid rgba(123, 63, 196, 0.08)",
            boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
          }}
        >
          <div className="flex items-center justify-between mb-3">
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 600, color: "#1A1040" }}>
              Daily Routine
            </p>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: "#A9A4C0" }}>
              Stay consistent, see results.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: "Morning", count: "4 steps", icon: "☀️", path: "/routine" },
              { label: "Night", count: "3 steps", icon: "🌙", path: "/routine" },
              { label: "Custom", count: "Edit", icon: "✏️", path: "/routine" },
            ].map((item) => (
              <motion.button
                key={item.label}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate(item.path)}
                className="flex flex-col items-center gap-1.5 py-3 rounded-xl"
                style={{
                  background: "rgba(123, 63, 196, 0.05)",
                  border: "1px solid rgba(123, 63, 196, 0.08)",
                }}
              >
                <span style={{ fontSize: 18 }}>{item.icon}</span>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, fontWeight: 600, color: "#1A1040" }}>
                  {item.label}
                </p>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, color: "#A9A4C0" }}>
                  {item.count}
                </p>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <div className="px-5 mb-5">
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#A9A4C0", letterSpacing: 1, textTransform: "uppercase", marginBottom: 12, fontWeight: 500 }}>
          Quick Actions
        </p>
        <div className="grid grid-cols-2 gap-3">
          {QUICK_ACTIONS.map((action, i) => {
            const Icon = action.icon;
            return (
              <motion.button
                key={action.path}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i + 0.3, duration: 0.4 }}
                onClick={() => navigate(action.path)}
                className="flex flex-col items-start p-4 rounded-2xl text-left"
                style={{
                  background: "#FFFFFF",
                  border: "1px solid rgba(123, 63, 196, 0.08)",
                  boxShadow: "0 4px 16px rgba(0,0,0,0.05)",
                }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                  style={{
                    background: `linear-gradient(135deg, ${action.color}20, ${action.color}35)`,
                    border: `1px solid ${action.color}25`,
                  }}
                >
                  <Icon size={18} color={action.color} />
                </div>
                <p style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: 13, color: "#1A1040" }}>
                  {action.label}
                </p>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: "#A9A4C0", marginTop: 2 }}>
                  {action.sub}
                </p>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Daily Tip */}
      <div className="px-5 mb-5">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.4 }}
          className="rounded-2xl p-4 relative overflow-hidden"
          style={{
            background: "linear-gradient(135deg, rgba(123, 63, 196, 0.07) 0%, rgba(168, 85, 247, 0.06) 100%)",
            border: "1px solid rgba(123, 63, 196, 0.12)",
          }}
        >
          <div className="flex items-start gap-3">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: "rgba(123, 63, 196, 0.1)", border: "1px solid rgba(123, 63, 196, 0.15)" }}
            >
              <Sparkles size={15} color="#7B3FC4" />
            </div>
            <div>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: "#7B3FC4", letterSpacing: 0.5, marginBottom: 4, textTransform: "uppercase", fontWeight: 600 }}>
                Aura's Tip of the Day
              </p>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#4A4A6A", lineHeight: 1.6 }}>
                {tip}
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Premium Banner */}
      <div className="px-5 mb-4">
        <motion.button
          whileTap={{ scale: 0.97 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.4 }}
          onClick={() => navigate("/premium")}
          className="w-full rounded-2xl p-4 flex items-center justify-between relative overflow-hidden"
          style={{
            background: "linear-gradient(135deg, #5421B5 0%, #3D0D9E 100%)",
            boxShadow: "0 8px 24px rgba(84, 33, 181, 0.3)",
          }}
        >
          <div className="absolute inset-0 opacity-10" style={{ background: "linear-gradient(135deg, #E879F9, transparent)" }} />
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: "rgba(255,255,255,0.15)" }}
            >
              <Crown size={18} color="white" />
            </div>
            <div className="text-left">
              <p style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: 13, color: "white" }}>
                Aura Premium 👑
              </p>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: "rgba(255,255,255,0.65)" }}>
                Unlock the best of Aura · 7 Days Free Trial
              </p>
            </div>
          </div>
          <ChevronRight size={16} color="rgba(255,255,255,0.7)" />
        </motion.button>
      </div>

      {/* Privacy badge */}
      <div className="px-5 pb-2">
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: "#C5C2D4", textAlign: "center" }}>
          🔒 Your data is private and secure
        </p>
      </div>
    </div>
  );
}
