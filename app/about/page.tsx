"use client";

import React from "react";
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
  Facebook, // Added for completeness, if you have other socials
  Twitter,  // Added for completeness
  Calendar,
  Users,
  BriefcaseBusiness,
  Star // From expectations, represents quality
} from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "../context/LanguageContext"; // Adjust path as needed

// Define the brand colors for consistency
const BRAND = {
  sky: "#00aeef",
  ocean: "#005691",
  deep: "#001829",
  white: "#ffffff",
  gold: "#fbbf24", // Retained for a subtle accent pop, as seen in Hero
};

// All textual content, structured for bilingual support and source-based data
const PAGE_CONTENT = {
  hero: {
    badge: { en: "Who We Are", mn: "Бид Хэн Бэ" },
    headline: { 
      en: "Driving Change,", 
      mn: "Өөрчлөлтийг Хөтлөгч," 
    },
    highlight: { 
      en: "For Every Child", 
      mn: "Хүүхэд Бүрийн Төлөө" 
    },
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
    subtitle: { en: "The Pillars Guiding Our Every Step", mn: "Бидний Алхам Бүрийг Чиглүүлэгч Тулах Цэгүүд" },
    goals: [ // Derived from "МАНАЙ КЛУБИЙН ЗОРИЛГО НЬ" section of poster
      { 
        icon: Users,
        title: { en: "Promote Child Rights", mn: "Хүүхдийн Эрхийг Дэмжих" },
        desc: { en: "Advocate for child rights and gender equality among students.", mn: "Оюутнуудын дунд хүүхдийн эрх, жендэрийн тэгш байдлыг сурталчлах." },
      },
      {
        icon: Lightbulb, // Icon chosen to represent 'inclusive learning environment'
        title: { en: "Inclusive Learning", mn: "Хүртээмжтэй Орчин" },
        desc: { en: "Contribute to creating a sensitive and inclusive learning environment.", mn: "Жендэрийн мэдрэмжтэй, хүртээмжтэй сургалтын орчныг бий болгоход хувь нэмэр оруулах." },
      },
      {
        icon: Sparkles, // Icon chosen for voluntary, impactful actions
        title: { en: "Voluntary Actions", mn: "Сайн Дурын Ажил" },
        desc: { en: "Collaborate with UNICEF Mongolia for impactful voluntary activities.", mn: "UNICEF Mongolia-тай хамтран сайн дурын үйл ажиллагааг өрнүүлэх." },
      },
      {
        icon: History, // Icon to represent a sustainable club that endures
        title: { en: "Sustainable Future", mn: "Тогтвортой Ирээдүй" },
        desc: { en: "Establish a vibrant and sustainable club during academic periods.", mn: "Сургуулийнхаа хэмжээнд үе дамжсан тогтвортой идэвхтэй клуб байгуулах." },
      }
    ],
  },
  ourActivities: {
    heading: { en: "What We Do", mn: "Бидний Үйл Ажиллагаа" },
    subtitle: { en: "Bringing Our Mission to Life Through Action", mn: "Эрхэм Зорилгоо Бодит Үйлдлээр Хэрэгжүүлдэг" },
    activities: [ // Derived from "КЛУБИЙН ҮЙЛ АЖИЛЛАГАА НЬ" section of poster
      { 
        id: "01", 
        icon: Megaphone, 
        title: { en: "Conduct Campaigns", mn: "Аян Зохион Байгуулах" }, 
        desc: { en: "Lead campaigns to positively impact social psychology and raise awareness.", mn: "Нийгмийн сэтгэл зүйд эерэг өөрчлөлт оруулах кампанит ажил хийх." } 
      },
      { 
        id: "02", 
        icon: BriefcaseBusiness, // Using briefcase to imply workshops/professional development
        title: { en: "Lectures & Training", mn: "Лекц, Сургалт" }, 
        desc: { en: "Organize trainings, lectures, and discussions on key topics.", mn: "Сургалт, лекц, хэлэлцүүлэг зохион байгуулах." } 
      },
      { 
        id: "03", 
        icon: Users, // Represents collaboration
        title: { en: "Club Collaborations", mn: "Клубуудын Хамтын Ажиллагаа" }, 
        desc: { en: "Collaborate with other UNICEF clubs and partner organizations.", mn: "UNICEF болон бусад клубуудтэй хамтран ажиллах." } 
      },
      { 
        id: "04", 
        icon: Calendar, // Represents planning/reporting cycle
        title: { en: "Annual Reporting", mn: "Жилийн Тайлан" }, 
        desc: { en: "Produce transparent annual reports on club activities and impact.", mn: "Жил бүр үйл ажиллагааны тайлан гаргах." } 
      }
    ]
  },
  connect: {
    heading: { en: "Connect With Us", mn: "Бидэнтэй Холбогдох" },
    subtitle: { en: "Your Gateway to Making a Difference", mn: "Таны Өөрчлөлтийг Бүтээх Гарц" },
    contactInfo: [ // Derived from contact details on poster
      { icon: Instagram, label: "@mnums_foreverychild", href: "https://instagram.com/mnums_foreverychild" },
      { icon: Mail, label: "unicef.club@st.mnums.edu.mn", href: "mailto:unicef.club@st.mnums.edu.mn" },
      { icon: MapPin, label: "MNUMS Campus, Ulaanbaatar", href: "https://maps.google.com/?q=MNUMS" },
    ]
  }
};

// Animation variants for sections
const sectionVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      type: "spring" as const,
      stiffness: 80, 
      damping: 15, 
      delayChildren: 0.1,
      staggerChildren: 0.1
    } 
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

// --- MAIN ABOUT PAGE COMPONENT ---
export default function AboutPage() {
  const { language: lang } = useLanguage();

  return (
    <div className="relative bg-[#001829] text-white pt-24 min-h-screen overflow-hidden">
      
      {/* Global Background Glows and Noise */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute -top-40 -left-40 w-[800px] h-[800px] bg-[#00aeef] rounded-full blur-[200px] opacity-[0.08]" />
        <div className="absolute -bottom-40 -right-40 w-[600px] h-[600px] bg-[#005691] rounded-full blur-[200px] opacity-[0.1]" />
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay" />
      </div>

      {/* --- HERO SECTION FOR ABOUT PAGE --- */}
      <section className="relative text-center py-24 px-4 max-w-5xl mx-auto z-10">
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="inline-block px-4 py-2 rounded-full bg-[#00aeef]/10 border border-[#00aeef]/30 text-[#00aeef] font-black uppercase tracking-widest text-xs mb-6"
        >
          {PAGE_CONTENT.hero.badge[lang]}
        </motion.span>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-5xl md:text-7xl font-black leading-tight mb-6 drop-shadow-lg"
        >
          {PAGE_CONTENT.hero.headline[lang]} <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00aeef] to-[#40c9ff]">
            {PAGE_CONTENT.hero.highlight[lang]}
          </span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-white/70 text-lg max-w-2xl mx-auto leading-relaxed mb-10 font-medium"
        >
          {PAGE_CONTENT.hero.description[lang]}
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, staggerChildren: 0.1 }}
          className="flex flex-wrap justify-center gap-4"
        >
          <Link href="#mission" className="group flex items-center gap-2 px-8 py-4 bg-[#00aeef] text-white font-bold rounded-full shadow-lg shadow-[#00aeef]/30 hover:bg-[#009bd5] transition-all transform hover:-translate-y-1">
            {PAGE_CONTENT.hero.cta1[lang]} <ArrowRight size={18} />
          </Link>
          <Link href="/join" className="group flex items-center gap-2 px-8 py-4 border border-white/20 bg-white/10 text-white font-bold rounded-full hover:bg-white/20 transition-all transform hover:-translate-y-1">
            {PAGE_CONTENT.hero.cta2[lang]} <ArrowRight size={18} />
          </Link>
        </motion.div>
      </section>

      {/* --- OUR STORY SECTION --- */}
      <motion.section 
        id="story"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        className="relative py-20 px-4 max-w-6xl mx-auto z-10"
      >
        <h2 className="text-center text-4xl md:text-5xl font-black text-white mb-6 drop-shadow-xl">
          {PAGE_CONTENT.ourStory.heading[lang]}
        </h2>
        <p className="text-center text-white/60 text-lg max-w-xl mx-auto mb-16 font-medium">
          {PAGE_CONTENT.ourStory.subtitle[lang]}
        </p>

        <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div variants={itemVariants} className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/10 bg-[#002b49]/40 backdrop-blur-md group">
                <Image 
                  src="https://images.unsplash.com/photo-1542810634-71277d95fa6b?q=80&w=2070&auto=format&fit=crop" // Image of students/team
                  alt="Team collaboration" 
                  width={600} 
                  height={400} 
                  className="w-full h-auto object-cover opacity-80 group-hover:scale-105 transition-transform duration-700"
                />
                {/* Overlay for depth and branding */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#001829]/90 to-transparent" />
                <div className="absolute bottom-6 left-6 text-white text-lg font-bold">
                    MNUMS, Est. 2025
                </div>
                {/* Decorative element */}
                <div className="absolute top-4 right-4 p-2 bg-[#00aeef] rounded-full shadow-lg shadow-blue-500/30">
                    <History size={20} className="text-white" />
                </div>
            </motion.div>
            <div className="space-y-8">
                <motion.p variants={itemVariants} className="text-white/80 text-lg leading-relaxed border-l-4 border-[#00aeef] pl-4 font-medium">
                    {PAGE_CONTENT.ourStory.p1[lang]}
                </motion.p>
                <motion.p variants={itemVariants} className="text-white/80 text-lg leading-relaxed border-l-4 border-[#005691] pl-4 font-medium">
                    {PAGE_CONTENT.ourStory.p2[lang]}
                </motion.p>
                <motion.div variants={itemVariants} className="mt-8 flex items-center gap-3 text-white/50">
                    <Star size={20} className="text-[#fbbf24] fill-[#fbbf24]" /> {/* Using Star for "key figure" implies importance/value */}
                    <span className="font-bold uppercase tracking-wide text-sm">{PAGE_CONTENT.ourStory.keyFigure[lang]}</span>
                </motion.div>
            </div>
        </div>
      </motion.section>

      {/* --- OUR MISSION SECTION --- */}
      <motion.section 
        id="mission"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        className="relative py-20 px-4 z-10"
      >
        <h2 className="text-center text-4xl md:text-5xl font-black text-white mb-6 drop-shadow-xl">
          {PAGE_CONTENT.ourMission.heading[lang]}
        </h2>
        <p className="text-center text-white/60 text-lg max-w-xl mx-auto mb-16 font-medium">
          {PAGE_CONTENT.ourMission.subtitle[lang]}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {PAGE_CONTENT.ourMission.goals.map((goal, index) => (
            <motion.div 
              key={index} 
              variants={itemVariants}
              whileHover={{ y: -10, scale: 1.05 }}
              className="bg-[#002b49]/60 backdrop-blur-lg border border-white/10 rounded-3xl p-6 text-center shadow-xl hover:shadow-cyan-500/20 transition-all duration-300 group"
            >
              <div className="w-16 h-16 rounded-full bg-[#00aeef] text-white flex items-center justify-center mx-auto mb-6 shadow-lg shadow-[#00aeef]/30 group-hover:scale-110 group-hover:shadow-[#00aeef]/50 transition-all duration-300">
                <goal.icon size={32} strokeWidth={2.5} />
              </div>
              <h3 className="text-xl font-black text-white mb-3 group-hover:text-[#00aeef] transition-colors">
                {goal.title[lang]}
              </h3>
              <p className="text-white/70 text-sm font-medium">
                {goal.desc[lang]}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* --- WHAT WE DO SECTION --- */}
      <motion.section 
        id="activities"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        className="relative py-20 px-4 z-10"
      >
        <h2 className="text-center text-4xl md:text-5xl font-black text-white mb-6 drop-shadow-xl">
          {PAGE_CONTENT.ourActivities.heading[lang]}
        </h2>
        <p className="text-center text-white/60 text-lg max-w-xl mx-auto mb-16 font-medium">
          {PAGE_CONTENT.ourActivities.subtitle[lang]}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {PAGE_CONTENT.ourActivities.activities.map((activity, index) => (
            <motion.div 
              key={index} 
              variants={itemVariants}
              whileHover={{ scale: 1.03 }}
              className="bg-[#001829] border-t-4 border-[#00aeef] rounded-3xl p-6 text-left shadow-xl shadow-[#00aeef]/10 hover:shadow-[#00aeef]/30 transition-all duration-300 group"
            >
                <div className="mb-4 flex items-center gap-4">
                    <div className="p-3 bg-[#00aeef]/10 rounded-xl">
                        <activity.icon size={32} strokeWidth={2} className="text-[#00aeef] group-hover:scale-110 transition-transform" />
                    </div>
                    <span className="text-white/20 text-4xl font-black opacity-0 group-hover:opacity-100 transition-opacity">
                        {activity.id}
                    </span>
                </div>
                <h3 className="text-2xl font-black text-white mb-2 group-hover:text-[#00aeef] transition-colors">
                    {activity.title[lang]}
                </h3>
                <p className="text-white/60 text-sm font-medium">
                    {activity.desc[lang]}
                </p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* --- CONNECT WITH US SECTION --- */}
      <motion.section 
        id="connect"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        className="relative py-20 px-4 z-10"
      >
        <h2 className="text-center text-4xl md:text-5xl font-black text-white mb-6 drop-shadow-xl">
          {PAGE_CONTENT.connect.heading[lang]}
        </h2>
        <p className="text-center text-white/60 text-lg max-w-xl mx-auto mb-16 font-medium">
          {PAGE_CONTENT.connect.subtitle[lang]}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {PAGE_CONTENT.connect.contactInfo.map((contact, index) => (
            <motion.div 
              key={index} 
              variants={itemVariants}
              whileHover={{ y: -5, scale: 1.05 }}
              className="bg-[#002b49]/60 backdrop-blur-lg border border-white/10 rounded-3xl p-6 text-center shadow-xl hover:shadow-cyan-500/20 transition-all duration-300 flex flex-col items-center justify-center group"
            >
              <Link href={contact.href} target="_blank" className="text-white/80 hover:text-[#00aeef] transition-colors flex flex-col items-center space-y-4">
                <contact.icon size={48} strokeWidth={1.5} className="text-[#00aeef] group-hover:scale-110 transition-transform" />
                <span className="text-lg font-bold">{contact.label}</span>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Spacer for bottom Marquee from Hero (if present) - Added a bit more space */}
      <div className="h-40" /> 
    </div>
  );
}