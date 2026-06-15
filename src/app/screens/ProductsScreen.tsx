import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Drawer } from "vaul";
import { 
  Star, ShoppingCart, Heart, ExternalLink, Tag, Flame, Clock, ChevronDown,
  Filter, SlidersHorizontal, Info, CheckCircle2, ShieldCheck, Sparkles, MapPin, Zap 
} from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { useProducts, Product } from "../hooks/useProducts";
import { useProductOffers, ProductOffer } from "../hooks/useProductOffers";
import { useUserProfile } from "../hooks/useUserProfile";
import { useRecommendations } from "../hooks/useRecommendations";

const CATEGORIES = ["All", "Serum", "Moisturizer", "Cleanser", "Sunscreen", "Eye Care"];

const TAG_COLORS: Record<string, { bg: string; color: string; border: string }> = {
  "Best Seller": { bg: "rgba(251, 191, 36, 0.12)", color: "#D97706", border: "rgba(251, 191, 36, 0.3)" },
  "Aura Pick": { bg: "rgba(123, 63, 196, 0.1)", color: "#7B3FC4", border: "rgba(123, 63, 196, 0.25)" },
  "Editor's Pick": { bg: "rgba(236, 72, 153, 0.1)", color: "#DB2777", border: "rgba(236, 72, 153, 0.25)" },
  "Fan Favorite": { bg: "rgba(34, 197, 94, 0.1)", color: "#16A34A", border: "rgba(34, 197, 94, 0.25)" },
};

const STORE_COLORS: Record<string, string> = {
  "Amazon": "#FF9900",
  "Nykaa": "#FC2779",
  "Myntra": "#FF3F6C",
  "Tira": "#1A1A2E",
  "Official Store": "#7B3FC4",
  "Official": "#7B3FC4",
  "Flipkart": "#2874F0",
};

const formatTimeAgo = (isoString?: string | null) => {
  if (!isoString) return "Updated just now";
  try {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 60) {
      return `Updated ${diffMins <= 0 ? 1 : diffMins}m ago`;
    } else if (diffHours < 24) {
      return `Updated ${diffHours}h ago`;
    } else {
      return `Updated ${diffDays}d ago`;
    }
  } catch {
    return "Updated just now";
  }
};

function OfferCard({ offer }: { offer: ProductOffer }) {
  const storeColor = STORE_COLORS[offer.storeName] || "#6B6880";
  const isRealUrl = offer.productUrl && offer.productUrl !== "#" && offer.productUrl.startsWith("http");

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isRealUrl) {
      window.open(offer.productUrl, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <motion.div
      onClick={handleClick}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-3 p-3 rounded-2xl relative"
      style={{
        background: offer.isBestDeal
          ? "linear-gradient(135deg, rgba(251, 191, 36, 0.08), rgba(251, 146, 60, 0.06))"
          : "#FFFFFF",
        border: offer.isBestDeal
          ? "1.5px solid rgba(251, 191, 36, 0.3)"
          : "1px solid rgba(123, 63, 196, 0.08)",
        textDecoration: "none",
        boxShadow: offer.isBestDeal ? "0 4px 16px rgba(251, 191, 36, 0.12)" : "0 2px 8px rgba(0,0,0,0.03)",
        cursor: isRealUrl ? "pointer" : "default",
      }}
    >
      {offer.isBestDeal && (
        <div
          className="absolute -top-2 right-3 px-2 py-0.5 rounded-full flex items-center gap-1"
          style={{ background: "linear-gradient(135deg, #F59E0B, #F97316)", boxShadow: "0 2px 8px rgba(245, 158, 11, 0.4)" }}
        >
          <Flame size={9} color="white" />
          <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 9, fontWeight: 700, color: "white" }}>Best Deal</span>
        </div>
      )}

      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: `${storeColor}12`, border: `1px solid ${storeColor}25` }}
      >
        <span style={{ fontSize: 18 }}>{offer.storeLogo}</span>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 600, color: "#1A1040" }}>
            {offer.storeName}
          </p>
          {offer.isOfficial && (
            <span
              className="px-1.5 py-0.5 rounded"
              style={{ background: "rgba(123, 63, 196, 0.08)", fontFamily: "'Inter', sans-serif", fontSize: 8, color: "#7B3FC4", fontWeight: 700 }}
            >
              OFFICIAL
            </span>
          )}
        </div>
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, color: "#A9A4C0", marginTop: 2 }}>
          {formatTimeAgo(offer.updatedAt)}
        </p>
        {offer.originalPrice !== null && offer.currentPrice !== null && offer.originalPrice > offer.currentPrice && (
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: "#16A34A", fontWeight: 600, marginTop: 2 }}>
            Save ₹{(offer.originalPrice - offer.currentPrice).toFixed(0)}
          </p>
        )}
      </div>

      <div className="text-right flex-shrink-0">
        {offer.currentPrice !== null && offer.currentPrice !== undefined ? (
          <>
            <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 17, fontWeight: 700, color: offer.isBestDeal ? "#D97706" : "#7B3FC4" }}>
              ₹{offer.currentPrice.toFixed(0)}
            </p>
            {offer.originalPrice !== null && offer.originalPrice > offer.currentPrice && (
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: "#A9A4C0", textDecoration: "line-through" }}>
                ₹{offer.originalPrice.toFixed(0)}
              </p>
            )}
          </>
        ) : (
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, fontWeight: 500, color: "#A9A4C0" }}>
            Check latest price
          </p>
        )}
      </div>

      <ExternalLink size={13} color="#C5C2D4" className="flex-shrink-0 ml-2" />
    </motion.div>
  );
}

function ProductBottomSheet({ 
  product: initialProduct, 
  open, 
  onClose,
  refetchProducts,
  allProducts
}: { 
  product: Product | null; 
  open: boolean; 
  onClose: () => void;
  refetchProducts: () => void;
  allProducts: Product[];
}) {
  const { profile } = useUserProfile();

  const product = useMemo(() => {
    if (!initialProduct) return null;
    return allProducts.find(p => p.id === initialProduct.id) || initialProduct;
  }, [initialProduct, allProducts]);

  const { offers, bestDeal, loading: offersLoading } = useProductOffers(product);

  useEffect(() => {
    if (open) {
      refetchProducts();
    }
  }, [open, refetchProducts]);

  if (!product) return null;

  const matchScore = product.skinTypes.some(t => t.toLowerCase() === profile?.skinType?.toLowerCase()) ? 95 : 85;

  return (
    <Drawer.Root open={open} onOpenChange={(o) => !o && onClose()} shouldScaleBackground>
      <Drawer.Portal>
        <Drawer.Overlay
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(26, 10, 80, 0.45)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
            zIndex: 9998,
          }}
        />
        <Drawer.Content
          style={{
            position: "fixed",
            bottom: 0,
            left: "50%",
            transform: "translateX(-50%)",
            width: "100%",
            maxWidth: 430,
            height: "96vh",
            zIndex: 9999,
            outline: "none",
            display: "flex",
            flexDirection: "column",
            background: "#F8F7FF",
            borderTopLeftRadius: 32,
            borderTopRightRadius: 32,
            boxShadow: "0 -12px 60px rgba(0,0,0,0.2)",
          }}
        >
          {/* Drag Handle */}
          <div className="flex justify-center pt-4 pb-2 flex-shrink-0">
            <div style={{ width: 36, height: 5, borderRadius: 99, background: "rgba(123, 63, 196, 0.2)" }} />
          </div>

          <div style={{ flex: 1, overflowY: "auto", WebkitOverflowScrolling: "touch" }}>
            {/* Hero Section */}
            <div className="relative" style={{ height: 300 }}>
              <ImageWithFallback src={product.image} alt={product.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, transparent 0%, rgba(248, 247, 255, 0) 60%, #F8F7FF 100%)" }} />
              
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={onClose}
                className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center"
                style={{ background: "rgba(255,255,255,0.9)", backdropFilter: "blur(10px)", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
              >
                <ChevronDown size={20} color="#1A1040" />
              </motion.button>

              <div className="absolute bottom-6 left-6 right-6">
                 <div className="flex items-center gap-2 mb-2">
                    <span className="px-2.5 py-1 rounded-full flex items-center gap-1.5" style={{ background: "rgba(123, 63, 196, 0.15)", border: "1px solid rgba(123, 63, 196, 0.2)", backdropFilter: "blur(10px)" }}>
                      <Sparkles size={12} color="#7B3FC4" />
                      <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, fontWeight: 700, color: "#7B3FC4" }}>{matchScore}% Aura Match</span>
                    </span>
                 </div>
              </div>
            </div>

            <div className="px-6 pb-32">
              {/* Product Header */}
              <div className="mb-6">
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#7B3FC4", fontWeight: 600, textTransform: "uppercase", letterSpacing: 1 }}>{product.brand}</p>
                <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, color: "#1A1040", fontWeight: 700, lineHeight: 1.2, margin: "4px 0 8px 0" }}>{product.name}</h2>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Star size={16} fill="#F59E0B" color="#F59E0B" />
                    <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, fontWeight: 700, color: "#1A1040" }}>{product.rating}</span>
                    <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: "#A9A4C0" }}>({product.reviews.toLocaleString()})</span>
                  </div>
                  <div className="h-4 w-[1px]" style={{ background: "rgba(123, 63, 196, 0.15)" }} />
                  <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: "#6B6880", fontWeight: 500 }}>{product.category}</span>
                </div>
              </div>

              {/* Price Row */}
              <div className="flex items-center justify-between p-4 rounded-2xl mb-8" style={{ background: "white", border: "1.5px solid rgba(123, 63, 196, 0.1)", boxShadow: "0 4px 20px rgba(123, 63, 196, 0.05)" }}>
                <div>
                  <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#A9A4C0", marginBottom: 2 }}>MSRP Approx.</p>
                  <div className="flex items-baseline gap-2">
                    <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 700, color: "#1A1040" }}>{product.price}</span>
                    <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: "#6B6880" }}>/ {product.priceUSD}</span>
                  </div>
                </div>
                {product.discount && (
                  <div className="px-3 py-1.5 rounded-xl" style={{ background: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.2)" }}>
                    <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 700, color: "#EF4444" }}>{product.discount}</span>
                  </div>
                )}
              </div>

              {/* Aura Analysis */}
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-3">
                  <Zap size={18} color="#7B3FC4" />
                  <h3 style={{ fontFamily: "'Inter', sans-serif", fontSize: 16, fontWeight: 700, color: "#1A1040" }}>Why it matches you</h3>
                </div>
                <div className="p-4 rounded-2xl" style={{ background: "linear-gradient(135deg, rgba(123, 63, 196, 0.05), rgba(168, 85, 247, 0.02))", border: "1px solid rgba(123, 63, 196, 0.1)" }}>
                  <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: "#4A4A6A", lineHeight: 1.6 }}>{product.description}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {product.concerns.map(concern => (
                      <div key={concern} className="flex items-center gap-1.5 px-3 py-1 rounded-lg" style={{ background: "white", border: "1px solid rgba(123, 63, 196, 0.1)" }}>
                        <CheckCircle2 size={12} color="#16A34A" />
                        <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#1A1040", fontWeight: 500 }}>{concern}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Detailed Offers */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <MapPin size={18} color="#7B3FC4" />
                    <h3 style={{ fontFamily: "'Inter', sans-serif", fontSize: 16, fontWeight: 700, color: "#1A1040" }}>Available at Stores</h3>
                  </div>
                  {!offersLoading && (
                    <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: "#A9A4C0" }}>{formatTimeAgo(bestDeal?.updatedAt)}</span>
                  )}
                </div>

                {offersLoading ? (
                  <div className="py-8 flex justify-center">
                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#7B3FC4] border-t-transparent" />
                  </div>
                ) : (
                  <div className="space-y-3">
                    {offers.map(offer => (
                      <OfferCard key={offer.id} offer={offer} />
                    ))}
                  </div>
                )}
              </div>

              {/* Ingredients & Steps */}
              <div className="grid grid-cols-1 gap-4 mb-8">
                <div className="p-5 rounded-2xl" style={{ background: "white", border: "1px solid rgba(123, 63, 196, 0.1)" }}>
                  <h3 style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, fontWeight: 700, color: "#1A1040", marginBottom: 12, display: "flex", itemsCenter: "center", gap: 2 }}>
                    <Info size={16} color="#7B3FC4" /> How to Use
                  </h3>
                  <div className="space-y-3">
                    {product.usageSteps.map((step, i) => (
                      <div key={i} className="flex gap-3">
                        <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, fontWeight: 700, color: "#7B3FC4", minWidth: 20 }}>0{i+1}</span>
                        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#6B6880", lineHeight: 1.4 }}>{step}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-5 rounded-2xl" style={{ background: "white", border: "1px solid rgba(123, 63, 196, 0.1)" }}>
                   <h3 style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, fontWeight: 700, color: "#1A1040", marginBottom: 12, display: "flex", itemsCenter: "center", gap: 2 }}>
                    <ShieldCheck size={16} color="#7B3FC4" /> Key Ingredients
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {product.ingredients.map(ing => (
                      <span key={ing} className="px-3 py-1.5 rounded-lg" style={{ background: "rgba(123, 63, 196, 0.05)", fontSize: 12, color: "#1A1040", fontWeight: 500 }}>{ing}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sticky Footer CTA */}
          <div className="absolute bottom-0 left-0 right-0 p-6 pb-10" style={{ background: "linear-gradient(to top, #F8F7FF 80%, transparent 100%)", zIndex: 10 }}>
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                const url = bestDeal?.productUrl || product.affiliateUrl;
                if (url && url !== "#") window.open(url, "_blank");
              }}
              className="w-full py-4 rounded-2xl flex items-center justify-center gap-3"
              style={{
                background: "linear-gradient(135deg, #7B3FC4 0%, #5421B5 100%)",
                boxShadow: "0 12px 32px rgba(123, 63, 196, 0.4)",
                border: "none",
                cursor: "pointer",
              }}
            >
              <ShoppingCart size={20} color="white" />
              <div className="text-left">
                <p style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: 16, color: "white", lineHeight: 1 }}>
                  {bestDeal && bestDeal.currentPrice !== null ? `Buy Now · ₹${bestDeal.currentPrice.toFixed(0)}` : "Shop Now"}
                </p>
                {bestDeal && bestDeal.currentPrice !== null && (
                  <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: "rgba(255,255,255,0.7)", marginTop: 2 }}>
                    Cheapest at {bestDeal.storeName}
                  </p>
                )}
              </div>
              <ExternalLink size={16} color="rgba(255,255,255,0.6)" className="ml-2" />
            </motion.button>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}

export function ProductsScreen() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeSort, setActiveSort] = useState("Best Match");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  const { products, loading, refetch } = useProducts();
  const { profile } = useUserProfile();
  const { recommendedForYou, recommendations } = useRecommendations(products, profile);

  const filteredAndSortedProducts = useMemo(() => {
    let result = activeCategory === "All" 
      ? products 
      : products.filter(p => p.category?.toLowerCase().trim() === activeCategory.toLowerCase().trim());

    // Sort logic
    if (activeSort === "Best Match") {
      const recIds = recommendations.map(r => r.product.id);
      result = [...result].sort((a, b) => recIds.indexOf(a.id) - recIds.indexOf(b.id));
    } else if (activeSort === "Lowest Price") {
      result = [...result].sort((a, b) => {
        const valA = a.rawPrice ?? Infinity;
        const valB = b.rawPrice ?? Infinity;
        return valA - valB;
      });
    } else if (activeSort === "Highest Rated") {
      result = [...result].sort((a, b) => b.rating - a.rating);
    } else if (activeSort === "Trending") {
      result = [...result].sort((a, b) => (b.trending ? 1 : 0) - (a.trending ? 1 : 0));
    }

    return result;
  }, [products, activeCategory, activeSort, recommendations]);

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites((prev) => (prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]));
  };

  return (
    <div className="min-h-screen px-5 pt-14 pb-12" style={{ background: "#F8F7FF" }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#7B3FC4", letterSpacing: 1, textTransform: "uppercase", fontWeight: 700 }}>
            Curated For You
          </p>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 700, color: "#1A1040", marginTop: 4 }}>
            Beauty Picks ✦
          </h1>
        </motion.div>
        
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setShowFilters(!showFilters)}
          className="w-12 h-12 rounded-2xl flex items-center justify-center relative"
          style={{ background: "white", border: "1.5px solid rgba(123, 63, 196, 0.1)", boxShadow: "0 4px 12px rgba(123, 63, 196, 0.05)" }}
        >
          <SlidersHorizontal size={20} color="#1A1040" />
          {activeSort !== "Best Match" && (
            <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#7B3FC4]" />
          )}
        </motion.button>
      </div>

      {/* Category Horizontal Scroll */}
      <div className="flex gap-2 overflow-x-auto pb-4 mb-2 -mx-1 px-1" style={{ scrollbarWidth: "none" }}>
        {CATEGORIES.map((cat) => (
          <motion.button
            key={cat}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveCategory(cat)}
            className="flex-shrink-0 px-5 py-2.5 rounded-2xl"
            style={{
              background: activeCategory === cat ? "linear-gradient(135deg, #7B3FC4, #5421B5)" : "white",
              border: activeCategory === cat ? "none" : "1.5px solid rgba(123, 63, 196, 0.08)",
              fontFamily: "'Inter', sans-serif",
              fontSize: 13,
              fontWeight: activeCategory === cat ? 700 : 500,
              color: activeCategory === cat ? "white" : "#6B6880",
              boxShadow: activeCategory === cat ? "0 8px 20px rgba(123, 63, 196, 0.25)" : "0 2px 8px rgba(0,0,0,0.02)",
            }}
          >
            {cat}
          </motion.button>
        ))}
      </div>

      {/* Sort Options (Collapsible) */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden mb-6"
          >
            <div className="p-4 rounded-2xl flex flex-wrap gap-2" style={{ background: "rgba(123, 63, 196, 0.04)", border: "1px solid rgba(123, 63, 196, 0.1)" }}>
              {["Best Match", "Lowest Price", "Highest Rated", "Trending"].map(sort => (
                <button
                  key={sort}
                  onClick={() => setActiveSort(sort)}
                  className="px-3 py-1.5 rounded-xl text-[12px] font-semibold transition-all"
                  style={{
                    background: activeSort === sort ? "#7B3FC4" : "white",
                    color: activeSort === sort ? "white" : "#6B6880",
                    border: "1px solid " + (activeSort === sort ? "#7B3FC4" : "rgba(123, 63, 196, 0.1)"),
                  }}
                >
                  {sort}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Recommended Banner */}
      {activeCategory === "All" && activeSort === "Best Match" && recommendedForYou.length > 0 && (
         <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 rounded-2xl flex items-center gap-4 relative overflow-hidden"
            style={{ background: "linear-gradient(135deg, #1A1040 0%, #301B7A 100%)", boxShadow: "0 12px 24px rgba(26, 16, 64, 0.2)" }}
         >
            <div className="flex-1 relative z-10">
               <div className="flex items-center gap-2 mb-1">
                  <Sparkles size={14} color="#A78BFA" />
                  <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, fontWeight: 800, color: "#A78BFA", textTransform: "uppercase", letterSpacing: 1 }}>Deeply Personalized</span>
               </div>
               <h4 style={{ fontFamily: "'Inter', sans-serif", fontSize: 15, fontWeight: 700, color: "white", lineHeight: 1.3 }}>Top Pick for your {profile?.skinType} skin</h4>
            </div>
            <div className="w-16 h-16 rounded-xl overflow-hidden shadow-2xl relative z-10">
               <ImageWithFallback src={recommendedForYou[0].image} alt="top pick" className="w-full h-full object-cover" />
            </div>
            <div className="absolute top-[-20%] right-[-10%] w-40 h-40 rounded-full bg-[#7B3FC4] opacity-20 blur-3xl" />
         </motion.div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#7B3FC4] border-t-transparent" />
        </div>
      )}

      {/* Product Grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeCategory + activeSort}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="grid grid-cols-2 gap-4"
        >
          {filteredAndSortedProducts.map((product, i) => {
            const isMatch = recommendations.find(r => r.product.id === product.id)?.score >= 50;
            
            // Calculate best deal and savings for product grid card
            const validPrices = [
              { store: "Amazon", price: product.amazonPrice },
              { store: "Nykaa", price: product.nykaaPrice },
              { store: "Official", price: product.officialPrice }
            ].filter(p => p.price !== null && p.price !== undefined) as { store: string, price: number }[];
            
            validPrices.sort((a, b) => a.price - b.price);
            
            const bestStore = validPrices.length > 0 ? validPrices[0] : null;
            let savings = null;
            if (validPrices.length > 1) {
              const highestPrice = Math.max(...validPrices.map(p => p.price));
              if (highestPrice > validPrices[0].price) {
                savings = highestPrice - validPrices[0].price;
              }
            }

            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05, duration: 0.4 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setSelectedProduct(product)}
                className="rounded-3xl overflow-hidden cursor-pointer relative flex flex-col"
                style={{
                  background: "#FFFFFF",
                  border: "1.5px solid rgba(123, 63, 196, 0.06)",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.04)",
                  height: "100%",
                }}
              >
                {/* Product image */}
                <div className="relative flex-shrink-0" style={{ height: 160 }}>
                  <ImageWithFallback src={product.image} alt={product.name} className="w-full h-full object-cover" />
                  
                  {isMatch && (
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded-lg flex items-center gap-1" style={{ background: "rgba(255,255,255,0.9)", backdropFilter: "blur(4px)", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
                       <Zap size={10} color="#7B3FC4" fill="#7B3FC4" />
                       <span style={{ fontSize: 9, fontWeight: 800, color: "#1A1040" }}>MATCH</span>
                    </div>
                  )}

                  {product.discount && !savings && (
                    <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-lg" style={{ background: "#EF4444", boxShadow: "0 2px 8px rgba(239, 68, 68, 0.3)" }}>
                      <span style={{ fontSize: 9, fontWeight: 800, color: "white" }}>{product.discount}</span>
                    </div>
                  )}

                  {savings && (
                    <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-lg flex items-center gap-1" style={{ background: "#16A34A", boxShadow: "0 2px 8px rgba(22, 163, 74, 0.3)" }}>
                      <Tag size={9} color="white" />
                      <span style={{ fontSize: 9, fontWeight: 800, color: "white" }}>Save ₹{savings.toFixed(0)}</span>
                    </div>
                  )}

                  <motion.button
                    whileTap={{ scale: 0.8 }}
                    onClick={(e) => toggleFavorite(product.id, e)}
                    className="absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center"
                    style={{ background: "rgba(255,255,255,0.9)", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}
                  >
                    <Heart size={14} color={favorites.includes(product.id) ? "#EF4444" : "#A9A4C0"} fill={favorites.includes(product.id) ? "#EF4444" : "transparent"} />
                  </motion.button>
                </div>

                {/* Info */}
                <div className="p-4 flex flex-col flex-1">
                  <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, color: "#7B3FC4", fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 2 }}>{product.brand}</p>
                  <p style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: 13, color: "#1A1040", lineHeight: 1.3, marginBottom: 8, height: 34, overflow: "hidden" }}>{product.name}</p>

                  <div className="flex flex-col justify-end mt-auto gap-2">
                    {bestStore && (
                      <div className="flex items-center gap-1">
                        <Flame size={12} color="#D97706" />
                        <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, fontWeight: 600, color: "#D97706" }}>
                          Best deal on {bestStore.store}
                        </span>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, fontWeight: 800, color: "#1A1040" }}>
                        {product.price || "Check latest price"}
                      </span>
                      <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "linear-gradient(135deg, #7B3FC4, #5421B5)", boxShadow: "0 4px 12px rgba(123, 63, 196, 0.3)" }}>
                        <ShoppingCart size={14} color="white" />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </AnimatePresence>

      {/* Product Bottom Sheet */}
      <ProductBottomSheet
        product={selectedProduct}
        open={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        refetchProducts={refetch}
        allProducts={products}
      />
    </div>
  );
}
