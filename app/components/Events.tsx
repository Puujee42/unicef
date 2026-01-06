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

// --- SUB-COMPONENT: 3D CARD ---
const EventCard = ({ event, lang }: any) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 15 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 15 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["7deg", "-7deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-7deg", "7deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
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
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative group rounded-[2.5rem] overflow-hidden cursor-pointer h-full min-h-[420px] border transition-all duration-500 bg-[#001829] border-[#00aeef]/20 shadow-[0_0_30px_-10px_rgba(0,0,0,0.8)]"
    >
      {/* IMAGE SECTION */}
      <div className="absolute inset-0 h-full w-full">
        {/* Placeholder Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#002b49] to-[#00101a]" />
        
        {/* Actual Image */}
        <Image 
          src={event.image || "/logo.jpg"} 
          alt={event.title[lang] || "Event"} 
          fill 
          className="object-cover transition-transform duration-700 group-hover:scale-110 opacity-90"
        />

        {/* Overlay Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t via-transparent to-transparent opacity-90 transition-opacity duration-300 from-[#00101a] via-[#001829]/60" />
        
        {/* Hover Color Tint */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-40 transition-opacity duration-500 mix-blend-overlay bg-[#00aeef]" />
      </div>

      {/* FLOATING DATE BADGE */}
      <div className="absolute top-6 left-6 z-20 flex flex-col items-center justify-center rounded-2xl w-14 h-16 border backdrop-blur-md shadow-lg transition-transform duration-300 group-hover:-translate-y-1 bg-white/10 border-white/20 text-white">
        <span className="text-xl font-black leading-none">{day}</span>
        <span className="text-[9px] font-bold uppercase tracking-widest opacity-80">{month}</span>
      </div>

      {/* CONTENT AREA */}
      <div className="absolute bottom-0 left-0 w-full p-8 z-20 transform translate-z-10 flex flex-col justify-end h-full pointer-events-none">
        <div className="transform transition-transform duration-500 group-hover:-translate-y-2 pointer-events-auto">
           
           {/* Tags & Location */}
           <div className="flex flex-wrap items-center gap-3 mb-3">
              <span className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border backdrop-blur-sm bg-[#00aeef]/10 border-[#00aeef]/30 text-[#00aeef]">
                {event.category}
              </span>
              <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-white/70">
                <MapPin size={12} className="text-[#00aeef]" /> 
                {event.location[lang] || event.location.en}
              </span>
           </div>

           {/* Title */}
           <h3 className="text-2xl lg:text-3xl font-black leading-[0.95] tracking-tight mb-2 line-clamp-2 transition-colors text-white">
             {event.title[lang] || event.title.en}
           </h3>
           
           <div className="text-xs font-bold flex items-center gap-2 mb-4 text-white/50">
              <Clock size={12} className="text-[#00aeef]" /> {event.timeString}
           </div>
        </div>

        {/* Hover Reveal Button */}
        <div className="h-0 overflow-hidden group-hover:h-auto transition-all duration-500 opacity-0 group-hover:opacity-100 pointer-events-auto">
           <div className="w-full h-[1px] mb-4 bg-white/20" />
           <Link href={`/events/${event._id}`} className="flex items-center gap-2 font-black uppercase tracking-widest text-[10px] transition-all hover:gap-4 text-white">
              {lang === 'mn' ? 'Дэлгэрэнгүй' : 'View Details'} 
              <span className="p-1 rounded-full bg-[#00aeef] text-white">
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
  const [mounted, setMounted] = useState(false);
  const [filter, setFilter] = useState("all");
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Hydration fix
  useEffect(() => setMounted(true), []);

  // --- API FETCH ---
  useEffect(() => {
    async function fetchData() {
        try {
            const res = await fetch('/api/admin/events'); 
            if (res.ok) {
                const data = await res.json();
                // Filter for upcoming events only
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

  // Filter Logic
  const filteredEvents = events.filter(ev => filter === 'all' || ev.category === filter);

  if (!mounted) return null;

  return (
    <section className="relative py-16 md:py-24 px-4 overflow-hidden transition-colors duration-700 bg-[#00101a]">
      
      {/* --- BACKGROUND AMBIENCE --- */}
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
         {/* Noise Texture */}
         <div className="absolute inset-0 opacity-[0.03] bg-[url('/noise.png')] mix-blend-overlay z-10" />
         
         {/* Blobs */}
         <div className="absolute -top-20 -right-20 w-[300px] md:w-[600px] h-[300px] md:h-[600px] rounded-full blur-[100px] md:blur-[150px] opacity-[0.1] transition-colors duration-700 bg-[#00aeef]" />
         <div className="absolute bottom-0 left-0 w-[250px] md:w-[500px] h-[250px] md:h-[500px] rounded-full blur-[100px] md:blur-[150px] opacity-[0.1] transition-colors duration-700 bg-[#005691]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        
        {/* --- HEADER --- */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 md:gap-8 mb-12 md:mb-16">
           <div>
              <motion.div 
                 initial={{ opacity: 0, x: -20 }}
                 whileInView={{ opacity: 1, x: 0 }}
                 viewport={{ once: true }}
                 className="flex items-center gap-3 mb-4"
              >
                 <div className="p-2 rounded-full border shadow-sm bg-white/5 border-white/10">
                    <CalendarDays size={14} className="text-[#00aeef]" />
                 </div>
                 <span className="font-black uppercase tracking-[0.25em] text-[10px] text-white/60">
                    {lang === 'mn' ? 'Хөтөлбөр' : 'Schedule'}
                 </span>
              </motion.div>
              
              <motion.h2 
                 initial={{ opacity: 0, y: 20 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true }}
                 className="text-3xl md:text-6xl lg:text-7xl font-black tracking-tighter leading-[0.9] text-white"
              >
                 {lang === 'mn' ? 'Арга Хэмжээ' : 'Upcoming Events'}
                 <span className="text-[#00aeef]">.</span>
              </motion.h2>
           </div>

           {/* --- FILTER TABS --- */}
           <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex flex-wrap gap-1 p-1.5 rounded-[2rem] md:rounded-full border backdrop-blur-xl shadow-lg bg-[#001829]/50 border-white/10 overflow-x-auto no-scrollbar"
           >
              {CATEGORIES.map((cat) => {
                const isActive = filter === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setFilter(cat.id)}
                    className={`relative px-4 md:px-6 py-2 md:py-2.5 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all z-10 whitespace-nowrap
                       ${isActive 
                         ? "text-white" 
                         : "text-white/40 hover:text-white"}
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
            <div className="flex flex-col items-center justify-center py-24 md:py-40 gap-4">
                <Loader2 className="animate-spin w-10 h-10 md:w-12 md:h-12 text-[#00aeef]" />
                <p className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-white/40">
                   {lang === 'mn' ? 'Уншиж байна...' : 'Loading events...'}
                </p>
            </div>
        ) : filteredEvents.length > 0 ? (
            <motion.div 
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 auto-rows-fr"
            >
            <AnimatePresence mode="popLayout">
                {filteredEvents.map((event) => (
                    <div key={event._id} className="h-full min-h-[380px] md:min-h-[420px]">
                        <EventCard event={event} lang={lang} />
                    </div>
                ))}
            </AnimatePresence>
            </motion.div>
        ) : (
            <div className="flex flex-col items-center justify-center py-20 md:py-40 border-2 border-dashed rounded-[2rem] md:rounded-[3rem] border-white/5 bg-white/5">
                <div className="p-4 rounded-full bg-[#00aeef]/10 mb-4">
                    <Filter className="text-[#00aeef] w-6 h-6 md:w-8 md:h-8" />
                </div>
                <h3 className="text-base md:text-lg font-bold text-white">
                    {lang === 'mn' ? 'Одоогоор арга хэмжээ байхгүй байна.' : 'No upcoming events found.'}
                </h3>
                <p className="text-[10px] md:text-sm mt-1 text-white/40 text-center px-4">
                    {lang === 'mn' ? 'Та дараа дахин шалгана уу.' : 'Please check back later.'}
                </p>
            </div>
        )}

        {/* --- VIEW ALL BUTTON --- */}
        <motion.div 
           initial={{ opacity: 0 }}
           whileInView={{ opacity: 1 }}
           className="mt-16 md:mt-24 flex justify-center"
        >
           <Link href="/events" className="group relative inline-flex items-center gap-4">
              <span className="text-[10px] font-black uppercase tracking-[0.25em] transition-colors text-white/60 group-hover:text-white">
                  {lang === 'mn' ? 'Бүх арга хэмжээг харах' : 'View All Events'}
              </span>
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-[-45deg] bg-[#00aeef] text-white shadow-[0_0_25px_rgba(0,174,239,0.4)]">
                 <ChevronRight className="w-4 h-4 md:w-[18px] md:h-[18px]" />
              </div>
           </Link>
        </motion.div>

      </div>
    </section>
  );
}