"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  ArrowUpRight, 
  Clock, 
  MapPin, 
  Calendar as CalendarIcon, 
  Search, 
  Filter, 
  ChevronDown,
  Sparkles,
  Zap
} from "lucide-react";
import { 
  motion, 
  useMotionValue, 
  useSpring, 
  useTransform, 
  AnimatePresence, 
  useScroll 
} from "framer-motion";
import { useLanguage } from "../context/LanguageContext";

// --- BRAND PALETTE ---
const BRAND = {
  sky: "#00aeef",
  ocean: "#005691",
  deep: "#001829",
  white: "#ffffff",
  gold: "#fbbf24",
};

// --- CONTENT ---
const CATEGORIES = [
  { id: 'all', en: 'All Events', mn: 'Бүгд' },
  { id: 'campaign', en: 'Campaigns', mn: 'Аяны Ажил' },
  { id: 'workshop', en: 'Education', mn: 'Сургалт' },
  { id: 'fundraiser', en: 'Charity', mn: 'Хандив' },
];

const EVENTS = [
  {
    id: 1,
    category: 'campaign',
    featured: true, 
    status: 'upcoming',
    image: "https://images.unsplash.com/photo-1544027993-37dbfe43562a?q=80&w=2070&auto=format&fit=crop",
    date: { d: "24", m: { en: "OCT", mn: "10 САР" } },
    title: { en: "Youth Leadership Summit 2025", mn: "Залуучуудын Манлайллын Чуулган" },
    location: { en: "Shangri-La, Ulaanbaatar", mn: "Шангри-Ла, Улаанбаатар" },
    time: "09:00 - 18:00",
    color: BRAND.sky 
  },
  {
    id: 2,
    category: 'fundraiser',
    featured: false,
    status: 'upcoming',
    image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=2070&auto=format&fit=crop",
    date: { d: "05", m: { en: "NOV", mn: "11 САР" } },
    title: { en: "Book Donation Drive", mn: "Номын Хандивын Аян" },
    location: { en: "MNUMS Campus", mn: "АШУҮИС Кампус" },
    time: "All Day",
    color: BRAND.gold 
  },
  {
    id: 3,
    category: 'workshop',
    featured: false,
    status: 'upcoming',
    image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=2070&auto=format&fit=crop",
    date: { d: "12", m: { en: "NOV", mn: "11 САР" } },
    title: { en: "Mental Health Workshop", mn: "Сэтгэл Зүйн Эрүүл Мэнд" },
    location: { en: "Library Hall 404", mn: "Номын Сан 404" },
    time: "14:00 - 16:00",
    color: BRAND.ocean 
  },
  {
    id: 4,
    category: 'campaign',
    featured: true, 
    status: 'upcoming',
    image: "https://images.unsplash.com/photo-1461301214746-1e790926d323?q=80&w=2070&auto=format&fit=crop",
    date: { d: "01", m: { en: "DEC", mn: "12 САР" } },
    title: { en: "Clean Air For Kids", mn: "Цэвэр Агаар - Хүүхдэд" },
    location: { en: "Sukhbaatar District", mn: "Сүхбаатар Дүүрэг" },
    time: "10:00 - 13:00",
    color: BRAND.sky 
  },
  // Past Events for filtering logic
  {
    id: 5,
    category: 'workshop',
    featured: false, 
    status: 'past',
    image: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=2070&auto=format&fit=crop",
    date: { d: "10", m: { en: "SEP", mn: "9 САР" } },
    title: { en: "Student Orientation", mn: "Оюутны Танилцуулга" },
    location: { en: "Main Hall", mn: "Төв Танхим" },
    time: "10:00",
    color: BRAND.ocean 
  }
];

// --- 3D TILT CARD COMPONENT ---
const EventCard = ({ event, lang }: any) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["5deg", "-5deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-5deg", "5deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => { x.set(0); y.set(0); };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4 }}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`
        relative group rounded-[2rem] overflow-hidden cursor-pointer 
        border border-white/10 shadow-2xl bg-[#001d30]
        ${event.featured ? "md:col-span-2 aspect-[16/9]" : "md:col-span-1 aspect-[4/5] md:aspect-auto h-full min-h-[420px]"}
      `}
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image 
          src={event.image} 
          alt={event.title[lang]} 
          fill 
          className={`object-cover transition-transform duration-700 group-hover:scale-105 ${event.status === 'past' ? 'grayscale opacity-50' : ''}`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#001829] via-[#001829]/60 to-transparent opacity-90 group-hover:opacity-95 transition-opacity duration-300" />
        <div 
          className="absolute inset-0 opacity-0 group-hover:opacity-40 transition-opacity duration-500 mix-blend-color-dodge" 
          style={{ backgroundColor: event.color }} 
        />
      </div>

      {/* Date Stub */}
      <div className="absolute top-6 left-6 z-20 flex flex-col items-center justify-center bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl w-16 h-20 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] overflow-hidden group-hover:-translate-y-2 transition-transform duration-300">
        <div className="w-full h-1" style={{ backgroundColor: event.color }} />
        <span className="text-2xl font-black text-white mt-1 drop-shadow-md">{event.date.d}</span>
        <span className="text-[8px] font-bold text-white/80 uppercase tracking-widest mb-2">{event.date.m[lang]}</span>
      </div>

      {/* Status Badge */}
      {event.status === 'past' && (
         <div className="absolute top-6 right-6 z-20 px-3 py-1 bg-black/50 backdrop-blur-md rounded-full border border-white/10 text-white/60 text-xs font-bold uppercase tracking-widest">
            {lang === 'mn' ? 'Өнгөрсөн' : 'Past Event'}
         </div>
      )}

      {/* Content Area */}
      <div className="absolute bottom-0 left-0 w-full p-8 z-20 transform translate-z-10">
        <div className="transform transition-transform duration-500 group-hover:-translate-y-2">
           <div className="flex items-center gap-2 mb-3">
              <span 
                className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-white/90 border border-white/20 shadow-lg backdrop-blur-sm"
                style={{ backgroundColor: `${event.color}40` }}
              >
                {event.category}
              </span>
              <span className="flex items-center gap-1 text-[10px] font-bold text-white/70 uppercase tracking-wider">
                <Clock size={12} className="text-sky-400" /> {event.time}
              </span>
           </div>

           <h3 className="text-2xl md:text-3xl lg:text-4xl font-black text-white leading-[0.9] mb-2 drop-shadow-xl tracking-tight">
             {event.title[lang]}
           </h3>
           
           <div className="flex items-center gap-2 text-white/60 text-xs font-bold uppercase tracking-wider mt-2">
              <MapPin size={12} /> {event.location[lang]}
           </div>
        </div>

        {/* Reveal Button */}
        {event.status !== 'past' && (
            <div className="h-0 overflow-hidden group-hover:h-auto transition-all duration-500 opacity-0 group-hover:opacity-100">
            <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent my-4" />
            <Link href={`/events/${event.id}`} className="flex items-center gap-2 font-bold uppercase tracking-widest text-xs text-white group/btn">
                {lang === 'mn' ? 'Бүртгүүлэх' : 'Register Now'} 
                <span className="p-1 rounded-full bg-white/20 group-hover/btn:bg-[#00aeef] transition-colors">
                    <ArrowUpRight size={14} />
                </span>
            </Link>
            </div>
        )}
      </div>
    </motion.div>
  );
};

// --- MAIN PAGE ---
export default function EventsPage() {
  const { language: lang } = useLanguage();
  const [filter, setFilter] = useState("all");
  const [showPast, setShowPast] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Filtering Logic
  const filteredEvents = EVENTS.filter(ev => {
    const matchesCategory = filter === 'all' || ev.category === filter;
    const matchesStatus = showPast ? true : ev.status === 'upcoming';
    const matchesSearch = ev.title[lang].toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesStatus && matchesSearch;
  });

  const upcomingCount = EVENTS.filter(e => e.status === 'upcoming').length;

  return (
    <main className="relative min-h-screen bg-[#001829] text-white pt-24 overflow-hidden">
      
      {/* 1. ATMOSPHERIC BACKGROUND */}
      <div className="absolute inset-0 pointer-events-none fixed">
         <div className="absolute -top-40 -left-40 w-[900px] h-[900px] bg-[#00aeef] rounded-full blur-[250px] opacity-[0.08]" />
         <div className="absolute top-1/2 right-0 w-[600px] h-[600px] bg-[#005691] rounded-full blur-[200px] opacity-[0.1]" />
         <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay" />
         <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:6rem_6rem]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        
        {/* 2. HERO HEADER */}
        <section className="py-12 mb-8 relative">
           <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.6 }}
             className="text-center max-w-3xl mx-auto"
           >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6 backdrop-blur-md">
                 <div className="w-2 h-2 rounded-full bg-[#00aeef] animate-pulse" />
                 <span className="text-[#00aeef] text-xs font-black uppercase tracking-[0.2em]">
                    {upcomingCount} {lang === 'mn' ? 'Удахгүй болох арга хэмжээ' : 'Upcoming Events'}
                 </span>
              </div>
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-white/50 mb-6 drop-shadow-sm">
                 {lang === 'mn' ? 'АРГА ХЭМЖЭЭ' : 'IMPACT EVENTS'}
              </h1>
              <p className="text-white/60 text-lg font-medium max-w-2xl mx-auto">
                 {lang === 'mn' 
                   ? 'Манай клубын зохион байгуулж буй кампанит ажил, сургалт, хандивын аянуудад нэгдээрэй.' 
                   : 'Join our campaigns, workshops, and fundraisers. Be part of the movement making big differences.'}
              </p>
           </motion.div>
        </section>

        {/* 3. CONTROL BAR (Filter & Search) */}
        <section className="sticky top-24 z-30 mb-16">
           <motion.div 
             layout
             className="bg-[#002b49]/60 backdrop-blur-xl border border-white/10 p-2 rounded-2xl flex flex-col md:flex-row items-center gap-4 shadow-2xl"
           >
              {/* Category Tabs */}
              <div className="flex p-1 bg-black/20 rounded-xl overflow-x-auto w-full md:w-auto no-scrollbar">
                 {CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setFilter(cat.id)}
                      className="relative px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap"
                    >
                      {filter === cat.id && (
                        <motion.div
                          layoutId="filterPill"
                          className="absolute inset-0 bg-[#00aeef] rounded-lg shadow-lg shadow-[#00aeef]/30"
                          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        />
                      )}
                      <span className={`relative z-10 ${filter === cat.id ? "text-white" : "text-white/60 hover:text-white"}`}>
                        {cat[lang]}
                      </span>
                    </button>
                 ))}
              </div>

              {/* Search Bar */}
              <div className="relative flex-1 w-full group">
                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-[#00aeef] transition-colors" size={18} />
                 <input 
                    type="text" 
                    placeholder={lang === 'mn' ? "Хайх..." : "Search events..."}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-black/20 border border-white/5 rounded-xl py-3 pl-12 pr-4 text-white text-sm focus:outline-none focus:bg-black/40 focus:border-[#00aeef]/50 transition-all placeholder:text-white/20"
                 />
              </div>

              {/* Past Events Toggle */}
              <button 
                 onClick={() => setShowPast(!showPast)}
                 className={`px-4 py-3 rounded-xl border flex items-center gap-2 text-xs font-bold uppercase tracking-wide transition-all w-full md:w-auto justify-center
                    ${showPast 
                       ? "bg-white/10 border-white/30 text-white" 
                       : "bg-transparent border-white/5 text-white/40 hover:text-white hover:bg-white/5"}`
                 }
              >
                 <Clock size={16} />
                 <span>{lang === 'mn' ? 'Түүх' : 'Archive'}</span>
              </button>
           </motion.div>
        </section>

        {/* 4. EVENTS GRID */}
        <section className="min-h-[50vh]">
           <motion.div 
             layout
             className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 auto-rows-fr"
           >
             <AnimatePresence mode="popLayout">
               {filteredEvents.length > 0 ? (
                 filteredEvents.map((event) => (
                   <EventCard key={event.id} event={event} lang={lang} />
                 ))
               ) : (
                 <motion.div 
                   initial={{ opacity: 0 }} 
                   animate={{ opacity: 1 }} 
                   className="col-span-full flex flex-col items-center justify-center py-20 text-center"
                 >
                    <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-4">
                        <Filter size={32} className="text-white/20" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">No events found</h3>
                    <p className="text-white/50">Try adjusting your filters or search query.</p>
                 </motion.div>
               )}
             </AnimatePresence>
           </motion.div>
        </section>

        {/* 5. NEWSLETTER / HOST EVENT CTA */}
        <section className="py-32">
           <div className="relative rounded-[3rem] bg-gradient-to-r from-[#001d30] to-[#00101a] border border-white/10 p-12 lg:p-24 text-center overflow-hidden">
              {/* Bg Effects */}
              <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#00aeef] rounded-full blur-[200px] opacity-[0.1]" />
              <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.05]" />

              <div className="relative z-10 max-w-3xl mx-auto space-y-8">
                 <div className="w-16 h-16 bg-[#00aeef] rounded-2xl mx-auto flex items-center justify-center shadow-lg shadow-[#00aeef]/40 rotate-12 mb-8">
                    <Zap size={32} className="text-white fill-white" />
                 </div>
                 
                 <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-[0.95]">
                    {lang === 'mn' ? 'Таны Санаачилга Хэрэгтэй' : 'Have an Idea? Host an Event.'}
                 </h2>
                 <p className="text-white/60 text-xl">
                    {lang === 'mn' 
                      ? 'Бид гишүүдийнхээ шинэ санаа, санаачилгыг үргэлж дэмждэг. Төслөө танилцуулаарай.'
                      : 'We support member-led initiatives. Pitch your campaign or workshop idea to the board.'}
                 </p>
                 <div className="flex flex-wrap justify-center gap-4">
                    <button className="px-8 py-4 bg-white text-[#001829] font-black uppercase tracking-widest text-xs rounded-full hover:bg-[#00aeef] hover:text-white transition-colors shadow-xl">
                       {lang === 'mn' ? 'Санал Илгээх' : 'Submit Proposal'}
                    </button>
                    <button className="px-8 py-4 border border-white/20 text-white font-black uppercase tracking-widest text-xs rounded-full hover:bg-white/10 transition-colors">
                       {lang === 'mn' ? 'Холбоо Барих' : 'Contact Us'}
                    </button>
                 </div>
              </div>
           </div>
        </section>

      </div>
    </main>
  );
}