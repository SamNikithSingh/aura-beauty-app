export const PRODUCTS = [
  {
    id: 1,
    name: "Luminous Glow Serum",
    brand: "Aura Essentials",
    benefit: "Brightens & evens skin tone with Vitamin C & Niacinamide",
    price: "$48",
    category: "serum",
    tag: "Best Seller",
    image: "https://images.unsplash.com/photo-1774887554034-c73a4edc3d3c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    rating: 4.8,
  },
  {
    id: 2,
    name: "Velvet Hydra Cream",
    brand: "Aura Essentials",
    benefit: "72-hour hydration with Hyaluronic Acid & Ceramides",
    price: "$62",
    category: "moisturizer",
    tag: "New",
    image: "https://images.unsplash.com/photo-1765964492963-b0aa8c172431?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    rating: 4.9,
  },
  {
    id: 3,
    name: "Rose Gold SPF 50",
    brand: "Aura Sun",
    benefit: "Invisible sunscreen with rose-tinted finish & SPF 50+",
    price: "$35",
    category: "sunscreen",
    tag: "Editor's Pick",
    image: "https://images.unsplash.com/photo-1694101454278-7fb3df776578?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    rating: 4.7,
  },
  {
    id: 4,
    name: "Clarity Gel Cleanser",
    brand: "Aura Pure",
    benefit: "Gentle foam that removes impurities without stripping",
    price: "$28",
    category: "cleanser",
    tag: "Fan Favorite",
    image: "https://images.unsplash.com/photo-1763532997223-d0f81ea8743c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    rating: 4.6,
  },
];

export const MORNING_ROUTINE = [
  { id: "m1", step: 1, name: "Gentle Cleanser", duration: "60 sec", tip: "Use lukewarm water, massage in circular motions for a full minute.", icon: "💧" },
  { id: "m2", step: 2, name: "Vitamin C Serum", duration: "30 sec", tip: "Apply 3–4 drops, press gently into skin — never rub.", icon: "✨" },
  { id: "m3", step: 3, name: "Hyaluronic Acid", duration: "30 sec", tip: "Apply to damp skin for maximum absorption. Mist face first if needed.", icon: "💦" },
  { id: "m4", step: 4, name: "Moisturizer", duration: "60 sec", tip: "Use upward strokes and always include neck and décolletage.", icon: "🌸" },
  { id: "m5", step: 5, name: "Eye Cream", duration: "30 sec", tip: "Tap gently with your ring finger — the lightest touch avoids damage.", icon: "👁️" },
  { id: "m6", step: 6, name: "SPF 50+ Sunscreen", duration: "60 sec", tip: "The most important step of your AM routine — never skip it!", icon: "☀️" },
];

export const NIGHT_ROUTINE = [
  { id: "n1", step: 1, name: "Oil Cleanser / Micellar", duration: "90 sec", tip: "Remove makeup and sunscreen thoroughly before the main cleanse.", icon: "🌙" },
  { id: "n2", step: 2, name: "Foaming Cleanser", duration: "60 sec", tip: "Double cleanse for a truly clean base ready for actives.", icon: "💧" },
  { id: "n3", step: 3, name: "Exfoliant (2–3x/wk)", duration: "30 sec", tip: "AHA/BHA exfoliation — do not use every night to avoid irritation.", icon: "🔄" },
  { id: "n4", step: 4, name: "Toner / Essence", duration: "30 sec", tip: "Balance pH and prep skin for serums to follow.", icon: "🫧" },
  { id: "n5", step: 5, name: "Treatment Serum", duration: "30 sec", tip: "Retinol or Niacinamide — alternate if using both to avoid irritation.", icon: "⚗️" },
  { id: "n6", step: 6, name: "Night Moisturizer", duration: "60 sec", tip: "Use a richer texture at night — skin repairs itself while you sleep.", icon: "🌿" },
  { id: "n7", step: 7, name: "Facial Oil (optional)", duration: "30 sec", tip: "Apply last to seal in all your layers and boost overnight repair.", icon: "✨" },
];

export const WEEKLY_PROGRESS = [
  { day: "Mon", score: 61 },
  { day: "Tue", score: 64 },
  { day: "Wed", score: 63 },
  { day: "Thu", score: 68 },
  { day: "Fri", score: 70 },
  { day: "Sat", score: 73 },
  { day: "Sun", score: 76 },
];

export const IMPROVEMENTS = [
  { label: "Hydration", before: 45, after: 78, icon: "💧" },
  { label: "Radiance", before: 52, after: 74, icon: "✨" },
  { label: "Texture", before: 60, after: 72, icon: "🌸" },
  { label: "Dark Spots", before: 35, after: 58, icon: "🔆" },
];

export const PREMIUM_FEATURES = [
  { icon: "🧬", title: "AI Skin Analysis", desc: "Upload your photo for a personalized AI skin diagnosis" },
  { icon: "📅", title: "Event Styling", desc: "Get routines tailored for weddings, parties & special events" },
  { icon: "⚡", title: "Priority AI", desc: "Faster responses with GPT-4o & dedicated beauty advisor mode" },
  { icon: "📊", title: "Advanced Analytics", desc: "Detailed glow score reports & monthly skin health insights" },
  { icon: "🛍️", title: "Affiliate Discounts", desc: "Exclusive 20–40% off on Aura-recommended products" },
  { icon: "🎯", title: "Custom Routines", desc: "Fully personalized AM/PM routines updated weekly by AI" },
];
