"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  ArrowRight, 
  MapPin, 
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  Loader2,
  AlertCircle
} from "lucide-react";
import { motion, AnimatePresence, cubicBezier, easeOut } from "framer-motion";
import { useLanguage } from "../context/LanguageContext";
import { useTheme } from "next-themes"; 

// --- ANIMATION CONFIG ---
const SLIDE_DURATION = 8000;

const maskVariants = {
  initial: { clipPath: "inset(0 0 0 100%)" },
  animate: { 
    clipPath: "inset(0 0 0 0%)",
    transition: { duration: 1.2, ease: cubicBezier(0.22, 1, 0.36, 1) } 
  },
  exit: { 
    clipPath: "inset(0 100% 0 0)",
    transition: { duration: 0.8, ease: cubicBezier(0.22, 1, 0.36, 1) } 
  }
};

const textReveal = {
  hidden: { y: "100%" },
  visible: (i: number) => ({
    y: "0%",
    transition: { delay: 0.2 + (i * 0.1), duration: 0.8, ease: easeOut }
  })
};

export default function HeroSlider() {
  const { language: lang } = useLanguage();
  const { theme } = useTheme();
  const isDark = theme === 'dark' || !theme;

  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [index, setIndex] = useState(0);

  // --- FETCH DATA ---
  useEffect(() => {
    async function fetchEvents() {
      try {
        console.log("HeroSlider: Fetching events...");
        const res = await fetch('/api/admin/events'); 
        
        if (res.ok) {
          const data = await res.json();
          console.log("HeroSlider: Raw Data Received:", data);

          // 1. Filter only 'upcoming' (Removed strictly future date check for debugging)
          const activeEvents = data
            .filter((e: any) => e.status === 'upcoming')
            .slice(0, 5); // Take top 5

          console.log("HeroSlider: Filtered Events:", activeEvents);
          setEvents(activeEvents);
        } else {
          console.error("HeroSlider API Error:", res.statusText);
        }
      } catch (error) {
        console.error("HeroSlider Network Error:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchEvents();
  }, []);

  // --- SLIDER LOGIC ---
  const nextSlide = useCallback(() => {
    if (events.length > 0) {
      setIndex((prev) => (prev + 1) % events.length);
    }
  }, [events.length]);

  const prevSlide = () => {
    if (events.length > 0) {
      setIndex((prev) => (prev === 0 ? events.length - 1 : prev - 1));
    }
  };

  useEffect(() => {
    if (events.length === 0) return;
    const timer = setTimeout(nextSlide, SLIDE_DURATION);
    return () => clearTimeout(timer);
  }, [index, nextSlide, events.length]);

  // --- LOADING STATE ---
  if (loading) return (
    <div className={`h-[90vh] flex items-center justify-center transition-colors duration-500 ${isDark ? 'bg-black text-[#00aeef]' : 'bg-white text-sky-600'}`}>
        <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-10 h-10 animate-spin" />
            <p className="text-xs font-bold uppercase tracking-widest opacity-60">Loading Events...</p>
        </div>
    </div>
  );

  // --- EMPTY STATE (Shows instructions instead of blank screen) ---
  if (events.length === 0) return (
    <div className={`h-[85vh] flex flex-col items-center justify-center transition-colors duration-500 text-center px-4 ${isDark ? 'bg-[#001829] text-white' : 'bg-slate-50 text-slate-900'}`}>
        <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6 border border-white/10">
           <AlertCircle size={32} className="text-[#00aeef]" />
        </div>
        <h2 className="text-3xl font-black mb-2">No Upcoming Events Found</h2>
        <p className={`max-w-md mb-8 ${isDark ? 'text-white/50' : 'text-slate-500'}`}>
           Go to the <strong>Admin Dashboard</strong> to create your first event, or check your database connection.
        </p>
        <Link href="/admin" className="px-8 py-3 bg-[#00aeef] text-white font-bold rounded-full text-xs uppercase tracking-widest hover:bg-[#009bd5] transition-colors">
            Go to Admin
        </Link>
    </div>
  );

  const event = events[index];
  
  // Format Date Helper
  const formatDate = (dateString: string) => {
    if (!dateString) return "TBD";
    const d = new Date(dateString);
    return d.toLocaleDateString(lang === 'mn' ? 'mn-MN' : 'en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className={`relative h-[90vh] w-full overflow-hidden font-sans transition-colors duration-700 ${isDark ? 'bg-black' : 'bg-white'}`}>
      
      {/* 1. BACKGROUND IMAGE SLIDER */}
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.div
          key={event._id}
          variants={maskVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="absolute inset-0 z-0 h-full w-full"
        >
          {/* Overlay */}
          <div className={`absolute inset-0 z-10 transition-colors duration-500 
             ${isDark 
               ? "bg-black/40 bg-gradient-to-t from-black/90 via-black/20 to-transparent" 
               : "bg-white/10 bg-gradient-to-t from-white/90 via-white/10 to-transparent"}`} 
          />
          
          <motion.div 
            className="relative w-full h-full"
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
            transition={{ duration: 10, ease: "linear" }}
          >
            <Image
              src={event.image || "/fallback-event.jpg"} // Ensure this file exists in /public or use external URL
              alt={event.title[lang] || event.title.en}
              fill
              className="object-cover"
              priority
            />
          </motion.div>
        </motion.div>
      </AnimatePresence>

      {/* 2. MAIN CONTENT */}
      <div className="absolute inset-0 z-20 flex flex-col justify-center px-6 md:px-12 lg:px-24">
        <div className="max-w-5xl overflow-hidden">
          
          {/* Tagline */}
          <div className="overflow-hidden mb-4">
            <motion.div 
              custom={0}
              variants={textReveal}
              initial="hidden"
              key={`sub-${event._id}`}
              animate="visible"
              className="flex items-center gap-3"
            >
              <span className={`h-[2px] w-12 ${isDark ? 'bg-[#00aeef]' : 'bg-sky-600'}`} />
              <span className={`uppercase tracking-[0.3em] text-sm font-bold ${isDark ? 'text-[#00aeef]' : 'text-sky-700'}`}>
                 {event.category}
              </span>
            </motion.div>
          </div>

          {/* Title */}
          <div className="overflow-hidden">
            <motion.h1
              custom={1}
              variants={textReveal}
              initial="hidden"
              key={`title-${event._id}`}
              animate="visible"
              className={`text-5xl md:text-7xl lg:text-8xl font-black leading-[0.95] tracking-tight mb-6 drop-shadow-xl 
                 ${isDark ? 'text-white' : 'text-slate-900'}`}
            >
              {event.title[lang] || event.title.en}
            </motion.h1>
          </div>

          {/* Description */}
          <div className="overflow-hidden mb-10">
            <motion.p
              custom={2}
              variants={textReveal}
              initial="hidden"
              key={`desc-${event._id}`}
              animate="visible"
              className={`text-lg md:text-xl font-light max-w-xl leading-relaxed 
                 ${isDark ? 'text-white/80' : 'text-slate-800 font-medium'}`}
            >
               {event.description[lang] || event.description.en}
            </motion.p>
          </div>

          {/* Data Bar */}
          <div className="overflow-hidden">
            <motion.div
              custom={3}
              variants={textReveal}
              initial="hidden"
              key={`meta-${event._id}`}
              animate="visible"
              className={`flex flex-wrap gap-6 items-center pt-8 border-t 
                 ${isDark ? 'border-white/20' : 'border-slate-900/10'}`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-full backdrop-blur-md border transition-colors 
                   ${isDark ? 'bg-white/10 border-white/10 text-white' : 'bg-white/60 border-slate-200 text-slate-900'}`}>
                  <Calendar size={20} className={`${isDark ? 'text-[#00aeef]' : 'text-sky-600'}`} />
                </div>
                <div>
                  <p className={`text-[10px] uppercase tracking-widest font-bold ${isDark ? 'text-white/50' : 'text-slate-500'}`}>Date</p>
                  <p className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{formatDate(event.date)}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-full backdrop-blur-md border transition-colors 
                   ${isDark ? 'bg-white/10 border-white/10 text-white' : 'bg-white/60 border-slate-200 text-slate-900'}`}>
                  <MapPin size={20} className={`${isDark ? 'text-[#00aeef]' : 'text-sky-600'}`} />
                </div>
                <div>
                  <p className={`text-[10px] uppercase tracking-widest font-bold ${isDark ? 'text-white/50' : 'text-slate-500'}`}>Location</p>
                  <p className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{event.location[lang] || event.location.en}</p>
                </div>
              </div>

              <Link href={`/events/${event._id}`}>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-8 py-3 font-black uppercase tracking-widest text-xs rounded-full flex items-center gap-2 transition-colors duration-300 ml-4 shadow-lg
                     ${isDark 
                        ? 'bg-white text-black hover:bg-[#00aeef] hover:text-white' 
                        : 'bg-slate-900 text-white hover:bg-sky-600'}`}
                >
                   {lang === 'mn' ? 'Дэлгэрэнгүй' : 'Details'} <ArrowRight size={14} />
                </motion.button>
              </Link>
            </motion.div>
          </div>

        </div>
      </div>

      {/* 3. PROGRESS BAR */}
      <div className="absolute bottom-0 left-0 w-full z-30 flex items-end justify-between p-8 md:p-12">
        <div className="flex-1 flex gap-2 max-w-md items-end h-full pb-4">
          {events.map((_, i) => (
            <div key={i} className={`relative flex-1 h-[3px] overflow-hidden rounded-full ${isDark ? 'bg-white/20' : 'bg-slate-300'}`}>
              {i === index && (
                <motion.div
                  layoutId="activeSlide"
                  className={`absolute inset-0 ${isDark ? 'bg-[#00aeef]' : 'bg-sky-600'}`}
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: SLIDE_DURATION / 1000, ease: "linear" }}
                />
              )}
              {i < index && <div className={`absolute inset-0 ${isDark ? 'bg-white' : 'bg-slate-800'}`} />}
            </div>
          ))}
        </div>

        <div className="flex gap-4 ml-8">
          <button onClick={prevSlide} className={`w-14 h-14 rounded-full border flex items-center justify-center transition-all hover:scale-110 active:scale-95 ${isDark ? 'border-white/20 text-white hover:bg-white hover:text-black' : 'border-slate-300 text-slate-900 hover:bg-slate-900 hover:text-white'}`}>
            <ChevronLeft size={24} />
          </button>
          <button onClick={nextSlide} className={`w-14 h-14 rounded-full border flex items-center justify-center transition-all hover:scale-110 active:scale-95 ${isDark ? 'border-white/20 text-white hover:bg-white hover:text-black' : 'border-slate-300 text-slate-900 hover:bg-slate-900 hover:text-white'}`}>
            <ChevronRight size={24} />
          </button>
        </div>
      </div>

    </div>
  );
}