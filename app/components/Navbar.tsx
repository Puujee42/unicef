"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Home,
  Users,
  Calendar,
  LogIn,
  HandHeart,
  Sparkles,
  ChevronRight,
  ArrowRight,
  Heart,
  LayoutDashboard // Added Icon for Dashboard
} from "lucide-react";
import {
  motion,
  useScroll,
  useMotionValueEvent,
  useSpring,
  useTransform,
  useMotionValue,
} from "framer-motion";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { useLanguage } from "../context/LanguageContext";

// --- CONFIG ---
const CONTENT = {
  logo: { mn: "UNICEF CLUB", en: "UNICEF CLUB" },
  sub: { mn: "MONGOLIA", en: "MONGOLIA" },
  login: { mn: "Нэвтрэх", en: "Sign In" },
  join: { mn: "Нэгдэх", en: "Join Us" },
  dashboard: { mn: "Миний Булан", en: "Dashboard" }, // Updated label
};

// --- MAGNETIC BUTTON ---
const MagneticWrapper = ({ children, strength = 0.5 }: { children: React.ReactNode; strength?: number }) => {
  const ref = useRef<HTMLDivElement>(null);
  const position = { x: useMotionValue(0), y: useMotionValue(0) };

  const handleMouse = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current!.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    position.x.set(middleX * strength);
    position.y.set(middleY * strength);
  };

  const reset = () => { position.x.set(0); position.y.set(0); };
  const springX = useSpring(position.x, { stiffness: 150, damping: 15, mass: 0.1 });
  const springY = useSpring(position.y, { stiffness: 150, damping: 15, mass: 0.1 });

  return (
    <motion.div ref={ref} onMouseMove={handleMouse} onMouseLeave={reset} style={{ x: springX, y: springY }}>
      {children}
    </motion.div>
  );
};

export default function UnicefNavbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const { language: lang, setLanguage } = useLanguage();
  
  // Scroll Hooks
  const { scrollY, scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  // Transforms
  const width = useTransform(scrollY, [0, 100], ["1200px", "1080px"]); 
  const y = useTransform(scrollY, [0, 100], [24, 12]);
  
  const navBg = useTransform(scrollY, [0, 100], ["rgba(0, 174, 239, 1)", "rgba(255, 255, 255, 0.9)"]);
  const borderColor = useTransform(scrollY, [0, 100], ["rgba(255,255,255,0.15)", "rgba(0, 174, 239, 0.15)"]);
  const shadow = useTransform(scrollY, [0, 100], ["0px 10px 30px -10px rgba(0, 174, 239, 0.2)", "0px 10px 40px -10px rgba(0,0,0,0.1)"]);
  
  const widthSpring = useSpring(width, { stiffness: 100, damping: 20 });
  const ySpring = useSpring(y, { stiffness: 100, damping: 20 });

  useEffect(() => setMounted(true), []);
  useMotionValueEvent(scrollY, "change", (latest) => setIsScrolled(latest > 50));
  if (!mounted) return null;

  const toggleLanguage = () => setLanguage(lang === "mn" ? "en" : "mn");

  const desktopNav = [
    { name: { mn: "Нүүр", en: "Home" }, href: "/", icon: Home },
    { name: { mn: "Бидний тухай", en: "About" }, href: "/about", icon: Users },
    { name: { mn: "Арга хэмжээ", en: "Events" }, href: "/events", icon: Calendar, badge: true },
    { name: { mn: "Үр нөлөө", en: "Impact" }, href: "/impact", icon: Sparkles },
  ];

  const mobileNav = [
    { id: "home", icon: Home, href: "/", label: { mn: "Нүүр", en: "Home" } },
    { id: "events", icon: Calendar, href: "/events", label: { mn: "Арга хэмжээ", en: "Events" } },
    { id: "join", icon: HandHeart, href: "/join", label: { mn: "Нэгдэх", en: "Join" }, isMain: true },
    { id: "dashboard", icon: Users, href: "/dashboard", label: { mn: "Профайл", en: "Profile" } },
    { id: "impact", icon: Heart, href: "/impact", label: { mn: "Үр нөлөө", en: "Impact" } },
  ];

  return (
    <>
      {/* ========================================================= */}
      {/* 1. DESKTOP HEADER                                        */}
      {/* ========================================================= */}
      <motion.div 
        style={{ width: widthSpring, y: ySpring }} 
        className="fixed z-50 left-0 right-0 hidden md:flex justify-center pointer-events-none mx-auto h-[70px]"
      >
        <div className="relative w-full h-full flex items-center">

          {/* LAYER A: VISUAL BACKGROUND (Clipped) */}
          <motion.div 
            style={{ backgroundColor: navBg, borderColor: borderColor, boxShadow: shadow }}
            className="absolute inset-0 rounded-full border-2 overflow-hidden z-0 backdrop-blur-xl"
          >
             <div className="absolute inset-0 opacity-[0.05]"
                  style={{ backgroundImage: `radial-gradient(circle, white 1px, transparent 1px)`, backgroundSize: '24px 24px' }} 
             />
             <motion.div 
               style={{ scaleX }}
               className="absolute bottom-0 left-6 right-6 h-[3px] bg-gradient-to-r from-transparent via-[#00aeef] to-transparent origin-left opacity-60"
             />
          </motion.div>

          {/* LAYER B: CONTENT (Interactive - Not Clipped) */}
          <div className="relative z-10 w-full px-6 flex items-center justify-between pointer-events-auto">
            
            {/* LOGO */}
            <Link href="/" className="flex items-center gap-4 group/logo pr-6 border-r border-white/10 mr-2 flex-shrink-0">
               <div className="relative">
                   <motion.div 
                     whileHover={{ rotate: 360 }}
                     transition={{ duration: 0.7, ease: "circOut" }}
                     className="relative rounded-full overflow-hidden border-2 border-white/40 shadow-inner w-11 h-11 bg-white"
                   >
                      <Image alt="Logo" src="/logo.jpg" fill className="object-cover" />
                   </motion.div>
                   <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></span>
               </div>
               
               <div className="flex flex-col leading-none">
                  <span className={`font-black text-lg tracking-tight whitespace-nowrap ${isScrolled ? "text-[#00aeef]" : "text-white"}`}>
                     {CONTENT.logo[lang]}
                  </span>
                  <span className={`text-[9px] font-bold tracking-[0.3em] uppercase flex items-center gap-1 ${isScrolled ? "text-gray-400" : "text-white/80"}`}>
                     {CONTENT.sub[lang]}
                     <ChevronRight size={8} /> 2025
                  </span>
               </div>
            </Link>

            {/* NAVIGATION LINKS */}
            <div className="flex items-center gap-1 flex-1 justify-center min-w-0">
              {desktopNav.map((item) => {
                 const isActive = pathname === item.href;
                 return (
                  <Link key={item.href} href={item.href} className="relative px-4 py-2 group/link overflow-hidden rounded-full flex-shrink-0">
                    {isActive && (
                      <motion.div 
                        layoutId="desktopBubble"
                        className={`absolute inset-0 rounded-full -z-10 ${isScrolled ? "bg-[#00aeef]/10" : "bg-white/20"}`}
                        transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
                      />
                    )}
                    
                    <div className="flex items-center gap-2">
                      <item.icon 
                          size={14} 
                          className={`transition-all duration-300 ${isScrolled ? (isActive ? "text-[#00aeef]" : "text-gray-400 group-hover/link:text-[#00aeef]") : "text-white"}`} 
                      />
                      <span className={`text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-colors duration-300 ${isScrolled ? (isActive ? "text-[#00aeef]" : "text-gray-600 group-hover/link:text-[#00aeef]") : "text-white"}`}>
                          {item.name[lang]}
                      </span>
                      {item.badge && (
                          <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                          </span>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* RIGHT SIDE ACTIONS */}
            <div className="flex items-center gap-6 border-l border-white/10 pl-6 ml-2 flex-shrink-0">
               
               {/* Language Toggle (z-100 to fix intersection issues) */}
               <button 
                 onClick={toggleLanguage} 
                 className={`relative z-[100] w-9 h-9 flex items-center justify-center rounded-full border border-white/20 transition-all active:scale-95 ${isScrolled ? "text-gray-500 hover:bg-gray-100" : "text-white hover:bg-white/10"}`}
               >
                  <span className="text-[10px] font-black">{lang === "mn" ? "EN" : "MN"}</span>
               </button>

               {/* Logged In State: Show Dashboard Button + User Profile */}
               <SignedIn>
                   <div className="flex items-center gap-4 relative z-50">
                       <Link href="/dashboard" className={`
                          hidden lg:flex items-center gap-2 px-5 py-2 rounded-full border text-xs font-bold uppercase tracking-wide transition-all
                          ${isScrolled 
                             ? "border-[#00aeef] text-[#00aeef] hover:bg-[#00aeef] hover:text-white" 
                             : "border-white/20 bg-white/10 text-white hover:bg-white hover:text-[#00aeef]"}
                       `}>
                          <LayoutDashboard size={14} />
                          <span>{CONTENT.dashboard[lang]}</span>
                       </Link>
                       <div className="ring-2 ring-offset-2 ring-[#00aeef] rounded-full scale-110">
                           <UserButton afterSignOutUrl="/" />
                       </div>
                   </div>
               </SignedIn>

               {/* Logged Out State: Join Button */}
               <SignedOut>
                 <div className="relative z-50"> 
                   <MagneticWrapper strength={0.3}>
                     <Link href="/join" className={`
                        flex items-center gap-2 px-6 py-3 rounded-full text-xs font-black uppercase tracking-wide overflow-hidden transition-all whitespace-nowrap group shadow-lg
                        ${isScrolled ? "bg-[#00aeef] text-white shadow-[#00aeef]/30" : "bg-white text-[#00aeef] shadow-white/10"}
                     `}>
                        <span className="relative z-10 flex items-center gap-2 group-hover:gap-3 transition-all">
                            {CONTENT.join[lang]} <ArrowRight size={14} />
                        </span>
                        <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1s_infinite] bg-gradient-to-r from-transparent via-white/30 to-transparent" />
                     </Link>
                   </MagneticWrapper>
                 </div>
               </SignedOut>
            </div>

          </div>
        </div>
      </motion.div>

      {/* ========================================================= */}
      {/* 2. MOBILE HEADER & 3. BOTTOM DOCK (No changes needed)    */}
      {/* ========================================================= */}
      <motion.div initial={{ y: -100 }} animate={{ y: 0 }} className="md:hidden fixed top-0 left-0 right-0 z-40 px-5 py-3 flex justify-between items-center bg-white/80 backdrop-blur-xl border-b border-white/20 shadow-sm">
        <Link href="/" className="flex items-center gap-3">
           <div className="relative">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#00aeef] to-[#00dbde] flex items-center justify-center text-white shadow-lg ring-2 ring-white">
                  <HandHeart size={20} strokeWidth={2.5} />
              </div>
           </div>
           <div className="flex flex-col">
              <span className="font-black text-[#00aeef] text-sm leading-none tracking-tight">UNICEF</span>
              <span className="font-bold text-gray-400 text-[9px] tracking-[0.2em] leading-none mt-1">MONGOLIA</span>
           </div>
        </Link>
        <div className="flex gap-3 items-center">
            <button onClick={toggleLanguage} className="bg-gray-50 border border-gray-200 w-8 h-8 flex items-center justify-center rounded-full text-[10px] font-bold text-gray-600">{lang === 'mn' ? 'EN' : 'MN'}</button>
            <SignedIn><UserButton afterSignOutUrl="/" /></SignedIn>
            <SignedOut><Link href="/sign-in" className="bg-[#00aeef] text-white p-2 rounded-full shadow-lg shadow-blue-200"><LogIn size={18} /></Link></SignedOut>
        </div>
      </motion.div>

      <div className="md:hidden fixed bottom-6 left-0 right-0 z-50 px-4 flex justify-center pointer-events-none">
        <motion.nav initial={{ y: 100 }} animate={{ y: 0 }} className="pointer-events-auto flex items-end justify-between w-full max-w-[380px] px-3 py-3 rounded-[2.5rem] bg-white/90 backdrop-blur-xl shadow-[0_20px_40px_-10px_rgba(0,0,0,0.15)] border border-white/50">
          {mobileNav.map((item) => {
            const isActive = pathname === item.href;
            if (item.isMain) {
              return (
                <Link key={item.id} href={item.href} className="relative -top-8 group px-2">
                   <div className="absolute inset-0 rounded-full animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite] bg-[#00aeef] opacity-10 z-0"></div>
                  <motion.div whileTap={{ scale: 0.9 }} className="w-16 h-16 rounded-full flex flex-col items-center justify-center bg-gradient-to-br from-[#00aeef] to-[#0077a3] text-white shadow-[0_10px_20px_rgba(0,174,239,0.4)] relative z-10 border-4 border-white/50">
                    <item.icon size={26} strokeWidth={2.5} className={isActive ? "animate-pulse" : ""} />
                  </motion.div>
                  <div className="absolute -bottom-6 w-full text-center"><span className="text-[9px] font-black uppercase text-[#00aeef] tracking-wider bg-white/80 px-2 py-0.5 rounded-full shadow-sm backdrop-blur-sm">{item.label[lang]}</span></div>
                </Link>
              );
            }
            return (
              <Link key={item.id} href={item.href} className="flex-1 flex flex-col items-center justify-center h-14 w-14 group relative">
                 {isActive && (<motion.div layoutId="mobileActiveBg" className="absolute inset-2 bg-blue-50 rounded-2xl -z-10" transition={{ type: "spring", stiffness: 300, damping: 30 }} />)}
                <div className={`transition-all duration-300 transform ${isActive ? "text-[#00aeef] scale-110" : "text-gray-400 group-active:scale-90"}`}><item.icon size={24} strokeWidth={isActive ? 2.5 : 2} /></div>
              </Link>
            );
          })}
        </motion.nav>
      </div>
      <div className="md:hidden h-24" />
    </>
  );
}