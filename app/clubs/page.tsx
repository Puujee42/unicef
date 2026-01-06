"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  School, 
  Users, 
  Calendar, 
  ArrowUpRight, 
  Search, 
  Zap, 
  Trophy,
  Filter,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import { useLanguage } from "../context/LanguageContext";

// --- TYPES ---
interface ClubStats {
  members: number;
  activity: string;
  currentEvents: (string | { en: string; mn: string })[];
  pastEventsCount: number;
  totalEvents?: number;
}

interface ChapterCardProps {
  uni: {
    id: string;
    en: string;
    mn: string;
    [key: string]: string; // Allow dynamic language access
  };
  lang: 'en' | 'mn';
  isDark: boolean;
  stats?: ClubStats;
}

// --- ТЕКСТҮҮД (Bilingual Translations) ---
const TRANSLATIONS = {
  badge: { mn: "Сургуулийн салбар клубууд", en: "University Chapters" },
  titleMain: { mn: "Оюутны", en: "Empowering" },
  titleHighlight: { mn: "Хүч", en: "University" },
  titleEnd: { mn: "-ийг нэгтгэж байна.", en: "Students." },
  searchPlaceholder: { mn: "Өөрийн сургуулийг хайх...", en: "Search for your university..." },
  found: { mn: "Клуб олдлоо", en: "Chapters Found" },
  syncing: { mn: "Мэдээлэл шинэчилж байна...", en: "Syncing Stats..." },
  noResults: { mn: "Таны хайсан клуб олдсонгүй.", en: "No chapters found matching your search." },
  membersLabel: { mn: "Гишүүд", en: "Members" },
  currentInitiatives: { mn: "Хэрэгжиж буй ажлууд", en: "Current Initiatives" },
  pastEvents: { mn: "Өнгөрсөн арга хэмжээ", en: "Past Events" },
  noEvents: { mn: "Одоогоор идэвхтэй ажил байхгүй байна", en: "No active public events" },
  viewProfile: { mn: "Клубын мэдээлэл үзэх", en: "View Club Profile" },
  totalMembers: { mn: "Нийт гишүүд", en: "Active Members" },
  totalEvents: { mn: "Нийт арга хэмжээ", en: "Total Events" },
  platinumChapters: { mn: "Тэргүүлэх клубууд", en: "Platinum Chapters" },
  activityLevels: {
    high: { mn: "Маш идэвхтэй", en: "Very High" },
    medium: { mn: "Идэвхтэй", en: "Medium" },
    low: { mn: "Бага", en: "Low" },
    inactive: { mn: "Идэвхгүй", en: "Inactive" }
  }
};

// --- UNIVERSITY LIST DATA ---
const UNIVERSITIES = [
  { id: "NUM", en: "National University of Mongolia", mn: "Монгол Улсын Их Сургууль (МУИС)" },
  { id: "MUST", en: "MUST", mn: "Шинжлэх Ухаан, Технологийн Их Сургууль" },
  { id: "UFE", en: "University of Finance and Economics", mn: "Санхүү, Эдийн Засгийн Их Сургууль" },
  { id: "MNUMS", en: "MNUMS", mn: "Анагаахын Шинжлэх Ухааны Үндэсний Их Сургууль (АШУҮИС)" },
  { id: "MSUE", en: "University of Education", mn: "Боловсролын Их Сургууль (МУБИС)" },
  { id: "MSUA", en: "University of Agriculture", mn: "Хөдөө Аж Ахуйн Их Сургууль (ХААИС)" },
  { id: "MSUAC", en: "University of Arts and Culture", mn: "Соёл, Урлагийн Их Сургууль (СУИС)" },
  { id: "MNDU", en: "National Defense University", mn: "Үндэсний Батлан Хамгаалахын Их Сургууль" },
  { id: "LEUM", en: "Law Enforcement University", mn: "Хууль Сахиулахын Их Сургууль" },
  { id: "UBU", en: "Ulaanbaatar University", mn: "Улаанбаатарын Их Сургууль (УБИС)" },
  { id: "IDER", en: "Ider University", mn: "Идэр Их Сургууль" },
  { id: "OTU", en: "Otgontenger University", mn: "Отгонтэнгэр Их Сургууль" },
  { id: "HUREE", en: "Huree University", mn: "Хүрээ Дээд Сургууль" },
  { id: "MJHU", en: "MJHU", mn: "Монгол-Японы Хүмүүнлэгийн Их Сургууль" },
  { id: "ACH", en: "Ach Medical University", mn: "Ач Анагаах Ухааны Их Сургууль" },
  { id: "IZIU", en: "Ikh Zasag University", mn: "Их Засаг Олон Улсын Их Сургууль" },
  { id: "ORKHON", en: "Orkhon University", mn: "Орхон Их Сургууль" },
  { id: "MIU", en: "MIU", mn: "Монгол Олон Улсын Их Сургууль" },
  { id: "MANDAKH", en: "Mandakh University", mn: "Мандах Их Сургууль" },
  { id: "CHINGGIS", en: "Chinggis Khaan University", mn: "Чингис Хаан Их Сургууль" },
  { id: "GAZARCHIN", en: "Gazarchin Institute", mn: "Газарчин Дээд Сургууль" },
];

// --- SUB-COMPONENT: CHAPTER CARD ---
const ChapterCard = ({ uni, lang, isDark, stats }: ChapterCardProps) => {
  const safeStats: ClubStats = stats || { members: 0, activity: "inactive", currentEvents: [], pastEventsCount: 0 };
  
  // Үйл ажиллагааны түвшинг орчуулж авах
  const activityKey = (safeStats.activity as keyof typeof TRANSLATIONS.activityLevels) || 'inactive';
  const activityText = TRANSLATIONS.activityLevels[activityKey] || TRANSLATIONS.activityLevels.inactive;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className={`relative group rounded-[2.5rem] border p-8 transition-all duration-500 overflow-hidden
        ${isDark 
          ? "bg-[#001d30]/60 border-white/5 shadow-2xl hover:border-[#00aeef]/40" 
          : "bg-white border-slate-200 shadow-xl shadow-slate-200/40 hover:border-[#00aeef]/40"}`}
    >
      <div className={`absolute top-0 right-0 w-32 h-32 blur-[80px] opacity-10 pointer-events-none bg-[#00aeef]`} />

      <div className="relative z-10">
        <div className="flex justify-between items-start mb-6">
          <div className={`p-4 rounded-3xl transition-colors ${isDark ? "bg-white/5" : "bg-sky-50"}`}>
            <School size={32} className="text-[#00aeef]" />
          </div>
          <div className="flex flex-col items-end">
            <div className={`flex items-center gap-2 px-3 py-1 rounded-full border ${safeStats.activity === 'inactive' ? 'bg-slate-500/10 border-slate-500/20' : 'bg-[#10b981]/10 border-[#10b981]/20'}`}>
               <span className={`w-1.5 h-1.5 rounded-full ${safeStats.activity === 'inactive' ? 'bg-slate-500' : 'bg-[#10b981] animate-pulse'}`} />
               <span className={`text-[10px] font-black uppercase tracking-widest ${safeStats.activity === 'inactive' ? 'text-slate-500' : 'text-[#10b981]'}`}>
                  {activityText[lang]}
               </span>
            </div>
            <div className="flex items-center gap-2 mt-3">
               <Users size={16} className="text-[#00aeef]" />
               <span className={`text-xl font-black ${isDark ? "text-white" : "text-[#001829]"}`}>{safeStats.members}</span>
               <span className={`text-[10px] font-bold opacity-40 uppercase ${isDark ? "text-white" : "text-[#001829]"}`}>
                 {TRANSLATIONS.membersLabel[lang]}
               </span>
            </div>
          </div>
        </div>

        <h3 className={`text-xl font-black mb-2 tracking-tight leading-tight min-h-[3rem] ${isDark ? "text-white" : "text-[#001829]"}`}>
          {uni[lang]}
        </h3>

        {/* Current Events Section */}
        <div className="mt-6 space-y-3">
          <div className="flex justify-between items-end">
             <p className={`text-[10px] font-black uppercase tracking-[0.2em] ${isDark ? "text-white/40" : "text-slate-400"}`}>
               {TRANSLATIONS.currentInitiatives[lang]}
             </p>
             {safeStats.pastEventsCount > 0 && (
                <p className={`text-[9px] font-bold ${isDark ? "text-white/30" : "text-slate-400"}`}>
                  +{safeStats.pastEventsCount} {TRANSLATIONS.pastEvents[lang]}
                </p>
             )}
          </div>
          
          {safeStats.currentEvents.length > 0 ? (
            safeStats.currentEvents.map((event, idx) => (
              <div key={idx} className={`flex items-center gap-3 p-3 rounded-2xl border transition-all
                ${isDark ? "bg-black/20 border-white/5" : "bg-slate-50 border-slate-100"}`}>
                <div className="w-2 h-2 rounded-full bg-[#00aeef]" />
                <span className={`text-xs font-bold line-clamp-1 ${isDark ? "text-white/80" : "text-slate-700"}`}>
                  {typeof event === 'string' ? event : event[lang]}
                </span>
              </div>
            ))
          ) : (
             <div className="text-xs italic opacity-30 py-2">{TRANSLATIONS.noEvents[lang]}</div>
          )}
        </div>

        <Link href={`/clubs/${uni.id}`} className={`mt-8 w-full py-4 rounded-2xl border font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-2 transition-all
          ${isDark 
            ? "border-white/10 text-white hover:bg-[#00aeef] hover:border-[#00aeef]" 
            : "border-slate-200 text-[#001829] hover:bg-[#001829] hover:text-white"}`}>
          {TRANSLATIONS.viewProfile[lang]}
          <ArrowUpRight size={14} />
        </Link>
      </div>
    </motion.div>
  );
};

// --- MAIN PAGE ---
export default function ClubsPage() {
  const { language: lang } = useLanguage();
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [search, setSearch] = useState("");
  const [clubStats, setClubStats] = useState<Record<string, ClubStats>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
    fetchStats();
  }, []);

  const fetchStats = async () => {
      try {
          const res = await fetch('/api/clubs/stats');
          if (res.ok) {
              const data = await res.json();
              setClubStats(data);
          }
      } catch (error) {
          console.error("Failed to fetch club stats", error);
      } finally {
          setLoading(false);
      }
  };

  if (!mounted) return null;

  const isDark = theme === "dark" || !theme;

  const filteredClubs = UNIVERSITIES.filter(uni => 
    uni.en.toLowerCase().includes(search.toLowerCase()) || 
    uni.mn.toLowerCase().includes(search.toLowerCase())
  );
  
  const totalMembers = Object.values(clubStats).reduce((acc, curr) => acc + (curr.members || 0), 0);
  const totalEventsCount = Object.values(clubStats).reduce((acc, curr) => acc + (curr.totalEvents || 0), 0);
  const platinumCount = Object.values(clubStats).filter(c => c.activity === 'high' || c.activity === 'very high').length;

  return (
    <div className={`min-h-screen transition-colors duration-700 pt-32 pb-20 px-6 font-sans
      ${isDark ? "bg-[#001829] text-white" : "bg-slate-50 text-slate-900"}`}>
      
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className={`absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full blur-[150px] transition-opacity duration-700
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
              ${isDark ? "bg-[#00aeef]/10 border-[#00aeef]/30 text-[#00aeef]" : "bg-white border-slate-200 text-[#00aeef] shadow-sm"}`}
          >
            <Zap size={14} className="fill-current" />
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
            {TRANSLATIONS.titleMain[lang]} <span className="text-[#00aeef]">{TRANSLATIONS.titleHighlight[lang]}</span> {TRANSLATIONS.titleEnd[lang]}
          </motion.h1>

          {/* SEARCH BAR */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-2xl mx-auto relative group"
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
        </div>

        {/* RESULTS SUMMARY */}
        <div className="flex items-center gap-4 mb-8 px-4">
            <Filter size={14} className="opacity-40" />
            <span className="text-xs font-black uppercase tracking-widest opacity-40">
                {filteredClubs.length} {TRANSLATIONS.found[lang]}
            </span>
            {loading && <span className="text-xs font-bold text-[#00aeef] animate-pulse">{TRANSLATIONS.syncing[lang]}</span>}
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredClubs.length > 0 ? (
              filteredClubs.map((uni) => (
                <ChapterCard 
                    key={uni.id} 
                    uni={uni} 
                    lang={lang} 
                    isDark={isDark} 
                    stats={clubStats[uni.id]} 
                />
              ))
            ) : (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }}
                className="col-span-full py-32 text-center"
              >
                <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-6">
                    <School className="opacity-20" size={40} />
                </div>
                <p className="opacity-30 italic font-medium">{TRANSLATIONS.noResults[lang]}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* STATS STRIP */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className={`mt-24 p-12 rounded-[3.5rem] border flex flex-wrap justify-around gap-12 transition-colors
            ${isDark ? "bg-white/5 border-white/5" : "bg-white border-slate-100 shadow-xl shadow-slate-200/20"}`}
        >
          {[
            { label: TRANSLATIONS.totalMembers[lang], val: totalMembers > 0 ? `${totalMembers}+` : "---", icon: Users },
            { label: TRANSLATIONS.totalEvents[lang], val: totalEventsCount > 0 ? `${totalEventsCount}` : "---", icon: Calendar },
            { label: TRANSLATIONS.platinumChapters[lang], val: platinumCount > 0 ? `${platinumCount}` : "---", icon: Trophy },
          ].map((stat, i) => (
            <div key={i} className="flex flex-col items-center text-center">
              <stat.icon className="text-[#00aeef] mb-4" size={24} />
              <span className={`text-4xl font-black mb-1 ${isDark ? "text-white" : "text-[#001829]"}`}>{stat.val}</span>
              <span className={`text-[10px] font-black uppercase tracking-widest opacity-40 ${isDark ? "text-white" : "text-[#001829]"}`}>
                {stat.label}
              </span>
            </div>
          ))}
        </motion.div>

      </div>
    </div>
  );
}