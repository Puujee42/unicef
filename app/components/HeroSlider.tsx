"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  ArrowRight, 
  MapPin, 
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  Clock 
} from "lucide-react";
import { motion, AnimatePresence, cubicBezier } from "framer-motion";

// --- MOCK DATA ---
const EVENTS = [
  {
    id: 1,
    title: "Youth Leadership Summit 2025",
    description: "Empowering the next generation. 500+ students. One weekend.",
    date: "Oct 24",
    location: "Shangri-La Hall",
    image: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?q=80&w=2070&auto=format&fit=crop", 
    color: "#00aeef"
  },
  {
    id: 2,
    title: "Clean Air Campaign",
    description: "Raising awareness and distributing masks to vulnerable districts.",
    date: "Nov 05",
    location: "Sukhbaatar Sq",
    image: "https://images.unsplash.com/photo-1576085898323-218339fe354e?q=80&w=2070&auto=format&fit=crop",
    color: "#10b981"
  },
  {
    id: 3,
    title: "Book Donation Drive",
    description: "Collecting 1,000 books for rural schools in Khovd province.",
    date: "Dec 01",
    location: "Club HQ",
    image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=2070&auto=format&fit=crop",
    color: "#f59e0b"
  }
];

// --- ANIMATION CONFIG ---
const SLIDE_DURATION = 8000; // 8 seconds per slide

const maskVariants = {
  initial: { clipPath: "inset(0 0 0 100%)" },
  animate: { 
    clipPath: "inset(0 0 0 0%)",
    transition: { duration: 1.2, ease: cubicBezier(0.22, 1, 0.36, 1) } 
  },
  exit: { 
    clipPath: "inset(0 100% 0 0)",
    transition: { duration: 0.8, ease: cubicBezier(0.22, 1, 0.36, 1) } 
  }
};

const textReveal = {
  hidden: { y: "100%" },
  visible: (i: number) => ({
    y: "0%",
    transition: { delay: 0.2 + (i * 0.1), duration: 0.8, ease: cubicBezier(0.25, 0.46, 0.45, 0.94) }
  })
};

export default function HeroSlider() {
  const [index, setIndex] = useState(0);
  
  const nextSlide = useCallback(() => {
    setIndex((prev) => (prev + 1) % EVENTS.length);
  }, []);

  const prevSlide = () => {
    setIndex((prev) => (prev === 0 ? EVENTS.length - 1 : prev - 1));
  };

  useEffect(() => {
    const timer = setTimeout(nextSlide, SLIDE_DURATION);
    return () => clearTimeout(timer);
  }, [index, nextSlide]);

  const event = EVENTS[index];

  return (
    <div className="relative h-[90vh] w-full bg-black overflow-hidden font-sans">
      
      {/* 1. BACKGROUND IMAGE SLIDER (Mask Transition) */}
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.div
          key={event.id}
          variants={maskVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="absolute inset-0 z-0 h-full w-full"
        >
          <div className="absolute inset-0 bg-black/40 z-10" /> {/* Darken overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent z-10" />
          
          <motion.div 
            className="relative w-full h-full"
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
            transition={{ duration: 10, ease: "linear" }} // Ken Burns Effect
          >
            <Image
              src={event.image}
              alt={event.title}
              fill
              className="object-cover"
              priority
            />
          </motion.div>
        </motion.div>
      </AnimatePresence>

      {/* 2. MAIN CONTENT (Minimalist) */}
      <div className="absolute inset-0 z-20 flex flex-col justify-center px-6 md:px-12 lg:px-24">
        <div className="max-w-4xl overflow-hidden">
          
          {/* Tagline Reveal */}
          <div className="overflow-hidden mb-4">
            <motion.div 
              custom={0}
              variants={textReveal}
              initial="hidden"
              key={`sub-${event.id}`}
              animate="visible"
              className="flex items-center gap-3"
            >
              <span className="h-[1px] w-12 bg-white/50" />
              <span className="text-white/80 uppercase tracking-[0.3em] text-sm font-bold">
                Upcoming Event
              </span>
            </motion.div>
          </div>

          {/* Title Reveal (Masked) */}
          <div className="overflow-hidden">
            <motion.h1
              custom={1}
              variants={textReveal}
              initial="hidden"
              key={`title-${event.id}`}
              animate="visible"
              className="text-6xl md:text-8xl font-black text-white leading-[0.95] tracking-tight mb-6"
            >
              {event.title.split(" ").map((word, i) => (
                <span key={i} className="inline-block mr-4">{word}</span>
              ))}
            </motion.h1>
          </div>

          {/* Description Reveal */}
          <div className="overflow-hidden mb-10">
            <motion.p
              custom={2}
              variants={textReveal}
              initial="hidden"
              key={`desc-${event.id}`}
              animate="visible"
              className="text-xl md:text-2xl text-white/70 font-light max-w-xl leading-relaxed"
            >
              {event.description}
            </motion.p>
          </div>

          {/* Minimalist Data Bar */}
          <div className="overflow-hidden">
            <motion.div
              custom={3}
              variants={textReveal}
              initial="hidden"
              key={`meta-${event.id}`}
              animate="visible"
              className="flex flex-wrap gap-8 items-center pt-8 border-t border-white/20"
            >
              <div className="flex items-center gap-3 group cursor-pointer">
                <div className="p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/10 group-hover:bg-white group-hover:text-black transition-colors duration-300">
                  <Calendar size={20} />
                </div>
                <div>
                  <p className="text-[10px] text-white/50 uppercase tracking-widest font-bold">Date</p>
                  <p className="text-white font-bold">{event.date}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 group cursor-pointer">
                <div className="p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/10 group-hover:bg-white group-hover:text-black transition-colors duration-300">
                  <MapPin size={20} />
                </div>
                <div>
                  <p className="text-[10px] text-white/50 uppercase tracking-widest font-bold">Location</p>
                  <p className="text-white font-bold">{event.location}</p>
                </div>
              </div>

              <Link href={`/events/${event.id}`}>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-3 bg-white text-black font-black uppercase tracking-widest text-xs rounded-full flex items-center gap-2 hover:bg-[#00aeef] hover:text-white transition-colors duration-300 ml-4"
                >
                  Details <ArrowRight size={14} />
                </motion.button>
              </Link>
            </motion.div>
          </div>

        </div>
      </div>

      {/* 3. PROGRESS BAR & CONTROLS */}
      <div className="absolute bottom-0 left-0 w-full z-30 flex items-end justify-between p-8 md:p-12">
        
        {/* Progress Line */}
        <div className="flex-1 flex gap-2 max-w-md items-end h-full pb-4">
          {EVENTS.map((_, i) => (
            <div key={i} className="relative flex-1 h-[2px] bg-white/20 overflow-hidden">
              {i === index && (
                <motion.div
                  layoutId="activeSlide"
                  className="absolute inset-0 bg-[#00aeef]"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: SLIDE_DURATION / 1000, ease: "linear" }}
                />
              )}
              {i < index && <div className="absolute inset-0 bg-white" />}
            </div>
          ))}
        </div>

        {/* Minimal Nav Buttons */}
        <div className="flex gap-4 ml-8">
          <button 
            onClick={prevSlide}
            className="w-14 h-14 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all duration-300 hover:scale-110 active:scale-95"
          >
            <ChevronLeft size={24} />
          </button>
          <button 
            onClick={nextSlide}
            className="w-14 h-14 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all duration-300 hover:scale-110 active:scale-95"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>

      {/* Ambient Noise Texture (Consistent with your theme) */}
      <div 
        className="absolute inset-0 opacity-[0.05] pointer-events-none z-[100]" 
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} 
      />

    </div>
  );
}