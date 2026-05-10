"use client";

import { useMemo, useState } from "react";
import { Images, Film, Users, Sparkles, Grid3x3 } from "lucide-react";

const categories = ["Semua", "Class Moment", "Random", "Video"];

const galleryItems = [
  { id: 1, title: "Morning Assembly", type: "Class Moment", span: "row-span-2", color: "from-blue-800 to-slate-800" },
  { id: 2, title: "Bestie Selfie", type: "Random", span: "", color: "from-pink-800 to-slate-800" },
  { id: 3, title: "Farewell Stage", type: "Video", span: "row-span-2", color: "from-violet-800 to-slate-800" },
  { id: 4, title: "Class Laugh", type: "Class Moment", span: "", color: "from-emerald-800 to-slate-800" },
  { id: 5, title: "Break Time", type: "Random", span: "", color: "from-amber-800 to-slate-800" },
  { id: 6, title: "After School", type: "Class Moment", span: "", color: "from-sky-800 to-slate-800" },
  { id: 7, title: "BTS Event", type: "Video", span: "row-span-2", color: "from-red-800 to-slate-800" },
  { id: 8, title: "School Yard", type: "Random", span: "", color: "from-teal-800 to-slate-800" },
  { id: 9, title: "Closing Day", type: "Class Moment", span: "", color: "from-indigo-800 to-slate-800" },
  { id: 10, title: "Vlog Team", type: "Video", span: "", color: "from-rose-800 to-slate-800" },
  { id: 11, title: "Lunch Break", type: "Random", span: "row-span-2", color: "from-cyan-800 to-slate-800" },
  { id: 12, title: "Class Photo", type: "Class Moment", span: "", color: "from-lime-800 to-slate-800" },
];

const categoryIcons = {
  "Semua": Grid3x3,
  "Class Moment": Users,
  "Random": Sparkles,
  "Video": Film,
};

export default function GaleriPage() {
  const [activeCategory, setActiveCategory] = useState("Semua");

  const visibleItems = useMemo(
    () => galleryItems.filter((item) => activeCategory === "Semua" || item.type === activeCategory),
    [activeCategory]
  );

  return (
    <div className="relative min-h-screen page-shell">
      <div className="mx-auto max-w-7xl px-4 pb-32 pt-24 sm:px-6 md:pt-28 lg:px-8">

        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-400/5 px-4 py-1.5 text-xs font-medium text-violet-300">
            <Images className="h-3.5 w-3.5" />
            Koleksi Momen 9B
          </div>
          <h1 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-4xl">
            Galeri <span className="gradient-text">Foto</span>
          </h1>
          <p className="mt-2 max-w-xl text-sm text-slate-400">
            Momen portrait & landscape kelas 9B yang tersimpan abadi. Upload foto kenangan terbaikmu di sini.
          </p>
        </div>

        {/* Category Filter */}
        <div className="sticky top-20 z-20 mb-6">
          <div className="glass flex flex-wrap gap-2 rounded-2xl p-2 shadow-[0_8px_32px_rgba(0,0,0,0.3)] sm:w-fit">
            {categories.map((cat) => {
              const Icon = categoryIcons[cat];
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  id={`filter-${cat.toLowerCase().replace(" ", "-")}`}
                  onClick={() => setActiveCategory(cat)}
                  className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition-all duration-300 ${
                    isActive
                      ? "bg-violet-500/20 text-violet-300 ring-1 ring-violet-400/30 shadow-[0_0_12px_rgba(167,139,250,0.2)]"
                      : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Masonry Grid */}
        <div className="columns-2 gap-3 sm:columns-3 lg:columns-4">
          {visibleItems.map((item, i) => (
            <div
              key={item.id}
              className="mb-3 break-inside-avoid group cursor-pointer"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <div className="bento-card overflow-hidden p-0">
                {/* Placeholder image block */}
                <div
                  className={`relative bg-gradient-to-br ${item.color} ${
                    i % 3 === 0 ? "h-64" : i % 3 === 1 ? "h-44" : "h-56"
                  } transition-all duration-500 group-hover:scale-[1.02]`}
                >
                  {/* Noise overlay */}
                  <div className="absolute inset-0 opacity-20"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E")`,
                    }}
                  />
                  {/* Type badge */}
                  <div className="absolute left-2 top-2">
                    <span className="rounded-full border border-white/15 bg-black/40 px-2 py-0.5 text-[10px] text-white/80 backdrop-blur-sm">
                      {item.type}
                    </span>
                  </div>
                  {/* Bottom info */}
                  <div className="absolute bottom-0 left-0 right-0 translate-y-2 bg-gradient-to-t from-black/70 to-transparent p-3 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                    <p className="text-sm font-semibold text-white">{item.title}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Upload CTA */}
        <div className="mt-8 bento-card p-6 text-center">
          <div className="absolute inset-0 bg-gradient-to-br from-violet-500/6 via-transparent to-emerald-500/6 pointer-events-none" />
          <div className="relative z-10">
            <Images className="mx-auto mb-3 h-8 w-8 text-violet-400" strokeWidth={1.5} />
            <p className="text-sm font-semibold text-slate-200">Punya foto kenangan?</p>
            <p className="mt-1 text-xs text-slate-500">Upload foto terbaikmu untuk abadikan momen kelas 9B.</p>
            <button className="mt-4 btn-primary text-sm">
              <Images className="h-4 w-4" />
              Upload Foto
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
