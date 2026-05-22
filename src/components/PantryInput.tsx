import React, { useState, useMemo } from "react";
import { MASTER_INGREDIENTS } from "../data/ingredients";
import { Ingredient } from "../types";
import { Plus, X, Search, Refrigerator, Sparkles, AlertCircle, ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface PantryInputProps {
  selectedIngredients: Ingredient[];
  onAddIngredient: (ingredient: Ingredient) => void;
  onRemoveIngredient: (id: string) => void;
  onAddCustomIngredient: (name: string, category: "sayuran"| "daging"| "bumbu"| "karbo"| "lainnya") => void;
}

export default function PantryInput({
  selectedIngredients,
  onAddIngredient,
  onRemoveIngredient,
  onAddCustomIngredient
}: PantryInputProps) {
  const [search, setSearch] = useState("");
  const [customName, setCustomName] = useState("");
  const [customCategory, setCustomCategory] = useState<"sayuran"| "daging"| "bumbu"| "karbo"| "lainnya">("sayuran");
  const [activeTab, setActiveTab] = useState<"all" | "sayuran" | "daging" | "bumbu" | "karbo" | "lainnya">("all");

  // Filter master ingredients based on current search & selected tab
  const filteredSuggestions = useMemo(() => {
    return MASTER_INGREDIENTS.filter(item => {
      const matchSearch = item.name.toLowerCase().includes(search.toLowerCase());
      const matchTab = activeTab === "all" || item.category === activeTab;
      const notSelected = !selectedIngredients.some((sel) => sel.id === item.id || sel.name.toLowerCase() === item.name.toLowerCase());
      return matchSearch && matchTab && notSelected;
    }).slice(0, 10);
  }, [search, activeTab, selectedIngredients]);

  const handleAddCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim()) return;
    onAddCustomIngredient(customName.trim(), customCategory);
    setCustomName("");
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col shadow-xl">
      {/* Drawer Title */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-white font-bold font-display">Kulkas Saya</h3>
          <p className="text-[10px] text-slate-500 uppercase font-mono mt-0.5">Stock Manager</p>
        </div>
        <div className="w-8 h-8 bg-slate-800/80 border border-slate-750 rounded-full flex items-center justify-center text-sky-400">
          <Plus size={16} />
        </div>
      </div>

      {/* Autocomplete Input & Search Container */}
      <div className="relative mb-5">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
          <Search size={18} />
        </div>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari sisa bahan: telur, tahu, wortel..."
          id="pantry-search"
          className="w-full pl-10 pr-4 py-3 bg-slate-950 text-white rounded-xl border border-slate-800 focus:border-cyan-500 focus:outline-none transition font-sans text-sm"
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-white"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Quick Add Suggestions Container with Tag Tabs */}
      <div className="mb-6">
        <div className="flex gap-1 overflow-x-auto pb-2 scrollbar-none text-xs border-b border-slate-800/80 mb-3">
          {(["all", "sayuran", "daging", "bumbu", "karbo", "lainnya"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap capitalize transition ${
                activeTab === tab
                  ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/40"
              }`}
            >
              {tab === "all" ? "Semua Bahan" : tab === "daging" ? "🥩 Protein" : tab === "sayuran" ? "🥬 Sayur" : tab === "bumbu" ? "🧅 Bumbu" : tab === "karbo" ? "🍚 Karbo" : "🥛 Lainnya"}
            </button>
          ))}
        </div>

        {/* Suggestion Chips */}
        {filteredSuggestions.length > 0 ? (
          <div className="flex flex-wrap gap-2 max-h-36 overflow-y-auto pr-1">
            <AnimatePresence mode="popLayout">
              {filteredSuggestions.map((item) => (
                <motion.button
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onAddIngredient(item)}
                  id={`chip-add-${item.id}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-950 hover:bg-cyan-950/50 text-slate-300 hover:text-cyan-400 rounded-lg border border-slate-800 hover:border-cyan-500/30 text-xs transition cursor-pointer"
                >
                  <Plus size={12} className="text-cyan-400" />
                  {item.name}
                </motion.button>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <p className="text-xs text-slate-500 italic py-1">Tidak ada rekomendasi tambahan di tab ini. Ketik nama bahan baru di bawah!</p>
        )}
      </div>

      {/* Custom Ingredient Manual Entry Form */}
      <form onSubmit={handleAddCustom} className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 mb-6">
        <h3 className="text-xs font-mono font-semibold text-slate-400 tracking-wide mb-3 flex items-center gap-1.5">
          <Sparkles size={12} className="text-yellow-400" />
          MILIH JALUR MANUAL? INPUT BAHAN KUSTOM:
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
          <input
            type="text"
            value={customName}
            onChange={(e) => setCustomName(e.target.value)}
            placeholder="Contoh: Sapi Cincang, Soun, dll."
            id="custom-ingredient-name"
            className="px-3 py-2 bg-slate-900 border border-slate-800 text-white rounded-lg focus:border-cyan-500 focus:outline-none text-xs font-sans"
          />
          <select
            value={customCategory}
            onChange={(e) => setCustomCategory(e.target.value as any)}
            id="custom-ingredient-category"
            className="px-2 py-2 bg-slate-900 border border-slate-800 text-slate-300 rounded-lg focus:border-cyan-500 focus:outline-none text-xs capitalize"
          >
            <option value="sayuran">🥬 Sayur</option>
            <option value="daging">🥩 Protein</option>
            <option value="bumbu">🧅 Bumbu / Saus</option>
            <option value="karbo">🍚 Karbohidrat</option>
            <option value="lainnya">🥛 Lainnya</option>
          </select>
        </div>
        <button
          type="submit"
          id="btn-add-custom-ingredient"
          className="w-full flex items-center justify-center gap-2 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold rounded-lg text-xs transition cursor-pointer"
        >
          <Plus size={14} /> Tambahkan ke Kulkas
        </button>
      </form>

      {/* Selected Pantry Fridge Drawer Visualization */}
      <div className="border-t border-slate-800/80 pt-5">
        <h3 className="text-sm font-display font-medium text-slate-200 mb-3 flex items-center justify-between">
          <span>Isi Kulkas Saat Ini:</span>
          <span className="text-xs px-2.5 py-0.5 bg-slate-950 border border-slate-800 rounded-full text-cyan-400 font-mono">
            {selectedIngredients.length} Bahan
          </span>
        </h3>

        {selectedIngredients.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1">
            <AnimatePresence>
              {selectedIngredients.map((item) => {
                let badgeStyle = "bg-emerald-950/40 text-emerald-300 border-emerald-800/50";
                if (item.category === "daging") badgeStyle = "bg-rose-950/40 text-rose-300 border-rose-800/50";
                if (item.category === "bumbu") badgeStyle = "bg-amber-950/40 text-amber-300 border-amber-800/50";
                if (item.category === "karbo") badgeStyle = "bg-sky-950/40 text-sky-300 border-sky-800/50";
                if (item.category === "lainnya") badgeStyle = "bg-purple-950/40 text-purple-300 border-purple-800/50";

                return (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="flex items-center justify-between p-2.5 bg-slate-950 rounded-lg border border-slate-800 hover:border-slate-700 transition"
                  >
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs text-white font-medium truncate">{item.name}</span>
                      <span className={`inline-block self-start font-mono text-[10px] uppercase px-1.5 py-0.5 rounded border mt-1 ${badgeStyle}`}>
                        {item.category === "sayuran" ? "🥬 Sayur" : item.category === "daging" ? "🥩 Protein" : item.category === "bumbu" ? "🧅 Bumbu" : item.category === "karbo" ? "🍚 Karbo" : "🥛 Lainnya"}
                      </span>
                    </div>
                    <button
                      onClick={() => onRemoveIngredient(item.id)}
                      id={`btn-remove-ing-${item.id}`}
                      className="p-1 text-slate-500 hover:text-rose-400 hover:bg-slate-900 rounded transition"
                      title="Keluarkan bahan"
                    >
                      <X size={14} />
                    </button>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center p-8 bg-slate-950 rounded-xl border border-dashed border-slate-800/80">
            <ShoppingBag size={28} className="text-slate-600 mb-2" />
            <p className="text-xs text-slate-400 font-medium">Kulkas Anda masih kosong kosong melompong!</p>
            <p className="text-[11px] text-slate-500 mt-1">Pilih chip bahan populer di atas atau tambahkan bumbu sisa Anda sendiri.</p>
          </div>
        )}
      </div>

      <div className="mt-5 bg-sky-500/10 p-4 rounded-2xl border border-sky-500/20">
        <p className="text-[10px] text-sky-400 font-bold uppercase tracking-widest mb-1 underline decoration-sky-400/50 flex items-center gap-1">
          <Sparkles size={11} className="text-sky-400 animate-pulse" /> Chef AI Sugesti:
        </p>
        <p className="text-xs text-slate-300 leading-snug">
          {selectedIngredients.length > 2 
            ? `💡 "Ada sisa bahan koki [${selectedIngredients.slice(0, 2).map(i => i.name).join(" & ")}]? Ini modal terbaik membuat nasi goreng atau oseng sisa rasa!"`
            : `💡 "Silakan masukkan setidaknya 3 bahan sisa di atas agar Slot Putar & Koki AI bekerja optimal!"`}
        </p>
      </div>
    </div>
  );
}
