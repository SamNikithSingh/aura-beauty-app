export interface FallbackResponse {
  message: string;
  routine?: { am?: string[]; pm?: string[] };
  products?: string[];
}

const skinKeywords: Record<string, FallbackResponse> = {
  oily: {
    message: `I totally understand — oily skin can feel frustrating, but trust me, it's actually a sign your skin is resilient! ✨ With the right routine, we can balance sebum production and give you that healthy, matte glow.\n\nHere's what I'd suggest for you:`,
    routine: {
      am: [
        "🧼 Gel or foam cleanser (look for salicylic acid)",
        "💧 Niacinamide 10% serum (controls oil + minimizes pores)",
        "🌿 Oil-free, lightweight moisturizer",
        "☀️ Matte or gel SPF 50",
      ],
      pm: [
        "🌙 Micellar water to remove sunscreen",
        "🧼 Gentle foam cleanser",
        "⚗️ BHA exfoliant 2–3x per week",
        "💧 Niacinamide or retinol (alternate nights)",
        "🌿 Light gel moisturizer",
      ],
    },
    products: ["Cetaphil Oily Skin Cleanser", "The Ordinary Niacinamide 10%", "Neutrogena Hydro Boost (Oil-Free)", "La Roche-Posay Anthelios Matte SPF 50"],
  },
  dry: {
    message: `Dry skin needs love, hydration, and a little patience — and you've come to the right place! 💕 The key is layering moisture and sealing it in so your skin stays plump and glowing all day.\n\nHere's a rich routine made for you:`,
    routine: {
      am: [
        "🧼 Cream or oil cleanser (never foaming)",
        "💦 Hyaluronic Acid serum (apply to damp skin!)",
        "🌸 Rich moisturizer with ceramides + shea",
        "☀️ Hydrating SPF with a dewy finish",
      ],
      pm: [
        "🌙 Oil or balm cleanser",
        "💦 Hydrating toner or essence",
        "⚗️ Peptide or bakuchiol serum",
        "🌿 Heavy-duty night cream",
        "✨ Facial oil to seal (optional but amazing!)",
      ],
    },
    products: ["CeraVe Hydrating Cleanser", "The Inkey List Hyaluronic Acid", "First Aid Beauty Ultra Repair Cream", "Tatcha Dewy Skin Mist SPF"],
  },
  acne: {
    message: `Acne is SO common — and it doesn't define you! 💜 The right skincare can calm breakouts, reduce inflammation, and help prevent future ones. Let's be gentle but effective.\n\nHere's a targeted routine:`,
    routine: {
      am: [
        "🧼 Salicylic acid cleanser",
        "💧 Niacinamide 10% (calms redness)",
        "🌿 Oil-free moisturizer",
        "☀️ Non-comedogenic SPF 50",
      ],
      pm: [
        "🌙 Micellar water pre-cleanse",
        "🧼 Benzoyl peroxide or salicylic wash",
        "⚗️ Retinol 0.025% (start slowly!)",
        "🌿 Lightweight soothing moisturizer",
        "🎯 Spot treatment on active breakouts",
      ],
    },
    products: ["Paula's Choice BHA 2%", "The Ordinary Niacinamide 10%", "CeraVe PM Lotion", "La Roche-Posay Effaclar Duo"],
  },
  dull: {
    message: `Dull skin is usually a sign it needs exfoliation, hydration, and a little brightening love! ✨ We'll wake up your glow with some powerhouse ingredients.\n\nHere's your brightness-boosting routine:`,
    routine: {
      am: [
        "🧼 Gentle brightening cleanser",
        "✨ Vitamin C serum 15–20% (your glow secret!)",
        "💦 Hyaluronic Acid",
        "🌸 Lightweight moisturizer",
        "☀️ SPF 50 (Vitamin C without SPF is wasted!)",
      ],
      pm: [
        "🌙 Double cleanse",
        "🔄 AHA exfoliant 2x per week (glycolic or lactic)",
        "⚗️ Retinol to speed cell turnover",
        "🌿 Hydrating night cream",
      ],
    },
    products: ["TruSkin Vitamin C Serum", "Pixi Glow Tonic", "The Ordinary Glycolic Acid 7%", "RoC Retinol Night Cream"],
  },
  "dark spots": {
    message: `Dark spots (hyperpigmentation) can be stubborn, but with consistency, they absolutely fade! 🌟 The key ingredients are Vitamin C, Niacinamide, and AHAs — used together over time.\n\nHere's a targeted pigmentation routine:`,
    routine: {
      am: [
        "🧼 Gentle cleanser",
        "✨ Vitamin C serum (20% for stubborn spots)",
        "💧 Niacinamide 10%",
        "🌸 Moisturizer with tranexamic acid",
        "☀️ SPF 50+ (non-negotiable for dark spots!)",
      ],
      pm: [
        "🌙 Double cleanse",
        "⚗️ Alpha Arbutin 2% + HA",
        "🔄 AHA exfoliant 2x per week",
        "🌿 Rich brightening night cream",
      ],
    },
    products: ["The Ordinary Alpha Arbutin 2%", "TruSkin Vitamin C Serum", "Good Molecules Discoloration Correcting Serum", "EltaMD UV Clear SPF 46"],
  },
  sensitive: {
    message: `Sensitive skin is all about gentleness — we keep it simple, soothing, and barrier-focused. No harsh actives, no fragrance, just calm, nourished skin. 🌸\n\nHere's a gentle routine for you:`,
    routine: {
      am: [
        "🧼 Fragrance-free, soap-free cleanser",
        "💧 Centella Asiatica toner (calming!)",
        "🌿 Ceramide + peptide moisturizer",
        "☀️ Mineral SPF 30 (zinc oxide — gentlest option)",
      ],
      pm: [
        "🌙 Micellar water cleanse only (if very sensitive)",
        "💦 Aloe vera or cica essence",
        "🌿 Barrier repair cream (with ceramides)",
      ],
    },
    products: ["Vanicream Gentle Cleanser", "Purito Centella Unscented Serum", "CeraVe Moisturizing Cream", "EltaMD UV Pure Tinted SPF 47"],
  },
  routine: {
    message: `I'd love to help you build the perfect routine! 🌸 To personalize it fully, could you tell me your skin type? (oily, dry, combination, sensitive) Or mention a concern like acne, dull skin, or dark spots and I'll craft something just for you.\n\nIn the meantime, here's a great everyday starter routine:`,
    routine: {
      am: [
        "🧼 Gentle cleanser",
        "💧 Hydrating serum",
        "🌸 Moisturizer",
        "☀️ SPF 50",
      ],
      pm: [
        "🌙 Double cleanse",
        "⚗️ Treatment serum",
        "🌿 Night moisturizer",
      ],
    },
  },
  hello: {
    message: `Hello, beautiful! 💜 I'm Aura, your personal beauty companion. I'm here to help you glow from the inside out!\n\nYou can ask me about:\n• 🧴 Skincare routines for your skin type\n• ✨ How to fade dark spots or get glowing\n• 💧 Best ingredients for hydration\n• 🌙 Building a night routine\n• 🛍️ Product recommendations\n\nWhat would you like to work on today?`,
  },
  hi: {
    message: `Hi there, gorgeous! ✨ I'm Aura — your AI beauty assistant. I'm here whenever you need skincare advice, routine help, or just a little beauty wisdom.\n\nWhat's on your mind today? 💕`,
  },
};

function detectKeyword(input: string): string | null {
  const lower = input.toLowerCase();
  if (lower.includes("dark spot") || lower.includes("hyperpigment") || lower.includes("pigment")) return "dark spots";
  if (lower.includes("oily") || lower.includes("shiny") || lower.includes("greasy")) return "oily";
  if (lower.includes("dry") || lower.includes("flak") || lower.includes("tight")) return "dry";
  if (lower.includes("acne") || lower.includes("pimple") || lower.includes("breakout") || lower.includes("spot")) return "acne";
  if (lower.includes("dull") || lower.includes("glow") || lower.includes("bright") || lower.includes("radiant")) return "dull";
  if (lower.includes("sensitiv") || lower.includes("redness") || lower.includes("react")) return "sensitive";
  if (lower.includes("routine") || lower.includes("regimen") || lower.includes("steps")) return "routine";
  if (lower.includes("hello") || lower.includes("hey")) return "hello";
  if (lower.includes("hi ") || lower === "hi" || lower.includes("hii")) return "hi";
  return null;
}

const GENERIC_RESPONSES = [
  `That's a great question! 💜 Skincare is deeply personal, and I want to give you the best advice. Could you tell me a little more about your skin type or your main concern? For example:\n\n• Is your skin oily, dry, or combination?\n• Any specific concerns like acne, dark spots, or dullness?\n• What's your current routine like?\n\nThe more I know, the better I can help you glow! ✨`,
  `I love that you're investing in your skin! 🌸 To personalize my advice for you, could you share more? Tell me:\n\n• Your skin type (oily, dry, sensitive, combination)\n• Your top concern (acne, aging, brightness, texture)\n• Any products you're already using?\n\nI'll craft a routine just for YOU. 💕`,
  `Great timing to chat about beauty! ✨ I want to give you advice that actually works for your unique skin. \n\nCould you describe how your skin usually feels by midday? That helps me understand your skin type and recommend the right ingredients and routine for you. 🌿`,
];

let genericIndex = 0;

export function getFallbackResponse(input: string): FallbackResponse {
  const keyword = detectKeyword(input);
  if (keyword && skinKeywords[keyword]) {
    return skinKeywords[keyword];
  }
  const response = { message: GENERIC_RESPONSES[genericIndex % GENERIC_RESPONSES.length] };
  genericIndex++;
  return response;
}

export function formatFallbackMessage(response: FallbackResponse): string {
  let text = response.message;

  if (response.routine?.am) {
    text += "\n\n🌅 **Morning Routine:**\n" + response.routine.am.join("\n");
  }
  if (response.routine?.pm) {
    text += "\n\n🌙 **Night Routine:**\n" + response.routine.pm.join("\n");
  }
  if (response.products && response.products.length > 0) {
    text += "\n\n🛍️ **Product Picks:**\n" + response.products.map((p) => `• ${p}`).join("\n");
  }

  return text;
}
