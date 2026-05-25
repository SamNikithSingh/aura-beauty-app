import { useMemo } from "react";
import { Product } from "./useProducts";
import { UserProfile } from "./useUserProfile";

export interface RecommendationResult {
  product: Product;
  score: number;
  matchReasons: string[];
}

export function useRecommendations(products: Product[], profile: UserProfile | null) {
  const recommendations = useMemo(() => {
    if (!products || products.length === 0 || !profile) return [];

    const userSkinType = (profile.skinType || "").toLowerCase();
    const userConcerns = (profile.onboarding_selections?.skinConcerns || []).map((c: string) => c.toLowerCase());
    const userPreferences = (profile.beauty_preferences || []).map((p: string) => p.toLowerCase());

    return products
      .map((product) => {
        let score = 0;
        const matchReasons: string[] = [];

        // 1. Skin Type Match (Critical)
        const productSkinTypes = product.skinTypes.map(t => t.toLowerCase());
        const hasSkinTypeMatch = productSkinTypes.includes(userSkinType) || productSkinTypes.includes("all types") || productSkinTypes.includes("all skin types");
        
        if (hasSkinTypeMatch) {
          score += 40;
          matchReasons.push(`Perfect for ${profile.skinType} skin`);
        }

        // 2. Concerns Match
        const productConcerns = product.concerns.map(c => c.toLowerCase());
        const matchingConcerns = userConcerns.filter(concern => 
          productConcerns.some(pc => pc.includes(concern) || concern.includes(pc))
        );

        if (matchingConcerns.length > 0) {
          score += matchingConcerns.length * 15;
          matchReasons.push(`Targets your concern: ${matchingConcerns[0]}`);
        }

        // 3. Featured/Trending Boost
        if (product.featured) {
          score += 10;
          matchReasons.push("Aura Featured Pick");
        }
        if (product.trending) {
          score += 5;
        }

        // 4. Rating Match
        if (product.rating >= 4.5) {
          score += 10;
          matchReasons.push("Top Rated by community");
        }

        return {
          product,
          score,
          matchReasons
        };
      })
      .sort((a, b) => b.score - a.score);
  }, [products, profile]);

  const recommendedForYou = recommendations.filter(r => r.score >= 50).map(r => r.product);
  const bestMatches = recommendations.slice(0, 4).map(r => r.product);
  const trending = products.filter(p => p.trending);
  const editorPicks = products.filter(p => p.featured);

  return {
    recommendations,
    recommendedForYou,
    bestMatches,
    trending,
    editorPicks,
  };
}
