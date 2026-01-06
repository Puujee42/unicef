"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { 
  Trophy, Clock, MapPin, ArrowUpRight, Activity, 
  CheckCircle2, Loader2,
  Users, School, ArrowLeft
} from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { useLanguage } from "../../context/LanguageContext";

// --- TYPES ---
interface Event {
  _id: string;
  title: { en: string; mn: string } | string;
  date: string;
  location: { en: string; mn: string } | string;
  status: string;
  image?: string;
}

interface ClubData {
  id: string;
  stats: {
    members: number;
    totalEvents: number;
    pastEventsCount: number;
    activity: string;
  };
  nextEvent: Event | null;
  events: Event[];
  activity: string;
}

interface DashboardCardProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  isDark: boolean;
}

// --- SUB-COMPONENT: THEMED CARD ---
const DashboardCard = ({ children, className = "", delay = 0, isDark }: DashboardCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.5 }}
    className={`relative backdrop-blur-xl border rounded-[2.5rem] p-6 overflow-hidden transition-all duration-500
      ${isDark 
        ? "bg-[#001d30]/60 border-white/5 shadow-2xl shadow-black/20" 
        : "bg-white border-slate-200 shadow-xl shadow-slate-200/40"} 
      ${className}`}
  >
    <div className={`absolute inset-0 bg-gradient-to-br pointer-events-none opacity-50
      ${isDark ? "from-white/5 to-transparent" : "from-slate-50 to-transparent"}`} />
    {children}
  </motion.div>
);

const UNIVERSITIES = [
  { id: "NUM", en: "National University of Mongolia", mn: "Монгол Улсын Их Сургууль (МУИС)" },
  { id: "MUST", en: "MUST", mn: "Шинжлэх Ухаан, Технологийн Их Сургууль" },
  { id: "UFE", en: "University of Finance and Economics", mn: "Санхүү, Эдийн Засгийн Их Сургууль" },
  { id: "MNUMS", en: "MNUMS", mn: "Анагаахын Шинжлэх Ухааны Үндэсний Их Сургууль (АШУҮИС)" },
  { id: "MSUE", en: "University of Education", mn: "Боловсролын Их Сургууль (МУБИС)" },
  { id: "MSUA", en: "University of Agriculture", mn: "Хөдөө Аж Ахуйн Их Сургууль (ХААИС)" },
  { id: "MSUAC", en: "University of Arts and Culture", mn: "Соёл, Урлагийн Их Сургууль (СУИС)" },
  { id: "MNDU", en: "National Defense University", mn: "Үндэсний Батлан Хамгаалахын Их Сургууль" },
  { id: "LEUM", en: "Law Enforcement University", mn: "Хууль Сахиулахын Их Сургууль" },
  { id: "UBU", en: "Ulaanbaatar University", mn: "Улаанбаатарын Их Сургууль (УБИС)" },
  { id: "IDER", en: "Ider University", mn: "Идэр Их Сургууль" },
  { id: "OTU", en: "Otgontenger University", mn: "Отгонтэнгэр Их Сургууль" },
  { id: "HUREE", en: "Huree University", mn: "Хүрээ Дээд Сургууль" },
  { id: "MJHU", en: "MJHU", mn: "Монгол-Японы Хүмүүнлэгийн Их Сургууль" },
  { id: "ACH", en: "Ach Medical University", mn: "Ач Анагаах Ухааны Их Сургууль" },
  { id: "IZIU", en: "Ikh Zasag University", mn: "Их Засаг Олон Улсын Их Сургууль" },
  { id: "ORKHON", en: "Orkhon University", mn: "Орхон Их Сургууль" },
  { id: "MIU", en: "MIU", mn: "Монгол Олон Улсын Их Сургууль" },
  { id: "MANDAKH", en: "Mandakh University", mn: "Мандах Их Сургууль" },
  { id: "CHINGGIS", en: "Chinggis Khaan University", mn: "Чингис Хаан Их Сургууль" },
  { id: "GAZARCHIN", en: "Gazarchin Institute", mn: "Газарчин Дээд Сургууль" },
];

export default function ClubProfile() {
  const params = useParams();
  const { language: lang } = useLanguage();
  const { theme } = useTheme();
  
  const [mounted, setMounted] = useState(false);
  const [data, setData] = useState<ClubData | null>(null);
  const [loading, setLoading] = useState(true);

  // Sync with theme and hydration
  useEffect(() => setMounted(true), []);
  const isDark = mounted && (theme === "dark" || !theme);
  const clubId = params.id as string;
  const university = UNIVERSITIES.find(u => u.id === clubId);

  useEffect(() => {
    async function fetchClubData() {
      if (!clubId) return;
      try {
        const res = await fetch(`/api/clubs/${clubId}`);
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch (error) {
        console.error("Failed to load club data", error);
      } finally {
        setLoading(false);
      }
    }
    fetchClubData();
  }, [clubId]);

  if (!mounted || loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center transition-colors duration-700
        ${isDark ? "bg-[#001829]" : "bg-slate-50"}`}>
        <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-8 h-8 text-[#00aeef] animate-spin" />
            <p className={`text-sm tracking-widest uppercase font-bold ${isDark ? "text-white/40" : "text-slate-400"}`}>
              {lang === 'mn' ? 'Ачаалж байна...' : 'Loading Profile...'}
            </p>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return "TBD";
    return new Date(dateString).toLocaleDateString(lang === 'mn' ? 'mn-MN' : 'en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute:'2-digit' });
  };

  // Helper to safely get localized string
  const getLocStr = (obj: { en: string; mn: string } | string | undefined | null) => {
    if (!obj) return "";
    if (typeof obj === 'string') return obj;
    return obj[lang] || obj.en || "";
  };

  return (
    <div className={`min-h-screen transition-colors duration-700 pt-28 pb-12 px-6 overflow-x-hidden font-sans
      ${isDark ? "bg-[#001829] text-white" : "bg-slate-50 text-slate-900"}`}>
      
      {/* --- ATMOSPHERE --- */}
      <div className="absolute inset-0 pointer-events-none fixed">
         <div className={`absolute top-0 right-0 w-[800px] h-[800px] rounded-full blur-[250px] transition-opacity duration-700
            ${isDark ? "bg-[#00aeef] opacity-[0.05]" : "bg-sky-200 opacity-[0.4]"}`} />
         <div className={`absolute bottom-0 left-0 w-[600px] h-[600px] rounded-full blur-[200px] transition-opacity duration-700
            ${isDark ? "bg-[#005691] opacity-[0.08]" : "bg-blue-100 opacity-[0.3]"}`} />
         <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        
        {/* --- HEADER --- */}
        <div className="mb-12">
           <Link href="/clubs" className={`inline-flex items-center gap-2 mb-6 opacity-60 hover:opacity-100 transition-opacity font-bold text-xs uppercase tracking-widest ${isDark ? "text-white" : "text-slate-900"}`}>
              <ArrowLeft size={14} /> {lang === 'mn' ? 'Буцах' : 'Back to Clubs'}
           </Link>

           <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                  <p className="text-[#00aeef] text-[10px] font-black uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full animate-pulse shadow-[0_0_10px_#22c55e]
                        ${data?.activity === 'inactive' ? 'bg-slate-500 shadow-none' : 'bg-green-500'}`} />
                    {lang === 'mn' ? 'Клубын Профайл' : 'Club Profile'}
                  </p>
                  <h1 className={`text-4xl md:text-6xl font-black tracking-tighter leading-none max-w-4xl
                    ${isDark ? "text-white" : "text-[#001829]"}`}>
                    {university ? university[lang] : clubId}
                  </h1>
              </motion.div>

              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex gap-3">
                  <button className="px-6 py-3.5 bg-[#00aeef] hover:bg-[#009bd5] text-white font-black text-[10px] uppercase tracking-widest rounded-2xl shadow-xl shadow-[#00aeef]/20 transition-all flex items-center gap-2 active:scale-95">
                    {lang === 'mn' ? 'Нэгдэх' : 'Join Club'}
                  </button>
              </motion.div>
           </div>
        </div>

        {/* --- BENTO GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-4 gap-6">
           
           {/* A. CLUB STATS CARD */}
           <DashboardCard isDark={isDark} className="md:col-span-3 lg:col-span-2 row-span-2 !p-0 group border-[#00aeef]/20">
              <div className="relative h-full p-8 flex flex-col justify-between z-10">
                 <div className="flex justify-between items-start">
                    <div className="flex items-center gap-5">
                       <div className={`w-20 h-20 rounded-3xl p-1 shadow-2xl overflow-hidden flex items-center justify-center
                         ${isDark ? "bg-white/10" : "bg-sky-50 border border-sky-100"}`}>
                          <School size={40} className="text-[#00aeef]" />
                       </div>
                       <div>
                          <h2 className={`text-2xl font-black leading-none mb-2 ${isDark ? "text-white" : "text-[#001829]"}`}>
                            Overview
                          </h2>
                          <p className={`text-[10px] font-black uppercase tracking-widest ${isDark ? "text-white/40" : "text-slate-400"}`}>
                            {clubId} Chapter
                          </p>
                       </div>
                    </div>
                    <div className={`p-3 rounded-2xl transition-colors ${isDark ? "bg-[#00aeef]/10 border border-[#00aeef]/20" : "bg-sky-50 border border-sky-100"}`}>
                       <Users size={20} className="text-[#00aeef]" />
                    </div>
                 </div>

                 <div className="space-y-8 mt-12">
                    <div className="grid grid-cols-2 gap-4">
                       <div className={`rounded-3xl p-5 border transition-all ${isDark ? "bg-black/20 border-white/5" : "bg-slate-50 border-slate-100"}`}>
                          <p className="text-[#00aeef] text-[9px] font-black uppercase tracking-[0.2em] mb-2">Total Members</p>
                          <p className={`text-4xl font-black ${isDark ? "text-white" : "text-[#001829]"}`}>{data?.stats?.members || 0}</p>
                       </div>
                       <div className={`rounded-3xl p-5 border transition-all ${isDark ? "bg-black/20 border-white/5" : "bg-slate-50 border-slate-100"}`}>
                          <p className="text-[#fbbf24] text-[9px] font-black uppercase tracking-[0.2em] mb-2">Activity Score</p>
                          <p className={`text-xl font-black ${isDark ? "text-white" : "text-[#001829]"}`}>{data?.stats?.activity || "N/A"}</p>
                       </div>
                    </div>
                 </div>
              </div>
           </DashboardCard>

           {/* B. NEXT EVENT TILE */}
           <DashboardCard isDark={isDark} className="md:col-span-3 lg:col-span-2 !p-0 group" delay={0.1}>
              {data?.nextEvent?.image && (
                 <div className="absolute inset-0 bg-cover bg-center transition-all duration-700 group-hover:scale-105" style={{ backgroundImage: `url(${data.nextEvent.image})` }} />
              )}
              <div className={`absolute inset-0 transition-colors duration-500
                ${isDark ? "bg-[#001829]/80" : "bg-white/90"}`} />
              
              <div className="relative z-10 h-full p-8 flex flex-col justify-between">
                 <div className="flex justify-between items-center">
                    <span className="bg-[#00aeef] text-white text-[9px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-lg">Next Event</span>
                    <div className={`p-2 rounded-full transition-colors ${isDark ? "bg-white/10" : "bg-white shadow-sm"}`}>
                      <ArrowUpRight size={16} className={isDark ? "text-white" : "text-[#001829]"} />
                    </div>
                 </div>
                 
                 <div>
                    <div className="flex items-center gap-2 text-[#00aeef] text-[10px] font-black uppercase tracking-[0.2em] mb-3">
                       <Clock size={12} />
                       <span>{data?.nextEvent ? formatDate(data.nextEvent.date) : "No Upcoming Events"}</span>
                    </div>
                    <h3 className={`text-3xl font-black tracking-tight leading-none mb-3 ${isDark ? "text-white" : "text-[#001829]"}`}>
                       {data?.nextEvent ? getLocStr(data.nextEvent.title) : "Stay Tuned"}
                    </h3>
                    <p className={`text-xs font-bold flex items-center gap-2 opacity-60 ${isDark ? "text-white" : "text-slate-600"}`}>
                       <MapPin size={14} className="text-[#00aeef]" /> {data?.nextEvent ? getLocStr(data.nextEvent.location) : "Main Hall"}
                    </p>
                 </div>
              </div>
           </DashboardCard>

           {/* C. QUICK STAT - PAST EVENTS */}
           <DashboardCard isDark={isDark} className="md:col-span-2 lg:col-span-1 flex flex-col justify-between group" delay={0.2}>
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:rotate-12
                ${isDark ? "bg-[#10b981]/10 text-[#10b981]" : "bg-emerald-50 text-emerald-500"}`}>
                 <CheckCircle2 size={24} />
              </div>
              <div className="mt-8">
                 <h4 className={`text-4xl font-black ${isDark ? "text-white" : "text-[#001829]"}`}>{data?.stats?.pastEventsCount || 0}</h4>
                 <p className={`text-[9px] font-black uppercase tracking-widest opacity-40 ${isDark ? "text-white" : "text-slate-900"}`}>Past Events</p>
              </div>
           </DashboardCard>

           {/* D. QUICK STAT - TOTAL EVENTS */}
           <DashboardCard isDark={isDark} className="md:col-span-2 lg:col-span-1 flex flex-col justify-between group" delay={0.3}>
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:rotate-12
                ${isDark ? "bg-[#fbbf24]/10 text-[#fbbf24]" : "bg-amber-50 text-amber-500"}`}>
                 <Trophy size={24} />
              </div>
              <div className="mt-8">
                 <h4 className={`text-4xl font-black ${isDark ? "text-white" : "text-[#001829]"}`}>{data?.stats?.totalEvents || 0}</h4>
                 <p className={`text-[9px] font-black uppercase tracking-widest opacity-40 ${isDark ? "text-white" : "text-slate-900"}`}>Total Events</p>
              </div>
           </DashboardCard>

           {/* E. EVENTS LIST */}
           <DashboardCard isDark={isDark} className="md:col-span-4 lg:col-span-4 row-span-2 !p-0" delay={0.4}>
              <div className={`p-6 border-b flex justify-between items-center ${isDark ? "border-white/5 bg-white/5" : "border-slate-100 bg-slate-50"}`}>
                 <h3 className={`font-black text-[10px] uppercase tracking-[0.2em] flex items-center gap-2 ${isDark ? "text-white" : "text-slate-900"}`}>
                    <Activity size={14} className="text-[#00aeef]" /> {lang === 'mn' ? 'Арга Хэмжээнүүд' : 'Club Events'}
                 </h3>
              </div>
              
              <div className="p-4 space-y-2 max-h-[400px] overflow-y-auto custom-scrollbar">
                 {data?.events?.length && data.events.length > 0 ? (
                    data.events.map((event, index) => (
                        <div key={index} className={`group flex items-center gap-4 p-4 rounded-3xl transition-all cursor-default
                          ${isDark ? "hover:bg-white/5" : "hover:bg-slate-50"}`}>
                        <div className={`w-11 h-11 rounded-2xl flex items-center justify-center font-black text-xs shrink-0 
                          ${isDark ? "bg-[#00aeef]/10 text-[#00aeef]" : "bg-sky-50 text-[#00aeef]"}`}>
                            {event.status === 'upcoming' ? 'UP' : 'PAST'}
                        </div>
                        <div className="flex-1 min-w-0">
                            <h4 className={`text-sm font-black truncate ${isDark ? "text-white" : "text-slate-900"}`}>
                                {getLocStr(event.title)}
                            </h4>
                            <p className={`text-[10px] font-bold opacity-40 uppercase tracking-widest ${isDark ? "text-white" : "text-slate-500"}`}>
                                {formatDate(event.date)}
                            </p>
                        </div>
                        <div className="text-right">
                            <span className={`text-[10px] font-black px-3 py-1.5 rounded-full
                                ${event.status === 'upcoming' 
                                    ? "text-[#10b981] bg-[#10b981]/10" 
                                    : "text-slate-400 bg-slate-400/10"}`}>
                                {event.status.toUpperCase()}
                            </span>
                        </div>
                        </div>
                    ))
                 ) : (
                    <div className="text-center py-20 opacity-20 text-xs font-bold uppercase tracking-widest">
                        No events found for this club.
                    </div>
                 )}
              </div>
           </DashboardCard>

        </div>
      </div>
    </div>
  );
}