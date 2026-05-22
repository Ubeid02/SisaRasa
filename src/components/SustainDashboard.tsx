import { UserStats } from "../types";
import { TreePine, Heart, DollarSign, Award, Percent, Leaf } from "lucide-react";
import { motion } from "motion/react";

interface SustainDashboardProps {
  stats: UserStats;
}

export default function SustainDashboard({ stats }: SustainDashboardProps) {
  // Simple Indonesian format for currency
  const formatIDR = (num: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0
    }).format(num);
  };

  // Eco equivalence math for gamified gratification
  const carbonSavedKg = (stats.savedWeightKg * 2.5).toFixed(1); // 2.5kg CO2 average per kg food waste
  const treesEquivalence = (parseFloat(carbonSavedKg) / 0.1).toFixed(0); // Arbitrary trees day equivalence

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 relative overflow-hidden transition-all shadow-xl">
      {/* Decorative top-left background light */}
      <div className="absolute -top-10 -left-10 w-32 h-32 bg-sky-500/10 blur-3xl pointer-events-none"></div>
      
      {/* Dashboard title header */}
      <div className="flex items-center justify-between mb-6 border-b border-slate-800 pb-4">
        <div>
          <h3 className="text-sky-400 text-xs font-mono font-bold uppercase tracking-widest">Impact Dashboard</h3>
          <p className="text-[10px] text-slate-500 tracking-tight uppercase">SisaRasa Keberlanjutan</p>
        </div>
        <div className="flex items-center gap-2 bg-slate-850 px-3 py-1 rounded-full border border-slate-700/80">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="text-[9px] font-bold text-slate-400 tracking-widest uppercase">REAL-TIME ECO</span>
        </div>
      </div>

      <div className="space-y-6 mb-6">
        {/* Money saved row */}
        <div className="flex justify-between items-center bg-slate-950/40 p-3 rounded-2xl border border-slate-850/50">
          <div className="flex flex-col">
            <span className="text-3xl font-display font-extrabold text-sky-400 tracking-tight">
              {formatIDR(stats.savedMoneyIdr)}
            </span>
            <span className="text-[10px] text-slate-500 font-medium uppercase font-mono mt-0.5">Uang Diselamatkan</span>
          </div>
          <div className="p-2.5 bg-sky-950/80 text-sky-400 rounded-xl border border-sky-500/20 shadow-sm shadow-sky-500/10">
            <DollarSign size={16} />
          </div>
        </div>

        {/* Saved Waste Weight row */}
        <div className="flex justify-between items-center bg-slate-950/40 p-3 rounded-2xl border border-slate-850/50">
          <div className="flex flex-col">
            <span className="text-3xl font-display font-extrabold text-emerald-400 tracking-tight">
              {stats.savedWeightKg.toFixed(2)} <span className="text-lg text-emerald-500 font-medium">kg</span>
            </span>
            <span className="text-[10px] text-slate-500 font-medium uppercase font-mono mt-0.5">Limbah Dikurangi</span>
          </div>
          <div className="p-2.5 bg-emerald-950/80 text-emerald-400 rounded-xl border border-emerald-500/20 shadow-sm shadow-emerald-500/10">
            <TreePine size={16} />
          </div>
        </div>

        {/* Cooked Meals row */}
        <div className="flex justify-between items-center bg-slate-950/40 p-3 rounded-2xl border border-slate-850/50">
          <div className="flex flex-col">
            <span className="text-3xl font-display font-extrabold text-orange-400 tracking-tight">
              {stats.mealsCooked} <span className="text-lg text-orange-500 font-medium">Resep</span>
            </span>
            <span className="text-[10px] text-slate-500 font-medium uppercase font-mono mt-0.5">Resep Sajian Bumi</span>
          </div>
          <div className="p-2.5 bg-orange-950/60 text-orange-400 rounded-xl border border-orange-500/20 shadow-sm shadow-orange-500/10">
            <Heart size={16} />
          </div>
        </div>
      </div>

      {/* Narrative Progress visualization block */}
      <div className="border-t border-slate-800/80 pt-4 mt-6">
        <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800 flex items-center gap-4">
          {/* Circular dial meter */}
          <div className="relative w-14 h-14 flex-shrink-0 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="28"
                cy="28"
                r="22"
                className="stroke-slate-800"
                strokeWidth="4.5"
                fill="transparent"
              />
              <circle
                cx="28"
                cy="28"
                r="22"
                className="stroke-sky-400"
                strokeWidth="4.5"
                fill="transparent"
                strokeDasharray={2 * Math.PI * 22}
                strokeDashoffset={2 * Math.PI * 22 * (1 - Math.min(stats.mealsCooked * 0.1, 1))}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute text-[10px] font-display font-bold text-white">
              {Math.min(stats.mealsCooked * 10, 100)}%
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <h4 className="text-[11px] font-semibold text-white tracking-tight uppercase truncate">
              {stats.mealsCooked === 0 
                ? "Koki Mula (Zero-Waste Novice)" 
                : stats.mealsCooked < 5 
                ? "Greenfield Savior" 
                : stats.mealsCooked < 15 
                ? "Ksatria SisaRasa" 
                : "Legenda Koki Bumi Sehat"}
            </h4>
            <p className="text-[10px] text-slate-400 mt-1 leading-normal line-clamp-2">
              {stats.mealsCooked === 0 
                ? "Klaim resep Anda hari ini untuk meningkatkan level darmamu!" 
                : `Menyelamatkan setara penyerapan ${treesEquivalence} pohon bulan ini! 🌳`}
            </p>
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-slate-800/50 mt-4">
        <p className="text-[10px] leading-relaxed text-slate-500 italic">
          📢 Estimasi penurunan jejak karbon Anda telah berkorelasi {carbonSavedKg} kg CO₂e untuk kelestarian pangan.
        </p>
      </div>
    </div>
  );
}
