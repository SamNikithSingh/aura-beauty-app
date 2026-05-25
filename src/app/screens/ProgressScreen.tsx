import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingUp, Calendar, Award, Sparkles, ChevronRight } from "lucide-react";
import { useUserProfile } from "../hooks/useUserProfile";
import { getAnalyticsData, getImprovements, getTrendStats, DataPoint, Metric } from "../utils/analytics";

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

function ImprovementBar({ label, before, after, icon }: Metric) {
  const gain = after - before;
  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span style={{ fontSize: 16 }}>{icon}</span>
          <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#1A1040", fontWeight: 500 }}>{label}</span>
        </div>
        <motion.span
          key={gain}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
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
        </motion.span>
      </div>
      <div className="relative" style={{ height: 8, background: "rgba(123, 63, 196, 0.08)", borderRadius: 99 }}>
        <motion.div
          className="absolute left-0 top-0 h-full rounded-full"
          style={{ background: "rgba(123, 63, 196, 0.15)" }}
          initial={{ width: 0 }}
          animate={{ width: `${before}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
        <motion.div
          className="absolute left-0 top-0 h-full rounded-full"
          style={{ background: "linear-gradient(90deg, #7B3FC4, #A855F7)" }}
          initial={{ width: 0 }}
          animate={{ width: `${after}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </div>
      <div className="flex items-center justify-between mt-1">
        <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, color: "#B0AEC8" }}>Start: {before}%</span>
        <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, color: "#7B3FC4", fontWeight: 600 }}>Now: {after}%</span>
      </div>
    </div>
  );
}

const TIME_RANGES = ["Week", "Month", "Year"] as const;
type TimeRange = typeof TIME_RANGES[number];

export function ProgressScreen() {
  const { profile } = useUserProfile();
  const [activeRange, setActiveRange] = useState<TimeRange>("Week");

  const chartData = useMemo(() => getAnalyticsData(activeRange), [activeRange]);
  const improvements = useMemo(() => getImprovements(activeRange), [activeRange]);
  const trend = useMemo(() => getTrendStats(activeRange), [activeRange]);

  const daysActive = Math.max(1, Math.floor((Date.now() - new Date(profile.joinDate).getTime()) / (1000 * 60 * 60 * 24)));

  return (
    <div className="min-h-screen px-5 pt-14 pb-12" style={{ background: "#F8F7FF" }}>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#7B3FC4", letterSpacing: 1, textTransform: "uppercase", fontWeight: 700 }}>
          Your Journey
        </p>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 32, fontWeight: 700, color: "#1A1040", marginTop: 4 }}>
          Glow Progress ✦
        </h1>
      </motion.div>

      {/* Stats Quick View */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { label: "Glow Score", value: profile.glowScore, unit: "/100", icon: "✨", color: "#7B3FC4" },
          { label: "Days Active", value: daysActive, unit: "days", icon: null, color: "#9333EA" },
          { label: "Sessions", value: profile.chatCount, unit: "chats", icon: "💬", color: "#6D28D9" },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="rounded-2xl p-3 text-center"
            style={{ background: "white", border: "1.5px solid rgba(123, 63, 196, 0.08)", boxShadow: "0 4px 12px rgba(0,0,0,0.02)" }}
          >
            <div className="flex justify-center mb-1">
              {stat.icon ? <span style={{ fontSize: 16 }}>{stat.icon}</span> : <Calendar size={16} color={stat.color} />}
            </div>
            <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 700, color: stat.color }}>{stat.value}</p>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 9, color: "#A9A4C0", textTransform: "uppercase", letterSpacing: 0.5 }}>{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Time Range Selector */}
      <div className="p-1.5 rounded-2xl flex gap-1 mb-6" style={{ background: "rgba(123, 63, 196, 0.05)", border: "1.5px solid rgba(123, 63, 196, 0.08)" }}>
        {TIME_RANGES.map((range) => (
          <button
            key={range}
            onClick={() => setActiveRange(range)}
            className="flex-1 py-2 rounded-xl transition-all duration-300 relative"
            style={{
              background: activeRange === range ? "white" : "transparent",
              boxShadow: activeRange === range ? "0 4px 12px rgba(123, 63, 196, 0.15)" : "none",
            }}
          >
            <span style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 12,
              fontWeight: activeRange === range ? 700 : 500,
              color: activeRange === range ? "#7B3FC4" : "#6B6880",
            }}>
              {range}
            </span>
          </button>
        ))}
      </div>

      {/* Analytics Card */}
      <motion.div
        layout
        className="rounded-3xl p-5 mb-6"
        style={{ background: "white", border: "1.5px solid rgba(123, 63, 196, 0.08)", boxShadow: "0 12px 40px rgba(0,0,0,0.03)" }}
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: "#A9A4C0", letterSpacing: 1, fontWeight: 700 }}>{activeRange.toUpperCase()} TREND</p>
            <div className="flex items-center gap-2 mt-1">
              <TrendingUp size={16} color="#16A34A" />
              <motion.span
                key={trend.totalGain}
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                style={{ fontFamily: "'Inter', sans-serif", fontSize: 16, color: "#16A34A", fontWeight: 700 }}
              >
                +{trend.totalGain} pts gain
              </motion.span>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, color: "#A9A4C0" }}>Improvement</span>
            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, fontWeight: 800, color: "#1A1040" }}>{trend.percentImprovement}%</span>
          </div>
        </div>

        <div style={{ height: 200 }} className="mb-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="glowGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7B3FC4" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#7B3FC4" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="label"
                tick={{ fontFamily: "'Inter', sans-serif", fontSize: 10, fill: "#A9A4C0" }}
                axisLine={false}
                tickLine={false}
                padding={{ left: 10, right: 10 }}
              />
              <YAxis
                domain={["dataMin - 5", "dataMax + 5"]}
                hide
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="score"
                stroke="#7B3FC4"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#glowGradient)"
                animationDuration={1000}
                dot={{ r: 4, fill: "white", stroke: "#7B3FC4", strokeWidth: 2 }}
                activeDot={{ r: 6, fill: "#7B3FC4", stroke: "white", strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Improvements Section */}
      <motion.div
        layout
        className="rounded-3xl p-6 mb-6"
        style={{ background: "white", border: "1.5px solid rgba(123, 63, 196, 0.08)", boxShadow: "0 12px 40px rgba(0,0,0,0.03)" }}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ background: "rgba(123, 63, 196, 0.08)" }}>
              <Sparkles size={20} color="#7B3FC4" />
            </div>
            <h3 style={{ fontFamily: "'Inter', sans-serif", fontSize: 16, fontWeight: 700, color: "#1A1040" }}>Aura Insights</h3>
          </div>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#7B3FC4", fontWeight: 600 }}>{activeRange}</p>
        </div>

        <div className="space-y-6">
          <AnimatePresence mode="popLayout">
            {improvements.map((imp) => (
              <motion.div
                key={imp.label + activeRange}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <ImprovementBar {...imp} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Achievement Section */}
      <div className="p-5 rounded-3xl" style={{ background: "linear-gradient(135deg, #1A1040 0%, #301B7A 100%)", boxShadow: "0 12px 32px rgba(26, 16, 64, 0.2)" }}>
        <div className="flex items-center justify-between mb-4">
          <h3 style={{ fontFamily: "'Inter', sans-serif", fontSize: 15, fontWeight: 700, color: "white" }}>Achievements</h3>
          <button className="flex items-center gap-1">
             <span style={{ fontSize: 11, color: "rgba(255,255,255,0.6)", fontWeight: 600 }}>View All</span>
             <ChevronRight size={14} color="rgba(255,255,255,0.6)" />
          </button>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-2 -mx-1 px-1" style={{ scrollbarWidth: "none" }}>
           {[
             { icon: "🌟", label: "Starter" },
             { icon: "📅", label: "7 Day Streak" },
             { icon: "💬", label: "Explorer" },
             { icon: "✨", label: "Glow Getter" },
           ].map(badge => (
             <div key={badge.label} className="flex-shrink-0 flex flex-col items-center gap-2 p-3 rounded-2xl" style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.1)", minWidth: 80 }}>
                <span style={{ fontSize: 24 }}>{badge.icon}</span>
                <span style={{ fontSize: 9, color: "white", fontWeight: 700, whiteSpace: "nowrap" }}>{badge.label}</span>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
}
