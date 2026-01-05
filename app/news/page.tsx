"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  Newspaper, 
  Calendar, 
  User, 
  ArrowRight, 
  Search, 
  Zap, 
  Filter,
  X,
  Clock,
  Loader2,
  ChevronRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import { useLanguage } from "../context/LanguageContext";

// --- TYPES ---
interface NewsArticle {
  _id: string;
  title: { en: string; mn: string };
  summary: { en: string; mn: string };
  content: { en: string; mn: string };
  author: string;
  publishedDate: string;
  image: string;
  tags: string[];
  featured: boolean;
}

// --- TRANSLATIONS ---
const TRANSLATIONS = {
  badge: { mn: "Мэдээ мэдээлэл", en: "News & Updates" },
  titleMain: { mn: "Хамгийн сүүлийн", en: "Stay Informed with" },
  titleHighlight: { mn: "Мэдээлэл", en: "Latest" },
  titleEnd: { mn: "үүд.", en: "Updates." },
  searchPlaceholder: { mn: "Мэдээ хайх...", en: "Search news..." },
  found: { mn: "Мэдээ олдлоо", en: "Articles Found" },
  noResults: { mn: "Илэрц олдсонгүй.", en: "No news articles found." },
  readMore: { mn: "Дэлгэрэнгүй", en: "Read More" },
  featured: { mn: "Онцлох", en: "Featured" },
  all: { mn: "Бүгд", en: "All" },
  recent: { mn: "Шинэ", en: "Recent" }
};

// --- SUB-COMPONENT: NEWS CARD ---
const NewsCard = ({ article, lang, isDark }: { article: NewsArticle, lang: 'en' | 'mn', isDark: boolean }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className={`relative group rounded-[2.5rem] border overflow-hidden transition-all duration-500 h-full flex flex-col
        ${isDark 
          ? "bg-[#001d30]/60 border-white/5 shadow-2xl hover:border-[#00aeef]/40" 
          : "bg-white border-slate-200 shadow-xl shadow-slate-200/40 hover:border-[#00aeef]/40"}`}
    >
      <div className="relative h-64 overflow-hidden">
        <img 
          src={article.image} 
          alt={article.title[lang]} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        {article.featured && (
          <div className="absolute top-6 left-6 px-4 py-2 rounded-full bg-[#00aeef] text-white text-[10px] font-black uppercase tracking-widest shadow-lg flex items-center gap-2">
            <Zap size={12} fill="currentColor" />
            {TRANSLATIONS.featured[lang]}
          </div>
        )}
      </div>

      <div className="p-8 flex flex-col flex-1">
        <div className="flex items-center gap-4 mb-4 opacity-60 text-[10px] font-black uppercase tracking-widest">
          <div className="flex items-center gap-1.5">
            <Calendar size={12} className="text-[#00aeef]" />
            {new Date(article.publishedDate).toLocaleDateString()}
          </div>
          <div className="flex items-center gap-1.5">
            <User size={12} className="text-[#00aeef]" />
            {article.author}
          </div>
        </div>

        <h3 className={`text-xl font-black mb-4 tracking-tight leading-tight line-clamp-2 transition-colors group-hover:text-[#00aeef] ${isDark ? "text-white" : "text-[#001829]"}`}>
          {article.title[lang]}
        </h3>

        <p className={`text-sm opacity-60 leading-relaxed mb-8 line-clamp-3 ${isDark ? "text-white" : "text-slate-600"}`}>
          {article.summary[lang]}
        </p>

        <div className="mt-auto flex items-center justify-between">
          <div className="flex flex-wrap gap-2">
            {article.tags.slice(0, 2).map(tag => (
              <span key={tag} className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg ${isDark ? "bg-white/5 text-white/40" : "bg-slate-100 text-slate-400"}`}>
                #{tag}
              </span>
            ))}
          </div>

          <Link href={`/news/${article._id}`} className={`flex items-center gap-2 font-black text-[10px] uppercase tracking-widest transition-all hover:gap-4 ${isDark ? "text-[#00aeef]" : "text-[#00aeef]"}`}>
            {TRANSLATIONS.readMore[lang]}
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

// --- MAIN PAGE ---
export default function NewsPage() {
  const { language: lang } = useLanguage();
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [search, setSearch] = useState("");
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const res = await fetch('/api/news');
      if (res.ok) {
        const data = await res.json();
        setArticles(data);
      }
    } catch (error) {
      console.error("Failed to fetch news", error);
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  const isDark = theme === "dark" || !theme;

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title[lang].toLowerCase().includes(search.toLowerCase()) || 
                         article.summary[lang].toLowerCase().includes(search.toLowerCase()) ||
                         article.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase()));
    return matchesSearch;
  });

  return (
    <div className={`min-h-screen transition-colors duration-700 pt-32 pb-20 px-6 font-sans
      ${isDark ? "bg-[#001829] text-white" : "bg-slate-50 text-slate-900"}`}>
      
      {/* Background Decor */}
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
              ${isDark ? "bg-[#00aeef]/10 border-[#00aeef]/30 text-[#00aeef]" : "bg-white border-sky-100 text-[#00aeef] shadow-sm"}`}
          >
            <Newspaper size={14} className="fill-current" />
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
                {filteredArticles.length} {TRANSLATIONS.found[lang]}
            </span>
            {loading && <span className="text-xs font-bold text-[#00aeef] animate-pulse ml-2">Loading...</span>}
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {loading ? (
               <div className="col-span-full py-20 flex justify-center">
                  <Loader2 className="animate-spin text-[#00aeef]" size={32} />
               </div>
            ) : filteredArticles.length > 0 ? (
              filteredArticles.map((article) => (
                <NewsCard 
                    key={article._id} 
                    article={article} 
                    lang={lang} 
                    isDark={isDark} 
                />
              ))
            ) : (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }}
                className="col-span-full py-32 text-center"
              >
                <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-6">
                    <Newspaper className="opacity-20" size={40} />
                </div>
                <p className="opacity-30 italic font-medium">{TRANSLATIONS.noResults[lang]}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}
