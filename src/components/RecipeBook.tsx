import { useState, useMemo, useEffect } from "react";
import { Recipe, Ingredient } from "../types";
import { Clock, ChefHat, Sparkles, AlertCircle, CheckCircle2, Bookmark, Heart, X, Play, LogIn, ChefHat as HatIcon, Check } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface RecipeBookProps {
  recipes: Recipe[];
  selectedIngredients: Ingredient[];
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  onCookRecipe: (recipe: Recipe) => void;
  activeSelectedRecipeId?: string | null;
  onClearActiveSelectedRecipeId?: () => void;
}

export default function RecipeBook({
  recipes,
  selectedIngredients,
  favorites,
  onToggleFavorite,
  onCookRecipe,
  activeSelectedRecipeId,
  onClearActiveSelectedRecipeId
}: RecipeBookProps) {
  const [activeModalId, setActiveModalId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [filterMatchOnly, setFilterMatchOnly] = useState(false);

  // States for Gemini chef tip loading
  const [chefTip, setChefTip] = useState<string | null>(null);
  const [loadingTip, setLoadingTip] = useState(false);

  // List of categorized tags for easier tabs
  const categories = useMemo(() => {
    const list = new Set(recipes.map((r) => r.category));
    return ["All", ...Array.from(list)];
  }, [recipes]);

  // Compute matched recipes score
  const annotatedRecipes = useMemo(() => {
    return recipes.map((recipe) => {
      const essentialIngredients = recipe.ingredients.filter((i) => i.isEssential);
      const totalEssential = essentialIngredients.length;

      // Find matching user ingredients
      const matchedCount = essentialIngredients.filter((esc) =>
        selectedIngredients.some((sel) => sel.name.toLowerCase().includes(esc.name.toLowerCase()) || esc.name.toLowerCase().includes(sel.name.toLowerCase()))
      ).length;

      // Total weight calculation
      const totalIngredientsCount = recipe.ingredients.length;
      const totalMatched = recipe.ingredients.filter((esc) =>
        selectedIngredients.some((sel) => sel.name.toLowerCase().includes(esc.name.toLowerCase()) || esc.name.toLowerCase().includes(sel.name.toLowerCase()))
      ).length;

      const percentage = totalEssential > 0 
        ? Math.round((matchedCount / totalEssential) * 100)
        : Math.round((totalMatched / totalIngredientsCount) * 100);

      return {
        ...recipe,
        matchPercentage: percentage
      };
    }).sort((a, b) => (b.matchPercentage || 0) - (a.matchPercentage || 0));
  }, [recipes, selectedIngredients]);

  // Handle active selections from roulette wheel
  useEffect(() => {
    if (activeSelectedRecipeId) {
      setActiveModalId(activeSelectedRecipeId);
      // Clean tip when opening new modal
      setChefTip(null);
    }
  }, [activeSelectedRecipeId]);

  const handleOpenDetail = (id: string) => {
    setActiveModalId(id);
    setChefTip(null);
  };

  const handleCloseDetail = () => {
    setActiveModalId(null);
    setChefTip(null);
    if (onClearActiveSelectedRecipeId) {
      onClearActiveSelectedRecipeId();
    }
  };

  // Call server-side API `/api/gemini/tip`
  const fetchChefTip = async (recipe: Recipe) => {
    setLoadingTip(true);
    setChefTip(null);
    try {
      const response = await fetch("/api/gemini/tip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipeTitle: recipe.title,
          ingredients: selectedIngredients.map((i) => i.name)
        })
      });
      const data = await response.json();
      if (data.tip) {
        setChefTip(data.tip);
      } else {
        setChefTip("💡 Gagal memuat tips koki. Silakan coba kembali beberapa saat lagi.");
      }
    } catch (error) {
      console.error(error);
      setChefTip("💡 Tips: Selalu tumis bawang dasar secukupnya di awal putaran memasak untuk mengikat aroma sedap.");
    } finally {
      setLoadingTip(false);
    }
  };

  // Filtered lists
  const filteredRecipes = useMemo(() => {
    return annotatedRecipes.filter((item) => {
      const matchSearch = item.title.toLowerCase().includes(search.toLowerCase()) || item.description.toLowerCase().includes(search.toLowerCase());
      const matchCat = selectedCategory === "All" || item.category === selectedCategory;
      const matchScore = !filterMatchOnly || (item.matchPercentage && item.matchPercentage > 0);
      return matchSearch && matchCat && matchScore;
    });
  }, [annotatedRecipes, search, selectedCategory, filterMatchOnly]);

  const activeRecipe = useMemo(() => {
    return annotatedRecipes.find((r) => r.id === activeModalId);
  }, [annotatedRecipes, activeModalId]);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
      
      {/* Title block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-display font-semibold text-white tracking-wide flex items-center gap-2">
            <ChefHat size={22} className="text-sky-400" />
            Buku Resep SisaRasa
          </h2>
          <p className="text-xs text-slate-500 mt-1">Daftar resep lezat yang dapat dicocokkan langsung berdasarkan stok kulkas saat ini.</p>
        </div>

        {/* Input filters */}
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari resep: nasi, sop, roti..."
          id="search-recipe-input"
          className="px-3.5 py-2 w-full sm:w-64 bg-slate-950 text-white rounded-xl border border-slate-800 focus:border-sky-550 focus:outline-none text-xs font-sans placeholder:text-slate-600"
        />
      </div>

      {/* Category scroll tabs & match-only checkbox */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4 mb-6">
        <div className="flex gap-1.5 overflow-x-auto scrollbar-none py-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                selectedCategory === cat
                  ? "bg-sky-500/15 text-sky-400 border border-sky-500/30"
                  : "bg-slate-950 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800/80"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <label className="inline-flex items-center gap-2 text-xs text-slate-300 font-sans cursor-pointer select-none">
          <input
            type="checkbox"
            checked={filterMatchOnly}
            onChange={(e) => setFilterMatchOnly(e.target.checked)}
            id="checkbox-match-only"
            className="rounded bg-slate-950 border-slate-800 text-sky-500 focus:ring-0 focus:ring-offset-0 w-4 h-4 cursor-pointer"
          />
          Hanya Yang Cocok Bahan ({annotatedRecipes.filter(r => (r.matchPercentage || 0) > 0).length})
        </label>
      </div>

      {/* Recipes grid */}
      {filteredRecipes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredRecipes.map((recipe) => {
            const hasEssentialMatch = (recipe.matchPercentage || 0) > 0;
            const isFav = favorites.includes(recipe.id);

            return (
              <motion.div
                key={recipe.id}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-slate-950 rounded-xl border border-slate-800/80 hover:border-slate-700/80 overflow-hidden flex flex-col justify-between transition group h-full"
              >
                {/* Upper block */}
                <div>
                  {/* Recipe Image with Fallbacks */}
                  <div className="h-32 w-full overflow-hidden relative bg-slate-900 border-b border-slate-800">
                    <img
                      src={recipe.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"}
                      alt={recipe.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500 opacity-60 group-hover:opacity-80"
                    />
                    
                    {/* Floating Matching badge percentage */}
                    <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                      <span className={`px-2.5 py-1 text-[10px] font-bold font-mono tracking-wide rounded-full border shadow-sm ${
                        hasEssentialMatch 
                          ? "bg-sky-500/10 text-sky-300 border-sky-500/40 glow-cerulean-sm" 
                          : "bg-slate-950/80 text-slate-400 border-slate-800"
                      }`}>
                        {recipe.matchPercentage}% COCOK
                      </span>
                    </div>

                    {/* Favorite Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavorite(recipe.id);
                      }}
                      id={`favorite-btn-${recipe.id}`}
                      className="absolute top-2.5 right-2.5 p-1.5 rounded-full bg-slate-950/80 hover:bg-slate-900 border border-slate-800 text-slate-300 hover:text-rose-500 transition cursor-pointer"
                      title="Sukai resep"
                    >
                      <Heart size={14} fill={isFav ? "#f43f5e" : "transparent"} className={isFav ? "text-rose-500 scale-110" : "text-slate-300"} />
                    </button>
                  </div>

                  {/* Body Text Info */}
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-[9px] font-mono font-bold bg-slate-900 text-slate-400 border border-slate-800 px-2 py-0.5 rounded">
                        {recipe.category}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono flex items-center gap-1">
                        <Clock size={10} /> {recipe.prepTime} Mins
                      </span>
                    </div>
                    <h3 className="text-sm font-display font-bold text-white group-hover:text-cyan-400 transition leading-tight">
                      {recipe.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                      {recipe.description}
                    </p>
                  </div>
                </div>

                {/* Bottom button match indicators */}
                <div className="p-4 pt-1 border-t border-slate-900 flex items-center justify-between gap-3 bg-slate-950/80">
                  <div className="text-[10px] text-slate-500 font-mono">
                    {recipe.ingredients.filter(ing => 
                      selectedIngredients.some(sel => sel.name.toLowerCase().includes(ing.name.toLowerCase()) || ing.name.toLowerCase().includes(sel.name.toLowerCase()))
                    ).length} dari {recipe.ingredients.length} bahan kulkas cocok
                  </div>
                  <button
                    onClick={() => handleOpenDetail(recipe.id)}
                    id={`open-detail-${recipe.id}`}
                    className="px-3.5 py-1.5 bg-slate-900 hover:bg-cyan-950/50 hover:text-cyan-400 text-slate-300 rounded-lg text-xs font-semibold border border-slate-800 hover:border-cyan-500/30 transition cursor-pointer flex items-center gap-1"
                  >
                    Buka Resep <Play size={10} className="fill-current" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center text-center p-12 bg-slate-950 rounded-xl border border-dashed border-slate-800/80">
          <AlertCircle size={32} className="text-slate-600 mb-2" />
          <p className="text-xs text-slate-400 font-semibold uppercase font-mono tracking-widest">TIDAK ADA RESEP COCOK</p>
          <p className="text-[11px] text-slate-500 mt-1 max-w-xs">
            {filterMatchOnly 
              ? "Matikan cek 'Hanya Yang Cocok Bahan' atau lari isi stock kulkas terlebih dahulu!" 
              : "Coba ganti kata pencarian bumbu/resep atau masukan bahan sisa di stock manager."}
          </p>
        </div>
      )}

      {/* Standard Full Recipe Detail Popup Modal Drawer */}
      <AnimatePresence>
        {activeRecipe && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-6"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="bg-slate-900 rounded-2xl border border-slate-800/80 glow-cerulean w-full max-w-2xl h-[90vh] sm:h-auto sm:max-h-[85vh] flex flex-col justify-between overflow-hidden shadow-2xl relative"
            >
              {/* Image banner details header */}
              <div className="h-44 w-full relative bg-slate-950 flex-shrink-0">
                <img
                  src={activeRecipe.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"}
                  alt={activeRecipe.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover opacity-50 border-b border-slate-800"
                />
                
                {/* Gradient background shade */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />

                {/* Close Button on Top right pointer */}
                <button
                  onClick={handleCloseDetail}
                  id="btn-close-recipe-modal"
                  className="absolute top-4 right-4 p-2 bg-slate-950/80 hover:bg-slate-950 border border-slate-800 text-slate-300 hover:text-white rounded-full transition cursor-pointer"
                >
                  <X size={16} />
                </button>

                {/* Heading detail */}
                <div className="absolute bottom-4 left-6 right-6">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[9px] font-mono font-extrabold bg-cyan-600 text-white px-2.5 py-0.5 rounded uppercase">
                      {activeRecipe.category}
                    </span>
                    <span className="text-xs text-slate-300 font-mono flex items-center gap-1 bg-slate-950/70 px-2 py-0.5 rounded border border-slate-800">
                      <Clock size={10} /> {activeRecipe.prepTime} Mins
                    </span>
                    <span className="text-xs text-slate-350 font-mono capitalize bg-slate-950/70 px-2 py-0.5 rounded border border-slate-800">
                      🎖️ {activeRecipe.difficulty}
                    </span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-display font-extrabold text-white leading-tight">
                    {activeRecipe.title}
                  </h3>
                </div>
              </div>

              {/* Scrollable details container */}
              <div className="p-6 overflow-y-auto space-y-5 flex-1 text-slate-300">
                
                {/* Description */}
                <p className="text-xs leading-relaxed text-slate-400 italic bg-slate-950/40 p-3 rounded-lg border border-slate-800/50">
                  {activeRecipe.description}
                </p>

                {/* Ingredients matching analysis division */}
                <div>
                  <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest mb-2.5 flex items-center justify-between">
                    <span>1. ANALISIS KECOKAN BAHAN ({activeRecipe.ingredients.length}):</span>
                    <span className="text-cyan-400">Cocok Terpenuhi</span>
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-slate-950 p-4 rounded-xl border border-slate-850">
                    {activeRecipe.ingredients.map((ing, i) => {
                      // Perform search logic for green highlighting
                      const isMatched = selectedIngredients.some((sel) =>
                        sel.name.toLowerCase().includes(ing.name.toLowerCase()) || ing.name.toLowerCase().includes(sel.name.toLowerCase())
                      );

                      return (
                        <div key={i} className="flex items-center gap-2.5 py-1 text-xs">
                          {isMatched ? (
                            <CheckCircle2 size={15} className="text-emerald-400 flex-shrink-0" />
                          ) : ing.isEssential ? (
                            <AlertCircle size={15} className="text-amber-500 flex-shrink-0" title="Bahan Utama Ketinggalan" />
                          ) : (
                            <div className="w-3.5 h-3.5 rounded-full border border-slate-700 flex-shrink-0" />
                          )}
                          <span className={`truncate ${isMatched ? "text-emerald-300 font-medium" : ing.isEssential ? "text-slate-400 font-sans" : "text-slate-500"}`}>
                            {ing.name} <span className="text-[10px] text-slate-500">({ing.quantity})</span>
                          </span>
                          {!isMatched && ing.isEssential && (
                            <span className="text-[8px] font-mono bg-amber-950 text-amber-400 px-1.5 py-0.2 rounded border border-amber-800">UTAMA</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Steps block */}
                <div>
                  <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest mb-2.5">
                    2. LANGKAH-LANGKAH MEMASAK:
                  </h4>
                  <ol className="space-y-3">
                    {activeRecipe.instructions.map((step, idx) => (
                      <li key={idx} className="flex items-start gap-3 bg-slate-950/20 p-3 rounded-lg border border-slate-800/30">
                        <span className="flex items-center justify-center w-5 h-5 bg-cyan-950 text-cyan-400 border border-cyan-500/30 rounded-full font-mono text-[10px] font-bold mt-0.5 flex-shrink-0">
                          {idx + 1}
                        </span>
                        <p className="text-xs leading-relaxed text-slate-300 font-sans">
                          {step}
                        </p>
                      </li>
                    ))}
                  </ol>
                </div>

                {/* Gemini Chef AI Tips component section */}
                <div className="border-t border-slate-800/80 pt-5 pr-1">
                  <div className="bg-gradient-to-r from-purple-950/20 via-indigo-950/25 to-cyan-950/30 border border-indigo-500/30 rounded-xl p-4 glow-cerulean-sm">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2 text-xs font-semibold text-white">
                        <Sparkles size={16} className="text-yellow-400 animate-spin" />
                        <span>Koki AI SisaRasa (Zero Waste Expert)</span>
                      </div>
                      
                      <button
                        onClick={() => fetchChefTip(activeRecipe)}
                        disabled={loadingTip}
                        id={`ask-ai-chef-${activeRecipe.id}`}
                        className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-[10px] font-bold tracking-wide transition disabled:opacity-40 flex items-center gap-1.5 cursor-pointer"
                      >
                        {loadingTip ? "MENGHITUNG..." : "TANYA KOKI AI ✨"}
                      </button>
                    </div>

                    <p className="text-xs text-slate-400 leading-relaxed font-sans mt-2">
                      {chefTip ? (
                        <span className="text-white bg-slate-950/40 p-2.5 rounded border border-slate-800/40 block mt-1">
                          {chefTip}
                        </span>
                      ) : loadingTip ? (
                        <span className="italic block mt-1 text-slate-500">Sedang memeriksa pantry Anda dan meramu bumbu kustom koki...</span>
                      ) : (
                        "Ada bahan sisa yang tidak pas di resep ini? Klik Tanya Koki AI untuk tahu cara memodifikasi bumbu atau beralih bahan dengan stok dapur Anda!"
                      )}
                    </p>
                  </div>
                </div>

              </div>

              {/* Cooked confirmation footer */}
              <div className="p-4 bg-slate-950 border-t border-slate-800/80 flex items-center justify-between gap-4 flex-shrink-0">
                <div className="text-[10px] text-slate-500 font-mono leading-tight">
                  Log memasak resep ini akan secara langsung mengkonsumsi bahan makanan dan menambah level stats lingkungan Anda.
                </div>
                
                <button
                  onClick={() => {
                    onCookRecipe(activeRecipe);
                    handleCloseDetail();
                  }}
                  id={`btn-mark-cooked-${activeRecipe.id}`}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-display font-black rounded-lg text-xs tracking-wide transition flex items-center gap-2 cursor-pointer shadow-lg shadow-emerald-700/10 active:scale-95"
                >
                  <HatIcon size={14} /> Sudah Saya Masak! 🍳
                </button>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
