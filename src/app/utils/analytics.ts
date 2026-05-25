export interface DataPoint {
  label: string;
  score: number;
}

export interface Metric {
  label: string;
  before: number;
  after: number;
  icon: string;
}

// Generate 365 days of deterministic but realistic progress data
const generateRawData = (joinDate: Date) => {
  const data: { date: Date; score: number }[] = [];
  const now = new Date();
  const baseScore = 55;
  const yearlyImprovement = 35;
  
  // Use a simple seeded pseudo-random for noise
  const seed = joinDate.getTime();
  const pseudoRandom = (offset: number) => {
    const x = Math.sin(seed + offset) * 10000;
    return x - Math.floor(x);
  };

  for (let i = 364; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(now.getDate() - i);
    
    // Growth curve: logarithmic improvement over time
    const dayIndex = 364 - i;
    const growth = (Math.log(dayIndex + 1) / Math.log(365)) * yearlyImprovement;
    
    // Add some noise
    const noise = pseudoRandom(dayIndex) * 5 - 2.5;
    
    const score = Math.min(100, Math.round(baseScore + growth + noise));
    data.push({ date, score });
  }
  return data;
};

const rawData = generateRawData(new Date("2025-01-01")); // Static join date for consistent mock data

export const getAnalyticsData = (range: "Week" | "Month" | "Year") => {
  if (range === "Week") {
    // Last 7 days, daily labels
    const weekData = rawData.slice(-7);
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return weekData.map(d => ({
      label: dayNames[d.date.getDay()],
      score: d.score
    }));
  }

  if (range === "Month") {
    // Last 30 days, aggregated into 5 points (roughly 6 days each)
    const monthData = rawData.slice(-30);
    const aggregated: DataPoint[] = [];
    for (let i = 0; i < 5; i++) {
      const chunk = monthData.slice(i * 6, (i + 1) * 6);
      const avg = Math.round(chunk.reduce((acc, curr) => acc + curr.score, 0) / chunk.length);
      aggregated.push({
        label: `Wk ${i + 1}`,
        score: avg
      });
    }
    return aggregated;
  }

  // Year: Last 12 months, aggregated monthly
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const aggregated: DataPoint[] = [];
  for (let i = 0; i < 12; i++) {
    const chunk = rawData.slice(i * 30, (i + 1) * 30);
    const avg = Math.round(chunk.reduce((acc, curr) => acc + curr.score, 0) / chunk.length);
    const date = chunk[0].date;
    aggregated.push({
      label: monthNames[date.getMonth()],
      score: avg
    });
  }
  return aggregated;
};

export const getImprovements = (range: "Week" | "Month" | "Year"): Metric[] => {
  const data = rawData.slice(range === "Week" ? -7 : range === "Month" ? -30 : -365);
  const startScore = data[0].score;
  const endScore = data[data.length - 1].score;
  const diff = endScore - startScore;

  // Base improvement factors for different metrics
  const metrics = [
    { label: "Hydration", icon: "💧", factor: 1.1 },
    { label: "Radiance", icon: "✨", factor: 0.9 },
    { label: "Texture", icon: "🌸", factor: 0.7 },
    { label: "Dark Spots", icon: "🔆", factor: 0.5 },
  ];

  return metrics.map(m => {
    const gain = Math.max(1, Math.round(diff * m.factor));
    // For realism, let's say "after" is the current health level, "before" is derived
    const after = Math.min(95, 40 + Math.round((endScore - 50) * m.factor * 1.5));
    const before = after - gain;
    return {
      label: m.label,
      icon: m.icon,
      before,
      after
    };
  });
};

export const getTrendStats = (range: "Week" | "Month" | "Year") => {
  const data = rawData.slice(range === "Week" ? -7 : range === "Month" ? -30 : -365);
  const start = data[0].score;
  const end = data[data.length - 1].score;
  return {
    totalGain: end - start,
    percentImprovement: Math.round(((end - start) / start) * 100)
  };
};
