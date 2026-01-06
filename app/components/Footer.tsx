"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  ArrowUp, 
  Facebook, 
  Instagram, 
  Twitter, 
  Mail, 
  MapPin, 
  Send, 
  Heart,
  Sparkles,
  ChevronRight
} from "lucide-react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import { useLanguage } from "../context/LanguageContext";

// --- CONFIG ---
const LINKS = {
  about: [
    { label: { en: "Our Story", mn: "Бидний тухай" }, href: "/about" },
    { label: { en: "Team", mn: "Баг хамт олон" }, href: "/team" },
    { label: { en: "Impact", mn: "Үр нөлөө" }, href: "/impact" },
  ],
  action: [
    { label: { en: "Donate", mn: "Хандив өгөх" }, href: "/donate" },
    { label: { en: "Volunteer", mn: "Сайн дурын ажил" }, href: "/join" },
    { label: { en: "Events", mn: "Арга хэмжээ" }, href: "/events" },
  ],
};

const SOCIALS = [
  { icon: Facebook, href: "https://facebook.com", label: "Facebook" },
  { icon: Instagram, href: "https://instagram.com", label: "Instagram" },
  { icon: Twitter, href: "https://twitter.com", label: "Twitter" },
];

export default function Footer() {
  const { language: lang } = useLanguage();
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { scrollYProgress } = useScroll();
  
  // Parallax for the giant background text
  const yText = useTransform(scrollYProgress, [0.8, 1], [100, 0]);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const isDark = theme === "dark" || !theme;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className={`relative w-full overflow-hidden transition-colors duration-700 
      ${isDark ? "bg-[#00101a]" : "bg-slate-50"}`}>
      
      {/* 1. NEWSLETTER BRIDGE SECTION */}
      <div className="relative z-20 max-w-7xl mx-auto px-6 -mb-16">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className={`relative p-1 rounded-[3rem] overflow-hidden shadow-2xl transition-all duration-500
            ${isDark 
              ? "bg-gradient-to-br from-[#00aeef]/30 to-transparent border border-white/10" 
              : "bg-gradient-to-br from-[#00aeef]/10 to-transparent border border-sky-100"}`}
        >
          {/* Glass Effect Inner */}
          <div className={`relative z-10 p-8 md:p-12 rounded-[2.9rem] backdrop-blur-3xl flex flex-col lg:flex-row items-center justify-between gap-10
            ${isDark ? "bg-[#001829]/80" : "bg-white/90"}`}>
            
            <div className="max-w-xl text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00aeef]/10 text-[#00aeef] text-[10px] font-black uppercase tracking-widest mb-4">
                <Sparkles size={12} fill="currentColor" />
                {lang === 'mn' ? "Шинэ мэдээ" : "Newsletter"}
              </div>
              <h2 className={`text-3xl md:text-5xl font-black tracking-tighter leading-none mb-4
                ${isDark ? "text-white" : "text-[#001829]"}`}>
                {lang === 'mn' ? "Өөрчлөлтийн нэг хэсэг бол" : "Be the Change You Want to See"}
              </h2>
              <p className={`text-lg font-medium opacity-60 ${isDark ? "text-white" : "text-slate-600"}`}>
                {lang === 'mn' 
                  ? "Долоо хоног бүр клубын үйл ажиллагааны мэдээллийг и-мэйлээр аваарай." 
                  : "Join our community and get weekly updates on impact, events, and stories."}
              </p>
            </div>

            <div className="w-full lg:w-auto">
              <form className="relative flex flex-col sm:flex-row gap-3 min-w-[320px] sm:min-w-[450px]">
                <input 
                  type="email" 
                  placeholder={lang === 'mn' ? "И-мэйл хаяг" : "Your email address"}
                  className={`flex-1 px-6 py-5 rounded-2xl text-sm font-bold transition-all focus:outline-none focus:ring-2 focus:ring-[#00aeef]
                    ${isDark 
                      ? "bg-white/5 border border-white/10 text-white placeholder:text-white/20" 
                      : "bg-slate-100 border border-slate-200 text-[#001829] placeholder:text-slate-400"}`}
                />
                <button className="bg-[#00aeef] hover:bg-[#009bd5] text-white px-8 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-[#00aeef]/20 transition-all active:scale-95 flex items-center justify-center gap-2 group">
                  {lang === 'mn' ? "Бүртгүүлэх" : "Subscribe"}
                  <Send size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </button>
              </form>
              <p className={`text-[10px] font-medium mt-4 text-center lg:text-left opacity-40 uppercase tracking-widest ${isDark ? "text-white" : "text-slate-900"}`}>
                {lang === 'mn' ? "Бид таны мэдээллийг хэзээ ч бусдад хуваалцахгүй" : "Your privacy is our priority. No spam, ever."}
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* 2. MAIN FOOTER CONTENT */}
      <div className={`relative pt-40 pb-12 px-6 border-t transition-colors duration-700
        ${isDark ? "bg-[#001829] border-white/5" : "bg-white border-slate-100"}`}>
        
        {/* Background Ambience */}
        <div className="absolute inset-0 pointer-events-none opacity-50">
          <div className={`absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full blur-[150px]
            ${isDark ? "bg-[#00aeef]/10" : "bg-sky-100"}`} />
          <div className="absolute inset-0 opacity-[0.03] bg-[url('/noise.png')] mix-blend-overlay" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
            
            {/* Column 1: Brand */}
            <div className="space-y-8">
              <Link href="/" className="flex items-center gap-4 group">
                <div className={`relative w-14 h-14 rounded-full flex items-center justify-center p-0.5 border-2 transition-transform duration-500 group-hover:rotate-12
                  ${isDark ? "bg-white border-[#00aeef]" : "bg-white border-sky-100 shadow-sm"}`}>
                   <Image src="/logo.jpg" alt="Logo" width={50} height={50} className="rounded-full object-cover" />
                </div>
                <div>
                  <h2 className={`text-xl font-black tracking-tight leading-none ${isDark ? "text-white" : "text-[#001829]"}`}>UNICEF CLUB</h2>
                  <p className="text-[#00aeef] font-bold tracking-[0.3em] text-[10px] mt-1">MONGOLIA</p>
                </div>
              </Link>
              <p className={`text-sm leading-relaxed font-medium opacity-60 ${isDark ? "text-white" : "text-slate-600"}`}>
                {lang === 'mn' 
                  ? "MNUMS Student UNICEF Club нь хүүхэд бүрийн эрхийг хамгаалах, тэднийг дэмжих зорилготой залуучуудын нэгдэл юм."
                  : "Empowering students at MNUMS to advocate for children's rights and create lasting impact across Mongolia."}
              </p>
              <div className="flex gap-4">
                {SOCIALS.map((soc, i) => (
                  <a key={i} href={soc.href} className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all hover:scale-110
                    ${isDark ? "bg-white/5 border-white/10 text-white/60 hover:text-[#00aeef] hover:border-[#00aeef]" : "bg-slate-50 border-slate-200 text-slate-400 hover:text-[#00aeef] hover:border-[#00aeef]"}`}>
                    <soc.icon size={18} />
                  </a>
                ))}
              </div>
            </div>

            {/* Column 2 & 3: Links */}
            {[
              { title: { en: "Organization", mn: "Байгууллага" }, items: LINKS.about },
              { title: { en: "Ways to Help", mn: "Туслах замууд" }, items: LINKS.action }
            ].map((col, i) => (
              <div key={i}>
                <h4 className={`text-xs font-black uppercase tracking-[0.2em] mb-8 ${isDark ? "text-[#00aeef]" : "text-sky-600"}`}>
                  {col.title[lang]}
                </h4>
                <ul className="space-y-4">
                  {col.items.map((link, j) => (
                    <li key={j}>
                      <Link href={link.href} className={`text-sm font-bold flex items-center gap-2 group transition-colors
                        ${isDark ? "text-white/40 hover:text-white" : "text-slate-400 hover:text-[#001829]"}`}>
                        <ChevronRight size={14} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-[#00aeef]" />
                        {link.label[lang]}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* Column 4: Contact */}
            <div>
              <h4 className={`text-xs font-black uppercase tracking-[0.2em] mb-8 ${isDark ? "text-[#00aeef]" : "text-sky-600"}`}>
                {lang === 'mn' ? "Холбоо барих" : "Get in Touch"}
              </h4>
              <ul className="space-y-6">
                <li className="flex gap-4">
                  <div className={`p-3 rounded-2xl h-fit border ${isDark ? "bg-white/5 border-white/10" : "bg-sky-50 border-sky-100"}`}>
                    <MapPin size={18} className="text-[#00aeef]" />
                  </div>
                  <span className={`text-sm font-bold leading-tight ${isDark ? "text-white/60" : "text-slate-600"}`}>
                    MNUMS Campus B,<br/> Sukhbaatar District,<br/> Ulaanbaatar, MN
                  </span>
                </li>
                <li className="flex gap-4 items-center">
                  <div className={`p-3 rounded-2xl border ${isDark ? "bg-white/5 border-white/10" : "bg-sky-50 border-sky-100"}`}>
                    <Mail size={18} className="text-[#00aeef]" />
                  </div>
                  <a href="mailto:club@mnums.edu.mn" className={`text-sm font-bold hover:text-[#00aeef] transition-colors ${isDark ? "text-white/60" : "text-slate-600"}`}>
                    club@mnums.edu.mn
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* 3. GIANT WATERMARK */}
          <div className="absolute bottom-0 left-0 w-full overflow-hidden pointer-events-none select-none z-0">
             <motion.h1 
               style={{ y: yText }}
               className={`text-[12rem] md:text-[22rem] font-black text-center leading-[0.7] tracking-tighter whitespace-nowrap opacity-[0.03] transition-colors
                 ${isDark ? "text-white" : "text-slate-900"}`}
             >
                UNICEF CLUB
             </motion.h1>
          </div>

          {/* 4. FOOTER BOTTOM */}
          <div className={`relative z-10 pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-6
            ${isDark ? "border-white/5" : "border-slate-100"}`}>
            
            <p className={`text-[10px] font-bold uppercase tracking-widest ${isDark ? "text-white/20" : "text-slate-400"}`}>
              © 2025 MNUMS Student UNICEF Club. 
              <span className="ml-2 inline-flex items-center gap-1">
                Made with <Heart size={10} className="text-rose-500 fill-rose-500 animate-pulse" /> for every child.
              </span>
            </p>

            <div className="flex items-center gap-8">
               <Link href="/privacy" className={`text-[10px] font-black uppercase tracking-widest hover:text-[#00aeef] transition-colors ${isDark ? "text-white/20" : "text-slate-400"}`}>
                 {lang === 'mn' ? "Нууцлал" : "Privacy"}
               </Link>
               <button 
                onClick={scrollToTop}
                className={`group flex items-center gap-2 px-6 py-2 rounded-full border transition-all text-[10px] font-black uppercase tracking-widest
                  ${isDark 
                    ? "bg-white/5 border-white/10 text-white/40 hover:bg-[#00aeef] hover:text-white" 
                    : "bg-slate-50 border-slate-200 text-slate-400 hover:bg-[#00aeef] hover:text-white"}`}
              >
                 Top <ArrowUp size={12} className="group-hover:-translate-y-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

