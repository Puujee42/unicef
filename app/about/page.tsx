"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  ArrowRight, 
  Sparkles, 
  History, 
  Lightbulb, 
  Target, 
  Megaphone,
  Mail,
  MapPin,
  Instagram,
  Calendar,
  Users,
  BriefcaseBusiness,
  Star 
} from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { useLanguage } from "../context/LanguageContext";

// --- CONFIG ---
const PAGE_CONTENT = {
  hero: {
    badge: { en: "Who We Are", mn: "Бид Хэн Бэ" },
    headline: { en: "Driving Change,", mn: "Өөрчлөлтийг Хөтлөгч," },
    highlight: { en: "For Every Child", mn: "Хүүхэд Бүрийн Төлөө" },
    description: {
      en: "The MNUMS Student UNICEF Club is a vibrant community committed to advocating for children's rights and welfare across Mongolia. Join us in making impactful differences.",
      mn: "АШУҮИС-ийн Оюутны UNICEF Клуб нь Монгол улсын хүүхдийн эрх, сайн сайхны төлөө зүтгэдэг идэвхтэй баг юм. Бидэнтэй нэгдэж, бодит өөрчлөлтийг бүтээцгээе."
    },
    cta1: { en: "Our Mission", mn: "Бидний Эрхэм Зорилго" },
    cta2: { en: "Join Us", mn: "Бидэнтэй Нэгдэх" },
  },
  ourStory: {
    heading: { en: "Our Story", mn: "Бидний Түүх" },
    subtitle: { en: "A Timeline of Dedication and Growth", mn: "Зориулалт ба Өсөлтийн Он тооллын Бүтээл" },
    p1: { 
      en: "Established in 2025, the MNUMS Student UNICEF Club was founded under the dedicated supervision of Lecturer B. Narangarav. Our journey began with a clear vision to extend the reach of UNICEF Mongolia’s mission within the academic community.",
      mn: "2025 онд Багш Б.Нарангаравын удирдлага дор АШУҮИС-ийн Оюутны UNICEF Клуб байгуулагдсан. Бидний аян UNICEF Монголын эрхэм зорилгыг сургуулийн орчинд түгээх тодорхой зорилгоор эхэлсэн юм."
    },
    p2: { 
      en: "We actively collaborate with UNICEF Mongolia to implement impactful voluntary activities and campaigns, transforming 'small actions' into 'big differences' for every child. Our commitment is to foster a vibrant and sustainable club that truly makes a difference in society.",
      mn: "Бид UNICEF Монгол-той идэвхтэй хамтран ажиллаж, 'жижиг үйлдэл'-ийг 'том өөрчлөлт' болгон хувиргадаг. Бидний амлалт бол нийгэмд бодит хувь нэмэр оруулдаг, тогтвортой, идэвхтэй клуб байгуулах явдал юм."
    },
    keyFigure: { en: "Supervisor: B. Narangarav, Lecturer, MNUMS", mn: "Удирдагч: Б. Нарангарав, АШУҮИС-ийн Багш" },
  },
  ourMission: {
    heading: { en: "Our Mission & Vision", mn: "Бидний Эрхэм Зорилго & Алсын Хараа" },
    goals: [
      { icon: Users, title: { en: "Promote Child Rights", mn: "Хүүхдийн Эрхийг Дэмжих" }, desc: { en: "Advocate for child rights and gender equality among students.", mn: "Оюутнуудын дунд хүүхдийн эрх, жендэрийн тэгш байдлыг сурталчлах." } },
      { icon: Lightbulb, title: { en: "Inclusive Learning", mn: "Хүртээмжтэй Орчин" }, desc: { en: "Contribute to creating a sensitive and inclusive learning environment.", mn: "Жендэрийн мэдрэмжтэй, хүртээмжтэй сургалтын орчныг бий болгоход хувь нэмэр оруулах." } },
      { icon: Sparkles, title: { en: "Voluntary Actions", mn: "Сайн Дурын Ажил" }, desc: { en: "Collaborate with UNICEF Mongolia for impactful voluntary activities.", mn: "UNICEF Mongolia-тай хамтран сайн дурын үйл ажиллагааг өрнүүлэх." } },
      { icon: History, title: { en: "Sustainable Future", mn: "Тогтвортой Ирээдүй" }, desc: { en: "Establish a vibrant and sustainable club during academic periods.", mn: "Сургуулийнхаа хэмжээнд үе дамжсан тогтвортой идэвхтэй клуб байгуулах." } }
    ],
  },
  ourActivities: {
    heading: { en: "What We Do", mn: "Бидний Үйл Ажиллагаа" },
    activities: [
      { id: "01", icon: Megaphone, title: { en: "Conduct Campaigns", mn: "Аян Зохион Байгуулах" }, desc: { en: "Lead campaigns to positively impact social psychology and raise awareness.", mn: "Нийгмийн сэтгэл зүйд эерэг өөрчлөлт оруулах кампанит ажил хийх." } },
      { id: "02", icon: BriefcaseBusiness, title: { en: "Lectures & Training", mn: "Лекц, Сургалт" }, desc: { en: "Organize trainings, lectures, and discussions on key topics.", mn: "Сургалт, лекц, хэлэлцүүлэг зохион байгуулах." } },
      { id: "03", icon: Users, title: { en: "Club Collaborations", mn: "Клубуудын Хамтын Ажиллагаа" }, desc: { en: "Collaborate with other UNICEF clubs and partner organizations.", mn: "UNICEF болон бусад клубуудтэй хамтран ажиллах." } },
      { id: "04", icon: Calendar, title: { en: "Annual Reporting", mn: "Жилийн Тайлан" }, desc: { en: "Produce transparent annual reports on club activities and impact.", mn: "Жил бүр үйл ажиллагааны тайлан гаргах." } }
    ]
  },
  connect: {
    heading: { en: "Connect With Us", mn: "Бидэнтэй Холбогдох" },
    contactInfo: [
      { icon: Instagram, label: "@mnums_foreverychild", href: "https://instagram.com/mnums_foreverychild" },
      { icon: Mail, label: "unicef.club@st.mnums.edu.mn", href: "mailto:unicef.club@st.mnums.edu.mn" },
      { icon: MapPin, label: "MNUMS Campus, Ulaanbaatar", href: "https://maps.google.com/?q=MNUMS" },
    ]
  }
};

// --- ANIMATION VARIANTS ---
const sectionVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 80, damping: 15, delayChildren: 0.1, staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

export default function AboutPage() {
  const { language: lang } = useLanguage();
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const isDark = theme === 'dark' || !theme;

  return (
    <div className={`relative transition-colors duration-700 pt-24 min-h-screen overflow-hidden ${isDark ? "bg-[#001829] text-white" : "bg-slate-50 text-slate-900"}`}>
      
      {/* 1. GLOBAL BACKGROUND ELEMENTS */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className={`absolute -top-40 -left-40 w-[800px] h-[800px] rounded-full blur-[200px] transition-opacity duration-700 ${isDark ? "bg-[#00aeef] opacity-[0.08]" : "bg-sky-200 opacity-[0.5]"}`} />
        <div className={`absolute -bottom-40 -right-40 w-[600px] h-[600px] rounded-full blur-[200px] transition-opacity duration-700 ${isDark ? "bg-[#005691] opacity-[0.1]" : "bg-blue-200 opacity-[0.4]"}`} />
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay" />
      </div>

      {/* --- HERO SECTION --- */}
      <section className="relative text-center py-24 px-4 max-w-5xl mx-auto z-10">
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`inline-block px-4 py-2 rounded-full border font-black uppercase tracking-widest text-xs mb-6 transition-colors ${isDark ? "bg-[#00aeef]/10 border-[#00aeef]/30 text-[#00aeef]" : "bg-white border-sky-100 text-[#00aeef] shadow-sm"}`}
        >
          {PAGE_CONTENT.hero.badge[lang]}
        </motion.span>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl md:text-7xl font-black leading-[0.9] mb-8 tracking-tighter"
        >
          {PAGE_CONTENT.hero.headline[lang]} <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00aeef] to-[#40c9ff]">
            {PAGE_CONTENT.hero.highlight[lang]}
          </span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`text-lg max-w-2xl mx-auto leading-relaxed mb-12 font-medium transition-colors ${isDark ? "text-white/70" : "text-slate-600"}`}
        >
          {PAGE_CONTENT.hero.description[lang]}
        </motion.p>
        <motion.div className="flex flex-wrap justify-center gap-4">
          <Link href="#mission" className="flex items-center gap-2 px-8 py-4 bg-[#00aeef] text-white font-bold rounded-full shadow-lg shadow-[#00aeef]/30 hover:bg-[#009bd5] transition-all transform hover:-translate-y-1">
            {PAGE_CONTENT.hero.cta1[lang]} <ArrowRight size={18} />
          </Link>
          <Link href="/join" className={`flex items-center gap-2 px-8 py-4 border font-bold rounded-full transition-all transform hover:-translate-y-1 ${isDark ? "border-white/20 bg-white/10 text-white hover:bg-white/20" : "border-slate-200 bg-white text-slate-900 hover:bg-slate-50 shadow-sm"}`}>
            {PAGE_CONTENT.hero.cta2[lang]} <ArrowRight size={18} />
          </Link>
        </motion.div>
      </section>

      {/* --- OUR STORY SECTION --- */}
      <motion.section 
        variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}
        className="relative py-20 px-4 max-w-6xl mx-auto z-10"
      >
        <h2 className="text-center text-4xl md:text-6xl font-black mb-16 tracking-tight">
          {PAGE_CONTENT.ourStory.heading[lang]}
        </h2>

        <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div variants={itemVariants} className={`relative rounded-[2.5rem] overflow-hidden shadow-2xl border transition-colors ${isDark ? "border-white/10 bg-[#002b49]/40" : "border-slate-200 bg-white p-2"}`}>
                <Image 
                  src="https://images.unsplash.com/photo-1542810634-71277d95fa6b?q=80&w=2070&auto=format&fit=crop"
                  alt="Team collaboration" width={600} height={400} className="w-full h-auto object-cover opacity-90 rounded-[2rem]"
                />
                <div className={`absolute bottom-8 left-8 text-white text-lg font-black px-4 py-2 rounded-xl backdrop-blur-md ${isDark ? "bg-black/20" : "bg-[#00aeef]/80"}`}>
                    MNUMS, Est. 2025
                </div>
            </motion.div>

            <div className="space-y-8">
                <motion.p variants={itemVariants} className={`text-lg leading-relaxed border-l-4 border-[#00aeef] pl-6 font-medium transition-colors ${isDark ? "text-white/80" : "text-slate-700"}`}>
                    {PAGE_CONTENT.ourStory.p1[lang]}
                </motion.p>
                <motion.p variants={itemVariants} className={`text-lg leading-relaxed border-l-4 border-[#005691] pl-6 font-medium transition-colors ${isDark ? "text-white/80" : "text-slate-700"}`}>
                    {PAGE_CONTENT.ourStory.p2[lang]}
                </motion.p>
                <motion.div variants={itemVariants} className={`mt-8 flex items-center gap-3 transition-colors ${isDark ? "text-white/50" : "text-slate-400"}`}>
                    <Star size={20} className="text-[#fbbf24] fill-[#fbbf24]" />
                    <span className="font-bold uppercase tracking-widest text-xs">{PAGE_CONTENT.ourStory.keyFigure[lang]}</span>
                </motion.div>
            </div>
        </div>
      </motion.section>

      {/* --- OUR MISSION SECTION --- */}
      <motion.section 
        id="mission" variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}
        className="relative py-32 px-4 z-10"
      >
        <div className="max-w-7xl mx-auto">
          <h2 className="text-center text-4xl md:text-6xl font-black mb-20 tracking-tight">
            {PAGE_CONTENT.ourMission.heading[lang]}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {PAGE_CONTENT.ourMission.goals.map((goal, index) => (
              <motion.div 
                key={index} variants={itemVariants} whileHover={{ y: -10 }}
                className={`p-8 rounded-[2.5rem] border transition-all duration-300 group shadow-lg ${isDark ? "bg-[#002b49]/60 border-white/10 hover:border-[#00aeef]/50" : "bg-white border-slate-200 hover:border-sky-300 shadow-slate-200/50"}`}
              >
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-8 shadow-xl transition-all group-hover:rotate-6 ${isDark ? "bg-[#00aeef] text-white" : "bg-[#00aeef] text-white"}`}>
                  <goal.icon size={32} strokeWidth={2.5} />
                </div>
                <h3 className={`text-xl font-black mb-4 transition-colors ${isDark ? "text-white group-hover:text-[#00aeef]" : "text-slate-900 group-hover:text-[#00aeef]"}`}>
                  {goal.title[lang]}
                </h3>
                <p className={`text-sm font-medium transition-colors ${isDark ? "text-white/60" : "text-slate-500"}`}>
                  {goal.desc[lang]}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* --- WHAT WE DO SECTION --- */}
      <motion.section 
        variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}
        className="relative py-20 px-4 z-10 max-w-7xl mx-auto"
      >
        <h2 className="text-center text-4xl md:text-6xl font-black mb-20 tracking-tight">
          {PAGE_CONTENT.ourActivities.heading[lang]}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {PAGE_CONTENT.ourActivities.activities.map((activity, index) => (
            <motion.div 
              key={index} variants={itemVariants}
              className={`relative p-8 rounded-[2.5rem] border-t-4 transition-all duration-300 group shadow-xl ${isDark ? "bg-[#001829] border-[#00aeef] shadow-[#00aeef]/5" : "bg-white border-[#00aeef] shadow-slate-200/50"}`}
            >
                <div className="mb-6 flex items-center justify-between">
                    <div className={`p-4 rounded-2xl transition-colors ${isDark ? "bg-[#00aeef]/10" : "bg-sky-50"}`}>
                        <activity.icon size={28} strokeWidth={2.5} className="text-[#00aeef]" />
                    </div>
                    <span className={`text-3xl font-black opacity-10 transition-opacity group-hover:opacity-30 ${isDark ? "text-white" : "text-slate-900"}`}>
                        {activity.id}
                    </span>
                </div>
                <h3 className={`text-2xl font-black mb-3 transition-colors ${isDark ? "text-white group-hover:text-[#00aeef]" : "text-slate-900 group-hover:text-[#00aeef]"}`}>
                    {activity.title[lang]}
                </h3>
                <p className={`text-sm font-medium transition-colors ${isDark ? "text-white/60" : "text-slate-500"}`}>
                    {activity.desc[lang]}
                </p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* --- CONNECT SECTION --- */}
      <motion.section 
        variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}
        className="relative py-32 px-4 z-10 max-w-5xl mx-auto"
      >
        <h2 className="text-center text-4xl md:text-5xl font-black mb-16 tracking-tight">
          {PAGE_CONTENT.connect.heading[lang]}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {PAGE_CONTENT.connect.contactInfo.map((contact, index) => (
            <motion.div 
              key={index} variants={itemVariants} whileHover={{ y: -5 }}
              className={`p-10 rounded-[3rem] border transition-all duration-300 flex flex-col items-center group shadow-lg ${isDark ? "bg-[#002b49]/60 border-white/10 hover:border-[#00aeef]/40" : "bg-white border-slate-200 hover:border-sky-300 shadow-slate-200/50"}`}
            >
              <Link href={contact.href} target="_blank" className="flex flex-col items-center space-y-6">
                <div className={`p-5 rounded-[2rem] transition-all group-hover:scale-110 ${isDark ? "bg-[#00aeef]/10 text-[#00aeef]" : "bg-sky-50 text-[#00aeef]"}`}>
                   <contact.icon size={40} strokeWidth={1.5} />
                </div>
                <span className={`text-sm font-black tracking-tight transition-colors ${isDark ? "text-white/80 group-hover:text-white" : "text-slate-600 group-hover:text-slate-900"}`}>
                   {contact.label}
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Spacer */}
      <div className="h-40" /> 
    </div>
  );
}