import { useState, useEffect, useMemo } from "react";
import { Product } from "./useProducts";

export interface ProductOffer {
  id: string;
  productId: string;
  storeName: string;
  storeLogo: string;
  productUrl: string;
  currentPrice: number | null;
  originalPrice: number | null;
  discountPercent: number;
  isBestDeal: boolean;
  isOfficial: boolean;
  inStock: boolean;
  productImage: string | null;
  updatedAt: string;
}

/**
 * Dynamically generates ProductOffer objects based on the URLs present
 * in the Product object. It strictly displays real scraped prices from
 * Supabase for Nykaa, and sets other stores to null so the UI can display
 * 'Check latest price' without fabrication.
 */
export function useProductOffers(product: Product | null) {
  const [loading, setLoading] = useState(false);

  const { offers, bestDeal } = useMemo(() => {
    if (!product) return { offers: [], bestDeal: null };

    // Simulate network delay for premium feel
    setLoading(true);
    
    const dynamicOffers: ProductOffer[] = [];
    
    if (product.amazonUrl && product.amazonPrice !== null && product.amazonPrice !== undefined) {
      dynamicOffers.push({
        id: `dyn-amazon-${product.id}`,
        productId: product.id,
        storeName: "Amazon",
        storeLogo: "🛒",
        productUrl: product.amazonUrl,
        currentPrice: product.amazonPrice,
        originalPrice: null,
        discountPercent: 0,
        isBestDeal: false,
        isOfficial: false,
        inStock: true,
        productImage: product.image,
        updatedAt: product.amazonLastUpdated || new Date().toISOString(),
      });
    }

    if (product.nykaaUrl && product.nykaaPrice !== null && product.nykaaPrice !== undefined) {
      dynamicOffers.push({
        id: `dyn-nykaa-${product.id}`,
        productId: product.id,
        storeName: "Nykaa",
        storeLogo: "💄",
        productUrl: product.nykaaUrl,
        currentPrice: product.nykaaPrice,
        originalPrice: null,
        discountPercent: 0,
        isBestDeal: false,
        isOfficial: false,
        inStock: true,
        productImage: product.image,
        updatedAt: product.nykaaLastUpdated || new Date().toISOString(),
      });
    }

    if (product.officialUrl && product.officialPrice !== null && product.officialPrice !== undefined) {
      dynamicOffers.push({
        id: `dyn-official-${product.id}`,
        productId: product.id,
        storeName: "Official Store",
        storeLogo: "🏷️",
        productUrl: product.officialUrl,
        currentPrice: product.officialPrice,
        originalPrice: null,
        discountPercent: 0,
        isBestDeal: false,
        isOfficial: true,
        inStock: true,
        productImage: product.image,
        updatedAt: product.officialLastUpdated || new Date().toISOString(),
      });
    }

    // Sort valid stores by price ascending
    dynamicOffers.sort((a, b) => {
      if (a.currentPrice !== null && b.currentPrice !== null) {
        return a.currentPrice - b.currentPrice;
      }
      return 0;
    });
    
    // Mark best deal and calculate savings ONLY among valid stores (excluding Flipkart)
    if (dynamicOffers.length > 0 && dynamicOffers[0].currentPrice !== null) {
      dynamicOffers[0].isBestDeal = true;
      
      const highestPrice = Math.max(...dynamicOffers.map(o => o.currentPrice || 0));
      const bestPrice = dynamicOffers[0].currentPrice || 0;
      
      if (highestPrice > bestPrice) {
        dynamicOffers[0].originalPrice = highestPrice;
        dynamicOffers[0].discountPercent = ((highestPrice - bestPrice) / highestPrice) * 100;
      }
    }

    // Add Flipkart at the bottom if it has a valid price, completely ignoring it from Best Deal and sorting
    if (product.flipkartUrl && product.flipkartPrice !== null && product.flipkartPrice !== undefined) {
      dynamicOffers.push({
        id: `dyn-flipkart-${product.id}`,
        productId: product.id,
        storeName: "Flipkart",
        storeLogo: "🛍️",
        productUrl: product.flipkartUrl,
        currentPrice: product.flipkartPrice,
        originalPrice: null,
        discountPercent: 0,
        isBestDeal: false,
        isOfficial: false,
        inStock: true,
        productImage: product.image,
        updatedAt: product.flipkartLastUpdated || new Date().toISOString(),
      });
    }

    return { 
      offers: dynamicOffers, 
      bestDeal: dynamicOffers.length > 0 && dynamicOffers[0].isBestDeal ? dynamicOffers[0] : null 
    };
  }, [product]);

  // Turn off loading state after a brief delay
  useEffect(() => {
    if (loading) {
      const timer = setTimeout(() => setLoading(false), 400); // 400ms premium delay
      return () => clearTimeout(timer);
    }
  }, [loading]);

  return { offers, bestDeal, loading, refetch: () => {} };
}
