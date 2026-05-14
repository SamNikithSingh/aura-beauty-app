import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sun, Moon, CheckCircle2, Circle, ChevronDown, Info, CheckCircle } from "lucide-react";
import { useUserProfile } from "../hooks/useUserProfile";
import { MORNING_ROUTINE, NIGHT_ROUTINE } from "../data/mockData";

type Tab = "morning" | "night";

interface RoutineStep {
  id: string;
  step: number;
  name: string;
  duration: string;
  tip: string;
  icon: string;
}

function StepCard({
  item,
  checked,
  onToggle,
}: {
  item: RoutineStep;
  checked: boolean;
  onToggle: () => void;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      layout
      className="rounded-2xl overflow-hidden"
      style={{
        background: checked
          ? "linear-gradient(135deg, rgba(123, 63, 196, 0.06) 0%, rgba(168, 85, 247, 0.08) 100%)"
          : "#FFFFFF",
        border: checked
          ? "1.5px solid rgba(123, 63, 196, 0.3)"
          : "1.5px solid rgba(123, 63, 196, 0.08)",
        boxShadow: checked
          ? "0 4px 16px rgba(123, 63, 196, 0.12)"
          : "0 2px 12px rgba(0,0,0,0.04)",
        transition: "all 0.3s ease",
      }}
    >
      <div className="flex items-center gap-3 p-4">
        {/* Step number */}
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
          style={{
            background: checked ? "rgba(123, 63, 196, 0.1)" : "rgba(123, 63, 196, 0.05)",
            border: `1px solid ${checked ? "rgba(123, 63, 196, 0.25)" : "rgba(123, 63, 196, 0.12)"}`,
          }}
        >
          <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, fontWeight: 600, color: checked ? "#7B3FC4" : "#A9A4C0" }}>
            {item.step}
          </span>
        </div>

        {/* Icon + Name */}
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <span style={{ fontSize: 20, flexShrink: 0 }}>{item.icon}</span>
          <div className="min-w-0">
            <p
              style={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: 500,
                fontSize: 14,
                color: checked ? "#7B3FC4" : "#1A1040",
                textDecoration: checked ? "line-through" : "none",
                opacity: checked ? 0.75 : 1,
              }}
            >
              {item.name}
            </p>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: "#A9A4C0" }}>
              ⏱ {item.duration}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <button onClick={() => setExpanded((v) => !v)}>
            <motion.div animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
              <ChevronDown size={15} color="#A9A4C0" />
            </motion.div>
          </button>
          <motion.button whileTap={{ scale: 0.9 }} onClick={onToggle}>
            {checked ? (
              <CheckCircle2 size={24} color="#7B3FC4" />
            ) : (
              <Circle size={24} color="#D4C8F0" />
            )}
          </motion.button>
        </div>
      </div>

      {/* Tip expansion */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            style={{ overflow: "hidden" }}
          >
            <div
              className="px-4 pb-4 flex items-start gap-2"
              style={{ borderTop: "1px solid rgba(123, 63, 196, 0.08)" }}
            >
              <Info size={13} color="#7B3FC4" style={{ marginTop: 12, flexShrink: 0 }} />
              <p
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 12,
                  color: "#6B6880",
                  lineHeight: 1.6,
                  marginTop: 10,
                }}
              >
                {item.tip}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function RoutineScreen() {
  const [tab, setTab] = useState<Tab>("morning");
  const { profile, toggleRoutineCheck } = useUserProfile();

  const routine = tab === "morning" ? MORNING_ROUTINE : NIGHT_ROUTINE;
  const checkedCount = routine.filter((item) => profile.routineChecks[item.id]).length;
  const progress = (checkedCount / routine.length) * 100;

  return (
    <div className="min-h-screen px-5 pt-14 pb-6" style={{ background: "#F8F5FF" }}>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#A9A4C0", letterSpacing: 1, textTransform: "uppercase", fontWeight: 500 }}>
          Daily Rituals
        </p>
        <h1
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 28,
            fontWeight: 600,
            color: "#1A1040",
            marginTop: 4,
            lineHeight: 1.2,
          }}
        >
          Routine Planner ✦
        </h1>
      </motion.div>

      {/* Tabs */}
      <div
        className="flex mt-6 mb-5 rounded-2xl p-1"
        style={{
          background: "#FFFFFF",
          border: "1.5px solid rgba(123, 63, 196, 0.1)",
          boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
        }}
      >
        {(["morning", "night"] as Tab[]).map((t) => (
          <motion.button
            key={t}
            whileTap={{ scale: 0.97 }}
            onClick={() => setTab(t)}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl transition-all duration-300"
            style={{
              background: tab === t ? "linear-gradient(135deg, #7B3FC4 0%, #5421B5 100%)" : "transparent",
              boxShadow: tab === t ? "0 4px 16px rgba(123, 63, 196, 0.3)" : "none",
            }}
          >
            {t === "morning"
              ? <Sun size={15} color={tab === t ? "white" : "#A9A4C0"} />
              : <Moon size={15} color={tab === t ? "white" : "#A9A4C0"} />
            }
            <span style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: 13, color: tab === t ? "white" : "#A9A4C0" }}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </span>
          </motion.button>
        ))}
      </div>

      {/* Progress */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15 }}
        className="mb-5 rounded-2xl p-4"
        style={{
          background: "#FFFFFF",
          border: "1.5px solid rgba(123, 63, 196, 0.08)",
          boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
        }}
      >
        <div className="flex items-center justify-between mb-3">
          <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#4A4A6A", fontWeight: 500 }}>
            {checkedCount} / {routine.length} steps completed
          </span>
          <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 700, color: "#7B3FC4" }}>
            {Math.round(progress)}%
          </span>
        </div>
        <div className="rounded-full overflow-hidden" style={{ height: 8, background: "rgba(123, 63, 196, 0.08)" }}>
          <motion.div
            className="h-full rounded-full"
            style={{ background: "linear-gradient(90deg, #7B3FC4, #A855F7)" }}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>
        {progress === 100 && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 mt-3"
          >
            <CheckCircle size={14} color="#7B3FC4" />
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#7B3FC4", fontWeight: 500 }}>
              Amazing! Routine complete — your skin will thank you!
            </p>
          </motion.div>
        )}
      </motion.div>

      {/* Mark as completed CTA */}
      {checkedCount === routine.length && checkedCount > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-4 rounded-2xl py-3 px-4 flex items-center justify-center gap-2"
          style={{
            background: "linear-gradient(135deg, #7B3FC4 0%, #5421B5 100%)",
            boxShadow: "0 8px 24px rgba(123, 63, 196, 0.3)",
          }}
        >
          <CheckCircle size={16} color="white" />
          <span style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: 14, color: "white" }}>
            Mark as Completed ✨
          </span>
        </motion.div>
      )}

      {/* Routine steps */}
      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col gap-3"
        >
          {routine.map((item) => (
            <StepCard
              key={item.id}
              item={item}
              checked={!!profile.routineChecks[item.id]}
              onToggle={() => toggleRoutineCheck(item.id)}
            />
          ))}
        </motion.div>
      </AnimatePresence>

      {/* Personalized tip */}
      {profile.skinType && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-5 rounded-2xl p-4"
          style={{
            background: "linear-gradient(135deg, rgba(123, 63, 196, 0.06), rgba(168, 85, 247, 0.06))",
            border: "1.5px solid rgba(123, 63, 196, 0.12)",
          }}
        >
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: "#7B3FC4", letterSpacing: 0.5, marginBottom: 4, textTransform: "uppercase", fontWeight: 600 }}>
            ✦ Tip for {profile.skinType} skin
          </p>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#4A4A6A", lineHeight: 1.6 }}>
            {profile.skinType === "oily" && "Use gel-based products and skip heavy oils. Your skin produces enough natural moisture!"}
            {profile.skinType === "dry" && "Apply moisturizer while skin is still slightly damp to lock in maximum hydration."}
            {profile.skinType === "combination" && "Use lightweight products on oily zones and richer formulas on drier cheek areas."}
            {profile.skinType === "sensitive" && "Patch test new products first, and always opt for fragrance-free formulas."}
            {profile.skinType === "normal" && "You have a great canvas! Focus on prevention and keeping your barrier healthy."}
          </p>
        </motion.div>
      )}
    </div>
  );
}
