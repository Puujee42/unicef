"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { 
  ArrowRight, 
  Heart, 
  Users, 
  Globe, 
  Megaphone, 
  FileText,
  Sparkles,
  Target
} from "lucide-react";
import { 
  motion, 
  useMotionTemplate, 
  useMotionValue, 
  useSpring, 
  useTransform 
} from "framer-motion";
import { useLanguage } from "../context/LanguageContext";
import { useTheme } from "next-themes";

// --- BRAND COLORS ---
const BRAND = {
  sky: "#00aeef",
  ocean: "#005691",
  deep: "#001829",
  gold: "#fbbf24",
  white: "#ffffff",
};

// --- DATA ---
const TEXTS = {
  headline: { en: "Small Actions", mn: "Жижиг Үйлдэл" },
  highlight: { en: "Big Differences", mn: "Том Өөрчлөлт" },
  description: { 
    en: "MNUMS Student UNICEF Club represents a bright future for every child. We advocate for rights, equality, and inclusive education through student-led initiatives.",
    mn: "АШУҮИС-ийн Оюутны UNICEF Клуб нь хүүхэд бүрийн гэрэлт ирээдүйн төлөө. Бид оюутан залуусын санаачилгаар тэгш байдал, хүртээмжтэй нийгмийг бүтээнэ."
  },
  stats: [
    { label: { en: "Est.", mn: "Байгуулагдсан" }, value: "2025" },
    { label: { en: "University", mn: "Сургууль" }, value: "MNUMS" },
    { label: { en: "Status", mn: "Төлөв" }, value: "Active" },
  ],
  weStandFor: { en: "Our Mission:", mn: "Бидний Эрхэм Зорилго:" }
};

const TYPEWRITER_WORDS = [
  { text: "Bright Future", mnText: "Гэрэлт Ирээдүй", color: BRAND.gold }, 
  { text: "Child Rights", mnText: "Хүүхдийн Эрх", color: BRAND.sky },
  { text: "Gender Equality", mnText: "Жендэрийн Тэгш Байдал", color: "#f472b6" }, 
  { text: "Inclusive Education", mnText: "Тэгш Боловсрол", color: "#4ade80" } 
];

const ACTIVITY_CARDS = [
  {
    id: 1,
    icon: Megaphone,
    title: { en: "Campaigns", mn: "Аяны Ажил" },
    desc: { en: "Social psychology & awareness drives.", mn: "Нийгмийн сэтгэл зүйд нөлөөлөх ажил." },
    color: "bg-sky-500",
    glow: "shadow-sky-500/50"
  },
  {
    id: 2,
    icon: Users,
    title: { en: "Training", mn: "Сургалт" },
    desc: { en: "Lectures on gender & rights.", mn: "Жендэрийн мэдрэмжтэй сургалт, лекц." },
    color: "bg-indigo-500",
    glow: "shadow-indigo-500/50"
  },
  {
    id: 3,
    icon: FileText,
    title: { en: "Reporting", mn: "Тайлагнал" },
    desc: { en: "Annual transparent reporting.", mn: "Жил бүр клубын үйл ажиллагааг тайлагнах." },
    color: "bg-teal-500",
    glow: "shadow-teal-500/50"
  }
];

// --- SUB-COMPONENTS ---

// 1. Enhanced Typewriter
const Typewriter = ({ lang }: { lang: 'en' | 'mn' }) => {
  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [reverse, setReverse] = useState(false);
  const [blink, setBlink] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => setBlink(!blink), 500);
    return () => clearTimeout(timeout);
  }, [blink]);

  useEffect(() => {
    const currentWord = lang === 'mn' ? TYPEWRITER_WORDS[index].mnText : TYPEWRITER_WORDS[index].text;
    if (subIndex === currentWord.length + 1 && !reverse) {
      setTimeout(() => setReverse(true), 2500); return;
    }
    if (subIndex === 0 && reverse) {
      setReverse(false);
      setIndex((prev) => (prev + 1) % TYPEWRITER_WORDS.length);
      return;
    }
    const timeout = setTimeout(() => {
      setSubIndex((prev) => prev + (reverse ? -1 : 1));
    }, reverse ? 75 : 150);
    return () => clearTimeout(timeout);
  }, [subIndex, index, reverse, lang]);

  return (
    <div className="flex items-center">
      <span className="text-3xl md:text-4xl font-black tracking-tight drop-shadow-lg" style={{ color: TYPEWRITER_WORDS[index].color }}>
        {(lang === 'mn' ? TYPEWRITER_WORDS[index].mnText : TYPEWRITER_WORDS[index].text).substring(0, subIndex)}
      </span>
      <motion.span
        animate={{ opacity: [0, 1, 0] }}
        transition={{ repeat: Infinity, duration: 0.8 }}
        className="w-[4px] h-[1em] bg-current ml-2 rounded-full"
      />
    </div>
  );
};

// 2. 3D Tilt Card Container
const TiltCard = ({ children }: { children: React.ReactNode }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    x.set(mouseX / width - 0.5);
    y.set(mouseY / height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative z-10 w-full perspective-1000"
    >
      {children}
    </motion.div>
  );
};

// 3. Info List Item
const InfoCard = ({ data, lang, index, isDark }: any) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.8 + index * 0.1 }}
      className={`group flex items-center gap-5 p-4 rounded-2xl border backdrop-blur-md transition-all cursor-default transform translate-z-10 shadow-lg 
        ${isDark 
           ? "bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/20" 
           : "bg-white/60 border-slate-200/60 hover:bg-white hover:border-sky-200 shadow-slate-200/50"}`}
    >
      <div className={`w-14 h-14 rounded-xl ${data.color} flex items-center justify-center text-white shadow-lg ${data.glow} group-hover:scale-110 transition-transform duration-300`}>
        <data.icon size={26} strokeWidth={2.5} />
      </div>
      <div>
        <h4 className={`font-bold text-sm uppercase tracking-wide group-hover:text-[#00aeef] transition-colors ${isDark ? 'text-white' : 'text-slate-800'}`}>
           {data.title[lang]}
        </h4>
        <p className={`text-xs mt-1 leading-snug font-medium max-w-[200px] ${isDark ? 'text-white/60' : 'text-slate-600'}`}>
           {data.desc[lang]}
        </p>
      </div>
    </motion.div>
  );
};

// --- MAIN HERO ---
export default function Hero() {
  const { language: lang } = useLanguage();
  const { theme } = useTheme();

  // Handle Hydration mismatch by mounting check
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  
  const isDark = mounted && (theme === 'dark' || !theme);
  
  // Spotlight
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // FIX: Call useMotionTemplate at the top level, BEFORE any return statements
  const spotlightBg = useMotionTemplate`radial-gradient(800px circle at ${mouseX}px ${mouseY}px, ${BRAND.sky}, transparent 80%)`;

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  // Prevent flash of unstyled content
  if (!mounted) return null;

  return (
    <section 
      className={`relative w-full min-h-screen overflow-hidden flex items-center transition-colors duration-700
         ${isDark ? 'bg-[#001829]' : 'bg-[#f0f9ff]'}`}
      onMouseMove={handleMouseMove}
    >
      {/* 1. ATMOSPHERE BACKGROUND */}
      <div className="absolute inset-0 z-0">
         {/* Theme Specific Gradient */}
         <div className={`absolute inset-0 bg-gradient-to-br transition-colors duration-700
            ${isDark ? "from-[#001829] via-[#002b49] to-[#00101a]" : "from-[#f0f9ff] via-[#e0f2fe] to-white"}`} 
         />
         
         {/* Mouse Follow Spotlight - Uses the pre-defined template variable */}
         <motion.div
            className="absolute inset-0 opacity-30 mix-blend-soft-light"
            style={{
              background: spotlightBg,
            }}
         />

         {/* Floating Particles (CSS Animation) */}
         <div className="absolute inset-0 opacity-20 pointer-events-none">
            <div className={`absolute top-1/4 left-1/4 w-2 h-2 rounded-full animate-pulse ${isDark ? 'bg-white' : 'bg-sky-400'}`} style={{ animationDuration: '3s' }} />
            <div className="absolute top-3/4 right-1/4 w-3 h-3 bg-[#00aeef] rounded-full animate-pulse" style={{ animationDuration: '5s' }} />
            <div className="absolute top-1/2 left-3/4 w-1 h-1 bg-[#fbbf24] rounded-full animate-pulse" style={{ animationDuration: '4s' }} />
         </div>

         {/* Glows */}
         <div className={`absolute -top-[20%] -left-[10%] w-[800px] h-[800px] rounded-full blur-[200px] transition-opacity
            ${isDark ? 'bg-[#00aeef] opacity-[0.1]' : 'bg-[#00aeef] opacity-[0.05]'}`} />
         <div className={`absolute -bottom-[20%] -right-[10%] w-[800px] h-[800px] rounded-full blur-[200px] transition-opacity
            ${isDark ? 'bg-[#005691] opacity-[0.15]' : 'bg-[#bae6fd] opacity-[0.3]'}`} />
         
         {/* Noise Overlay */}
         <div className="absolute inset-0 opacity-[0.03] bg-[url('/noise.png')] mix-blend-overlay" />
      </div>

      {/* 2. CONTENT GRID */}
      <div className="relative z-10 max-w-7xl mx-auto w-full px-6 sm:px-8 lg:px-10 grid lg:grid-cols-2 gap-16 lg:gap-24 items-center pt-24 pb-32">
        
        {/* --- LEFT: NARRATIVE --- */}
        <div className="flex flex-col justify-center">
          
          {/* Badge */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-3 mb-8"
          >
             <div className={`px-4 py-1.5 rounded-full border backdrop-blur-md flex items-center gap-2 transition-colors
                ${isDark 
                   ? "bg-[#00aeef]/10 border-[#00aeef]/30" 
                   : "bg-white/60 border-sky-200 shadow-sm"}`}>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00aeef] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00aeef]"></span>
                </span>
                <span className="text-[#00aeef] font-black text-[10px] uppercase tracking-[0.2em]">
                  Est. 2025
                </span>
             </div>
             <span className={`text-xs font-bold uppercase tracking-widest ${isDark ? 'text-white/40' : 'text-slate-500'}`}>
               MNUMS Student Club
             </span>
          </motion.div>

          {/* Staggered Headline */}
          <div className="mb-6 overflow-hidden">
            <motion.h1 
               initial={{ opacity: 0, y: 50 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.3, duration: 0.8 }}
               className={`text-6xl md:text-7xl lg:text-8xl font-black leading-[0.9] tracking-tighter ${isDark ? 'text-white' : 'text-slate-900'}`}
            >
              {TEXTS.headline[lang]} <br />
              <span className={`text-transparent bg-clip-text bg-gradient-to-r drop-shadow-sm 
                 ${isDark ? "from-[#00aeef] via-[#38bdf8] to-[#0077a3]" : "from-[#00aeef] to-[#005691]"}`}>
                {TEXTS.highlight[lang]}
              </span>
            </motion.h1>
          </div>

          {/* Typewriter Mission */}
          <motion.div 
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             transition={{ delay: 0.5 }}
             className="mb-10 flex flex-col items-start gap-2 h-14"
          >
             <span className={`font-bold uppercase tracking-widest text-xs flex items-center gap-2 ${isDark ? 'text-white/50' : 'text-slate-500'}`}>
                 <Target size={14} /> {TEXTS.weStandFor[lang]}
             </span>
             <Typewriter lang={lang} />
          </motion.div>

          {/* Description */}
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className={`text-lg leading-relaxed max-w-lg mb-10 font-medium ${isDark ? 'text-white/70' : 'text-slate-600'}`}
          >
            {TEXTS.description[lang]}
          </motion.p>

          {/* Stats Bar */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
            className={`flex gap-10 mb-12 border-l-4 pl-6 ${isDark ? 'border-[#00aeef]' : 'border-sky-300'}`}
          >
            {TEXTS.stats.map((stat, i) => (
              <div key={i}>
                 <p className="text-[#00aeef] text-[10px] uppercase font-black tracking-widest mb-1">{stat.label[lang]}</p>
                 <p className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{stat.value}</p>
              </div>
            ))}
          </motion.div>

          {/* Actions */}
          <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.8 }}
             className="flex flex-wrap gap-4"
          >
             <Link href="/join" className={`group relative px-8 py-4 text-white font-bold rounded-full overflow-hidden transition-all shadow-lg hover:shadow-xl hover:scale-105
                ${isDark 
                  ? "bg-[#00aeef] hover:bg-[#009bd5] shadow-[#00aeef]/40" 
                  : "bg-[#00aeef] hover:bg-[#009bd5] shadow-sky-300"}`}
             >
                <span className="relative z-10 flex items-center gap-3 uppercase tracking-wide text-xs">
                   <Heart size={18} className="fill-white" />
                   {lang === 'mn' ? 'Бидэнтэй Нэгдэх' : 'Join the Club'}
                </span>
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
             </Link>
             
             <button className={`group px-8 py-4 border font-bold rounded-full backdrop-blur-md uppercase tracking-wide text-xs flex items-center gap-2 transition-all hover:shadow-lg
                ${isDark 
                  ? "border-white/10 bg-white/5 text-white hover:bg-white/10 hover:border-white/30" 
                  : "border-slate-200 bg-white/50 text-slate-700 hover:bg-white hover:border-sky-200"}`}
             >
                {lang === 'mn' ? 'Дэлгэрэнгүй' : 'Learn More'}
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
             </button>
          </motion.div>
        </div>

        {/* --- RIGHT: 3D MISSION CONTROL --- */}
        <div className="relative">
           <TiltCard>
             <motion.div 
                initial={{ opacity: 0, scale: 0.8, rotateY: 30 }}
                animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                transition={{ delay: 0.5, duration: 1, type: "spring" }}
                className={`relative z-10 backdrop-blur-2xl border rounded-[2.5rem] p-8 lg:p-10 shadow-2xl transition-colors duration-500
                   ${isDark 
                     ? "bg-[#001d30]/70 border-white/10 shadow-black/60" 
                     : "bg-white/60 border-white/40 shadow-sky-100/50"}`}
             >
                {/* Header */}
                <div className={`flex justify-between items-end mb-8 border-b pb-6 ${isDark ? "border-white/10" : "border-slate-200/60"}`}>
                   <div>
                      <h3 className={`text-3xl font-black tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>{lang === 'mn' ? 'Үйл Ажиллагаа' : 'Activities'}</h3>
                      <p className={`text-xs uppercase tracking-[0.2em] mt-2 font-bold opacity-80 ${isDark ? "text-[#00aeef]" : "text-sky-600"}`}>
                          {lang === 'mn' ? 'Гол чиглэлүүд' : 'Key Pillars'}
                      </p>
                   </div>
                   <div className={`p-3 rounded-2xl border animate-pulse-slow 
                      ${isDark ? "bg-[#00aeef]/10 border-[#00aeef]/20" : "bg-sky-50 border-sky-100"}`}>
                      <Globe className="text-[#00aeef]" size={36} strokeWidth={1.5} />
                   </div>
                </div>

                {/* Info Cards List */}
                <div className="space-y-4">
                   {ACTIVITY_CARDS.map((card, idx) => (
                      <InfoCard key={card.id} data={card} index={idx} lang={lang} isDark={isDark} />
                   ))}
                </div>

                {/* Live Member Count Footer */}
                <div className={`mt-8 pt-6 border-t flex items-center justify-between ${isDark ? "border-white/10" : "border-slate-200/60"}`}>
                   <div className="flex items-center gap-4">
                      <div className="flex -space-x-3">
                          {[...Array(4)].map((_, i) => (
                             <div key={i} className={`w-9 h-9 rounded-full border-2 relative overflow-hidden ${isDark ? "bg-[#002b49] border-[#00aeef]/30" : "bg-white border-white shadow-sm"}`}>
                                <div className={`absolute inset-0 ${isDark ? "bg-gradient-to-br from-transparent to-black/30" : "bg-slate-100"}`} />
                             </div>
                          ))}
                          <div className={`w-9 h-9 rounded-full border-2 flex items-center justify-center text-[9px] font-black ${isDark ? "bg-[#00aeef] border-[#001d30] text-white" : "bg-sky-500 border-white text-white"}`}>
                             +50
                          </div>
                      </div>
                      <div className="flex flex-col">
                        <span className={`text-sm font-bold ${isDark ? "text-white" : "text-slate-800"}`}>Active Members</span>
                        <span className={`text-[10px] uppercase tracking-widest ${isDark ? "text-white/40" : "text-slate-400"}`}>Growing daily</span>
                      </div>
                   </div>
                   <div className="h-2 w-2 rounded-full bg-green-500 shadow-[0_0_10px_#22c55e] animate-pulse" />
                </div>
             </motion.div>
           </TiltCard>

           {/* Floating Background Blobs behind Card */}
           <div className={`absolute -top-12 -right-12 w-64 h-64 rounded-full blur-[100px] opacity-20 -z-10 animate-pulse-slow ${isDark ? 'bg-[#00aeef]' : 'bg-sky-300'}`} />
           <div className={`absolute -bottom-12 -left-12 w-64 h-64 rounded-full blur-[100px] -z-10 animate-pulse-slow delay-1000 ${isDark ? 'bg-[#fbbf24] opacity-10' : 'bg-yellow-200 opacity-20'}`} />
        </div>
      </div>

      {/* 3. SCROLLING MARQUEE (Integrated Seamlessly) */}
      <div className={`absolute bottom-0 left-0 w-full z-20 border-t backdrop-blur-sm
         ${isDark ? "border-white/5 bg-[#00101a]/50" : "border-slate-100 bg-white/60"}`}>
        <motion.div 
          animate={{ x: [0, -1000] }}
          transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
          className="flex gap-16 py-4 items-center whitespace-nowrap"
        >
          {[...Array(8)].map((_, i) => (
            <div key={i} className="flex items-center gap-16">
              <span className={`font-black uppercase text-3xl tracking-widest ${isDark ? "text-white/20" : "text-slate-300"}`}>
                {lang === 'mn' ? "ХҮҮХДИЙН ТӨЛӨӨ" : "FOR EVERY CHILD"}
              </span>
              <span className="text-[#00aeef] text-xl">★</span>
              <span className={`font-black uppercase text-3xl tracking-widest ${isDark ? "text-white/20" : "text-slate-300"}`}>
                {lang === 'mn' ? "ГЭРЭЛТ ИРЭЭДҮЙ" : "BRIGHT FUTURE"}
              </span>
              <span className="text-[#fbbf24] text-xl">●</span>
            </div>
          ))}
        </motion.div>
      </div>
      
    </section>
  );
}