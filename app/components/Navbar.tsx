"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { 
  Home,
  Users,
  Sparkles,
  LayoutGrid,
  Globe,
  Sun,
  Moon,
  LogIn,
  Calendar,
  HandHeart,
  Heart,
  School,
  Library,
  Compass,
  Megaphone
} from "lucide-react";
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { useLanguage } from "../context/LanguageContext";

const CONTENT = {
  logo: { mn: "UNICEF CLUB", en: "UNICEF CLUB" },
  login: { mn: "Нэвтрэх", en: "Sign In" },
  register: { mn: "Бүртгүүлэх", en: "Register" },
  dashboard: { mn: "Самбар", en: "Panel" },
};

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const { language: lang, setLanguage } = useLanguage();
  const { resolvedTheme, setTheme } = useTheme();
  const { scrollY } = useScroll();

  useEffect(() => setMounted(true), []);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 50);
  });

  if (!mounted) return null;

  const isDark = resolvedTheme === "dark";
  const toggleLanguage = () => setLanguage(lang === "mn" ? "en" : "mn");
  const toggleTheme = () => setTheme(isDark ? "light" : "dark");

  const desktopNav = [
    { name: { mn: "Нүүр", en: "Home" }, href: "/" },
    { name: { mn: "Бидний тухай", en: "About" }, href: "/about" },
    { name: { mn: "Клубууд", en: "Clubs" }, href: "/clubs" },
    { name: { mn: "Төсөл & Хөтөлбөр", en: "Programs" }, href: "/events" },
    { name: { mn: "Боломжууд", en: "Opportunities" }, href: "/opportunities" },
    { name: { mn: "Мэдээ", en: "News" }, href: "/news" },
  ];

  const mobileNav = [
    { id: "home", icon: Home, href: "/", label: { mn: "Нүүр", en: "Home" } },
    { id: "clubs", icon: School, href: "/clubs", label: { mn: "Клуб", en: "Clubs" } },
    { id: "join", icon: HandHeart, href: "/join", label: { mn: "Нэгдэх", en: "Join" }, isMain: true },
    { id: "opportunities", icon: Compass, href: "/opportunities", label: { mn: "Боломж", en: "Opp" } },
    { id: "news", icon: Megaphone, href: "/news", label: { mn: "Мэдээ", en: "News" } },
  ];

  return (
    <>
      {/* ========================================================= */}
      {/* 1. DESKTOP HEADER                                         */}
      {/* ========================================================= */}
      <motion.header 
        className="fixed z-50 left-0 right-0 hidden lg:flex justify-center pointer-events-none"
        animate={{ y: 20 }}
        transition={{ type: "spring", stiffness: 200, damping: 25 }}
      >
        <nav className={`
          pointer-events-auto flex items-center justify-between transition-all duration-700
          w-[95%] lg:w-[1200px] py-3 px-8 rounded-full border backdrop-blur-2xl shadow-2xl
          ${isScrolled 
            ? (isDark ? "bg-[#00101a]/95 border-sky-900/40 shadow-black" : "bg-white/95 border-sky-100 shadow-sky-900/20")
            : (isDark ? "bg-[#00101a]/40 border-white/5" : "bg-white/40 border-white/20 shadow-none")}
          ${isDark 
            ? "text-sky-50" 
            : "text-[#001829]"}
        `}>
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group shrink-0">
             <div className="relative w-10 h-10 overflow-hidden rounded-full border-2 border-[#00aeef]/20 shadow-inner">
                <Image src="/logo.jpg" alt="Logo" fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
             </div>
             <span className="font-serif font-black text-xl tracking-tighter text-[#00aeef]">{CONTENT.logo[lang]}</span>
          </Link>

          {/* Links */}
          <div className="flex items-center gap-0.5 bg-current/5 p-1 rounded-full mx-4">
            {desktopNav.map((item) => (
              <Link 
                key={item.href} 
                href={item.href} 
                className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.05em] transition-all whitespace-nowrap
                  ${pathname === item.href 
                    ? (isDark ? "bg-[#00aeef] text-[#00101a]" : "bg-[#001829] text-white") 
                    : "opacity-60 hover:opacity-100"}`}
              >
                {item.name[lang]}
              </Link>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="flex items-center gap-2 shrink-0">
             <button onClick={toggleLanguage} className="w-10 h-10 rounded-full border flex items-center justify-center border-current/10 hover:bg-current/10 transition-all active:scale-90">
                <Globe size={16}/>
             </button>

             <button onClick={toggleTheme} className="w-10 h-10 rounded-full border flex items-center justify-center border-current/10 hover:bg-current/10 transition-all active:scale-90">
                {isDark ? <Sun size={16} /> : <Moon size={16} />}
             </button>
           
             <div className="h-6 w-[1px] bg-current/10 mx-1" />

             <SignedIn>
                <div className="flex items-center gap-3">
                    <Link href="/dashboard" className="text-[9px] font-black uppercase tracking-widest opacity-70 hover:opacity-100 border-b-2 border-[#00aeef]/50">
                        {CONTENT.dashboard[lang]}
                    </Link>
                    <div className="scale-100"><UserButton /></div>
                </div>
             </SignedIn>
             
             <SignedOut>
               <Link href="/sign-in">
                  <button className="px-6 py-2.5 rounded-full bg-[#00aeef] hover:bg-sky-600 text-white text-[9px] font-black uppercase tracking-widest shadow-xl shadow-sky-900/20 transition-all active:scale-95">
                    {CONTENT.login[lang]}
                  </button>
               </Link>
             </SignedOut>
          </div>
        </nav>
      </motion.header>


      {/* ========================================================= */}
      {/* 2. MOBILE TOP BAR                                         */}
      {/* ========================================================= */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 px-5 py-4 flex justify-between items-center pointer-events-none">
        <Link href="/" className="pointer-events-auto">
           <div className={`p-1 rounded-full backdrop-blur-xl border shadow-2xl transition-all ${
             isDark ? "bg-white/10 border-white/30" : "bg-white/80 border-sky-100"
           }`}>
              <Image src="/logo.jpg" alt="Logo" width={34} height={34} className="rounded-full" />
           </div>
        </Link>

        <div className="flex items-center gap-2 pointer-events-auto">
            <SignedOut>
                <Link href="/sign-in">
                    <motion.button 
                      whileTap={{ scale: 0.9 }}
                      className="px-4 h-10 rounded-full bg-[#00aeef] text-white text-[10px] font-black tracking-tighter uppercase shadow-lg shadow-sky-900/30 border border-sky-400/50"
                    >
                        {CONTENT.login[lang]}
                    </motion.button>
                </Link>
            </SignedOut>

            <div className={`flex gap-1 p-1 rounded-full backdrop-blur-md border transition-all ${
              isDark ? "bg-black/5 border-white/10" : "bg-white/80 border-sky-100 shadow-sm"
            }`}>
                <button onClick={toggleLanguage} className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${isDark ? "text-sky-200" : "text-sky-900"}`}>
                    <span className="text-[9px] font-black">{lang === 'mn' ? 'EN' : 'MN'}</span>
                </button>
                <button onClick={toggleTheme} className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${isDark ? "text-sky-200" : "text-sky-900"}`}>
                    {isDark ? <Sun size={14} /> : <Moon size={14} />}
                </button>
            </div>

            <SignedIn>
                <div className="ml-1 scale-110 drop-shadow-lg"><UserButton /></div>
            </SignedIn>
        </div>
      </div>


      {/* ========================================================= */}
      {/* 3. MOBILE BOTTOM DOCK                                     */}
      {/* ========================================================= */}
      <div className="lg:hidden fixed bottom-6 left-0 right-0 z-50 px-4 flex justify-center">
        <nav className={`
          flex items-center justify-between w-full max-w-[460px] px-2 py-3 rounded-full border shadow-[0_-15px_50px_rgba(0,0,0,0.2)] backdrop-blur-3xl transition-all duration-700
          ${isDark ? "bg-[#00101a]/95 border-sky-900/50 shadow-black text-sky-50" : "bg-white/95 border-sky-100 shadow-sky-900/10 text-[#001829]"}
        `}>
          {mobileNav.map((item) => {
            const isActive = pathname === item.href;
            
            // Central Services Button (Join Us)
            if (item.isMain) {
              return (
                <Link key={item.id} href={item.href} className="relative -top-8 flex flex-col items-center">
                  <motion.div 
                    whileTap={{ scale: 0.85 }}
                    className={`w-14 h-14 rounded-full flex items-center justify-center shadow-2xl relative z-10
                      ${isDark ? "bg-[#00aeef] text-[#00101a]" : "bg-[#001829] text-white"}`}
                  >
                    <item.icon size={26} strokeWidth={2.5} />
                    <motion.div 
                      animate={{ scale: [1, 1.4], opacity: [0.4, 0] }}
                      transition={{ duration: 2.5, repeat: Infinity }}
                      className="absolute inset-0 rounded-full bg-[#00aeef]"
                    />
                  </motion.div>
                  <span className={`mt-2 text-[9px] font-black uppercase tracking-widest ${isActive ? "text-[#00aeef]" : "opacity-40"}`}>
                    {item.label[lang]}
                  </span>
                </Link>
              );
            }

            return (
              <Link key={item.id} href={item.href} className="flex-1 flex flex-col items-center justify-center py-2 relative group">
                <AnimatePresence>
                  {isActive && (
                    <motion.div 
                        layoutId="activePill" 
                        className={`absolute inset-x-1 inset-y-1 rounded-full -z-10 ${isDark ? "bg-sky-900/20" : "bg-sky-100"}`} 
                    />
                  )}
                </AnimatePresence>

                <div className={`transition-all duration-300 mb-1 ${isActive ? (isDark ? "text-sky-400 scale-110" : "text-[#001829] scale-110") : "opacity-60"}`}>
                   <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                </div>
                
                <span className={`text-[8px] font-black uppercase tracking-tighter transition-all ${isActive ? "opacity-100" : "opacity-60"}`}>
                   {item.label[lang]}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );
}