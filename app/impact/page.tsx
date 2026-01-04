"use client";

import React from "react";
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
  Target
} from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useLanguage } from "../context/LanguageContext";

// --- BRAND PALETTE ---
const BRAND = {
  sky: "#00aeef",
  ocean: "#005691",
  deep: "#001829",
  white: "#ffffff",
  gold: "#fbbf24",
  green: "#10b981",
  rose: "#f43f5e"
};

// --- CONTENT ---
const STATS = [
  { 
    id: 1, 
    value: "2.5M₮", 
    label: { en: "Funds Raised", mn: "Босгосон Хандив" }, 
    icon: TrendingUp,
    color: BRAND.gold
  },
  { 
    id: 2, 
    value: "500+", 
    label: { en: "Children Impacted", mn: "Хүрсэн Хүүхдүүд" }, 
    icon: Heart,
    color: BRAND.rose
  },
  { 
    id: 3, 
    value: "15+", 
    label: { en: "Projects Completed", mn: "Хэрэгжсэн Төсөл" }, 
    icon: CheckCircle2,
    color: BRAND.sky
  },
  { 
    id: 4, 
    value: "50+", 
    label: { en: "Active Volunteers", mn: "Сайн Дурынхан" }, 
    icon: Users,
    color: BRAND.green
  },
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
    desc: { 
      en: "Distributed 200+ masks and air filters to kindergartens in the ger district.", 
      mn: "Гэр хорооллын цэцэрлэгүүдэд 200+ маск болон агаар шүүгч тараав." 
    },
    image: "https://images.unsplash.com/photo-1623164323223-1d90518776bd?q=80&w=1932&auto=format&fit=crop"
  },
  {
    year: "2025",
    title: { en: "Digital Literacy", mn: "Цахим Боловсрол" },
    desc: { 
      en: "Conducted coding workshops for 50 rural students via online seminars.", 
      mn: "Хөдөө орон нутгийн 50 сурагчдад цахим код бичих сургалт оров." 
    },
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop"
  }
];

// --- COMPONENTS ---

const StatCard = ({ item, index, lang }: any) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -5 }}
      className="relative p-6 rounded-[2rem] bg-[#002b49]/40 border border-white/5 backdrop-blur-md overflow-hidden group"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="absolute -right-4 -top-4 w-24 h-24 rounded-full blur-2xl opacity-20 transition-all duration-500 group-hover:opacity-40" style={{ backgroundColor: item.color }} />
      
      <div className="relative z-10 flex flex-col items-center text-center">
        <div className="mb-4 p-3 rounded-2xl bg-white/5 border border-white/10 text-white shadow-lg" style={{ color: item.color }}>
           <item.icon size={28} />
        </div>
        <h3 className="text-4xl md:text-5xl font-black text-white mb-2 tracking-tight drop-shadow-lg">
           {item.value}
        </h3>
        <p className="text-white/60 text-sm font-bold uppercase tracking-widest">
           {item.label[lang]}
        </p>
      </div>
    </motion.div>
  );
};

const SDGCard = ({ item, lang }: any) => {
  return (
    <motion.div 
      whileHover={{ scale: 1.05 }}
      className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors"
    >
      <div className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center font-black text-white shadow-lg" style={{ backgroundColor: item.color }}>
         {item.id}
      </div>
      <div>
         <h4 className="text-white font-bold leading-tight">{item.title[lang]}</h4>
         <span className="text-[10px] text-white/40 uppercase tracking-wider">Target Goal</span>
      </div>
    </motion.div>
  );
};

export default function ImpactPage() {
  const { language: lang } = useLanguage();
  const { scrollYProgress } = useScroll();
  const scaleBar = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <div className="relative bg-[#001829] min-h-screen text-white pt-24 overflow-hidden">
      
      {/* 1. ATMOSPHERE BACKGROUND */}
      <div className="absolute inset-0 pointer-events-none">
         <div className="absolute top-[-20%] left-[-10%] w-[1000px] h-[1000px] bg-[#00aeef] rounded-full blur-[250px] opacity-[0.07]" />
         <div className="absolute bottom-[-10%] right-[-10%] w-[800px] h-[800px] bg-[#005691] rounded-full blur-[200px] opacity-[0.1]" />
         <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay" />
         
         {/* Vertical Lines representing "Growth" */}
         <div className="absolute inset-0 flex justify-around opacity-[0.03]">
            <div className="w-[1px] h-full bg-white/50" />
            <div className="w-[1px] h-full bg-white/50" />
            <div className="w-[1px] h-full bg-white/50" />
         </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        
        {/* 2. HERO: THE BIG NUMBER */}
        <section className="py-20 text-center relative">
           <motion.div 
             initial={{ opacity: 0, scale: 0.9 }}
             animate={{ opacity: 1, scale: 1 }}
             className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#00aeef]/10 border border-[#00aeef]/30 text-[#00aeef] font-black text-xs uppercase tracking-widest mb-8"
           >
              <Target size={14} />
              <span>{lang === 'mn' ? 'Бидний Үр Дүн' : 'Our Impact'}</span>
           </motion.div>

           <h1 className="text-5xl md:text-7xl lg:text-9xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40 mb-8 drop-shadow-2xl">
              REAL CHANGE
           </h1>
           <p className="max-w-2xl mx-auto text-lg text-white/60 font-medium leading-relaxed">
              {lang === 'mn' 
                ? 'Бид тоо биш, бодит өөрчлөлтийг хэмждэг. Бидний хийсэн ажил бүр хүүхдийн ирээдүйд гэрэл асаадаг.'
                : 'We don’t just count numbers; we measure change. Every project we undertake lights a spark for a child’s future.'}
           </p>
        </section>

        {/* 3. STATS GRID (Bioluminescent Style) */}
        <section className="py-12">
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {STATS.map((stat, i) => (
                 <StatCard key={stat.id} item={stat} index={i} lang={lang} />
              ))}
           </div>
        </section>

        {/* 4. SDGs SECTION */}
        <section className="py-24">
           <div className="flex flex-col lg:flex-row gap-16 items-center">
              <div className="lg:w-1/2">
                 <h2 className="text-4xl font-black mb-6">
                    {lang === 'mn' ? 'Тогтвортой Хөгжлийн Зорилтууд' : 'Targeting the SDGs'}
                 </h2>
                 <p className="text-white/60 mb-8 text-lg">
                    {lang === 'mn'
                      ? 'Бидний үйл ажиллагаа НҮБ-ын Тогтвортой Хөгжлийн Зорилтуудтай нягт уялдаж, дэлхийн нийтийн зорилгод хувь нэмрээ оруулдаг.'
                      : 'Our mission aligns directly with the UN Sustainable Development Goals, ensuring our local actions have global relevance.'}
                 </p>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {SDGS.map((sdg) => (
                       <SDGCard key={sdg.id} item={sdg} lang={lang} />
                    ))}
                 </div>
              </div>
              
              {/* Visual Graphic representing "Growth" */}
              <div className="lg:w-1/2 relative h-[400px] w-full bg-gradient-to-br from-[#002b49]/40 to-[#001829]/40 rounded-[3rem] border border-white/5 backdrop-blur-sm p-8 flex items-center justify-center overflow-hidden group">
                 {/* Ripple Circles */}
                 <div className="absolute w-[600px] h-[600px] border border-[#00aeef]/10 rounded-full animate-pulse-slow" />
                 <div className="absolute w-[400px] h-[400px] border border-[#00aeef]/20 rounded-full animate-pulse-slow delay-75" />
                 <div className="absolute w-[200px] h-[200px] border border-[#00aeef]/30 rounded-full animate-pulse-slow delay-150" />
                 
                 <div className="relative z-10 text-center">
                    <Globe size={64} className="mx-auto text-[#00aeef] mb-4 group-hover:scale-110 transition-transform duration-500" />
                    <h3 className="text-2xl font-black text-white">Global Vision</h3>
                    <p className="text-white/50 text-sm mt-2">Local Action</p>
                 </div>
              </div>
           </div>
        </section>

        {/* 5. IMPACT TIMELINE / STORIES */}
        <section className="py-24 relative">
           <h2 className="text-4xl font-black mb-16 text-center">
              {lang === 'mn' ? 'Бидний Түүх' : 'Stories of Impact'}
           </h2>
           
           <div className="relative">
              {/* Timeline Center Line */}
              <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-px bg-white/10 transform -translate-x-1/2 hidden md:block">
                 <motion.div 
                    style={{ scaleY: scaleBar }} 
                    className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-[#00aeef] to-transparent origin-top" 
                 />
              </div>

              <div className="space-y-24">
                 {STORIES.map((story, i) => (
                    <motion.div 
                       key={i}
                       initial={{ opacity: 0, y: 50 }}
                       whileInView={{ opacity: 1, y: 0 }}
                       viewport={{ once: true, margin: "-100px" }}
                       className={`flex flex-col md:flex-row gap-8 md:gap-16 items-center ${i % 2 === 0 ? '' : 'md:flex-row-reverse'}`}
                    >
                       {/* Image */}
                       <div className="w-full md:w-1/2">
                          <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl border border-white/10 group">
                             <Image 
                               src={story.image} 
                               alt="Impact Story" 
                               fill 
                               className="object-cover group-hover:scale-105 transition-transform duration-700"
                             />
                             <div className="absolute inset-0 bg-[#001829]/20 group-hover:bg-transparent transition-colors duration-500" />
                          </div>
                       </div>

                       {/* Text */}
                       <div className="w-full md:w-1/2 relative">
                          {/* Dot on timeline */}
                          <div className={`hidden md:block absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-[#00aeef] rounded-full border-4 border-[#001829] shadow-[0_0_20px_#00aeef]
                             ${i % 2 === 0 ? '-left-[calc(32px+2rem)]' : '-right-[calc(32px+2rem)]'}
                          `} />
                          
                          <span className="text-[#00aeef] font-black text-sm uppercase tracking-widest mb-2 block">{story.year}</span>
                          <h3 className="text-3xl font-bold text-white mb-4">{story.title[lang]}</h3>
                          <p className="text-white/60 leading-relaxed text-lg">{story.desc[lang]}</p>
                       </div>
                    </motion.div>
                 ))}
              </div>
           </div>
        </section>

        {/* 6. CTA */}
        <section className="py-32 text-center">
           <div className="relative p-12 rounded-[3rem] border border-white/10 bg-gradient-to-b from-white/5 to-transparent overflow-hidden">
              <div className="relative z-10 max-w-2xl mx-auto">
                 <h2 className="text-4xl md:text-6xl font-black text-white mb-6">
                    {lang === 'mn' ? 'Өөрчлөлтийг Бүтээ' : 'Be The Change'}
                 </h2>
                 <p className="text-white/60 text-lg mb-8">
                    {lang === 'mn' 
                      ? 'Таны оруулсан хувь нэмэр дараагийн том амжилтын эхлэл байх болно.' 
                      : 'Your contribution is the spark for our next major milestone.'}
                 </p>
                 <Link href="/donate" className="inline-flex items-center gap-3 px-8 py-4 bg-[#00aeef] text-white rounded-full font-black uppercase tracking-widest text-sm shadow-[0_0_40px_-10px_rgba(0,174,239,0.5)] hover:shadow-[0_0_60px_-10px_rgba(0,174,239,0.6)] hover:scale-105 transition-all">
                    <span>{lang === 'mn' ? 'Хандив Өгөх' : 'Support Our Cause'}</span>
                    <ArrowRight size={16} />
                 </Link>
              </div>
              
              {/* Background Glow */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#00aeef] rounded-full blur-[200px] opacity-[0.1]" />
           </div>
        </section>

      </div>
    </div>
  );
}