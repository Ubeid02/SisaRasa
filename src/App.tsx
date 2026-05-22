import { useState, useEffect } from "react";
import { Ingredient, Recipe, UserStats } from "./types";
import { PRESET_RECIPES } from "./data/recipes";
import { MASTER_INGREDIENTS } from "./data/ingredients";
import PantryInput from "./components/PantryInput";
import RouletteEngine from "./components/RouletteEngine";
import SustainDashboard from "./components/SustainDashboard";
import RecipeBook from "./components/RecipeBook";
import { Sparkles, Leaf, Info, MessageSquare, Flame, Check, Trophy, Heart } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function App() {
  // 1. STATE INITIALIZATION WITH PERSISTENCE (LOCAL STORAGE)
  const [recipes, setRecipes] = useState<Recipe[]>(() => {
    try {
      const saved = localStorage.getItem("sisarasa_recipes");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error("Local storage read error for recipes:", e);
    }
    return PRESET_RECIPES;
  });

  const [selectedIngredients, setSelectedIngredients] = useState<Ingredient[]>(() => {
    try {
      const saved = localStorage.getItem("sisarasa_pantry");
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error(e);
    }
    // Pre-seed with some popular items so the app is immediately alive and gorgeous
    return [
      MASTER_INGREDIENTS[0], // Nasi Putih
      MASTER_INGREDIENTS[1], // Telur Ayam
      MASTER_INGREDIENTS[2], // Bawang Merah
      MASTER_INGREDIENTS[3], // Bawang Putih
    ];
  });

  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("sisarasa_favorites");
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [];
  });

  const [stats, setStats] = useState<UserStats>(() => {
    try {
      const saved = localStorage.getItem("sisarasa_stats");
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return {
      mealsCooked: 0,
      savedWeightKg: 0,
      savedMoneyIdr: 0
    };
  });

  // Active modal recipe selected via the Roulette engine
  const [activeSelectedRecipeId, setActiveSelectedRecipeId] = useState<string | null>(null);

  // Micro notification toasts for feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationText, setCelebrationText] = useState("");

  // Save states to local storage on changes
  useEffect(() => {
    localStorage.setItem("sisarasa_recipes", JSON.stringify(recipes));
  }, [recipes]);

  useEffect(() => {
    localStorage.setItem("sisarasa_pantry", JSON.stringify(selectedIngredients));
  }, [selectedIngredients]);

  useEffect(() => {
    localStorage.setItem("sisarasa_favorites", JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem("sisarasa_stats", JSON.stringify(stats));
  }, [stats]);

  // Toast utility helper
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3000);
  };

  // 2. STOCK MANAGER OPERATIONS
  const handleAddIngredient = (item: Ingredient) => {
    const exists = selectedIngredients.some((sel) => sel.id === item.id);
    if (exists) return;
    setSelectedIngredients([...selectedIngredients, item]);
    triggerToast(`🥬 Menambahkan ${item.name} ke Kulkas saya!`);
  };

  const handleRemoveIngredient = (id: string) => {
    const item = selectedIngredients.find((sel) => sel.id === id);
    setSelectedIngredients(selectedIngredients.filter((sel) => sel.id !== id));
    if (item) {
      triggerToast(`💨 Mengeluarkan ${item.name} dari Kulkas.`);
    }
  };

  const handleAddCustomIngredient = (name: string, category: "sayuran"| "daging"| "bumbu"| "karbo"| "lainnya") => {
    const trimmed = name.trim();
    if (!trimmed) return;
    
    // Create random price and weight estimates based on category
    let averagePrice = 3000;
    let weightPerUnit = 0.15;
    if (category === "daging") { averagePrice = 12000; weightPerUnit = 0.25; }
    if (category === "bumbu") { averagePrice = 1000; weightPerUnit = 0.03; }
    if (category === "karbo") { averagePrice = 4000; weightPerUnit = 0.20; }

    const newIng: Ingredient = {
      id: `custom-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      name: trimmed,
      category,
      averagePrice,
      weightPerUnit
    };

    setSelectedIngredients([...selectedIngredients, newIng]);
    triggerToast(`✨ Bahan kustom '${trimmed}' ditambahkan ke Kulkas!`);
  };

  // 3. FAVORITE AND COMBAT FOOD WASTE CONSUMPTION LOOP
  const handleToggleFavorite = (id: string) => {
    if (favorites.includes(id)) {
      setFavorites(favorites.filter(favId => favId !== id));
      triggerToast("🤍 Dihapus dari resep favorit.");
    } else {
      setFavorites([...favorites, id]);
      triggerToast("❤️ Ditambahkan ke resep favorit!");
    }
  };

  const handleCookRecipe = (recipe: Recipe) => {
    // Collect ingredients match and consume/remove them from the fridge drawer
    let matchedWeight = 0;
    let matchedPrice = 0;
    const consumedIngredientNames: string[] = [];

    const updatedPantry = selectedIngredients.filter((item) => {
      // If the recipe lists this ingredient, consume it
      const inRecipe = recipe.ingredients.some(ri =>
        item.name.toLowerCase().includes(ri.name.toLowerCase()) || ri.name.toLowerCase().includes(item.name.toLowerCase())
      );
      if (inRecipe) {
        matchedWeight += item.weightPerUnit;
        matchedPrice += item.averagePrice;
        consumedIngredientNames.push(item.name);
        return false; // Remove from pantry list (consumed)
      }
      return true; // Keep in pantry
    });

    // Update stats
    const statsWeightSaved = matchedWeight > 0 ? matchedWeight : 0.45; // default 0.45kg average per cooked meal sisa if custom AI
    const statsMoneySaved = matchedPrice > 0 ? matchedPrice : 8500; // default IDR 8.500 saved if kustom AI

    setStats(prev => ({
      mealsCooked: prev.mealsCooked + 1,
      savedWeightKg: prev.savedWeightKg + statsWeightSaved,
      savedMoneyIdr: prev.savedMoneyIdr + statsMoneySaved
    }));

    // Update fridge stock
    setSelectedIngredients(updatedPantry);

    // Trigger celebration banners
    const displayNames = consumedIngredientNames.join(", ");
    setCelebrationText(
      consumedIngredientNames.length > 0 
        ? `Sukses memasak "${recipe.title}"! Anda menyelamatkan [${displayNames}] senilai ${new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(statsMoneySaved)} agar tak jadi sampah dapur!`
        : `Sukses memasak "${recipe.title}"! Hidangan zero-waste Anda siap dinikmati.`
    );
    setShowCelebration(true);
    
    // Automatically close celebration modal after 6 seconds
    setTimeout(() => {
      setShowCelebration(false);
    }, 6500);
  };

  // 4. ROULETTE HANDLERS
  const handleRecipeSelectedFromRoulette = (recipe: Recipe, isCustomAICreated: boolean) => {
    setActiveSelectedRecipeId(recipe.id);
    if (isCustomAICreated) {
      triggerToast("🔮 Selalu sedia AI! Koki AI SisaRasa telah menyusun resep baru!");
    } else {
      triggerToast(`🌀 Slot mendarat di: ${recipe.title}!`);
    }
  };

  // CALL SERVER DIRECTLY TO DRAFT A GEMINI CUSTOM COMBINATION RECIPE
  const handleGenerateCustomAI = async (): Promise<Recipe | null> => {
    if (selectedIngredients.length === 0) return null;
    
    try {
      const response = await fetch("/api/gemini/generate-recipe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ingredients: selectedIngredients.map((i) => i.name)
        })
      });

      if (!response.ok) {
        throw new Error("Gagal generate resep dari backend");
      }

      const parsedRecipe = await response.json();
      
      if (!parsedRecipe.title) {
        return null;
      }

      // Assign a unique generated ID
      const newRecipe: Recipe = {
        id: `ai-recipe-${Date.now()}`,
        title: parsedRecipe.title,
        description: parsedRecipe.description || "Kreasi koki kustom AI dari sisa kulkas Anda.",
        prepTime: parsedRecipe.prepTime || 15,
        difficulty: parsedRecipe.difficulty || "Mudah",
        category: parsedRecipe.category || "Dapur AI SisaRasa",
        ingredients: parsedRecipe.ingredients || [],
        instructions: parsedRecipe.instructions || [],
        image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3" // gorgeous custom matching backdrop
      };

      // Set state to append to catalog, saving to local state
      setRecipes((prev) => [newRecipe, ...prev]);
      return newRecipe;

    } catch (e) {
      console.error(e);
      triggerToast("⚠️ Terjadi kesalahan. Gagal menghubungi Koki AI.");
      return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-cyan-500 selection:text-slate-950 font-sans pb-16 relative overflow-x-hidden">
      
      {/* Background glow radial points */}
      <div className="absolute top-0 left-1/4 w-[450px] h-[450px] bg-cyan-900/10 rounded-full filter blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-[600px] h-[600px] bg-indigo-900/5 rounded-full filter blur-[150px] pointer-events-none" />

      {/* Decorative zero waste indicator banner */}
      <div className="bg-gradient-to-r from-cyan-950/40 via-slate-950 to-indigo-950/40 border-b border-slate-900 py-2.5 px-4 text-center">
        <p className="text-[11px] font-mono tracking-widest text-cyan-400 font-semibold uppercase flex items-center justify-center gap-2">
          <Leaf size={12} className="animate-pulse text-emerald-400" />
          Setop Sampah Makanan • Dukung Keberlanjutan Pangan Nusantara • SisaRasa Gamified Engine
        </p>
      </div>

      {/* Main navigation / brand layout */}
      <header className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-slate-800/60 pb-6 mb-8">
          <div className="flex items-center gap-4 text-center md:text-left">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-cyan-500 to-indigo-600 p-0.5 shadow-lg shadow-cyan-500/20 flex items-center justify-center flex-shrink-0 animate-spin-pulse">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-cyan-400">
                <Flame size={28} className="fill-current animate-bounce" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 justify-center md:justify-start">
                <h1 className="text-3xl font-display font-black text-white tracking-tight">SisaRasa</h1>
                <span className="text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 px-2 py-0.5 rounded-full">GAMIFIED AI v1.2</span>
              </div>
              <p className="text-xs text-slate-400 mt-1 max-w-sm md:max-w-lg leading-relaxed">
                Ubah sisa bahan makanan di kulkas kos Anda menjadi mahakarya masakan khas Indonesia yang nikmat, praktis, dan bebas dari limbah!
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="text-right hidden sm:block">
              <p className="text-[10px] text-slate-500 font-mono">ESTIMASI CARBON SAVED</p>
              <p className="text-xs font-semibold text-emerald-400">{(stats.savedWeightKg * 2.5).toFixed(1)} Kg CO₂e</p>
            </div>
            <div className="h-8 w-[1px] bg-slate-800 hidden sm:block mx-2" />
            <span className="px-4 py-2 bg-slate-900 border border-slate-800 text-slate-350 text-xs font-mono rounded-lg flex items-center gap-1.5 shadow-sm">
              🔑 Kunci AI: <span className={recipes.length > PRESET_RECIPES.length ? "text-emerald-400 font-bold" : "text-cyan-400 font-bold"}>SERVER READY</span>
            </span>
          </div>
        </div>
      </header>

      {/* Main Container Core Modules */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Celebration cooked success modal overlay */}
        <AnimatePresence>
          {showCelebration && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-gradient-to-r from-emerald-950 via-teal-950 to-cyan-950 border-y border-emerald-500/40 p-5 rounded-2xl mb-8 flex flex-col sm:flex-row items-center gap-4 glow-cerulean-lg shadow-xl"
            >
              <div className="w-12 h-12 bg-emerald-500/20 border border-emerald-400/40 rounded-full flex items-center justify-center flex-shrink-0 text-emerald-400">
                <Trophy size={24} className="animate-bounce" />
              </div>

              <div className="flex-1 text-center sm:text-left">
                <h4 className="text-sm font-display font-extrabold text-white uppercase tracking-wider flex items-center gap-1.5 justify-center sm:justify-start">
                  <span>Selamat Hidangan Matang!</span>
                  <Trophy size={14} className="text-yellow-400" />
                </h4>
                <p className="text-xs text-emerald-300 font-sans mt-1.5 leading-relaxed">
                  {celebrationText}
                </p>
              </div>

              <button
                onClick={() => setShowCelebration(false)}
                className="px-4 py-1.5 bg-emerald-500 text-slate-950 font-mono font-bold text-xs rounded-lg hover:bg-emerald-450 transition cursor-pointer"
              >
                OKE, LANJUTKAN MEMASAK 🍳
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Global Split layout columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left panel compartment - 5 span segments */}
          <section className="lg:col-span-5 space-y-8">
            {/* 1. Fridge stockpile input section */}
            <PantryInput
              selectedIngredients={selectedIngredients}
              onAddIngredient={handleAddIngredient}
              onRemoveIngredient={handleRemoveIngredient}
              onAddCustomIngredient={handleAddCustomIngredient}
            />

            {/* 2. Sustainability and eco statistics indices */}
            <SustainDashboard stats={stats} />
          </section>

          {/* Right panel interactive elements - 7 span segments */}
          <section className="lg:col-span-7 space-y-8">
            
            {/* 3. The Gamified Slot Machine Wheel component */}
            <RouletteEngine
              recipes={recipes}
              onRecipeSelected={handleRecipeSelectedFromRoulette}
              selectedIngredients={selectedIngredients.map((i) => i.name)}
              onGenerateCustomAI={handleGenerateCustomAI}
            />

            {/* 4. Complete list catalog search matching book */}
            <RecipeBook
              recipes={recipes}
              selectedIngredients={selectedIngredients}
              favorites={favorites}
              onToggleFavorite={handleToggleFavorite}
              onCookRecipe={handleCookRecipe}
              activeSelectedRecipeId={activeSelectedRecipeId}
              onClearActiveSelectedRecipeId={() => setActiveSelectedRecipeId(null)}
            />
          </section>

        </div>

        {/* Informative summary help line blocks */}
        <section className="mt-12 bg-slate-900/40 p-6 rounded-2xl border border-slate-850 max-w-7xl mx-auto flex flex-col sm:flex-row gap-5 items-center justify-between text-slate-400">
          <div className="flex gap-4 items-start">
            <Info size={24} className="text-cyan-400 flex-shrink-0 mt-0.5" />
            <div>
              <h5 className="text-xs font-display font-bold text-white uppercase tracking-wider mb-1">Misi SisaRasa (Zero Waste Mission)</h5>
              <p className="text-[11px] leading-relaxed">
                Di Indonesia, sampah makanan mencapai rata-rata 184 kg per orang setiap tahunnya. Dengan menggunakan SisaRasa, Anda tidak hanya menghemat anggaran makan harian kos atau rumah tangga Anda, tetapi juga berkontribusi secara nyata menurunkan jejak emisi karbon limbah organik di Tempat Pembuangan Akhir. Zero waste cooking, zero guilt!
              </p>
            </div>
          </div>
          
          <div className="flex gap-1.5 flex-wrap-reverse sm:flex-nowrap shrink-0">
            <a
              href="https://www.worldfoodday.org"
              target="_blank"
              rel="noreferrer"
              className="px-3.5 py-1.5 bg-slate-950 hover:bg-slate-900 text-slate-300 rounded-lg text-xs font-semibold border border-slate-800 transition whitespace-nowrap"
            >
              Info Kampanye Food-Waste 📚
            </a>
          </div>
        </section>

      </main>

      {/* Persistent mini notifications toast */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            id="toast-notification-strip"
            className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-slate-800 text-slate-100 px-4 py-3 rounded-xl shadow-lg shadow-cyan-900/10 text-xs font-medium flex items-center gap-2.5 cursor-pointer glow-cerulean-sm"
          >
            <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-ping" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
