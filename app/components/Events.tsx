"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  ArrowUpRight, 
  Clock, 
  MapPin, 
  CalendarDays, 
  Loader2,
  ChevronRight,
  Filter
} from "lucide-react";
import { 
  motion, 
  useMotionValue, 
  useSpring, 
  useTransform, 
  AnimatePresence 
} from "framer-motion";
import { useTheme } from "next-themes";
import { useLanguage } from "../context/LanguageContext";

// --- CONFIG ---
const CATEGORIES = [
  { id: 'all', en: 'All Events', mn: 'Бүгд' },
  { id: 'campaign', en: 'Campaigns', mn: 'Аяны Ажил' },
  { id: 'workshop', en: 'Workshops', mn: 'Сургалт' },
  { id: 'fundraiser', en: 'Fundraisers', mn: 'Хандив' },
];

// --- HELPER: DATE FORMATTER ---
const formatDate = (dateString: string, lang: 'en' | 'mn') => {
  if (!dateString) return { day: "00", month: "DEC" };
  const d = new Date(dateString);
  const day = d.getDate();
  const month = d.toLocaleDateString(lang === 'mn' ? 'mn-MN' : 'en-US', { month: 'short' }).toUpperCase();
  return { day, month };
};

// --- SUB-COMPONENT: RESPONSIVE CARD ---
const EventCard = ({ event, lang, isDark, isMobile }: any) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Softer springs for subtle movement
  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 15 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 15 });

  // 3D Tilt Logic (Active only on Desktop)
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["7deg", "-7deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-7deg", "7deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isMobile) return; // Disable tilt on mobile
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => { x.set(0); y.set(0); };

  const { day, month } = formatDate(event.date, lang);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      exit={{ opacity: 0, scale: 0.95 }}
      style={{ 
        rotateX: isMobile ? 0 : rotateX, 
        rotateY: isMobile ? 0 : rotateY, 
        transformStyle: "preserve-3d" 
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`
        relative group rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden cursor-pointer h-full min-h-[360px] sm:min-h-[420px] border transition-all duration-500
        ${isDark 
          ? "bg-[#001829] border-[#00aeef]/20 shadow-none sm:shadow-[0_0_30px_-10px_rgba(0,0,0,0.8)]" 
          : "bg-white border-slate-200 shadow-sm sm:shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)] sm:hover:shadow-[0_20px_50px_-10px_rgba(0,174,239,0.15)]"
        }
      `}
    >
      {/* IMAGE SECTION */}
      <div className="absolute inset-0 h-full w-full">
        {/* Placeholder Gradient */}
        <div className={`absolute inset-0 bg-gradient-to-b ${isDark ? "from-[#002b49] to-[#00101a]" : "from-slate-100 to-slate-200"}`} />
        
        {/* Actual Image */}
        <Image 
          src={event.image || "/logo.jpg"} 
          alt={event.title[lang] || "Event"} 
          fill 
          className="object-cover transition-transform duration-700 sm:group-hover:scale-110 opacity-90"
        />

        {/* Overlay Gradients */}
        <div className={`absolute inset-0 bg-gradient-to-t via-transparent to-transparent opacity-90 transition-opacity duration-300
           ${isDark ? "from-[#00101a] via-[#001829]/60" : "from-white via-white/40"}`} 
        />
        
        {/* Hover Color Tint (Desktop Only) */}
        <div className={`hidden sm:block absolute inset-0 opacity-0 group-hover:opacity-40 transition-opacity duration-500 mix-blend-overlay bg-[#00aeef]`} />
      </div>

      {/* FLOATING DATE BADGE */}
      <div className={`
         absolute top-4 left-4 sm:top-6 sm:left-6 z-20 flex flex-col items-center justify-center rounded-2xl w-12 h-14 sm:w-14 sm:h-16 border backdrop-blur-md shadow-lg transition-transform duration-300 sm:group-hover:-translate-y-1
         ${isDark 
            ? "bg-white/10 border-white/20 text-white" 
            : "bg-white/90 border-slate-200 text-[#001829]"}
      `}>
        <span className="text-lg sm:text-xl font-black leading-none">{day}</span>
        <span className="text-[8px] sm:text-[9px] font-bold uppercase tracking-widest opacity-80">{month}</span>
      </div>

      {/* CONTENT AREA */}
      <div className="absolute bottom-0 left-0 w-full p-6 sm:p-8 z-20 transform translate-z-10 flex flex-col justify-end h-full pointer-events-none">
        <div className="transform transition-transform duration-500 sm:group-hover:-translate-y-2 pointer-events-auto">
           
           {/* Tags & Location */}
           <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
              <span className={`px-2.5 py-1 rounded-full text-[8px] sm:text-[9px] font-black uppercase tracking-widest border backdrop-blur-sm
                 ${isDark 
                    ? "bg-[#00aeef]/10 border-[#00aeef]/30 text-[#00aeef]" 
                    : "bg-[#00aeef] border-[#00aeef] text-white shadow-md"}
              `}>
                {event.category}
              </span>
              <span className={`flex items-center gap-1.5 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider
                 ${isDark ? "text-white/70" : "text-slate-600"}`}>
                <MapPin size={12} className="text-[#00aeef]" /> 
                {event.location[lang] || event.location.en}
              </span>
           </div>

           {/* Title */}
           <h3 className={`text-xl sm:text-2xl lg:text-3xl font-black leading-[1] tracking-tight mb-2 line-clamp-2 transition-colors
              ${isDark ? "text-white" : "text-[#001829] group-hover:text-[#00aeef]"}`}>
             {event.title[lang] || event.title.en}
           </h3>
           
           <div className={`text-xs font-bold flex items-center gap-2 mb-2 sm:mb-4
              ${isDark ? "text-white/50" : "text-slate-500"}`}>
              <Clock size={12} className="text-[#00aeef]" /> {event.timeString}
           </div>
        </div>

        {/* Hover/Mobile Reveal Button */}
        <div className="h-auto sm:h-0 overflow-hidden sm:group-hover:h-auto transition-all duration-500 sm:opacity-0 sm:group-hover:opacity-100 pointer-events-auto">
           <div className={`w-full h-[1px] mb-3 sm:mb-4 opacity-50 sm:opacity-100 ${isDark ? "bg-white/20" : "bg-slate-200"}`} />
           <Link href={`/events/${event._id}`} className={`flex items-center gap-2 font-black uppercase tracking-widest text-[9px] sm:text-[10px] transition-all hover:gap-4
               ${isDark ? "text-white" : "text-[#001829]"}`}>
              {lang === 'mn' ? 'Дэлгэрэнгүй' : 'View Details'} 
              <span className={`p-1 rounded-full ${isDark ? "bg-[#00aeef] text-white" : "bg-[#00aeef] text-white"}`}>
                <ArrowUpRight size={12} />
              </span>
           </Link>
        </div>
      </div>
    </motion.div>
  );
};

// --- MAIN SECTION COMPONENT ---
export default function EventsSection() {
  const { language: lang } = useLanguage();
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [filter, setFilter] = useState("all");
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  
  // Hydration fix & Theme detection
  useEffect(() => {
    setMounted(true);
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);
  
  const isDark = mounted && (theme === 'dark' || !theme);

  // --- API FETCH ---
  useEffect(() => {
    async function fetchData() {
        try {
            const res = await fetch('/api/admin/events'); 
            if (res.ok) {
                const data = await res.json();
                const upcoming = data.filter((e: any) => e.status === 'upcoming');
                setEvents(upcoming);
            }
        } catch (error) {
            console.error("Failed to fetch events", error);
        } finally {
            setLoading(false);
        }
    }
    fetchData();
  }, []);

  const filteredEvents = events.filter(ev => filter === 'all' || ev.category === filter);

  if (!mounted) return null;

  return (
    <section className={`relative py-16 sm:py-24 px-5 overflow-hidden transition-colors duration-700 
      ${isDark ? "bg-[#00101a]" : "bg-[#f8fafc]"}`
    }>
      
      {/* --- BACKGROUND AMBIENCE --- */}
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
         {/* Noise Texture */}
         <div className="absolute inset-0 opacity-[0.03] bg-[url('/noise.png')] mix-blend-overlay z-10" />
         
         {/* Blobs */}
         <div className={`absolute -top-20 -right-20 w-[300px] sm:w-[600px] h-[300px] sm:h-[600px] rounded-full blur-[100px] sm:blur-[150px] opacity-[0.1] transition-colors duration-700
            ${isDark ? "bg-[#00aeef]" : "bg-sky-300"}`} 
         />
         <div className={`absolute bottom-0 left-0 w-[200px] sm:w-[500px] h-[200px] sm:h-[500px] rounded-full blur-[100px] sm:blur-[150px] opacity-[0.1] transition-colors duration-700
            ${isDark ? "bg-[#005691]" : "bg-blue-300"}`} 
         />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        
        {/* --- HEADER --- */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 sm:gap-8 mb-10 sm:mb-16">
           <div className="flex-1">
              <motion.div 
                 initial={{ opacity: 0, x: -20 }}
                 whileInView={{ opacity: 1, x: 0 }}
                 viewport={{ once: true }}
                 className="flex items-center gap-3 mb-3 sm:mb-4"
              >
                 <div className={`p-1.5 sm:p-2 rounded-full border shadow-sm ${isDark ? "bg-white/5 border-white/10" : "bg-white border-slate-200"}`}>
                    <CalendarDays size={14} className="text-[#00aeef] sm:w-4 sm:h-4" />
                 </div>
                 <span className={`font-black uppercase tracking-[0.2em] text-[10px] sm:text-xs ${isDark ? "text-white/60" : "text-slate-500"}`}>
                    {lang === 'mn' ? 'Хөтөлбөр' : 'Schedule'}
                 </span>
              </motion.div>
              
              <motion.h2 
                 initial={{ opacity: 0, y: 20 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true }}
                 className={`text-4xl sm:text-6xl lg:text-7xl font-black tracking-tighter leading-[0.9]
                    ${isDark ? "text-white" : "text-[#001829]"}`}
              >
                 {lang === 'mn' ? 'Арга Хэмжээ' : 'Upcoming Events'}
                 <span className="text-[#00aeef]">.</span>
              </motion.h2>
           </div>

           {/* --- FILTER TABS (Scrollable on Mobile) --- */}
           <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className={`flex overflow-x-auto pb-2 sm:pb-0 gap-1 p-1 sm:p-1.5 rounded-2xl sm:rounded-full border backdrop-blur-xl shadow-lg scrollbar-hide
                ${isDark ? "bg-[#001829]/50 border-white/10" : "bg-white border-slate-200"}`}
           >
              {CATEGORIES.map((cat) => {
                const isActive = filter === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setFilter(cat.id)}
                    className={`relative whitespace-nowrap px-4 sm:px-6 py-2 sm:py-2.5 rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-widest transition-all z-10 flex-shrink-0
                       ${isActive 
                         ? "text-white" 
                         : (isDark ? "text-white/40 hover:text-white" : "text-slate-400 hover:text-slate-900")}
                    `}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeEventFilter"
                        className="absolute inset-0 bg-[#00aeef] rounded-full -z-10 shadow-md"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                    {cat[lang]}
                  </button>
                )
              })}
           </motion.div>
        </div>

        {/* --- CONTENT GRID --- */}
        {loading ? (
            <div className="flex flex-col items-center justify-center py-24 sm:py-40 gap-4">
                <Loader2 className="animate-spin w-10 h-10 sm:w-12 sm:h-12 text-[#00aeef]" />
                <p className={`text-[10px] sm:text-xs font-bold uppercase tracking-widest ${isDark ? "text-white/40" : "text-slate-400"}`}>
                   {lang === 'mn' ? 'Уншиж байна...' : 'Loading events...'}
                </p>
            </div>
        ) : filteredEvents.length > 0 ? (
            <motion.div 
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 auto-rows-fr"
            >
            <AnimatePresence mode="popLayout">
                {filteredEvents.map((event) => (
                    <EventCard key={event._id} event={event} lang={lang} isDark={isDark} isMobile={isMobile} />
                ))}
            </AnimatePresence>
            </motion.div>
        ) : (
            <div className={`flex flex-col items-center justify-center py-24 sm:py-40 border-2 border-dashed rounded-[2rem] sm:rounded-[3rem] px-6 text-center
               ${isDark ? "border-white/5 bg-white/5" : "border-slate-200 bg-slate-50"}`}>
                <div className="p-3 sm:p-4 rounded-full bg-[#00aeef]/10 mb-4">
                    <Filter className="text-[#00aeef] w-6 h-6 sm:w-8 sm:h-8" />
                </div>
                <h3 className={`text-base sm:text-lg font-bold ${isDark ? "text-white" : "text-[#001829]"}`}>
                    {lang === 'mn' ? 'Одоогоор арга хэмжээ байхгүй байна.' : 'No upcoming events found.'}
                </h3>
                <p className={`text-xs sm:text-sm mt-1 ${isDark ? "text-white/40" : "text-slate-400"}`}>
                    {lang === 'mn' ? 'Та дараа дахин шалгана уу.' : 'Please check back later.'}
                </p>
            </div>
        )}

        {/* --- VIEW ALL BUTTON --- */}
        <motion.div 
           initial={{ opacity: 0 }}
           whileInView={{ opacity: 1 }}
           className="mt-16 sm:mt-24 flex justify-center"
        >
           <Link href="/events" className="group relative inline-flex items-center gap-4">
              <span className={`text-[10px] sm:text-xs font-black uppercase tracking-[0.25em] transition-colors
                 ${isDark ? "text-white/60 group-hover:text-white" : "text-slate-500 group-hover:text-[#001829]"}`}>
                  {lang === 'mn' ? 'Бүх арга хэмжээг харах' : 'View All Events'}
              </span>
              <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-[-45deg]
                 ${isDark 
                    ? "bg-[#00aeef] text-white shadow-[0_0_25px_rgba(0,174,239,0.4)]" 
                    : "bg-[#001829] text-white shadow-xl hover:shadow-2xl"}`}>
                 <ChevronRight size={16} className="sm:w-[18px] sm:h-[18px]" />
              </div>
           </Link>
        </motion.div>

      </div>
    </section>
  );
}