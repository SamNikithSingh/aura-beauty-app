import { useState, useEffect, useCallback } from "react";
import { supabase } from "../lib/supabase";

export interface Product {
  id: string;
  name: string;
  brand: string;
  description: string;
  benefit: string;
  price: string | null;
  priceUSD: string | null;
  rawPrice: number | null;
  category: string;
  tag: string;
  image: string;
  rating: number;
  reviews: number;
  ingredients: string[];
  skinType: string;
  skinTypes: string[];
  concerns: string[];
  usageSteps: string[];
  affiliateUrl: string;
  discount: string | null;
  featured: boolean;
  trending: boolean;
  
  // New Store URLs
  amazonUrl?: string;
  nykaaUrl?: string;
  officialUrl?: string;
  flipkartUrl?: string;
  otherUrls?: string;
  
  nykaaPrice?: number | null;
  officialPrice?: number | null;
  amazonPrice?: number | null;
  flipkartPrice?: number | null;
  
  nykaaLastUpdated?: string | null;
  officialLastUpdated?: string | null;
  amazonLastUpdated?: string | null;
  flipkartLastUpdated?: string | null;
}

/**
 * Maps Supabase snake_case columns to Product camelCase properties.
 * Provides safe fallbacks for missing data to maintain the premium UI.
 */
const mapFromSupabase = (data: any): Product => {
  // Determine skin type match based on category for basic fallback
  let defaultSkinTypes = ["All types"];
  let defaultConcerns = ["Hydration"];
  
  if (data.category === "Cleanser") {
    defaultSkinTypes = ["Oily", "Normal", "Combination"];
    defaultConcerns = ["acne", "large_pores"];
  } else if (data.category === "Serum") {
    defaultSkinTypes = ["Dry", "Normal", "Combination"];
    defaultConcerns = ["dullness", "fine_lines"];
  }

  // Parse multiple prices
  const parseRaw = (val: any) => {
    if (val === null || val === undefined) return null;
    let p: number | null = null;
    if (typeof val === 'string') {
      p = parseFloat(val.replace(/[^\d.]/g, ""));
    } else {
      p = Number(val);
    }
    return isNaN(p) ? null : p;
  };

  const nykaaPrice = parseRaw(data.nykaa_price);
  const officialPrice = parseRaw(data.official_price);
  const amazonPrice = parseRaw(data.amazon_price);
  const flipkartPrice = parseRaw(data.flipkart_price);

  // Find lowest valid price (ignoring Flipkart as requested)
  const allPrices = [nykaaPrice, officialPrice, amazonPrice].filter((p): p is number => p !== null);
  let rawPrice: number | null = null;
  if (allPrices.length > 0) {
    rawPrice = Math.min(...allPrices);
  }

  const displayPrice = rawPrice ? `₹${rawPrice}` : null;
  const displayPriceUSD = rawPrice ? `$${Math.round(rawPrice / 83)}` : null;

  return {
    id: data.id,
    name: data.product_name || "Aura Premium Product",
    brand: data.brand || "Aura Pick", 
    description: data.description || data.benefit || "A highly effective formulation designed to enhance your natural glow.",
    benefit: data.benefit || "Improves skin health",
    price: displayPrice,
    priceUSD: displayPriceUSD,
    rawPrice: rawPrice,
    nykaaPrice,
    officialPrice,
    amazonPrice,
    flipkartPrice,
    nykaaLastUpdated: data.nykaa_last_updated,
    officialLastUpdated: data.official_last_updated,
    amazonLastUpdated: data.amazon_last_updated,
    flipkartLastUpdated: data.flipkart_last_updated,
    category: data.category || "Skincare",
    tag: data.tag || "Best Seller",
    image: data.image_url || data.image || "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    rating: data.rating || 4.8,
    reviews: data.reviews || Math.floor(Math.random() * 5000) + 500,
    ingredients: data.ingredients || data.key_ingredients || ["Hyaluronic Acid", "Niacinamide", "Glycerin"],
    skinType: data.skin_type || defaultSkinTypes[0],
    skinTypes: data.skin_types || defaultSkinTypes,
    concerns: data.concerns || defaultConcerns,
    usageSteps: data.usage_steps || ["Cleanse face thoroughly.", "Apply 2-3 drops to dry skin.", "Follow up with moisturizer."],
    affiliateUrl: data.affiliate_url || data.official_url || data.amazon_url || data.nykaa_url || data.flipkart_url || "#",
    discount: data.discount || null,
    featured: data.featured || false,
    trending: data.trending || true,

    amazonUrl: data.amazon_url,
    nykaaUrl: data.nykaa_url,
    officialUrl: data.official_url,
    flipkartUrl: data.flipkart_url,
    otherUrls: data.other_urls,
  };
};

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: fetchError } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (fetchError) {
        console.error("Supabase fetch error:", fetchError);
        throw fetchError;
      }

      if (data) {
        console.log("Raw Supabase Products Data:", data.map(d => ({ id: d.id, price: d.price })));
        const mappedProducts = data.map(mapFromSupabase);
        console.log("Mapped Products for UI:", mappedProducts.map(p => ({ id: p.id, price: p.price, rawPrice: p.rawPrice })));
        setProducts(mappedProducts);
      }
    } catch (err: any) {
      console.error("Error fetching products:", err);
      setError(err.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return { products, loading, error, refetch: fetchProducts };
}
