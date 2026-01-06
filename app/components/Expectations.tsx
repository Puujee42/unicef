"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Clock, 
  HeartHandshake, 
  MessageCircle, 
  Box, 
  Star,
  CheckCircle2,
  ArrowRight,
  Sparkles
} from "lucide-react";
import { 
  motion, 
  useMotionValue, 
  useSpring, 
  useTransform 
} from "framer-motion";
import { useTheme } from "next-themes";
import { useLanguage } from "../context/LanguageContext";

// --- CONFIG ---
const CONTENT = {
  title: { 
    en: "Core Standards", 
    mn: "Гишүүний Стандарт" 
  },
  subtitle: { 
    en: "Excellence is a habit. These are the non-negotiable standards of a UNICEF Club member.", 
    mn: "Клубын гишүүн бүрийн дагаж мөрдөх ёс зүй ба үүрэг хариуцлага."
  },
  items: [
    {
      id: "01",
      icon: Clock,
      title: { en: "Active Participation", mn: "Идэвхтэй Оролцоо" },
      desc: { en: "Participate actively in events and fulfill assigned duties on time.", mn: "Арга хэмжээнд идэвхтэй оролцож, үүргээ цагт нь биелүүлнэ." }
    },
    {
      id: "02",
      icon: HeartHandshake,
      title: { en: "Mutual Respect", mn: "Хүндэтгэл" },
      desc: { en: "Treat leaders and fellow members with respect and kindness.", mn: "Лидерүүд болон бусад гишүүдэд хүндэтгэлтэй харилцана." }
    },
    {
      id: "03",
      icon: MessageCircle,
      title: { en: "Transparency", mn: "Нээлттэй Байдал" },
      desc: { en: "Receive and report all club information through approved channels.", mn: "Клубын бүх мэдээллийг зөвшөөрсөн сувгаар хүлээн авч тайлагнана." }
    },
    {
      id: "04",
      icon: Box,
      title: { en: "Responsibility", mn: "Хариуцлага" },
      desc: { en: "Use finances, logistics, and materials appropriately.", mn: "Санхүү, логистик, материалыг зөв зохистой ашиглана." }
    },
    {
      id: "05",
      icon: Star,
      title: { en: "Contribution", mn: "Бодит Хувь Нэмэр" },
      desc: { en: "Every member contributes actively to the club's core activities.", mn: "Гишүүн бүр клубын үйл ажиллагаанд идэвхтэй хувь нэмэр оруулна." }
    }
  ]
};

// --- 3D TILT CARD COMPONENT ---
const ExpectationCard = ({ item, index, lang, isDark }: any) => {
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`
        group relative h-full min-h-[280px] md:min-h-[320px] p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] overflow-hidden transition-all duration-500 border
        ${isDark 
          ? "bg-[#002b49]/20 border-white/5 hover:border-[#00aeef]/30 shadow-2xl" 
          : "bg-white border-slate-200 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_-10px_rgba(0,174,239,0.15)] hover:border-[#00aeef]/50"}
      `}
    >
      {/* Background Gradient Hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-[#00aeef]/5 group-hover:via-[#00aeef]/10 transition-all duration-700" />

      {/* Huge Watermark Number */}
      <span className={`absolute -top-4 -right-4 md:-top-6 md:-right-6 text-[6rem] md:text-[10rem] font-black select-none transition-colors pointer-events-none leading-none
         ${isDark ? "text-white/[0.02] group-hover:text-white/[0.04]" : "text-slate-900/[0.03] group-hover:text-[#00aeef]/10"}`}>
        {item.id}
      </span>

      <div className="relative z-10 flex flex-col h-full transform translate-z-20">
        {/* Header */}
        <div className="flex justify-between items-start mb-4 md:mb-6">
           <div className={`w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl flex items-center justify-center group-hover:scale-110 transition-all duration-300 shadow-lg
              ${isDark 
                ? "bg-[#001829] border border-white/10 group-hover:border-[#00aeef] group-hover:shadow-[#00aeef]/20" 
                : "bg-slate-50 border border-slate-200 group-hover:bg-white group-hover:border-[#00aeef] group-hover:shadow-sky-100"}`}>
              <item.icon className="text-[#00aeef] w-[22px] h-[22px] md:w-[26px] md:h-[26px]" strokeWidth={1.5} />
           </div>
           {/* Pulsing Dot */}
           <div className="w-2 h-2 rounded-full bg-[#00aeef]/30 group-hover:bg-[#00aeef] transition-colors" />
        </div>

        {/* Content */}
        <div className="flex-grow">
           <h3 className={`text-xl md:text-2xl font-bold mb-3 md:mb-4 transition-colors
              ${isDark ? "text-white group-hover:text-[#00aeef]" : "text-[#001829] group-hover:text-[#00aeef]"}`}>
              {item.title[lang]}
           </h3>
           <p className={`text-xs md:text-sm leading-relaxed font-medium transition-colors
              ${isDark ? "text-white/60" : "text-slate-500"}`}>
              {item.desc[lang]}
           </p>
        </div>

        {/* Footer Badge */}
        <div className={`mt-6 md:mt-8 pt-4 md:pt-6 border-t flex items-center gap-2
           ${isDark ? "border-white/5" : "border-slate-100"}`}>
           <CheckCircle2 className="w-3 h-3 md:w-3.5 md:h-3.5 text-[#00aeef] opacity-50 group-hover:opacity-100 transition-opacity" />
           <span className={`text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] transition-colors
              ${isDark ? "text-white/30 group-hover:text-white/60" : "text-slate-400 group-hover:text-slate-600"}`}>
              Standard
           </span>
        </div>
      </div>
    </motion.div>
  );
};

// --- MAIN COMPONENT ---
export default function Expectations() {
  const { language: lang } = useLanguage();
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Hydration Check
  useEffect(() => setMounted(true), []);
  const isDark = mounted && (theme === 'dark' || !theme);

  if (!mounted) return null;

  return (
    <section className={`relative py-16 md:py-32 px-4 overflow-hidden transition-colors duration-700
       ${isDark ? "bg-[#001829]" : "bg-slate-50"}`}>
      
      {/* BACKGROUND AMBIENCE */}
      <div className="absolute inset-0 pointer-events-none">
         {/* Gradient Overlay */}
         <div className={`absolute inset-0 bg-gradient-to-b transition-colors duration-700
            ${isDark ? "from-[#001829] via-[#00223a] to-[#001829]" : "from-slate-50 via-slate-100 to-slate-50"}`} 
         />
         
         {/* Moving Blobs */}
         <div className={`absolute top-0 right-0 w-[400px] md:w-[800px] h-[400px] md:h-[800px] rounded-full blur-[100px] md:blur-[150px] transition-opacity duration-700
            ${isDark ? "bg-[#00aeef] opacity-[0.05]" : "bg-sky-200 opacity-[0.4]"}`} 
         />
         <div className={`absolute bottom-0 left-0 w-[300px] md:w-[600px] h-[300px] md:h-[600px] rounded-full blur-[120px] md:blur-[180px] transition-opacity duration-700
            ${isDark ? "bg-[#005691] opacity-[0.08]" : "bg-blue-200 opacity-[0.3]"}`} 
         />
         
         {/* Noise & Grid */}
         <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay" />
         <div className={`absolute inset-0 opacity-[0.05] transition-opacity duration-700
            ${isDark ? "invert-0" : "invert"}`} 
            style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%2300aeef' fill-opacity='1' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")` }} 
         />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        
        {/* HEADER */}
        <div className="flex flex-col items-center text-center mb-12 md:mb-20 space-y-4 md:space-y-6 text-balance">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border backdrop-blur-md
               ${isDark ? "bg-[#00aeef]/10 border-[#00aeef]/20" : "bg-white border-slate-200 shadow-sm"}`}
          >
             <Sparkles className="w-2.5 h-2.5 md:w-3 md:h-3 text-[#00aeef] fill-current animate-pulse" />
             <span className="text-[#00aeef] text-[9px] md:text-[10px] font-black uppercase tracking-[0.25em]">
               Membership Code
             </span>
          </motion.div>

          <motion.h2 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className={`text-3xl md:text-7xl font-black tracking-tighter drop-shadow-sm transition-colors
               ${isDark ? "text-white" : "text-[#001829]"}`}
          >
            {CONTENT.title[lang]}
          </motion.h2>
          
          <motion.div 
             initial={{ width: 0 }}
             whileInView={{ width: "80px" }}
             className="h-1 bg-gradient-to-r from-transparent via-[#00aeef] to-transparent"
          />

          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className={`max-w-2xl text-base md:text-xl font-medium leading-relaxed transition-colors px-4
               ${isDark ? "text-white/60" : "text-slate-500"}`}
          >
            {CONTENT.subtitle[lang]}
          </motion.p>
        </div>

        {/* CARDS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {CONTENT.items.map((item, index) => (
            <ExpectationCard key={item.id} item={item} index={index} lang={lang} isDark={isDark} />
          ))}

          {/* FINAL CTA CARD */}
          <motion.div
             initial={{ opacity: 0, scale: 0.95 }}
             whileInView={{ opacity: 1, scale: 1 }}
             viewport={{ once: true }}
             transition={{ delay: 0.6 }}
             className="relative group h-full min-h-[280px] md:min-h-[320px] p-1 rounded-[2rem] md:rounded-[2.5rem] bg-gradient-to-br from-[#00aeef] to-[#005691] shadow-xl shadow-[#00aeef]/20 cursor-pointer overflow-hidden"
          >
             {/* Shimmer Overlay */}
             <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20 mix-blend-overlay pointer-events-none" />
             <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent z-10" />

             <div className={`relative h-full backdrop-blur-sm rounded-[1.9rem] md:rounded-[2.3rem] p-8 md:p-10 flex flex-col justify-between
                ${isDark ? "bg-[#001829]/10" : "bg-white/10"}`}>
                <div>
                   <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-white text-[#00aeef] flex items-center justify-center mb-4 md:mb-6 shadow-[0_0_20px_rgba(255,255,255,0.3)]">
                      <Star className="w-6 h-6 md:w-7 md:h-7 fill-current" />
                   </div>
                   <h3 className="text-2xl md:text-3xl font-black text-white mb-2 md:mb-3 tracking-tight">
                      {lang === 'mn' ? 'Бэлэн үү?' : 'Ready to Start?'}
                   </h3>
                   <p className="text-white/90 text-xs md:text-sm font-medium leading-relaxed">
                      {lang === 'mn' ? 'Таны аялал эндээс эхэлнэ. Өргөдлөө илгээнэ үү.' : 'Your journey starts here. Submit your application today.'}
                   </p>
                </div>

                <Link href="/join" className="group/btn mt-6 md:mt-8 flex items-center justify-between bg-black/20 hover:bg-black/30 p-1.5 md:p-2 rounded-full border border-white/10 transition-colors">
                   <span className="pl-4 md:pl-6 text-[10px] md:text-xs font-bold uppercase tracking-widest text-white">
                      {lang === 'mn' ? 'Нэгдэх' : 'Apply Now'}
                   </span>
                   <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white text-[#00aeef] flex items-center justify-center group-hover/btn:scale-110 transition-transform">
                      <ArrowRight className="w-4 h-4 md:w-[18px] md:h-[18px]" />
                   </div>
                </Link>
             </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}