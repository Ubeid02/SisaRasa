export interface Ingredient {
  id: string;
  name: string;
  category: "sayuran"| "daging"| "bumbu"| "karbo"| "lainnya";
  averagePrice: number; // in IDR
  weightPerUnit: number; // in kg
}

export interface Recipe {
  id: string;
  title: string;
  description: string;
  ingredients: {
    name: string;
    quantity: string;
    isEssential: boolean;
  }[];
  instructions: string[];
  prepTime: number; // minutes
  difficulty: "Mudah" | "Sedang" | "Sukar";
  matchPercentage?: number;
  image?: string;
  category: string;
}

export interface UserStats {
  mealsCooked: number;
  savedWeightKg: number;
  savedMoneyIdr: number;
}

export interface FavoriteRecipe {
  id: string;
  addedAt: string;
}

export interface ChefTipResponse {
  tip: string;
}
