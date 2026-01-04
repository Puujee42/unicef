"use client";

import React, { useState } from "react";
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
  Heart 
} from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useLanguage } from "../context/LanguageContext";

// --- BRAND CONFIG ---
const BRAND = {
  sky: "#00aeef",
  white: "#ffffff",
  navy: "#001829",
  card: "rgba(255, 255, 255, 0.05)",
};

const LINKS = {
  about: [
    { label: { en: "Our Story", mn: "Бидний тухай" }, href: "/about" },
    { label: { en: "Team", mn: "Баг хамт олон" }, href: "/team" },
    { label: { en: "Careers", mn: "Ажлын байр" }, href: "/careers" },
  ],
  action: [
    { label: { en: "Donate", mn: "Хандив өгөх" }, href: "/donate" },
    { label: { en: "Volunteer", mn: "Сайн дурын ажил" }, href: "/join" },
    { label: { en: "Events", mn: "Арга хэмжээ" }, href: "/events" },
  ],
  legal: [
    { label: { en: "Privacy Policy", mn: "Нууцлалын бодлого" }, href: "/privacy" },
    { label: { en: "Terms of Use", mn: "Үйлчилгээний нөхцөл" }, href: "/terms" },
  ]
};

const SOCIALS = [
  { icon: Facebook, href: "https://facebook.com", color: "#1877F2" },
  { icon: Instagram, href: "https://instagram.com", color: "#E4405F" },
  { icon: Twitter, href: "https://twitter.com", color: "#1DA1F2" },
];

export default function Footer() {
  const { language: lang } = useLanguage();
  const { scrollYProgress } = useScroll();
  
  // Parallax effect for the big watermark text
  const yText = useTransform(scrollYProgress, [0.5, 1], [0, -100]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative bg-[#001829] pt-24 pb-8 overflow-hidden text-white border-t border-white/5">
      
      {/* 1. BACKGROUND ATMOSPHERE */}
      <div className="absolute inset-0 pointer-events-none">
         {/* Deep Glow Bottom */}
         <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[80vw] h-[500px] bg-[#00aeef] rounded-full blur-[200px] opacity-[0.08]" />
         
         {/* Noise Texture */}
         <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />
         
         {/* Grid Lines */}
         <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:6rem_6rem]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        
        {/* 2. TOP SECTION: CTA & BRAND */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-20 items-center">
           
           {/* Left: Brand Identity */}
           <div className="space-y-6">
              <Link href="/" className="flex items-center gap-4 group">
                 <div className="relative w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-[0_0_30px_rgba(0,174,239,0.3)]">
                    <Image src="/logo.jpg" alt="Logo" width={64} height={64} className="rounded-full object-cover p-0.5" />
                 </div>
                 <div>
                    <h2 className="text-3xl font-black tracking-tight leading-none">UNICEF CLUB</h2>
                    <p className="text-[#00aeef] font-bold tracking-[0.4em] text-sm mt-1">MONGOLIA</p>
                 </div>
              </Link>
              <p className="text-white/60 max-w-md leading-relaxed">
                 {lang === 'mn' 
                   ? "Хүүхэд бүрийн төлөө гэрэлт ирээдүйг хамтдаа бүтээцгээе."
                   : "Building a brighter future for every child, together. Join the movement for change."}
              </p>
           </div>

           {/* Right: Newsletter Glass Box */}
           <motion.div 
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             className="relative p-1 rounded-3xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 backdrop-blur-xl"
           >
              <div className="bg-[#001d30]/80 rounded-[20px] p-8">
                 <h3 className="text-xl font-bold mb-2">
                    {lang === 'mn' ? "Мэдээлэл авах" : "Stay Updated"}
                 </h3>
                 <p className="text-sm text-white/50 mb-6">
                    {lang === 'mn' ? "Манай үйл ажиллагааны талаарх мэдээллийг цаг алдалгүй аваарай." : "Get the latest updates on our campaigns and events."}
                 </p>
                 
                 <form className="flex gap-2">
                    <input 
                      type="email" 
                      placeholder="Enter your email" 
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-[#00aeef] transition-colors"
                    />
                    <button type="button" className="bg-[#00aeef] hover:bg-[#009bd5] text-white p-3 rounded-xl transition-colors shadow-lg shadow-blue-500/20">
                       <Send size={20} />
                    </button>
                 </form>
              </div>
           </motion.div>
        </div>

        {/* 3. LINKS GRID */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12 border-t border-white/10 pt-16 mb-16">
           
           {/* Column 1 */}
           <div>
              <h4 className="font-bold text-[#00aeef] uppercase tracking-widest text-xs mb-6">About Us</h4>
              <ul className="space-y-4">
                 {LINKS.about.map((link) => (
                    <li key={link.href}>
                       <Link href={link.href} className="text-white/60 hover:text-white transition-colors flex items-center gap-2 group">
                          <span className="w-1 h-1 rounded-full bg-[#00aeef] opacity-0 group-hover:opacity-100 transition-opacity" />
                          <span className="group-hover:translate-x-1 transition-transform">{link.label[lang]}</span>
                       </Link>
                    </li>
                 ))}
              </ul>
           </div>

           {/* Column 2 */}
           <div>
              <h4 className="font-bold text-[#00aeef] uppercase tracking-widest text-xs mb-6">Get Involved</h4>
              <ul className="space-y-4">
                 {LINKS.action.map((link) => (
                    <li key={link.href}>
                       <Link href={link.href} className="text-white/60 hover:text-white transition-colors flex items-center gap-2 group">
                           <span className="w-1 h-1 rounded-full bg-[#00aeef] opacity-0 group-hover:opacity-100 transition-opacity" />
                           <span className="group-hover:translate-x-1 transition-transform">{link.label[lang]}</span>
                       </Link>
                    </li>
                 ))}
              </ul>
           </div>

           {/* Column 3: Contact */}
           <div>
              <h4 className="font-bold text-[#00aeef] uppercase tracking-widest text-xs mb-6">Contact</h4>
              <ul className="space-y-6">
                 <li className="flex gap-3 text-sm text-white/70">
                    <div className="p-2 bg-white/5 rounded-lg h-fit border border-white/10">
                       <MapPin size={16} className="text-[#00aeef]" />
                    </div>
                    <span>
                       MNUMS Campus B,<br/>
                       Sukhbaatar District,<br/>
                       Ulaanbaatar, Mongolia
                    </span>
                 </li>
                 <li className="flex gap-3 text-sm text-white/70 items-center">
                    <div className="p-2 bg-white/5 rounded-lg border border-white/10">
                       <Mail size={16} className="text-[#00aeef]" />
                    </div>
                    <a href="mailto:club@mnums.edu.mn" className="hover:text-white">club@mnums.edu.mn</a>
                 </li>
              </ul>
           </div>

           {/* Column 4: Socials */}
           <div>
               <h4 className="font-bold text-[#00aeef] uppercase tracking-widest text-xs mb-6">Follow Us</h4>
               <div className="flex gap-3">
                  {SOCIALS.map((social, i) => (
                     <a 
                       key={i} 
                       href={social.href}
                       className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:border-white/30 hover:bg-white/10 transition-all hover:-translate-y-1"
                     >
                        <social.icon size={18} />
                     </a>
                  ))}
               </div>
           </div>

        </div>

        {/* 4. MASSIVE WATERMARK */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden pointer-events-none select-none z-0">
           <motion.h1 
             style={{ y: yText }}
             className="text-[12rem] md:text-[20rem] font-black text-white/[0.02] text-center leading-[0.7] tracking-tighter whitespace-nowrap"
           >
              UNICEF CLUB
           </motion.h1>
        </div>

        {/* 5. COPYRIGHT & UTILS */}
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center py-8 border-t border-white/5 gap-4">
           <div className="text-xs text-white/40 font-medium">
              © 2025 MNUMS Student UNICEF Club. 
              <span className="hidden md:inline"> All rights reserved.</span>
           </div>
           
           <div className="flex items-center gap-6">
              <div className="flex items-center gap-1 text-xs text-white/40">
                 Made with <Heart size={12} className="text-red-500 animate-pulse fill-red-500" /> in Ulaanbaatar
              </div>
              <button 
                onClick={scrollToTop}
                className="group flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-[#00aeef] rounded-full border border-white/10 hover:border-[#00aeef] transition-all text-xs font-bold uppercase tracking-wider"
              >
                 Top <ArrowUp size={14} className="group-hover:-translate-y-0.5 transition-transform" />
              </button>
           </div>
        </div>

      </div>
    </footer>
  );
}