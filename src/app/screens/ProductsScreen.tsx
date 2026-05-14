import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Star, ShoppingCart, Heart, ExternalLink, Tag } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { useProducts, Product } from "../hooks/useProducts";
import { useUserProfile } from "../hooks/useUserProfile";

const CATEGORIES = ["All", "Serum", "Moisturizer", "Cleanser", "Sunscreen", "Eye Care"];



const TAG_COLORS: Record<string, { bg: string; color: string; border: string }> = {
  "Best Seller": { bg: "rgba(251, 191, 36, 0.12)", color: "#D97706", border: "rgba(251, 191, 36, 0.3)" },
  "Aura Pick": { bg: "rgba(123, 63, 196, 0.1)", color: "#7B3FC4", border: "rgba(123, 63, 196, 0.25)" },
  "Editor's Pick": { bg: "rgba(236, 72, 153, 0.1)", color: "#DB2777", border: "rgba(236, 72, 153, 0.25)" },
  "Fan Favorite": { bg: "rgba(34, 197, 94, 0.1)", color: "#16A34A", border: "rgba(34, 197, 94, 0.25)" },
};



function ProductModal({ product, onClose }: { product: Product; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end justify-center"
      style={{ maxWidth: 430, margin: "0 auto" }}
      onClick={onClose}
    >
      <div className="absolute inset-0" style={{ background: "rgba(26, 10, 80, 0.4)", backdropFilter: "blur(8px)" }} />
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="relative w-full rounded-t-3xl overflow-hidden pb-10"
        style={{
          background: "#FFFFFF",
          border: "1px solid rgba(123, 63, 196, 0.1)",
          maxHeight: "85vh",
          overflowY: "auto",
          boxShadow: "0 -8px 40px rgba(0,0,0,0.15)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full" style={{ background: "rgba(123, 63, 196, 0.15)" }} />
        </div>

        {/* Product image */}
        <div className="relative h-52 overflow-hidden">
          <ImageWithFallback src={product.image} alt={product.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, transparent 50%, rgba(255,255,255,0.95) 100%)" }} />
          {/* Tag */}
          <div
            className="absolute top-4 left-4 px-3 py-1 rounded-full"
            style={{
              background: TAG_COLORS[product.tag]?.bg || "rgba(123, 63, 196, 0.1)",
              border: `1px solid ${TAG_COLORS[product.tag]?.border || "rgba(123, 63, 196, 0.2)"}`,
            }}
          >
            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: TAG_COLORS[product.tag]?.color || "#7B3FC4", fontWeight: 600 }}>
              {product.tag}
            </span>
          </div>
          {product.discount && (
            <div
              className="absolute top-4 right-4 px-3 py-1 rounded-full"
              style={{ background: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.25)" }}
            >
              <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: "#EF4444", fontWeight: 600 }}>
                {product.discount}
              </span>
            </div>
          )}
        </div>

        <div className="px-5 pt-2">
          <div className="flex items-start justify-between mb-2">
            <div>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#A9A4C0", fontWeight: 500 }}>{product.brand}</p>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, color: "#1A1040", fontWeight: 600, lineHeight: 1.2 }}>
                {product.name}
              </h3>
            </div>
            <div className="text-right">
              <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700, color: "#7B3FC4" }}>
                {product.price}
              </p>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: "#A9A4C0" }}>{product.priceUSD}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 mb-4">
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={12} fill={i < Math.floor(product.rating) ? "#F59E0B" : "transparent"} color="#F59E0B" />
              ))}
            </div>
            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#6B6880" }}>
              {product.rating} ({product.reviews.toLocaleString()} reviews)
            </span>
          </div>

          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13.5, color: "#4A4A6A", lineHeight: 1.6, marginBottom: 16 }}>
            {product.benefit}
          </p>

          <div className="mb-4">
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: "#A9A4C0", letterSpacing: 0.5, marginBottom: 8, textTransform: "uppercase", fontWeight: 600 }}>
              Key Ingredients
            </p>
            <div className="flex flex-wrap gap-2">
              {product.keyIngredients.map((ing) => (
                <span
                  key={ing}
                  className="px-3 py-1 rounded-full"
                  style={{
                    background: "rgba(123, 63, 196, 0.06)",
                    border: "1px solid rgba(123, 63, 196, 0.15)",
                    fontFamily: "'Inter', sans-serif",
                    fontSize: 11,
                    color: "#7B3FC4",
                    fontWeight: 500,
                  }}
                >
                  {ing}
                </span>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 mb-5 p-3 rounded-xl" style={{ background: "rgba(123, 63, 196, 0.04)", border: "1px solid rgba(123, 63, 196, 0.08)" }}>
            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#A9A4C0" }}>Best for:</span>
            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#1A1040", fontWeight: 500 }}>{product.skinType}</span>
          </div>

          {/* Affiliate CTA */}
          <a
            href={product.affiliateUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-4 rounded-2xl flex items-center justify-center gap-2"
            style={{
              background: "linear-gradient(135deg, #7B3FC4 0%, #5421B5 100%)",
              boxShadow: "0 8px 24px rgba(123, 63, 196, 0.35)",
              display: "flex",
              textDecoration: "none",
            }}
          >
            <ShoppingCart size={16} color="white" />
            <span style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: 15, color: "white" }}>
              Shop Now
            </span>
            <ExternalLink size={13} color="rgba(255,255,255,0.7)" />
          </a>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, color: "#B0AEC8", textAlign: "center", marginTop: 8 }}>
            Affiliate link · Aura earns a small commission at no extra cost to you
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function ProductsScreen() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);

  const { products, loading } = useProducts();
  const { profile } = useUserProfile();

  const personalizedProducts = useMemo(() => {
    if (!products || products.length === 0) return [];
    
    const userSkinType = profile?.skinType?.toLowerCase() || "";
    if (!userSkinType) return products;

    let matched = products.filter(p => {
      const pSkin = p.skinType?.toLowerCase() || "";
      return pSkin.includes(userSkinType) || pSkin.includes("all types");
    });

    if (matched.length === 0) {
      matched = products;
    }

    return matched;
  }, [products, profile?.skinType]);

  const filtered = activeCategory === "All" 
    ? personalizedProducts 
    : personalizedProducts.filter((p) => p.category === activeCategory);

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites((prev) => (prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]));
  };

  return (
    <div className="min-h-screen px-5 pt-14 pb-6" style={{ background: "#F8F5FF" }}>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-5">
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#A9A4C0", letterSpacing: 1, textTransform: "uppercase", fontWeight: 500 }}>
          Curated For You
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
          Product Recommendations ✦
        </h1>
      </motion.div>

      {/* Affiliate banner */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-2xl p-3 mb-4 flex items-center gap-3"
        style={{
          background: "linear-gradient(135deg, rgba(123, 63, 196, 0.06), rgba(168, 85, 247, 0.05))",
          border: "1.5px solid rgba(123, 63, 196, 0.12)",
        }}
      >
        <Tag size={14} color="#7B3FC4" />
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: "#6B6880", lineHeight: 1.4, flex: 1 }}>
          ✦ <span style={{ color: "#7B3FC4", fontWeight: 600 }}>Smart & safe picks</span> by Aura AI · Affiliate links help us keep Aura free
        </p>
      </motion.div>

      {/* Category filter */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-5 -mx-1 px-1" style={{ scrollbarWidth: "none" }}>
        {CATEGORIES.map((cat) => (
          <motion.button
            key={cat}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveCategory(cat)}
            className="flex-shrink-0 px-4 py-2 rounded-full"
            style={{
              background: activeCategory === cat
                ? "linear-gradient(135deg, #7B3FC4, #5421B5)"
                : "#FFFFFF",
              border: activeCategory === cat
                ? "none"
                : "1.5px solid rgba(123, 63, 196, 0.12)",
              fontFamily: "'Inter', sans-serif",
              fontSize: 12,
              fontWeight: activeCategory === cat ? 600 : 400,
              color: activeCategory === cat ? "white" : "#6B6880",
              boxShadow: activeCategory === cat
                ? "0 4px 12px rgba(123, 63, 196, 0.3)"
                : "0 2px 8px rgba(0,0,0,0.04)",
            }}
          >
            {cat}
          </motion.button>
        ))}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#7B3FC4] border-t-transparent" />
        </div>
      )}

      {/* Product Grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeCategory}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="grid grid-cols-2 gap-4"
        >
          {filtered.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, duration: 0.35 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setSelectedProduct(product)}
              className="rounded-2xl overflow-hidden cursor-pointer"
              style={{
                background: "#FFFFFF",
                border: "1.5px solid rgba(123, 63, 196, 0.08)",
                boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
              }}
            >
              {/* Product image */}
              <div className="relative" style={{ height: 145 }}>
                <ImageWithFallback src={product.image} alt={product.name} className="w-full h-full object-cover" />
                {/* Tag */}
                <div
                  className="absolute top-2 left-2 px-2 py-0.5 rounded-full"
                  style={{
                    background: TAG_COLORS[product.tag]?.bg || "rgba(123, 63, 196, 0.1)",
                    border: `1px solid ${TAG_COLORS[product.tag]?.border || "rgba(123, 63, 196, 0.2)"}`,
                  }}
                >
                  <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 9, fontWeight: 700, color: TAG_COLORS[product.tag]?.color || "#7B3FC4" }}>
                    {product.tag}
                  </span>
                </div>
                {/* Discount badge */}
                {product.discount && (
                  <div
                    className="absolute bottom-2 left-2 px-2 py-0.5 rounded-full"
                    style={{ background: "rgba(239, 68, 68, 0.9)" }}
                  >
                    <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 9, fontWeight: 700, color: "white" }}>
                      {product.discount}
                    </span>
                  </div>
                )}
                {/* Favorite */}
                <motion.button
                  whileTap={{ scale: 0.85 }}
                  onClick={(e) => toggleFavorite(product.id, e)}
                  className="absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center"
                  style={{
                    background: "rgba(255,255,255,0.9)",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  }}
                >
                  <Heart
                    size={13}
                    color={favorites.includes(product.id) ? "#EF4444" : "#C5C2D4"}
                    fill={favorites.includes(product.id) ? "#EF4444" : "transparent"}
                  />
                </motion.button>
              </div>

              {/* Info */}
              <div className="p-3">
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, color: "#A9A4C0", marginBottom: 2, fontWeight: 500 }}>
                  {product.brand}
                </p>
                <p style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: 12, color: "#1A1040", lineHeight: 1.3, marginBottom: 4 }}>
                  {product.name}
                </p>

                <div className="flex items-center gap-1 mb-3">
                  <Star size={10} fill="#F59E0B" color="#F59E0B" />
                  <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, color: "#6B6880" }}>
                    {product.rating}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 15, fontWeight: 700, color: "#7B3FC4" }}>
                      {product.price}
                    </span>
                  </div>
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center"
                    style={{ background: "linear-gradient(135deg, #7B3FC4, #5421B5)" }}
                  >
                    <ShoppingCart size={12} color="white" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>

      {/* Coming soon note */}
      <div className="mt-6 rounded-2xl p-4 text-center" style={{ background: "#FFFFFF", border: "1.5px solid rgba(123, 63, 196, 0.08)" }}>
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#7B3FC4", fontWeight: 600, marginBottom: 2 }}>
          ✨ More brands & exclusive discounts coming soon
        </p>
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: "#A9A4C0" }}>
          Real affiliate links activate at launch
        </p>
      </div>

      {/* Product Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
