import { useState, useEffect, useRef } from "react";
import { Recipe } from "../types";
import { playTickSound, playWinSound, playSpinUpSound } from "../utils/audio";
import { Sparkles, Dice5, HelpCircle, Flame, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface RouletteEngineProps {
  recipes: Recipe[];
  onRecipeSelected: (recipe: Recipe, isCustomAICreated: boolean) => void;
  selectedIngredients: string[];
  onGenerateCustomAI: () => Promise<Recipe | null>;
}

export default function RouletteEngine({
  recipes,
  onRecipeSelected,
  selectedIngredients,
  onGenerateCustomAI
}: RouletteEngineProps) {
  const [spinning, setSpinning] = useState(false);
  const [spinMode, setSpinMode] = useState<"preset" | "ai">("preset");
  const [displayTitle, setDisplayTitle] = useState("SisaRasa Roulette");
  const [loadingAI, setLoadingAI] = useState(false);

  // States for mechanical tick scrolling simulation
  const [visibleRecipes, setVisibleRecipes] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);

  // Seed the roller values with diverse available names
  useEffect(() => {
    if (recipes.length > 0) {
      setVisibleRecipes(recipes.map(r => r.title));
    } else {
      setVisibleRecipes([
        "Nasi Goreng Penyelamat",
        "Omelet Serba Sisa",
        "Tumis Tahu Keblinger",
        "Sop Kulkas Segar",
        "Mie Nyemek Anak Kos"
      ]);
    }
  }, [recipes]);

  // Compute a previous and next item for visual slot effect
  const prevTitle = currentIndex > 0 ? visibleRecipes[currentIndex - 1] : visibleRecipes[visibleRecipes.length - 1];
  const nextTitle = currentIndex < visibleRecipes.length - 1 ? visibleRecipes[currentIndex + 1] : visibleRecipes[0];

  const handleSpinPreset = () => {
    if (recipes.length === 0) return;
    if (spinning) return;

    setSpinning(true);
    playSpinUpSound();

    const winner = recipes[Math.floor(Math.random() * recipes.length)];
    const duration = 3500; // 3.5 seconds
    const startTime = Date.now();
    
    // Decelerating scroll simulation algorithm
    const tick = () => {
      const elapsed = Date.now() - startTime;
      const progress = elapsed / duration;

      if (progress < 1) {
        // Play mechanical click ticks that slow down as time passes
        playTickSound();
        const randomIndex = Math.floor(Math.random() * recipes.length);
        setCurrentIndex(randomIndex);
        setDisplayTitle(recipes[randomIndex].title);

        // Calculate next tick timeout using exponent to mimic physical deceleration
        const speed = Math.max(40, Math.pow(progress, 2.5) * 450);
        setTimeout(tick, speed);
      } else {
        // Complete the spin and announce the winner!
        const wIndex = recipes.indexOf(winner);
        setCurrentIndex(wIndex >= 0 ? wIndex : 0);
        setDisplayTitle(winner.title);
        playWinSound();
        setSpinning(false);
        onRecipeSelected(winner, false);
      }
    };

    setTimeout(tick, 40);
  };

  const handleSpinAI = async () => {
    if (selectedIngredients.length === 0) return;
    if (spinning || loadingAI) return;

    setSpinning(true);
    setLoadingAI(true);
    playSpinUpSound();

    // Start a frantic slot-style animation in the background while Gemini thinks
    let aiInterval = setInterval(() => {
      playTickSound();
      const mockTitles = [
        "Kreasi Eksperimental AI...",
        "Mengaduk Bumbu Kulkas...",
        "Mencari Inspirasi Koki AI...",
        "Resep Kuno Rahasia...",
        "Menimbang Karbo & Protein...",
        "Penyelamatan Sisa Bahan..."
      ];
      const randTxt = mockTitles[Math.floor(Math.random() * mockTitles.length)];
      setDisplayTitle(randTxt);
      setCurrentIndex(Math.floor(Math.random() * visibleRecipes.length));
    }, 150);

    try {
      const customRecipeResult = await onGenerateCustomAI();
      clearInterval(aiInterval);

      if (customRecipeResult) {
        // Landing transition animation
        playWinSound();
        setDisplayTitle(customRecipeResult.title);
        setSpinning(false);
        setLoadingAI(false);
        onRecipeSelected(customRecipeResult, true);
      } else {
        clearInterval(aiInterval);
        setSpinning(false);
        setLoadingAI(false);
        setDisplayTitle("Gagal Menghubungi Koki AI");
      }
    } catch (e) {
      clearInterval(aiInterval);
      setSpinning(false);
      setLoadingAI(false);
      setDisplayTitle("Gagal Mengaduk Kulkas");
    }
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 to-slate-950 border-2 border-sky-500/30 rounded-[40px] p-8 flex flex-col items-center justify-center relative overflow-hidden shadow-2xl">
      {/* Absolute dots background */}
      <div className="absolute inset-0 bg-dots opacity-15 pointer-events-none"></div>

      <div className="relative z-10 w-full flex flex-col items-center">
        <div className="text-center mb-6">
          <span className="text-sky-400 font-mono text-xs tracking-[0.25em] uppercase mb-1.5 block">
            Recipe Selection
          </span>
          <p className="text-white text-3xl font-bold font-display tracking-tight">Siap Memasak?</p>
          <p className="text-xs text-slate-400 mt-2 max-w-sm mx-auto">
            Gunakan preset kulkas mahasiswa atau biarkan koki AI meramu resep kustom cerdas.
          </p>
        </div>

        {/* Mode Selectors */}
        <div className="grid grid-cols-2 gap-2 bg-slate-950 p-1 rounded-2xl border border-slate-800 w-full max-w-md mb-6 relative z-10">
          <button
            onClick={() => !spinning && setSpinMode("preset")}
            disabled={spinning}
            id="mode-preset-btn"
            className={`py-2 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
              spinMode === "preset"
                ? "bg-slate-800 text-sky-400 border border-slate-705 shadow-md"
                : "text-slate-400 hover:text-white"
            } disabled:opacity-50`}
          >
            <Dice5 size={14} /> Preset ({recipes.length})
          </button>
          <button
            onClick={() => !spinning && setSpinMode("ai")}
            disabled={spinning || selectedIngredients.length === 0}
            id="mode-ai-btn"
            className={`py-2 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
              spinMode === "ai"
                ? "bg-slate-800 text-purple-400 border border-slate-705 shadow-md"
                : "text-slate-400 hover:text-white"
            } disabled:opacity-40`}
            title={selectedIngredients.length === 0 ? "Masukkan setidaknya 1 sisa bahan makanan di laci kulkas Anda" : ""}
          >
            <Sparkles size={14} /> Koki AI ✨
          </button>
        </div>

        {/* Slot Machine UI Frame */}
        <div className="w-full max-w-md h-36 bg-black rounded-3xl border-4 border-slate-800 flex flex-col items-center justify-center relative shadow-[0_0_50px_rgba(14,165,233,0.15)] overflow-hidden">
          {/* Inner radial shade overlay */}
          <div className="absolute inset-0 pointer-events-none z-20 shadow-[inset_0_0_24px_rgba(0,0,0,0.9)]"></div>
          {/* Horizontal lock-in guideline */}
          <div className="absolute h-0.5 w-full bg-sky-500/30 top-1/2 -translate-y-1/2 z-10"></div>
          
          {/* Slots roll stack */}
          <div className="flex flex-col items-center justify-center gap-1 w-full px-4 overflow-hidden select-none">
            {/* Previous slot */}
            <div className="text-sm font-black text-sky-500 opacity-20 blur-[1px] select-none truncate max-w-[80%]">
              {prevTitle || "Gado Gado Modern"}
            </div>

            {/* Selected slot */}
            <div className="text-xl sm:text-2xl font-black text-white tracking-tight uppercase truncate max-w-[95%] z-10 text-center flex flex-col items-center justify-center min-h-[40px]">
              <AnimatePresence mode="wait">
                <motion.span
                  key={displayTitle}
                  initial={{ y: spinning ? 12 : 0, opacity: spinning ? 0.3 : 1 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: spinning ? -12 : 0, opacity: spinning ? 0.3 : 0 }}
                  transition={{ duration: 0.12 }}
                >
                  {displayTitle}
                </motion.span>
              </AnimatePresence>
            </div>

            {/* Next slot */}
            <div className="text-sm font-black text-sky-500 opacity-20 blur-[1px] select-none truncate max-w-[80%]">
              {nextTitle || "Sop Sayur Hangat"}
            </div>
          </div>
        </div>

        {/* Dynamic CTA Spin buttons styled precisely like Design HTML */}
        {spinMode === "preset" ? (
          <button
            onClick={handleSpinPreset}
            disabled={spinning || recipes.length === 0}
            id="spin-preset-trigger"
            className="mt-8 px-12 py-3.5 bg-sky-500 hover:bg-sky-400 text-white rounded-full font-black text-base hover:scale-[1.02] transition-all flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(14,165,233,0.4)] border-b-4 border-sky-700 active:border-b-0 active:translate-y-1 cursor-pointer disabled:opacity-50"
          >
            <span>PUTAR SISARASA</span>
            <svg viewBox="0 0 24 24" className={`w-5 h-5 fill-white ${spinning ? "animate-spin" : ""}`}>
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-5.5-2.5l7.5-5.5-7.5-5.5v11z"/>
            </svg>
          </button>
        ) : (
          <button
            onClick={handleSpinAI}
            disabled={spinning || selectedIngredients.length === 0 || loadingAI}
            id="spin-ai-trigger"
            className="mt-8 px-12 py-3.5 bg-gradient-to-r from-purple-500 via-indigo-500 to-sky-500 hover:brightness-110 text-white rounded-full font-black text-base hover:scale-[1.02] transition-all flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(99,102,241,0.4)] border-b-4 border-indigo-700 active:border-b-0 active:translate-y-1 cursor-pointer disabled:opacity-40"
          >
            <span>{loadingAI ? "MERAMU KREASI AI..." : "CAMPUR BAHAN AI"}</span>
            <Sparkles size={16} className={loadingAI ? "animate-pulse" : ""} />
          </button>
        )}

        <div className="mt-4 text-center">
          <p className="text-[10px] text-slate-500 font-mono">
            {selectedIngredients.length === 0
              ? "Kulkas kosong. Masukkan setidaknya 1 sisa bahan."
              : `Menargetkan ${selectedIngredients.length} bahan kulkas dalam pencocokan.`}
          </p>
        </div>
      </div>
    </div>
  );
}
