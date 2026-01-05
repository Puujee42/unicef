"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { 
  Trophy, Clock, Calendar, MapPin, ArrowUpRight, Activity, 
  CheckCircle2, Shield, Zap, MoreHorizontal, ChevronRight, Loader2,
  Settings
} from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { useLanguage } from "../context/LanguageContext";

// --- SUB-COMPONENT: THEMED CARD ---
const DashboardCard = ({ children, className = "", delay = 0, isDark }: any) => (
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

export default function Dashboard() {
  const { user, isLoaded } = useUser();
  const { language: lang } = useLanguage();
  const { theme } = useTheme();
  
  const [mounted, setMounted] = useState(false);
  const [greeting, setGreeting] = useState("");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Sync with theme and hydration
  useEffect(() => setMounted(true), []);
  const isDark = mounted && (theme === "dark" || !theme);

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const res = await fetch('/api/user/dashboard');
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch (error) {
        console.error("Failed to load dashboard", error);
      } finally {
        setLoading(false);
      }
    }
    if (isLoaded && user) fetchDashboard();
  }, [isLoaded, user]);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting(lang === 'mn' ? "Өглөөний мэнд" : "Good Morning");
    else if (hour < 18) setGreeting(lang === 'mn' ? "Өдрийн мэнд" : "Good Afternoon");
    else setGreeting(lang === 'mn' ? "Оройн мэнд" : "Good Evening");
  }, [lang]);

  if (!mounted || !isLoaded || loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center transition-colors duration-700
        ${isDark ? "bg-[#001829]" : "bg-slate-50"}`}>
        <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-8 h-8 text-[#00aeef] animate-spin" />
            <p className={`text-sm tracking-widest uppercase font-bold ${isDark ? "text-white/40" : "text-slate-400"}`}>
              {lang === 'mn' ? 'Ачаалж байна...' : 'Loading Portal...'}
            </p>
        </div>
      </div>
    );
  }

  const progressPercent = data?.stats ? Math.min((data.stats.points / data.stats.targetPoints) * 100, 100) : 0;
  const formatDate = (dateString: string) => {
    if (!dateString) return "TBD";
    return new Date(dateString).toLocaleDateString(lang === 'mn' ? 'mn-MN' : 'en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute:'2-digit' });
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
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
           <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
              <p className="text-[#00aeef] text-[10px] font-black uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                 <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_#22c55e]" />
                 {lang === 'mn' ? 'ШУУД' : 'Online Now'}
              </p>
              <h1 className={`text-4xl md:text-6xl font-black tracking-tighter leading-none
                ${isDark ? "text-white" : "text-[#001829]"}`}>
                 {greeting}, <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00aeef] to-[#40c9ff]">
                    {data?.profile?.fullName || user?.firstName}
                 </span>
              </h1>
           </motion.div>

           <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex gap-3">
              <Link href="/events" className="px-6 py-3.5 bg-[#00aeef] hover:bg-[#009bd5] text-white font-black text-[10px] uppercase tracking-widest rounded-2xl shadow-xl shadow-[#00aeef]/20 transition-all flex items-center gap-2 active:scale-95">
                 <Calendar size={14} />
                 {lang === 'mn' ? 'Арга Хэмжээ' : 'Events'}
              </Link>
              <button className={`p-3.5 border rounded-2xl transition-all active:scale-95
                ${isDark ? "border-white/10 hover:bg-white/5 text-white" : "border-slate-200 bg-white text-slate-500 shadow-sm"}`}>
                 <Settings size={18} />
              </button>
           </motion.div>
        </div>

        {/* --- BENTO GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-4 gap-6">
           
           {/* A. DIGITAL ID CARD */}
           <DashboardCard isDark={isDark} className="md:col-span-3 lg:col-span-2 row-span-2 !p-0 group border-[#00aeef]/20">
              <div className="relative h-full p-8 flex flex-col justify-between z-10">
                 <div className="flex justify-between items-start">
                    <div className="flex items-center gap-5">
                       <div className={`w-20 h-20 rounded-3xl p-1 shadow-2xl overflow-hidden rotate-[-4deg] group-hover:rotate-0 transition-transform duration-500
                         ${isDark ? "bg-white" : "bg-white border border-slate-100"}`}>
                          <Image src={user?.imageUrl || "/logo.jpg"} alt="User" width={80} height={80} className="rounded-2xl w-full h-full object-cover" />
                       </div>
                       <div>
                          <h2 className={`text-2xl font-black leading-none mb-2 ${isDark ? "text-white" : "text-[#001829]"}`}>
                            {data?.profile?.fullName}
                          </h2>
                          <p className={`text-[10px] font-black uppercase tracking-widest ${isDark ? "text-white/40" : "text-slate-400"}`}>
                            {data?.profile?.studentId || "S.ID2025XXX"}
                          </p>
                       </div>
                    </div>
                    <div className={`p-3 rounded-2xl transition-colors ${isDark ? "bg-[#00aeef]/10 border border-[#00aeef]/20" : "bg-sky-50 border border-sky-100"}`}>
                       <Shield size={20} className="text-[#00aeef]" />
                    </div>
                 </div>

                 <div className="space-y-8 mt-12">
                    <div className="space-y-3">
                       <div className={`flex justify-between text-[10px] font-black uppercase tracking-widest ${isDark ? "text-white/40" : "text-slate-400"}`}>
                          <span>Next Level: {data?.stats?.nextLevel || "Pro"}</span>
                          <span className="text-[#00aeef]">{data?.stats?.points || 0} XP</span>
                       </div>
                       <div className={`h-2.5 w-full rounded-full overflow-hidden ${isDark ? "bg-black/20" : "bg-slate-100"}`}>
                          <motion.div 
                             initial={{ width: 0 }}
                             animate={{ width: `${progressPercent}%` }}
                             transition={{ duration: 1.5, ease: "circOut" }}
                             className="h-full bg-[#00aeef] shadow-[0_0_15px_rgba(0,174,239,0.5)]" 
                          />
                       </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                       <div className={`rounded-3xl p-5 border transition-all ${isDark ? "bg-black/20 border-white/5" : "bg-slate-50 border-slate-100"}`}>
                          <p className="text-[#00aeef] text-[9px] font-black uppercase tracking-[0.2em] mb-2">Member Rank</p>
                          <p className={`text-xl font-black ${isDark ? "text-white" : "text-[#001829]"}`}>{data?.stats?.level || "Volunteer"}</p>
                       </div>
                       <div className={`rounded-3xl p-5 border transition-all ${isDark ? "bg-black/20 border-white/5" : "bg-slate-50 border-slate-100"}`}>
                          <p className="text-[#fbbf24] text-[9px] font-black uppercase tracking-[0.2em] mb-2">Activity Hours</p>
                          <p className={`text-xl font-black ${isDark ? "text-white" : "text-[#001829]"}`}>{data?.stats?.hours || 0}h</p>
                       </div>
                    </div>
                 </div>
              </div>
           </DashboardCard>

           {/* B. NEXT EVENT TILE */}
           <DashboardCard isDark={isDark} className="md:col-span-3 lg:col-span-2 !p-0 group" delay={0.1}>
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1544027993-37dbfe43562a?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center transition-all duration-700 group-hover:scale-105" />
              <div className={`absolute inset-0 transition-colors duration-500
                ${isDark ? "bg-[#001829]/80" : "bg-white/80"}`} />
              
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
                       {data?.nextEvent ? (data.nextEvent.title?.en || data.nextEvent.title) : "Stay Tuned"}
                    </h3>
                    <p className={`text-xs font-bold flex items-center gap-2 opacity-60 ${isDark ? "text-white" : "text-slate-600"}`}>
                       <MapPin size={14} className="text-[#00aeef]" /> {data?.nextEvent ? (data.nextEvent.location?.en || data.nextEvent.location) : "Main Hall"}
                    </p>
                 </div>
              </div>
           </DashboardCard>

           {/* C. QUICK STAT - BADGES */}
           <DashboardCard isDark={isDark} className="md:col-span-2 lg:col-span-1 flex flex-col justify-between group" delay={0.2}>
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:rotate-12
                ${isDark ? "bg-[#fbbf24]/10 text-[#fbbf24]" : "bg-amber-50 text-amber-500"}`}>
                 <Trophy size={24} />
              </div>
              <div className="mt-8">
                 <h4 className={`text-4xl font-black ${isDark ? "text-white" : "text-[#001829]"}`}>{data?.stats?.badges?.length || 0}</h4>
                 <p className={`text-[9px] font-black uppercase tracking-widest opacity-40 ${isDark ? "text-white" : "text-slate-900"}`}>Recognition</p>
              </div>
           </DashboardCard>

           {/* D. QUICK STAT - EVENTS */}
           <DashboardCard isDark={isDark} className="md:col-span-2 lg:col-span-1 flex flex-col justify-between group" delay={0.3}>
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:rotate-12
                ${isDark ? "bg-[#10b981]/10 text-[#10b981]" : "bg-emerald-50 text-emerald-500"}`}>
                 <CheckCircle2 size={24} />
              </div>
              <div className="mt-8">
                 <h4 className={`text-4xl font-black ${isDark ? "text-white" : "text-[#001829]"}`}>{data?.stats?.eventsAttended || 0}</h4>
                 <p className={`text-[9px] font-black uppercase tracking-widest opacity-40 ${isDark ? "text-white" : "text-slate-900"}`}>Activities</p>
              </div>
           </DashboardCard>

           {/* E. ACTIVITY FEED */}
           <DashboardCard isDark={isDark} className="md:col-span-2 lg:col-span-2 row-span-2 !p-0" delay={0.4}>
              <div className={`p-6 border-b flex justify-between items-center ${isDark ? "border-white/5 bg-white/5" : "border-slate-100 bg-slate-50"}`}>
                 <h3 className={`font-black text-[10px] uppercase tracking-[0.2em] flex items-center gap-2 ${isDark ? "text-white" : "text-slate-900"}`}>
                    <Activity size={14} className="text-[#00aeef]" /> {lang === 'mn' ? 'Сүүлийн үйлдлүүд' : 'Recent Activity'}
                 </h3>
                 <MoreHorizontal size={16} className="opacity-20 cursor-pointer hover:opacity-100" />
              </div>
              
              <div className="p-4 space-y-2 max-h-[340px] overflow-y-auto custom-scrollbar">
                 {data?.recentActivity?.length > 0 ? (
                    data.recentActivity.map((activity: any, index: number) => (
                        <div key={index} className={`group flex items-center gap-4 p-4 rounded-3xl transition-all cursor-default
                          ${isDark ? "hover:bg-white/5" : "hover:bg-slate-50"}`}>
                        <div className={`w-11 h-11 rounded-2xl flex items-center justify-center font-black text-xs shrink-0 
                          ${isDark ? "bg-[#00aeef]/10 text-[#00aeef]" : "bg-sky-50 text-[#00aeef]"}`}>
                            {activity.type.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                            <h4 className={`text-sm font-black truncate ${isDark ? "text-white" : "text-slate-900"}`}>{activity.title}</h4>
                            <p className={`text-[10px] font-bold opacity-40 uppercase tracking-widest ${isDark ? "text-white" : "text-slate-500"}`}>{formatDate(activity.date)}</p>
                        </div>
                        <div className="text-right">
                            <span className="text-[10px] font-black text-[#10b981] bg-[#10b981]/10 px-3 py-1.5 rounded-full">
                                +{activity.points}
                            </span>
                        </div>
                        </div>
                    ))
                 ) : (
                    <div className="text-center py-20 opacity-20 text-xs font-bold uppercase tracking-widest">
                        No activity recorded
                    </div>
                 )}
              </div>
              
              <div className={`p-4 border-t mt-auto ${isDark ? "border-white/5" : "border-slate-100"}`}>
                 <button className={`w-full py-2 text-[10px] font-black uppercase tracking-[0.3em] opacity-40 hover:opacity-100 hover:text-[#00aeef] transition-all`}>
                    {lang === 'mn' ? 'Бүх түүхийг харах' : 'Full History'}
                 </button>
              </div>
           </DashboardCard>

           {/* F. CTA TILE */}
           <DashboardCard isDark={isDark} className="md:col-span-4 lg:col-span-2 bg-[#00aeef] !border-none group cursor-pointer shadow-2xl shadow-[#00aeef]/30" delay={0.5}>
              <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-overlay" />
              <div className="relative z-10 flex items-center justify-between h-full py-2">
                 <div>
                    <h3 className="text-2xl font-black text-white mb-2 tracking-tight">Make an Impact</h3>
                    <p className="text-white/80 text-xs font-bold uppercase tracking-wider">Donate now to support the next campaign.</p>
                 </div>
                 <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center text-[#00aeef] shadow-2xl group-hover:scale-110 transition-transform">
                    <Zap size={28} className="fill-current" />
                 </div>
              </div>
           </DashboardCard>

        </div>
      </div>
    </div>
  );
}