"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Compass, 
  Search, 
  Zap, 
  X, 
  Filter, 
  GraduationCap, 
  Briefcase, 
  HandHeart, 
  Globe, 
  ArrowUpRight, 
  Calendar,
  Building2,
  Clock
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import { useLanguage } from "../context/LanguageContext";

// 1. Define specific types for indexing
type SupportedLang = "mn" | "en";

interface TranslationItem {
  mn: string;
  en: string;
}

// --- ТЕКСТҮҮД (Explicitly typed) ---
const TRANSLATIONS: Record<string, any> = {
  badge: { mn: "Дэлхийн боломжууд", en: "Global Opportunities" },
  titleMain: { mn: "Ирээдүйн", en: "Unlock Your" },
  titleHighlight: { mn: "Гарцаа", en: "Potential" },
  titleEnd: { mn: "нээ.", en: "Today." },
  searchPlaceholder: { mn: "Тэтгэлэг, дадлага хайх...", en: "Search scholarships, internships..." },
  categories: {
    all: { mn: "Бүгд", en: "All" },
    scholarship: { mn: "Тэтгэлэг", en: "Scholarships" },
    internship: { mn: "Дадлага", en: "Internships" },
    volunteer: { mn: "Сайн дурын ажил", en: "Volunteering" }
  },
  deadline: { mn: "Дуусах хугацаа:", en: "Deadline:" },
  applyNow: { mn: "Бүртгүүлэх", en: "Apply Now" },
  provider: { mn: "Зарлагч:", en: "Provider:" },
  noResults: { mn: "Одоогоор ийм боломж олдсонгүй.", en: "No opportunities found matching your criteria." },
};

// --- MOCK OPPORTUNITIES DATA ---
const OPPORTUNITIES_DATA = [
  {
    id: 1,
    category: "scholarship",
    title: { 
      en: "UNICEF Global Youth Fellowship 2026", 
      mn: "НҮБ-ын Хүүхдийн Сангийн Залуучуудын Тэтгэлэг 2026" 
    },
    provider: "UNICEF",
    deadline: "2026-03-15",
    description: {
      en: "A fully funded fellowship for social innovators targeting child welfare.",
      mn: "Хүүхдийн сайн сайхны төлөөх нийгмийн шинийг санаачлагчдад зориулсан бүрэн тэтгэлэгт хөтөлбөр."
    },
    tags: ["Remote", "Full-funded"],
    color: "#00aeef"
  },
  {
    id: 2,
    category: "internship",
    title: { 
      en: "UNDP Sustainable Development Internship", 
      mn: "НҮБ-ын Хөгжлийн Хөтөлбөрийн Тогтвортой Хөгжлийн Дадлага" 
    },
    provider: "UNDP",
    deadline: "2026-02-28",
    description: {
      en: "Gain hands-on experience in implementing sustainable development goals in Mongolia.",
      mn: "Монгол улсад тогтвортой хөгжлийн зорилтуудыг хэрэгжүүлэхэд гар бие оролцож туршлага хуримтлуулах."
    },
    tags: ["Ulaanbaatar", "Paid"],
    color: "#4c9f38"
  },
  {
    id: 3,
    category: "volunteer",
    title: { 
      en: "Climate Action Youth Leader", 
      mn: "Уур амьсгалын өөрчлөлтийн эсрэг Залуу Лидер" 
    },
    provider: "Unicef Mongolia",
    deadline: "2026-04-10",
    description: {
      en: "Join our nationwide campaign to raise awareness about air pollution and health.",
      mn: "Агаарын бохирдол болон эрүүл мэндийн талаарх мэдлэгийг дээшлүүлэх үндэсний хэмжээний аянд нэгдэх."
    },
    tags: ["Flexible", "Certificate"],
    color: "#fbbf24"
  },
  {
    id: 4,
    category: "scholarship",
    title: { 
      en: "MEXT Japanese Government Scholarship", 
      mn: "Японы засгийн газрын MEXT тэтгэлэг" 
    },
    provider: "Embassy of Japan",
    deadline: "2026-05-20",
    description: {
      en: "Full tuition coverage for undergraduate and graduate studies in Japanese universities.",
      mn: "Япон улсын их дээд сургуульд бакалавр болон магистр, докторт суралцах бүрэн тэтгэлэг."
    },
    tags: ["Japan", "Full-funded"],
    color: "#c5192d"
  }
];

// --- SUB-COMPONENT: OPPORTUNITY CARD ---
// Added proper typing for props
interface OppCardProps {
  opp: typeof OPPORTUNITIES_DATA[0];
  lang: SupportedLang;
  isDark: boolean;
}

const OppCard = ({ opp, lang, isDark }: OppCardProps) => {
  const getIcon = (cat: string) => {
    switch (cat) {
      case "scholarship": return <GraduationCap size={28} />;
      case "internship": return <Briefcase size={28} />;
      case "volunteer": return <HandHeart size={28} />;
      default: return <Compass size={28} />;
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={`relative group rounded-[2.5rem] border p-8 transition-all duration-500 overflow-hidden
        ${isDark 
          ? "bg-[#001d30]/60 border-white/5 shadow-2xl hover:border-[#00aeef]/40" 
          : "bg-white border-slate-200 shadow-xl shadow-slate-200/40 hover:border-[#00aeef]/40"}`}
    >
      <div className={`absolute top-0 right-0 w-32 h-32 blur-[100px] opacity-10 pointer-events-none`} 
           style={{ backgroundColor: opp.color }} />

      <div className="relative z-10">
        <div className="flex justify-between items-start mb-6">
          <div className={`p-4 rounded-3xl transition-colors ${isDark ? "bg-white/5" : "bg-sky-50"}`}
               style={{ color: opp.color }}>
            {getIcon(opp.category)}
          </div>
          <div className="flex flex-col items-end">
             <span className={`text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full border
                ${isDark ? "bg-white/5 border-white/10 text-white/40" : "bg-slate-50 border-slate-200 text-slate-500"}`}>
                {opp.category}
             </span>
          </div>
        </div>

        <h3 className={`text-xl font-black mb-3 tracking-tight leading-tight min-h-[3rem] transition-colors
          ${isDark ? "text-white group-hover:text-[#00aeef]" : "text-[#001829] group-hover:text-[#00aeef]"}`}>
          {opp.title[lang]}
        </h3>

        <div className="space-y-4 mb-8">
           <div className="flex items-center gap-2">
              <Building2 size={14} className="text-[#00aeef]" />
              <span className="text-xs font-bold opacity-60">{TRANSLATIONS.provider[lang]}</span>
              <span className={`text-xs font-black ${isDark ? "text-white/90" : "text-slate-800"}`}>{opp.provider}</span>
           </div>
           <div className="flex items-center gap-2">
              <Clock size={14} className="text-[#fbbf24]" />
              <span className="text-xs font-bold opacity-60">{TRANSLATIONS.deadline[lang]}</span>
              <span className={`text-xs font-black text-rose-500`}>{opp.deadline}</span>
           </div>
        </div>

        <p className={`text-sm font-medium mb-8 leading-relaxed line-clamp-3 opacity-60 ${isDark ? "text-white" : "text-slate-600"}`}>
          {opp.description[lang]}
        </p>

        <div className="flex flex-wrap gap-2 mb-8">
          {opp.tags.map((tag: string, i: number) => (
            <span key={i} className={`text-[10px] font-bold px-3 py-1 rounded-full border transition-colors
              ${isDark ? "bg-white/5 border-white/5 text-white/40" : "bg-slate-50 border-slate-100 text-slate-500"}`}>
              #{tag}
            </span>
          ))}
        </div>

        <Link href={`/opportunities/${opp.id}`} 
          className={`w-full py-4 rounded-2xl border font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-2 transition-all
            ${isDark 
              ? "bg-[#00aeef] border-[#00aeef] text-white hover:bg-sky-600" 
              : "bg-[#001829] border-[#001829] text-white hover:bg-black"}`}>
          {TRANSLATIONS.applyNow[lang]}
          <ArrowUpRight size={14} />
        </Link>
      </div>
    </motion.div>
  );
};

// --- MAIN PAGE ---
export default function OpportunitiesPage() {
  const { language } = useLanguage();
  // Cast language to SupportedLang to fix indexing errors
  const lang = language as SupportedLang;
  
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const isDark = theme === "dark" || !theme;

  // Filter Logic
  const filteredOpps = OPPORTUNITIES_DATA.filter(opp => {
    const matchesSearch = opp.title[lang].toLowerCase().includes(search.toLowerCase()) || 
                          opp.provider.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === "all" || opp.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className={`min-h-screen transition-colors duration-700 pt-32 pb-20 px-6 font-sans
      ${isDark ? "bg-[#001829] text-white" : "bg-slate-50 text-slate-900"}`}>
      
      {/* ATMOSPHERE */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className={`absolute top-0 right-1/4 w-[600px] h-[600px] rounded-full blur-[150px] transition-opacity duration-700
          ${isDark ? "bg-[#00aeef] opacity-[0.05]" : "bg-sky-200 opacity-[0.3]"}`} />
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        
        {/* HEADER */}
        <div className="text-center mb-20">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border transition-colors mb-6
              ${isDark ? "bg-[#001829] border-[#00aeef]/30 text-[#00aeef]" : "bg-white border-sky-100 text-[#00aeef] shadow-sm"}`}
          >
            <Globe size={14} className="animate-spin-slow" />
            <span className="font-black text-[10px] uppercase tracking-[0.2em]">
               {TRANSLATIONS.badge[lang]}
            </span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`text-5xl md:text-7xl font-black tracking-tighter mb-8 leading-[0.9]
              ${isDark ? "text-white" : "text-[#001829]"}`}
          >
            {TRANSLATIONS.titleMain[lang]} <span className="text-[#00aeef]">{TRANSLATIONS.titleHighlight[lang]}</span> <br /> {TRANSLATIONS.titleEnd[lang]}
          </motion.h1>

          <div className="max-w-4xl mx-auto space-y-8">
             <motion.div 
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               className="relative group"
             >
               <Search className={`absolute left-6 top-1/2 -translate-y-1/2 transition-colors
                 ${isDark ? "text-white/20 group-focus-within:text-[#00aeef]" : "text-slate-400 group-focus-within:text-[#00aeef]"}`} size={20} />
               <input 
                 type="text" 
                 placeholder={TRANSLATIONS.searchPlaceholder[lang]}
                 value={search}
                 onChange={(e) => setSearch(e.target.value)}
                 className={`w-full py-6 pl-16 pr-6 rounded-[2rem] border text-sm font-bold transition-all focus:outline-none focus:ring-4
                   ${isDark 
                     ? "bg-white/5 border-white/10 text-white focus:border-[#00aeef] focus:ring-[#00aeef]/10 placeholder:text-white/20" 
                     : "bg-white border-slate-200 text-[#001829] focus:border-[#00aeef] focus:ring-sky-100 placeholder:text-slate-400 shadow-xl shadow-slate-200/50"}`}
               />
               {search && (
                   <button onClick={() => setSearch("")} className="absolute right-6 top-1/2 -translate-y-1/2 p-2 hover:bg-black/5 rounded-full transition-colors">
                       <X size={18} className="opacity-40" />
                   </button>
               )}
             </motion.div>

             <div className="flex flex-wrap justify-center gap-2">
                {Object.keys(TRANSLATIONS.categories).map((catKey) => {
                  const isActive = activeCategory === catKey;
                  // Cast catKey and index properly to fix the error
                  const categoryLabels = TRANSLATIONS.categories[catKey as keyof typeof TRANSLATIONS.categories];
                  
                  return (
                    <button
                      key={catKey}
                      onClick={() => setActiveCategory(catKey)}
                      className={`px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all
                        ${isActive 
                          ? "bg-[#00aeef] text-white shadow-lg shadow-sky-500/30" 
                          : isDark ? "bg-white/5 border border-white/10 text-white/40 hover:bg-white/10" : "bg-white border border-slate-200 text-slate-400 hover:bg-slate-50 shadow-sm"}`}
                    >
                      {categoryLabels[lang]}
                    </button>
                  );
                })}
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredOpps.length > 0 ? filteredOpps.map((opp) => (
              <OppCard key={opp.id} opp={opp} lang={lang} isDark={isDark} />
            )) : (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }}
                className="col-span-full py-32 text-center"
              >
                <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-6">
                    <Compass className="opacity-20 animate-spin-slow" size={40} />
                </div>
                <p className="opacity-30 italic font-medium">{TRANSLATIONS.noResults[lang]}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className={`mt-24 p-12 rounded-[3.5rem] border flex flex-wrap justify-around gap-12 transition-colors text-center
            ${isDark ? "bg-white/5 border-white/5" : "bg-white border-slate-100 shadow-xl shadow-slate-200/20"}`}
        >
          <div>
            <p className="text-[#00aeef] font-black text-3xl mb-1">50+</p>
            <p className="text-[10px] font-bold uppercase tracking-widest opacity-40">Monthly Updates</p>
          </div>
          <div className="w-px h-12 bg-current opacity-10 hidden md:block" />
          <div>
            <p className="text-[#fbbf24] font-black text-3xl mb-1">20+</p>
            <p className="text-[10px] font-bold uppercase tracking-widest opacity-40">Partner NGOs</p>
          </div>
          <div className="w-px h-12 bg-current opacity-10 hidden md:block" />
          <div>
            <p className="text-[#10b981] font-black text-3xl mb-1">100%</p>
            <p className="text-[10px] font-bold uppercase tracking-widest opacity-40">Free Resources</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}