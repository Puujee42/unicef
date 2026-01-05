"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  ArrowRight, 
  TrendingUp, 
  Users, 
  Heart, 
  Globe, 
  CheckCircle2,
  Leaf,
  BookOpen,
  Target,
  Sparkles
} from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useTheme } from "next-themes";
import { useLanguage } from "../context/LanguageContext";

// --- BRAND PALETTE ---
const BRAND = {
  sky: "#00aeef",
  ocean: "#005691",
  deep: "#001829",
  gold: "#fbbf24",
  rose: "#f43f5e",
  green: "#10b981"
};

const STATS = [
  { id: 1, value: "2.5M₮", label: { en: "Funds Raised", mn: "Босгосон Хандив" }, icon: TrendingUp, color: BRAND.gold },
  { id: 2, value: "500+", label: { en: "Children Impacted", mn: "Хүрсэн Хүүхдүүд" }, icon: Heart, color: BRAND.rose },
  { id: 3, value: "15+", label: { en: "Projects Completed", mn: "Хэрэгжсэн Төсөл" }, icon: CheckCircle2, color: BRAND.sky },
  { id: 4, value: "50+", label: { en: "Active Volunteers", mn: "Сайн Дурынхан" }, icon: Users, color: BRAND.green },
];

const SDGS = [
  { id: 3, title: { en: "Good Health", mn: "Эрүүл Мэнд" }, icon: Heart, color: "#4c9f38" },
  { id: 4, title: { en: "Quality Education", mn: "Чанартай Боловсрол" }, icon: BookOpen, color: "#c5192d" },
  { id: 13, title: { en: "Climate Action", mn: "Уур Амьсгал" }, icon: Leaf, color: "#3f7e44" },
  { id: 17, title: { en: "Partnerships", mn: "Түншлэл" }, icon: Globe, color: "#19486a" },
];

const STORIES = [
  {
    year: "2025",
    title: { en: "Clean Air Campaign", mn: "Цэвэр Агаар Аян" },
    desc: { en: "Distributed 200+ masks and air filters to kindergartens in the ger district.", mn: "Гэр хорооллын цэцэрлэгүүдэд 200+ маск болон агаар шүүгч тараав." },
    image: "https://images.unsplash.com/photo-1623164323223-1d90518776bd?q=80&w=1932&auto=format&fit=crop"
  },
  {
    year: "2025",
    title: { en: "Digital Literacy", mn: "Цахим Боловсрол" },
    desc: { en: "Conducted coding workshops for 50 rural students via online seminars.", mn: "Хөдөө орон нутгийн 50 сурагчдад цахим код бичих сургалт оров." },
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop"
  }
];

// --- SUB-COMPONENTS ---

const StatCard = ({ item, index, lang, isDark }: any) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className={`relative p-8 rounded-[2.5rem] border transition-all duration-500 group overflow-hidden
        ${isDark 
          ? "bg-[#002b49]/40 border-white/5 shadow-2xl" 
          : "bg-white border-slate-200 shadow-xl shadow-slate-200/50 hover:shadow-sky-100"}`}
    >
      <div className={`absolute -right-4 -top-4 w-24 h-24 rounded-full blur-3xl opacity-10 transition-all duration-500 group-hover:opacity-30`} style={{ backgroundColor: item.color }} />
      
      <div className="relative z-10 flex flex-col items-center text-center">
        <div className={`mb-4 p-4 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110
          ${isDark ? "bg-white/5" : "bg-slate-50"}`} style={{ color: item.color }}>
           <item.icon size={28} />
        </div>
        <h3 className={`text-4xl md:text-5xl font-black mb-1 tracking-tighter ${isDark ? "text-white" : "text-[#001829]"}`}>
           {item.value}
        </h3>
        <p className={`text-[10px] font-black uppercase tracking-[0.2em] ${isDark ? "text-white/40" : "text-slate-400"}`}>
           {item.label[lang]}
        </p>
      </div>
    </motion.div>
  );
};

const SDGCard = ({ item, lang, isDark }: any) => {
  return (
    <motion.div 
      whileHover={{ scale: 1.02, x: 5 }}
      className={`flex items-center gap-4 p-4 rounded-2xl border transition-all
        ${isDark ? "bg-white/5 border-white/5 hover:bg-white/10" : "bg-white border-slate-200 hover:border-sky-200 shadow-sm"}`}
    >
      <div className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center font-black text-white shadow-lg" style={{ backgroundColor: item.color }}>
         {item.id}
      </div>
      <div>
         <h4 className={`font-bold leading-tight ${isDark ? "text-white" : "text-slate-900"}`}>{item.title[lang]}</h4>
         <span className={`text-[9px] font-bold uppercase tracking-wider ${isDark ? "text-white/30" : "text-slate-400"}`}>UN Impact Goal</span>
      </div>
    </motion.div>
  );
};

// --- MAIN PAGE ---
export default function ImpactPage() {
  const { language: lang } = useLanguage();
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { scrollYProgress } = useScroll();
  const scaleBar = useTransform(scrollYProgress, [0.4, 0.9], [0, 1]);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const isDark = theme === "dark" || !theme;

  return (
    <div className={`relative min-h-screen transition-colors duration-700 pt-24 overflow-hidden
      ${isDark ? "bg-[#001829] text-white" : "bg-slate-50 text-slate-900"}`}>
      
      {/* 1. ATMOSPHERE BACKGROUND */}
      <div className="absolute inset-0 pointer-events-none">
         <div className={`absolute top-[-10%] left-[-10%] w-[1000px] h-[1000px] rounded-full blur-[250px] transition-opacity duration-700
            ${isDark ? "bg-[#00aeef] opacity-[0.07]" : "bg-sky-200 opacity-[0.5]"}`} />
         <div className={`absolute bottom-[-10%] right-[-10%] w-[800px] h-[800px] rounded-full blur-[200px] transition-opacity duration-700
            ${isDark ? "bg-[#005691] opacity-[0.1]" : "bg-blue-100 opacity-[0.4]"}`} />
         <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay" />
         
         <div className={`absolute inset-0 flex justify-around opacity-[0.05] transition-colors
            ${isDark ? "invert-0" : "invert"}`}>
            <div className="w-px h-full bg-white/20" />
            <div className="w-px h-full bg-white/20" />
            <div className="w-px h-full bg-white/20" />
         </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        
        {/* 2. HERO */}
        <section className="py-24 text-center relative">
           <motion.div 
             initial={{ opacity: 0, y: 10 }}
             animate={{ opacity: 1, y: 0 }}
             className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border transition-colors mb-8
               ${isDark ? "bg-[#00aeef]/10 border-[#00aeef]/30 text-[#00aeef]" : "bg-white border-sky-100 text-[#00aeef] shadow-sm"}`}
           >
              <Sparkles size={14} className="animate-pulse" />
              <span className="font-black text-[10px] uppercase tracking-[0.2em]">
                 {lang === 'mn' ? 'Бидний Үр Дүн' : 'Our Impact'}
              </span>
           </motion.div>

           <h1 className={`text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter mb-8 leading-[0.85]
             ${isDark 
               ? "text-transparent bg-clip-text bg-gradient-to-b from-white to-white/30" 
               : "text-[#001829]"}`}>
              REAL CHANGE<span className="text-[#00aeef]">.</span>
           </h1>
           <p className={`max-w-2xl mx-auto text-lg md:text-xl font-medium leading-relaxed opacity-60
             ${isDark ? "text-white" : "text-slate-600"}`}>
              {lang === 'mn' 
                ? 'Бид тоо биш, бодит өөрчлөлтийг хэмждэг. Бидний хийсэн ажил бүр хүүхдийн ирээдүйд гэрэл асаадаг.'
                : 'We don’t just count numbers; we measure change. Every project we undertake lights a spark for a child’s future.'}
           </p>
        </section>

        {/* 3. STATS GRID */}
        <section className="py-12 mb-20">
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {STATS.map((stat, i) => (
                 <StatCard key={stat.id} item={stat} index={i} lang={lang} isDark={isDark} />
              ))}
           </div>
        </section>

        {/* 4. SDGs SECTION */}
        <section className="py-24 border-t transition-colors duration-700 ${isDark ? 'border-white/5' : 'border-slate-200'}">
           <div className="flex flex-col lg:flex-row gap-20 items-center">
              <div className="lg:w-1/2">
                 <h2 className={`text-4xl md:text-5xl font-black mb-8 tracking-tight ${isDark ? "text-white" : "text-[#001829]"}`}>
                    {lang === 'mn' ? 'Тогтвортой Хөгжлийн Зорилтууд' : 'Targeting the Global SDGs'}
                 </h2>
                 <p className={`mb-10 text-lg opacity-60 font-medium ${isDark ? "text-white" : "text-slate-600"}`}>
                    {lang === 'mn'
                      ? 'Бидний үйл ажиллагаа НҮБ-ын Тогтвортой Хөгжлийн Зорилтуудтай нягт уялдаж, дэлхийн нийтийн зорилгод хувь нэмрээ оруулдаг.'
                      : 'Our mission aligns directly with the UN Sustainable Development Goals, ensuring our local actions have global relevance.'}
                 </p>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {SDGS.map((sdg) => (
                       <SDGCard key={sdg.id} item={sdg} lang={lang} isDark={isDark} />
                    ))}
                 </div>
              </div>
              
              <div className={`lg:w-1/2 relative h-[500px] w-full rounded-[3rem] border backdrop-blur-sm flex items-center justify-center overflow-hidden group transition-all
                ${isDark ? "bg-[#002b49]/40 border-white/5 shadow-2xl" : "bg-white border-slate-200 shadow-xl"}`}>
                 
                 <div className={`absolute w-[600px] h-[600px] border rounded-full transition-colors ${isDark ? "border-[#00aeef]/5" : "border-sky-100"}`} />
                 <div className={`absolute w-[400px] h-[400px] border rounded-full transition-colors ${isDark ? "border-[#00aeef]/10" : "border-sky-200"}`} />
                 
                 <div className="relative z-10 text-center px-12">
                    <div className="w-24 h-24 bg-[#00aeef] rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-[#00aeef]/40 rotate-12 group-hover:rotate-0 transition-transform duration-500">
                       <Globe size={48} className="text-white" />
                    </div>
                    <h3 className={`text-3xl font-black ${isDark ? "text-white" : "text-[#001829]"}`}>Global Vision</h3>
                    <p className={`text-sm mt-3 font-bold uppercase tracking-widest opacity-40 ${isDark ? "text-white" : "text-[#001829]"}`}>Local Action</p>
                 </div>
              </div>
           </div>
        </section>

        {/* 5. IMPACT STORIES */}
        <section className="py-24 relative">
           <h2 className={`text-4xl md:text-6xl font-black mb-24 text-center tracking-tight ${isDark ? "text-white" : "text-[#001829]"}`}>
              {lang === 'mn' ? 'Бидний Түүх' : 'Stories of Impact'}
           </h2>
           
           <div className="relative">
              {/* Timeline Center Line */}
              <div className={`absolute left-0 md:left-1/2 top-0 bottom-0 w-1 transform -translate-x-1/2 hidden md:block rounded-full
                 ${isDark ? "bg-white/5" : "bg-slate-200"}`}>
                 <motion.div 
                    style={{ scaleY: scaleBar }} 
                    className="absolute top-0 left-0 w-full h-full bg-[#00aeef] origin-top rounded-full shadow-[0_0_15px_#00aeef]" 
                 />
              </div>

              <div className="space-y-32">
                 {STORIES.map((story, i) => (
                    <motion.div 
                       key={i}
                       initial={{ opacity: 0, y: 50 }}
                       whileInView={{ opacity: 1, y: 0 }}
                       viewport={{ once: true, margin: "-100px" }}
                       className={`flex flex-col md:flex-row gap-12 md:gap-24 items-center ${i % 2 === 0 ? '' : 'md:flex-row-reverse'}`}
                    >
                       <div className="w-full md:w-1/2">
                          <div className={`relative aspect-[4/3] rounded-[2.5rem] overflow-hidden shadow-2xl border transition-all duration-500
                            ${isDark ? "border-white/10" : "border-white shadow-slate-200"}`}>
                             <Image 
                               src={story.image} 
                               alt="Impact Story" 
                               fill 
                               className="object-cover group-hover:scale-105 transition-transform duration-700"
                             />
                             <div className={`absolute inset-0 transition-opacity ${isDark ? "bg-[#001829]/30" : "bg-white/10"}`} />
                          </div>
                       </div>

                       <div className="w-full md:w-1/2 relative">
                          <div className={`hidden md:block absolute top-1/2 -translate-y-1/2 w-6 h-6 bg-[#00aeef] rounded-full border-[6px] shadow-[0_0_20px_#00aeef]
                             ${i % 2 === 0 ? '-left-[calc(60px+2rem)]' : '-right-[calc(60px+2rem)]'}
                             ${isDark ? "border-[#001829]" : "border-slate-50"}
                          `} />
                          
                          <span className="text-[#00aeef] font-black text-sm uppercase tracking-[0.3em] mb-4 block">{story.year}</span>
                          <h3 className={`text-4xl font-black mb-6 tracking-tight ${isDark ? "text-white" : "text-[#001829]"}`}>
                            {story.title[lang]}
                          </h3>
                          <p className={`leading-relaxed text-lg font-medium opacity-60 ${isDark ? "text-white" : "text-slate-600"}`}>
                            {story.desc[lang]}
                          </p>
                       </div>
                    </motion.div>
                 ))}
              </div>
           </div>
        </section>

        {/* 6. CTA */}
        <section className="py-32 text-center">
           <div className={`relative p-16 md:p-24 rounded-[4rem] border transition-all duration-700 overflow-hidden
             ${isDark ? "bg-white/5 border-white/10" : "bg-white border-slate-200 shadow-2xl shadow-slate-200/50"}`}>
              
              <div className="relative z-10 max-w-2xl mx-auto">
                 <h2 className={`text-4xl md:text-6xl font-black mb-8 tracking-tighter ${isDark ? "text-white" : "text-[#001829]"}`}>
                    {lang === 'mn' ? 'Өөрчлөлтийг Бүтээ' : 'Be The Change'}
                 </h2>
                 <p className={`text-lg mb-10 font-medium opacity-60 ${isDark ? "text-white" : "text-slate-600"}`}>
                    {lang === 'mn' 
                      ? 'Таны оруулсан хувь нэмэр дараагийн том амжилтын эхлэл байх болно.' 
                      : 'Your contribution is the spark for our next major milestone. Join us in making a difference today.'}
                 </p>
                 <Link href="/donate" className="group relative inline-flex items-center gap-3 px-10 py-5 bg-[#00aeef] text-white rounded-full font-black uppercase tracking-widest text-xs shadow-xl shadow-[#00aeef]/30 hover:shadow-[#00aeef]/50 hover:scale-105 transition-all active:scale-95">
                    <span>{lang === 'mn' ? 'Хандив Өгөх' : 'Support Our Cause'}</span>
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                 </Link>
              </div>
              
              <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[200px] pointer-events-none transition-colors duration-700
                ${isDark ? "bg-[#00aeef] opacity-[0.1]" : "bg-sky-200 opacity-[0.4]"}`} />
           </div>
        </section>

      </div>
    </div>
  );
}