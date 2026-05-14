import { useState } from "react";
import { motion } from "motion/react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingUp, Calendar, Award, Sparkles } from "lucide-react";
import { useUserProfile } from "../hooks/useUserProfile";
import { WEEKLY_PROGRESS, IMPROVEMENTS } from "../data/mockData";

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: { value: number }[]; label?: string }) => {
  if (active && payload && payload.length) {
    return (
      <div
        className="px-3 py-2 rounded-xl"
        style={{
          background: "#FFFFFF",
          border: "1.5px solid rgba(123, 63, 196, 0.2)",
          boxShadow: "0 4px 20px rgba(123, 63, 196, 0.15)",
          fontFamily: "'Inter', sans-serif",
        }}
      >
        <p style={{ fontSize: 11, color: "#A9A4C0" }}>{label}</p>
        <p style={{ fontSize: 14, fontWeight: 700, color: "#7B3FC4" }}>Score: {payload[0].value}</p>
      </div>
    );
  }
  return null;
};

function ImprovementBar({ label, before, after, icon }: { label: string; before: number; after: number; icon: string }) {
  const gain = after - before;
  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span style={{ fontSize: 16 }}>{icon}</span>
          <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#1A1040", fontWeight: 500 }}>{label}</span>
        </div>
        <span
          className="px-2 py-0.5 rounded-full"
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: 11,
            color: "#16A34A",
            fontWeight: 700,
            background: "rgba(34, 197, 94, 0.1)",
            border: "1px solid rgba(34, 197, 94, 0.2)",
          }}
        >
          +{gain}%
        </span>
      </div>
      <div className="relative" style={{ height: 8, background: "rgba(123, 63, 196, 0.08)", borderRadius: 99 }}>
        {/* Before bar */}
        <motion.div
          className="absolute left-0 top-0 h-full rounded-full"
          style={{ background: "rgba(123, 63, 196, 0.15)" }}
          initial={{ width: 0 }}
          animate={{ width: `${before}%` }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
        />
        {/* After bar */}
        <motion.div
          className="absolute left-0 top-0 h-full rounded-full"
          style={{ background: "linear-gradient(90deg, #7B3FC4, #A855F7)" }}
          initial={{ width: 0 }}
          animate={{ width: `${after}%` }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.4 }}
        />
      </div>
      <div className="flex items-center justify-between mt-1">
        <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, color: "#B0AEC8" }}>Start: {before}%</span>
        <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, color: "#7B3FC4", fontWeight: 600 }}>Now: {after}%</span>
      </div>
    </div>
  );
}

const TIME_RANGES = ["Week", "Month", "Year"];

export function ProgressScreen() {
  const { profile } = useUserProfile();
  const [activeRange, setActiveRange] = useState("Week");

  const weeklyChange = WEEKLY_PROGRESS[WEEKLY_PROGRESS.length - 1].score - WEEKLY_PROGRESS[0].score;
  const daysActive = Math.max(1, Math.floor((Date.now() - new Date(profile.joinDate).getTime()) / (1000 * 60 * 60 * 24)));

  return (
    <div className="min-h-screen px-5 pt-14 pb-6" style={{ background: "#F8F5FF" }}>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-5">
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#A9A4C0", letterSpacing: 1, textTransform: "uppercase", fontWeight: 500 }}>
          Your Journey
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
          Progress Tracker ✦
        </h1>
      </motion.div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        {[
          { label: "Glow Score", value: profile.glowScore, unit: "/100", icon: "✨", color: "#7B3FC4" },
          { label: "Days Active", value: daysActive, unit: "days", icon: null, color: "#9333EA" },
          { label: "Sessions", value: profile.chatCount, unit: "chats", icon: "💬", color: "#6D28D9" },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.4 }}
            className="rounded-2xl p-3 text-center"
            style={{
              background: "#FFFFFF",
              border: "1.5px solid rgba(123, 63, 196, 0.08)",
              boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
            }}
          >
            <div className="flex justify-center mb-1">
              {stat.icon ? (
                <span style={{ fontSize: 16 }}>{stat.icon}</span>
              ) : (
                <Calendar size={16} color={stat.color} />
              )}
            </div>
            <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700, color: stat.color }}>
              {stat.value}
              {stat.unit === "/100" && <span style={{ fontSize: 10, color: "#B0AEC8", fontFamily: "'Inter', sans-serif" }}>/100</span>}
            </p>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 9, color: "#A9A4C0", textTransform: "uppercase", letterSpacing: 0.5, marginTop: 2 }}>
              {stat.label}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Time range tabs */}
      <div className="flex gap-2 mb-4">
        {TIME_RANGES.map((range) => (
          <button
            key={range}
            onClick={() => setActiveRange(range)}
            className="px-4 py-1.5 rounded-full"
            style={{
              background: activeRange === range ? "#7B3FC4" : "#FFFFFF",
              border: "1.5px solid",
              borderColor: activeRange === range ? "#7B3FC4" : "rgba(123, 63, 196, 0.12)",
              fontFamily: "'Inter', sans-serif",
              fontSize: 12,
              fontWeight: activeRange === range ? 600 : 400,
              color: activeRange === range ? "white" : "#6B6880",
              boxShadow: activeRange === range ? "0 4px 12px rgba(123, 63, 196, 0.25)" : "none",
            }}
          >
            {range}
          </button>
        ))}
      </div>

      {/* Weekly Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="rounded-2xl p-4 mb-5"
        style={{
          background: "#FFFFFF",
          border: "1.5px solid rgba(123, 63, 196, 0.08)",
          boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
        }}
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#A9A4C0", letterSpacing: 0.5, fontWeight: 500 }}>
              YOUR PROGRESS
            </p>
            <div className="flex items-center gap-2 mt-1">
              <TrendingUp size={14} color="#7B3FC4" />
              <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#7B3FC4", fontWeight: 700 }}>
                +{weeklyChange} this week
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1 px-2 py-1 rounded-full" style={{ background: "rgba(34, 197, 94, 0.08)", border: "1px solid rgba(34, 197, 94, 0.2)" }}>
            <Sparkles size={11} color="#16A34A" />
            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, color: "#16A34A", fontWeight: 600 }}>
              85%
            </span>
          </div>
        </div>

        <div style={{ height: 160 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={WEEKLY_PROGRESS} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
              <defs>
                <linearGradient id="glowAreaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop key="stop-top" offset="0%" stopColor="#7B3FC4" stopOpacity={0.2} />
                  <stop key="stop-bottom" offset="100%" stopColor="#7B3FC4" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="day"
                tick={{ fontFamily: "'Inter', sans-serif", fontSize: 10, fill: "#B0AEC8" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                domain={[50, 100]}
                tick={{ fontFamily: "'Inter', sans-serif", fontSize: 9, fill: "#C5C2D4" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="score"
                stroke="#7B3FC4"
                strokeWidth={2.5}
                fill="url(#glowAreaGrad)"
                dot={{ fill: "#7B3FC4", r: 3, strokeWidth: 0 }}
                activeDot={{ fill: "#5421B5", r: 5, strokeWidth: 0 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* What's Improving */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="rounded-2xl p-4 mb-5"
        style={{
          background: "#FFFFFF",
          border: "1.5px solid rgba(123, 63, 196, 0.08)",
          boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
        }}
      >
        <div className="flex items-center gap-2 mb-5">
          <div className="w-7 h-7 rounded-xl flex items-center justify-center" style={{ background: "rgba(123, 63, 196, 0.08)" }}>
            <Award size={14} color="#7B3FC4" />
          </div>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#1A1040", fontWeight: 600 }}>
            What's Improving
          </p>
        </div>
        {IMPROVEMENTS.map((imp) => (
          <ImprovementBar key={imp.label} {...imp} />
        ))}
      </motion.div>

      {/* Achievements */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="rounded-2xl p-4"
        style={{
          background: "#FFFFFF",
          border: "1.5px solid rgba(123, 63, 196, 0.08)",
          boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
        }}
      >
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#1A1040", fontWeight: 600, marginBottom: 12 }}>
          Achievements 🏆
        </p>
        <div className="grid grid-cols-4 gap-2">
          {[
            { emoji: "🌟", label: "Starter", earned: true },
            { emoji: "💧", label: "7-Day", earned: daysActive >= 7 },
            { emoji: "💬", label: "Explorer", earned: profile.chatCount >= 5 },
            { emoji: "👑", label: "Glow Queen", earned: profile.glowScore >= 80 },
          ].map((badge) => (
            <div
              key={badge.label}
              className="flex flex-col items-center gap-1.5 p-2.5 rounded-xl"
              style={{
                background: badge.earned ? "rgba(123, 63, 196, 0.06)" : "rgba(0,0,0,0.02)",
                border: badge.earned ? "1.5px solid rgba(123, 63, 196, 0.2)" : "1.5px solid rgba(0,0,0,0.05)",
                opacity: badge.earned ? 1 : 0.45,
              }}
            >
              <span style={{ fontSize: 22 }}>{badge.emoji}</span>
              <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 9, color: badge.earned ? "#7B3FC4" : "#A9A4C0", textAlign: "center", lineHeight: 1.3, fontWeight: badge.earned ? 600 : 400 }}>
                {badge.label}
              </span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
