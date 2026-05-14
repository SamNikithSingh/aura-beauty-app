import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { useUserProfile } from "../hooks/useUserProfile";
import { useAuth } from "../hooks/useAuth";

export function SplashScreen() {
  const navigate = useNavigate();
  const { profile } = useUserProfile();
  const { session, loading } = useAuth();

  useEffect(() => {
    if (loading) return; // Wait for auth to initialize

    const timer = setTimeout(() => {
      if (!session) {
        navigate("/login");
      } else if (profile.onboarded) {
        navigate("/home");
      } else {
        navigate("/onboarding");
      }
    }, 2800);
    return () => clearTimeout(timer);
  }, [navigate, profile.onboarded, session, loading]);

  return (
    <div
      className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden"
      style={{
        background: "linear-gradient(145deg, #2D0A6E 0%, #5B21A3 45%, #7B3FC4 75%, #9B5FD4 100%)",
      }}
    >
      {/* Ambient glow circles */}
      <div
        className="absolute rounded-full blur-3xl opacity-30"
        style={{
          width: 320,
          height: 320,
          background: "radial-gradient(circle, #C084FC 0%, transparent 70%)",
          top: "8%",
          right: "-10%",
        }}
      />
      <div
        className="absolute rounded-full blur-3xl opacity-20"
        style={{
          width: 280,
          height: 280,
          background: "radial-gradient(circle, #E879F9 0%, transparent 70%)",
          bottom: "15%",
          left: "-5%",
        }}
      />
      <div
        className="absolute rounded-full blur-3xl opacity-15"
        style={{
          width: 200,
          height: 200,
          background: "radial-gradient(circle, #F8BBD0 0%, transparent 70%)",
          bottom: "30%",
          right: "10%",
        }}
      />

      {/* Logo area */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="flex flex-col items-center gap-4"
      >
        {/* Icon */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="relative"
        >
          <div
            className="w-28 h-28 rounded-full flex items-center justify-center"
            style={{
              background: "rgba(255,255,255,0.12)",
              boxShadow: "0 0 50px rgba(192, 132, 252, 0.5), 0 0 100px rgba(192, 132, 252, 0.25)",
              border: "1.5px solid rgba(255,255,255,0.3)",
            }}
          >
            {/* Aura face logo SVG */}
            <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
              <circle cx="32" cy="32" r="28" stroke="rgba(255,255,255,0.9)" strokeWidth="1.5" fill="none"/>
              <path d="M20 28 Q24 20 32 22 Q40 20 44 28" stroke="rgba(255,255,255,0.9)" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
              <path d="M18 36 Q22 46 32 48 Q42 46 46 36" stroke="rgba(255,255,255,0.9)" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
              <circle cx="25" cy="30" r="2" fill="rgba(255,255,255,0.8)"/>
              <circle cx="39" cy="30" r="2" fill="rgba(255,255,255,0.8)"/>
              <path d="M26 38 Q32 42 38 38" stroke="rgba(255,255,255,0.8)" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
            </svg>
          </div>
          {/* Pulse rings */}
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{ border: "1px solid rgba(192, 132, 252, 0.5)" }}
            animate={{ scale: [1, 1.5, 1.5], opacity: [0.7, 0, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 0.5 }}
          />
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{ border: "1px solid rgba(192, 132, 252, 0.3)" }}
            animate={{ scale: [1, 1.8, 1.8], opacity: [0.5, 0, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 0.5, delay: 0.3 }}
          />
        </motion.div>

        {/* Brand name */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="text-center"
        >
          <h1
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 56,
              fontWeight: 700,
              letterSpacing: 10,
              color: "white",
              lineHeight: 1.1,
              textShadow: "0 0 40px rgba(192, 132, 252, 0.6)",
            }}
          >
            AURA
          </h1>
          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 13,
              letterSpacing: 3,
              color: "rgba(255,255,255,0.7)",
              marginTop: 4,
              textTransform: "uppercase",
            }}
          >
            by Habbah
          </p>
        </motion.div>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.8 }}
          style={{
            fontFamily: "'Playfair Display', serif",
            fontStyle: "italic",
            fontSize: 19,
            color: "rgba(255,255,255,0.85)",
            letterSpacing: 0.5,
            marginTop: 6,
          }}
        >
          "Feel the real you"
        </motion.p>
      </motion.div>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.3, duration: 0.7 }}
        style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: 13,
          color: "rgba(255,255,255,0.5)",
          textAlign: "center",
          marginTop: 24,
          letterSpacing: 0.3,
          lineHeight: 1.6,
        }}
      >
        Your AI Beauty & Self-Care Assistant
      </motion.p>

      {/* Loading dots */}
      <motion.div
        className="absolute bottom-16 flex gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.5 }}
      >
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: "rgba(192, 132, 252, 0.9)" }}
            animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
            transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
          />
        ))}
      </motion.div>
    </div>
  );
}
