import { useState, useEffect, useCallback } from "react";
import { supabase } from "../lib/supabase";

export interface Product {
  id: string; // Updated to string for UUID
  name: string;
  brand: string;
  benefit: string;
  price: string;
  priceUSD: string;
  category: string;
  tag: string;
  image: string;
  rating: number;
  reviews: number;
  keyIngredients: string[];
  skinType: string;
  affiliateUrl: string;
  discount: string | null;
}

/**
 * Maps Supabase snake_case columns to Product camelCase properties.
 */
const mapFromSupabase = (data: any): Product => ({
  id: data.id,
  name: data.name,
  brand: data.brand,
  benefit: data.benefit,
  price: data.price,
  priceUSD: data.price_usd,
  category: data.category,
  tag: data.tag,
  image: data.image,
  rating: data.rating,
  reviews: data.reviews,
  keyIngredients: data.key_ingredients || [],
  skinType: data.skin_type,
  affiliateUrl: data.affiliate_url,
  discount: data.discount,
});

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
        throw fetchError;
      }

      if (data) {
        setProducts(data.map(mapFromSupabase));
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
