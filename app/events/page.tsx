"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  ArrowUpRight, 
  Clock, 
  MapPin, 
  Droplets, 
  Search,
  Zap,
  History,
  Loader2,
  Filter,
  CalendarDays
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

const BRAND = {
  sky: "#00aeef",
  ocean: "#005691",
  deep: "#001829",
};

// Helper to map category to color
const getCategoryColor = (category: string) => {
    switch (category) {
        case 'campaign': return BRAND.sky;
        case 'fundraiser': return "#fbbf24"; // Gold
        case 'workshop': return BRAND.ocean;
        default: return BRAND.sky;
    }
};

const formatDateObject = (dateString: string, lang: 'en' | 'mn') => {
    const d = new Date(dateString);
    const day = d.getDate().toString();
    const month = d.toLocaleDateString(lang === 'mn' ? 'mn-MN' : 'en-US', { month: 'short' }).toUpperCase();
    return { d: day, m: month };
};

// --- 3D CARD COMPONENT ---
const EventCard = ({ event, lang, isDark }: any) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 15 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 15 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["5deg", "-5deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-5deg", "5deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => { x.set(0); y.set(0); };

  const color = getCategoryColor(event.category);
  const dateObj = formatDateObject(event.date, lang);
  const isPast = event.status === 'past';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`
        relative group rounded-[2.5rem] overflow-hidden cursor-pointer border transition-all duration-500
        ${event.featured ? "md:col-span-2 aspect-[16/9]" : "md:col-span-1 aspect-[4/5] md:aspect-auto h-full min-h-[450px]"}
        ${isDark 
            ? "bg-[#001d30] border-white/10 shadow-2xl" 
            : "bg-white border-slate-200 shadow-xl shadow-slate-200/50 hover:shadow-sky-100"
        }
      `}
    >
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image 
          src={event.image || "/logo.jpg"} 
          alt={event.title[lang] || event.title.en} 
          fill 
          className={`object-cover transition-transform duration-1000 group-hover:scale-110 
            ${isPast ? 'grayscale opacity-40' : 'opacity-90'}`}
        />
        {/* Overlay Gradients */}
        <div className={`absolute inset-0 bg-gradient-to-t via-transparent transition-opacity duration-300
           ${isDark 
              ? "from-[#001829] via-[#001829]/40 opacity-90 group-hover:opacity-95" 
              : "from-white via-white/20 opacity-80 group-hover:opacity-90"}`} 
        />
        <div className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-700 mix-blend-soft-light" 
             style={{ backgroundColor: color }} 
        />
      </div>

      {/* Date Stub */}
      <div className={`absolute top-6 left-6 z-20 flex flex-col items-center justify-center backdrop-blur-md border rounded-2xl w-16 h-20 shadow-xl transition-transform duration-500 group-hover:-translate-y-2
        ${isDark ? "bg-white/10 border-white/20" : "bg-white/90 border-slate-200 shadow-sm"}`}>
        <div className="w-full h-1 rounded-t-2xl" style={{ backgroundColor: isPast ? '#94a3b8' : color }} />
        <span className={`text-2xl font-black mt-1 ${isDark ? "text-white" : "text-slate-900"}`}>{dateObj.d}</span>
        <span className={`text-[9px] font-bold uppercase tracking-widest mb-2 ${isDark ? "text-white/60" : "text-slate-500"}`}>{dateObj.m}</span>
      </div>

      {/* Location */}
      <div className={`absolute top-6 right-6 z-20 px-3 py-1.5 rounded-full backdrop-blur-md border flex items-center gap-1.5 shadow-lg
        ${isDark ? "bg-[#002b49]/40 border-white/10" : "bg-white/80 border-slate-200"}`}>
         <MapPin size={12} style={{ color: color }} />
         <span className={`text-[10px] font-bold uppercase tracking-wider ${isDark ? "text-white/90" : "text-slate-700"}`}>
            {event.location[lang] || event.location.en}
         </span>
      </div>

      {/* Content */}
      <div className="absolute bottom-0 left-0 w-full p-8 z-20 transform translate-z-10">
        <div className="transform transition-transform duration-500 group-hover:-translate-y-4">
           <div className="flex items-center gap-3 mb-4">
              <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border backdrop-blur-sm
                ${isDark ? "text-white/90 border-white/20" : "text-slate-700 border-slate-200"}`}
                style={{ backgroundColor: isPast ? 'transparent' : `${color}30` }}
              >
                {event.category}
              </span>
              <span className={`flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider ${isDark ? "text-white/70" : "text-slate-500"}`}>
                <Clock size={12} className="text-[#00aeef]" /> {event.timeString}
              </span>
           </div>

           <h3 className={`text-3xl lg:text-4xl font-black leading-[0.95] mb-3 tracking-tight transition-colors
             ${isDark ? "text-white" : "text-slate-900 group-hover:text-[#00aeef]"}`}>
             {event.title[lang] || event.title.en}
           </h3>
        </div>

        {!isPast && (
            <div className="h-0 overflow-hidden group-hover:h-auto transition-all duration-500 opacity-0 group-hover:opacity-100">
               <div className={`w-full h-px my-6 ${isDark ? "bg-white/10" : "bg-slate-200"}`} />
               <Link href={`/events/${event._id}`} className="inline-flex items-center gap-3 group/btn">
                    <div className="w-10 h-10 rounded-full bg-[#00aeef] text-white flex items-center justify-center group-hover/btn:scale-110 transition-transform shadow-lg">
                        <ArrowUpRight size={18} />
                    </div>
                    <span className={`font-bold uppercase tracking-widest text-xs ${isDark ? "text-white" : "text-slate-900"}`}>
                        {lang === 'mn' ? 'Бүртгүүлэх' : 'Register Now'}
                    </span>
               </Link>
            </div>
        )}
      </div>
    </motion.div>
  );
};

// --- MAIN COMPONENT ---
export default function EventsSection() {
  const { language: lang } = useLanguage();
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  
  const [filter, setFilter] = useState("all");
  const [showPast, setShowPast] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => setMounted(true), []);
  const isDark = mounted && (theme === 'dark' || !theme);

  useEffect(() => {
    async function fetchData() {
        try {
            const res = await fetch('/api/admin/events'); 
            if (res.ok) {
                const data = await res.json();
                setEvents(data);
            }
        } catch (error) { console.error(error); } 
        finally { setLoading(false); }
    }
    if (mounted) fetchData();
  }, [mounted]);

  const filteredEvents = events.filter(ev => {
      const matchesCategory = filter === 'all' || ev.category === filter;
      const title = (ev.title[lang] || ev.title.en).toLowerCase();
      const matchesSearch = title.includes(searchQuery.toLowerCase());
      const isPast = new Date(ev.date) < new Date();
      return matchesCategory && matchesSearch && (showPast ? isPast : !isPast);
  });

  if (!mounted) return null;

  return (
    <section className={`relative py-24 px-4 overflow-hidden transition-colors duration-700 
      ${isDark ? "bg-[#00101a]" : "bg-slate-50"}`}>
      
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none z-0">
         <div className={`absolute top-0 left-0 w-full h-full transition-opacity duration-700
            ${isDark ? "opacity-100" : "opacity-30"}`}>
             <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-[#00aeef] rounded-full blur-[150px] opacity-[0.1]" />
             <div className="absolute bottom-0 right-0 w-[800px] h-[800px] bg-[#005691] rounded-full blur-[180px] opacity-[0.1]" />
         </div>
         <div className="absolute inset-0 opacity-[0.03] bg-[url('/noise.png')] mix-blend-overlay" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
           <div>
              <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="flex items-center gap-3 mb-4">
                 <div className={`p-2 rounded-full border shadow-sm ${isDark ? "bg-white/5 border-white/10" : "bg-white border-slate-200"}`}>
                    <CalendarDays size={16} className="text-[#00aeef]" />
                 </div>
                 <span className={`font-black uppercase tracking-[0.2em] text-xs ${isDark ? "text-white/60" : "text-slate-500"}`}>
                    {lang === 'mn' ? 'Хөтөлбөр' : 'Schedule'}
                 </span>
              </motion.div>
              
              <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className={`text-5xl md:text-7xl font-black tracking-tighter transition-colors ${isDark ? "text-white" : "text-[#001829]"}`}>
                 {lang === 'mn' ? 'Арга Хэмжээ' : 'Upcoming Events'}
              </motion.h2>
           </div>

           {/* Filter Tabs */}
           <div className={`flex flex-wrap gap-1 p-1.5 rounded-full border backdrop-blur-xl shadow-lg
             ${isDark ? "bg-[#001829]/50 border-white/10" : "bg-white border-slate-200"}`}>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setFilter(cat.id)}
                  className={`relative px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all z-10
                    ${filter === cat.id ? "text-white" : (isDark ? "text-white/40 hover:text-white" : "text-slate-400 hover:text-slate-900")}`}
                >
                  {filter === cat.id && (
                    <motion.div layoutId="activeF" className="absolute inset-0 bg-[#00aeef] rounded-full -z-10 shadow-md" transition={{ type: "spring", bounce: 0.2, duration: 0.6 }} />
                  )}
                  {cat[lang]}
                </button>
              ))}
           </div>
        </div>

        {/* CONTROL BAR */}
        <div className={`sticky top-24 z-30 mb-16 p-2 rounded-3xl border backdrop-blur-2xl flex flex-col md:flex-row items-center gap-4 transition-all duration-500
          ${isDark ? "bg-[#002b49]/60 border-white/10 shadow-2xl" : "bg-white/80 border-slate-200 shadow-xl shadow-slate-200/40"}`}>
           <div className="relative flex-1 w-full group">
              <Search className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${isDark ? "text-white/20" : "text-slate-400"}`} size={18} />
              <input 
                 type="text" 
                 placeholder={lang === 'mn' ? "Хайх..." : "Search events..."}
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 className={`w-full rounded-2xl py-3.5 pl-12 pr-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#00aeef]/50 transition-all
                   ${isDark ? "bg-black/20 text-white placeholder:text-white/20" : "bg-slate-50 text-slate-900 placeholder:text-slate-400"}`}
              />
           </div>

           <button 
              onClick={() => setShowPast(!showPast)}
              className={`px-6 py-3.5 rounded-2xl border flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all w-full md:w-auto justify-center
                 ${showPast 
                    ? "bg-[#00aeef] border-[#00aeef] text-white shadow-lg" 
                    : (isDark ? "bg-white/5 border-white/10 text-white/40 hover:text-white" : "bg-slate-50 border-slate-200 text-slate-400 hover:text-slate-900")}`
              }
           >
              <History size={16} />
              <span>{lang === 'mn' ? 'Түүх' : 'Archive'}</span>
           </button>
        </div>

        {/* GRID */}
        {loading ? (
             <div className="flex flex-col items-center justify-center py-40 gap-4">
                 <Loader2 className="animate-spin w-12 h-12 text-[#00aeef]" />
                 <p className={`text-[10px] font-black uppercase tracking-widest ${isDark ? "text-white/40" : "text-slate-400"}`}>Syncing Events...</p>
             </div>
        ) : (
            <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 auto-rows-fr">
            <AnimatePresence mode="popLayout">
                {filteredEvents.length > 0 ? (
                    filteredEvents.map((event) => (
                        <EventCard key={event._id} event={{...event, status: showPast ? 'past' : 'upcoming'}} lang={lang} isDark={isDark} />
                    ))
                ) : (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`col-span-full py-40 text-center rounded-[3rem] border border-dashed flex flex-col items-center justify-center ${isDark ? "border-white/10 bg-white/5" : "border-slate-200 bg-slate-50"}`}>
                        <div className="w-20 h-20 rounded-full bg-[#00aeef]/10 flex items-center justify-center mb-6">
                            <Filter size={32} className="text-[#00aeef]" />
                        </div>
                        <h3 className={`text-xl font-black mb-2 ${isDark ? "text-white" : "text-slate-900"}`}>No events found</h3>
                        <p className={`text-sm font-medium ${isDark ? "text-white/40" : "text-slate-500"}`}>Try adjusting your filters or search terms.</p>
                    </motion.div>
                )}
            </AnimatePresence>
            </motion.div>
        )}

        {/* PROPOSAL CTA */}
        <section className="mt-40">
           <div className={`relative rounded-[4rem] p-12 lg:p-24 overflow-hidden group shadow-2xl transition-colors duration-700
              ${isDark ? "bg-[#00aeef]" : "bg-[#001829]"}`}>
              <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000" />
              
              <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
                 <div className="max-w-2xl text-center lg:text-left">
                    <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full text-white text-[10px] font-black uppercase tracking-widest mb-8 border border-white/20">
                       <Zap size={14} className="fill-current" />
                       {lang === 'mn' ? 'Гишүүдийн Санаачилга' : 'Member Initiative'}
                    </div>
                    <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-[0.95] mb-8">
                       {lang === 'mn' ? 'Таны Санаачилга, Бидний Дэмжлэг' : 'Have an Idea? Host an Event.'}
                    </h2>
                    <p className="text-white/80 text-lg font-medium">
                       We support member-led initiatives. Pitch your campaign or workshop idea to the board and let's make it happen together.
                    </p>
                 </div>

                 <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                    <button className={`h-16 px-10 rounded-full font-black uppercase tracking-widest text-xs transition-all active:scale-95
                       ${isDark ? "bg-white text-[#001829] hover:shadow-xl" : "bg-[#00aeef] text-white hover:bg-sky-400"}`}>
                       {lang === 'mn' ? 'Санал Илгээх' : 'Submit Proposal'}
                    </button>
                    <button className="h-16 px-10 bg-white/10 text-white border border-white/20 rounded-full font-black uppercase tracking-widest text-xs hover:bg-white/20 transition-all">
                       {lang === 'mn' ? 'Холбоо Барих' : 'Contact Board'}
                    </button>
                 </div>
              </div>
           </div>
        </section>

      </div>
    </section>
  );
}