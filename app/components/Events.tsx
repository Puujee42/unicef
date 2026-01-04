"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  ArrowUpRight, 
  Clock,
  MapPin, 
  Droplets,
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

// --- OCEAN & SKY PALETTE ---
const BRAND = {
  sky: "#00aeef",       // Bright Cyan (Sky)
  ocean: "#005691",     // Rich Medium Blue (Ocean)
  deep: "#001829",      // Darkest Navy (Deep Sea)
  foam: "#e0f2fe",      // Very Pale Blue (Sea Foam)
  white: "#ffffff",     // Pure White
};

const CATEGORIES = [
  { id: 'all', en: 'All Events', mn: 'Бүгд' },
  { id: 'campaign', en: 'Campaigns', mn: 'Аяны Ажил' },
  { id: 'workshop', en: 'Workshops', mn: 'Сургалт' },
  { id: 'fundraiser', en: 'Fundraisers', mn: 'Хандив' },
];

const EVENTS = [
  {
    id: 1,
    category: 'campaign',
    featured: true, 
    image: "https://images.unsplash.com/photo-1544027993-37dbfe43562a?q=80&w=2070&auto=format&fit=crop",
    date: { d: "24", m: { en: "OCT", mn: "10 САР" } },
    title: { en: "Youth Leadership Summit 2025", mn: "Залуучуудын Манлайллын Чуулган" },
    location: { en: "Shangri-La, Ulaanbaatar", mn: "Шангри-Ла, Улаанбаатар" },
    time: "09:00 - 18:00",
    color: BRAND.sky // Sky Blue for Leadership
  },
  {
    id: 2,
    category: 'fundraiser',
    featured: false,
    image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=2070&auto=format&fit=crop",
    date: { d: "05", m: { en: "NOV", mn: "11 САР" } },
    title: { en: "Book Donation Drive", mn: "Номын Хандивын Аян" },
    location: { en: "MNUMS Campus", mn: "АШУҮИС Кампус" },
    time: "All Day",
    color: BRAND.white // White/Clean for Charity
  },
  {
    id: 3,
    category: 'workshop',
    featured: false,
    image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=2070&auto=format&fit=crop",
    date: { d: "12", m: { en: "NOV", mn: "11 САР" } },
    title: { en: "Mental Health Workshop", mn: "Сэтгэл Зүйн Эрүүл Мэнд" },
    location: { en: "Library Hall 404", mn: "Номын Сан 404" },
    time: "14:00 - 16:00",
    color: BRAND.ocean // Ocean Blue for Education
  },
  {
    id: 4,
    category: 'campaign',
    featured: true, 
    image: "https://images.unsplash.com/photo-1461301214746-1e790926d323?q=80&w=2070&auto=format&fit=crop",
    date: { d: "01", m: { en: "DEC", mn: "12 САР" } },
    title: { en: "Clean Air For Kids", mn: "Цэвэр Агаар - Хүүхдэд" },
    location: { en: "Sukhbaatar District", mn: "Сүхбаатар Дүүрэг" },
    time: "10:00 - 13:00",
    color: BRAND.sky // Sky Blue
  }
];

// --- 3D CARD COMPONENT ---
const EventCard = ({ event, lang }: any) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["7deg", "-7deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-7deg", "7deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`
        relative group rounded-[2rem] overflow-hidden cursor-pointer 
        border border-white/10 shadow-2xl
        ${event.featured ? "md:col-span-2 aspect-[16/9]" : "md:col-span-1 aspect-[4/5] md:aspect-auto h-full min-h-[400px]"}
      `}
    >
      {/* Background Image */}
      <div className="absolute inset-0 bg-[#001829]">
        <Image 
          src={event.image} 
          alt={event.title[lang]} 
          fill 
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        {/* Ocean Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#001829] via-[#002b49]/50 to-transparent opacity-80 group-hover:opacity-95 transition-opacity duration-300" />
        
        {/* Color Tint - Liquid Effect */}
        <div 
          className="absolute inset-0 opacity-0 group-hover:opacity-60 transition-opacity duration-700 mix-blend-soft-light bg-gradient-to-tr from-transparent via-transparent" 
          style={{ backgroundColor: event.color }} 
        />
      </div>

      {/* "Ice Cube" Date Stub */}
      <div className="absolute top-6 left-6 z-20 flex flex-col items-center justify-center bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl w-16 h-20 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] overflow-hidden group-hover:-translate-y-2 transition-transform duration-300">
        <div className="w-full h-1" style={{ backgroundColor: event.color === BRAND.white ? BRAND.sky : event.color }} />
        <span className="text-2xl font-black text-white mt-1 drop-shadow-md">{event.date.d}</span>
        <span className="text-[8px] font-bold text-white/80 uppercase tracking-widest mb-2">{event.date.m[lang]}</span>
      </div>

      {/* Location Badge */}
      <div className="absolute top-6 right-6 z-20 px-3 py-1.5 rounded-full bg-[#002b49]/40 backdrop-blur-md border border-white/10 flex items-center gap-1.5 shadow-lg">
         <MapPin size={12} style={{ color: event.color === BRAND.white ? BRAND.sky : event.color }} />
         <span className="text-[10px] font-bold text-white/90 uppercase tracking-wider">{event.location[lang]}</span>
      </div>

      {/* Content Area */}
      <div className="absolute bottom-0 left-0 w-full p-8 z-20 transform translate-z-10">
        <div className="transform transition-transform duration-500 group-hover:-translate-y-2">
           {/* Tags */}
           <div className="flex items-center gap-2 mb-3">
              <span 
                className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-white/90 border border-white/20 shadow-lg backdrop-blur-sm"
                style={{ 
                  backgroundColor: event.color === BRAND.white ? 'rgba(255,255,255,0.2)' : `${event.color}40`,
                }}
              >
                {event.category}
              </span>
              <span className="flex items-center gap-1 text-[10px] font-bold text-white/70 uppercase tracking-wider">
                <Clock size={12} className="text-sky-400" /> {event.time}
              </span>
           </div>

           {/* Title */}
           <h3 className="text-2xl md:text-3xl lg:text-4xl font-black text-white leading-[0.9] mb-2 drop-shadow-xl tracking-tight">
             {event.title[lang]}
           </h3>
        </div>

        {/* Reveal Interaction */}
        <div className="h-0 overflow-hidden group-hover:h-auto transition-all duration-500 opacity-0 group-hover:opacity-100">
           <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent my-3" />
           <div className="flex items-center gap-2 font-bold uppercase tracking-widest text-xs text-white">
              {lang === 'mn' ? 'Бүртгүүлэх' : 'Register Now'} 
              <span className="p-1 rounded-full bg-white/20">
                <ArrowUpRight size={14} />
              </span>
           </div>
        </div>
      </div>
    </motion.div>
  );
};

// --- MAIN COMPONENT ---
export default function EventsSection() {
  const { language: lang } = useLanguage();
  const [filter, setFilter] = useState("all");

  const filteredEvents = EVENTS.filter(ev => filter === 'all' || ev.category === filter);

  return (
    // Deep Ocean Background
    <section className="relative py-24 px-4 bg-[#001829] overflow-hidden">
      
      {/* Background Ambience (The "Sea" and "Sky") */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
         {/* Deep Ocean Gradient Base */}
         <div className="absolute inset-0 bg-gradient-to-b from-[#002B49] to-[#00101a]" />
         
         {/* Sky Blue Glow (Top Left - "Surface") */}
         <div className="absolute -top-20 -left-20 w-[600px] h-[600px] bg-[#00aeef] rounded-full blur-[150px] opacity-[0.15]" />
         
         {/* Ocean Blue Glow (Bottom Right - "Depth") */}
         <div className="absolute bottom-0 right-0 w-[800px] h-[800px] bg-[#005691] rounded-full blur-[180px] opacity-[0.1]" />
         
         {/* Water Surface Pattern */}
         <div className="absolute inset-0 opacity-[0.05]" 
              style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='1'/%3E%3C/g%3E%3C/svg%3E")` }} 
         />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
           <div>
              <motion.div 
                 initial={{ opacity: 0, x: -20 }}
                 whileInView={{ opacity: 1, x: 0 }}
                 viewport={{ once: true }}
                 className="flex items-center gap-3 mb-4"
              >
                 <div className="p-1.5 rounded-full bg-white/10 backdrop-blur-md">
                    <Droplets size={14} className="text-[#00aeef]" />
                 </div>
                 <span className="text-white/80 font-black uppercase tracking-[0.25em] text-xs">
                    {lang === 'mn' ? 'Хөтөлбөр' : 'Events Schedule'}
                 </span>
              </motion.div>
              
              <motion.h2 
                 initial={{ opacity: 0, y: 20 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true }}
                 transition={{ delay: 0.1 }}
                 className="text-5xl md:text-7xl font-black text-white tracking-tighter drop-shadow-2xl"
              >
                 {lang === 'mn' ? 'Арга Хэмжээ' : 'Upcoming Events'}
              </motion.h2>
           </div>

           {/* Ocean Glass Filter Tabs */}
           <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex flex-wrap gap-2 p-1 bg-white/5 border border-white/10 rounded-full backdrop-blur-xl shadow-2xl"
           >
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setFilter(cat.id)}
                  className="relative px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider transition-colors z-10"
                >
                  {filter === cat.id && (
                    <motion.div
                      layoutId="activeFilter"
                      className="absolute inset-0 bg-[#00aeef] rounded-full -z-10 shadow-[0_0_20px_rgba(0,174,239,0.4)]"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <span className={filter === cat.id ? "text-white" : "text-white/60 hover:text-white"}>
                    {cat[lang]}
                  </span>
                </button>
              ))}
           </motion.div>
        </div>

        {/* BENTO GRID */}
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr"
        >
          <AnimatePresence mode="popLayout">
            {filteredEvents.map((event) => (
              <EventCard key={event.id} event={event} lang={lang} />
            ))}
          </AnimatePresence>
        </motion.div>

        {/* VIEW ALL LINK */}
        <motion.div 
           initial={{ opacity: 0 }}
           whileInView={{ opacity: 1 }}
           className="mt-20 flex justify-center"
        >
           <Link href="/events" className="group flex items-center gap-4 text-white/70 hover:text-white transition-colors">
              <div className="relative">
                 {/* Ripple Button */}
                 <div className="w-16 h-16 rounded-full border border-white/20 flex items-center justify-center bg-white/5 group-hover:bg-[#00aeef] group-hover:border-[#00aeef] transition-all duration-300 z-10 relative backdrop-blur-sm">
                    <ArrowUpRight className="group-hover:rotate-45 transition-transform duration-300" />
                 </div>
                 {/* White Ring Animation */}
                 <div className="absolute inset-0 border border-white/30 rounded-full scale-100 group-hover:scale-125 opacity-100 group-hover:opacity-0 transition-all duration-500" />
              </div>
              <span className="text-sm font-bold uppercase tracking-[0.2em] shadow-black drop-shadow-lg">
                  {lang === 'mn' ? 'Бүх арга хэмжээг харах' : 'View All Events'}
              </span>
           </Link>
        </motion.div>

      </div>
    </section>
  );
}