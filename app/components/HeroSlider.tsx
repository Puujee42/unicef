"use client";

import React, { useRef, useEffect, useState } from "react";
import Link from "next/link";
import { 
  ArrowRight, 
  Play, 
  Users, 
  Globe, 
  Heart, 
  Sparkles,
  ChevronRight
} from "lucide-react";
import { 
  motion, 
  useScroll, 
  useTransform, 
  useSpring, 
  useMotionValue 
} from "framer-motion";
import { useLanguage } from "../context/LanguageContext";
import { useTheme } from "next-themes";

// --- CONFIG ---


export default function CinematicHero() {
  const { language: lang } = useLanguage();
  const { theme } = useTheme();
  const isDark = theme === "dark" || !theme;
  const [mounted, setMounted] = useState(false);

  // Mouse Parallax Effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  useEffect(() => {
    setMounted(true);
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const moveX = (clientX - window.innerWidth / 2) / 50;
      const moveY = (clientY - window.innerHeight / 2) / 50;
      mouseX.set(moveX);
      mouseY.set(moveY);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  if (!mounted) return null;

  return (
    <section className="relative h-screen min-h-[600px] md:h-screen w-full overflow-hidden flex items-center justify-center">
      
      {/* 1. VIDEO BACKGROUND ENGINE */}
      <div className="absolute inset-0 z-0">
        <div className={`absolute inset-0 z-10 transition-colors duration-1000 
          ${isDark 
            ? "bg-black/60 bg-gradient-to-b from-black/40 via-transparent to-black" 
            : "bg-white/40 bg-gradient-to-b from-white/20 via-transparent to-white"}`} 
        />
        <video
          autoPlay
          muted
          loop
          playsInline
          className="h-full w-full object-cover scale-105"
          poster="/video-poster.jpg" // Fallback image
        >
          {/* REPLACE THIS URL WITH YOUR ACTUAL VIDEO LINK */}
          <source src="/A_clean_modern_1080p_202601052236.mp4" type="video/mp4" />
        </video>
      </div>

      {/* 2. MAIN CINEMATIC CONTENT */}
      <motion.div 
        style={{ x: springX, y: springY }}
        className="relative z-20 w-full max-w-7xl mx-auto px-6 md:px-12 flex flex-col items-start pt-20 md:pt-0"
      >
        
        {/* Dynamic Status Badge */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className={`flex items-center gap-2 px-4 py-2 rounded-full border mb-6 md:mb-8 backdrop-blur-md
            ${isDark ? "bg-white/5 border-white/10 text-white" : "bg-black/5 border-black/10 text-black"}`}
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00aeef] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00aeef]"></span>
          </span>
          <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em]">
            {lang === 'mn' ? "ШУУД: ХҮҮХЭД БҮРИЙН ТӨЛӨӨ" : "LIVE: FOR EVERY CHILD"}
          </span>
        </motion.div>

        {/* Informative Headline */}
        <div className="max-w-4xl">
          <motion.h1 
            initial={{ clipPath: "inset(0 100% 0 0)" }}
            animate={{ clipPath: "inset(0 0% 0 0)" }}
            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className={`text-5xl sm:text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter leading-[0.85] mb-6 md:mb-8
              ${isDark ? "text-white" : "text-slate-900"}`}
          >
            ACTING FOR <br /> 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00aeef] to-[#40c9ff]">
              TOMORROW
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className={`text-base md:text-2xl font-medium max-w-2xl leading-relaxed mb-8 md:mb-12
              ${isDark ? "text-white/60" : "text-slate-700"}`}
          >
            {lang === 'mn' 
              ? "Монголын залуучуудын нэгдэл. Бид хүүхдийн эрх, сайн сайхны төлөө бодит өөрчлөлтийг хамтдаа бүтээж байна."
              : "A movement of Mongolian students. Join us in creating tangible change for child rights and welfare nationwide."}
          </motion.p>
        </div>

        {/* Action Group */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="flex flex-wrap gap-3 md:gap-4 items-center"
        >
          <Link href="/join">
            <button className="px-8 md:px-10 py-4 md:py-5 bg-[#00aeef] hover:bg-[#009bd5] text-white rounded-full font-black uppercase tracking-widest text-[10px] md:text-xs shadow-2xl shadow-[#00aeef]/40 transition-all hover:scale-105 active:scale-95 flex items-center gap-3">
              {lang === 'mn' ? "Одоо нэгдэх" : "Join Movement"}
              <ArrowRight size={18} />
            </button>
          </Link>
          
          <Link href="/about">
            <button className={`px-8 md:px-10 py-4 md:py-5 rounded-full font-black uppercase tracking-widest text-[10px] md:text-xs transition-all border flex items-center gap-3
              ${isDark 
                ? "bg-white/5 border-white/10 text-white hover:bg-white/10" 
                : "bg-black/5 border-black/10 text-black hover:bg-black/10"}`}>
              {lang === 'mn' ? "Бидний түүх" : "Our Story"}
              <Play size={16} fill="currentColor" />
            </button>
          </Link>
        </motion.div>

      </motion.div>

      {/* Side Decorative Element (Vertical Text) */}
      <div className={`hidden xl:block absolute right-12 top-1/2 -translate-y-1/2 vertical-text font-black text-[10px] uppercase tracking-[1em] opacity-20 transition-colors
        ${isDark ? "text-white" : "text-black"}`}>
        UNICEF STUDENT CLUB • MONGOLIA • 2024
      </div>

      <style jsx>{`
        .vertical-text {
          writing-mode: vertical-rl;
          text-orientation: mixed;
        }
      `}</style>

    </section>
  );
}