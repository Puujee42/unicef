"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { 
  Trophy, 
  Clock, 
  Calendar, 
  MapPin, 
  ArrowUpRight, 
  Activity, 
  CheckCircle2,
  Shield,
  Zap,
  MoreHorizontal,
  ChevronRight
} from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "../context/LanguageContext";

// --- BRAND PALETTE ---
const BRAND = {
  sky: "#00aeef",
  ocean: "#005691",
  deep: "#001829",
  gold: "#fbbf24",
};

// --- MOCK DATA (Ideally this comes from your /api/user endpoint later) ---
const MOCK_STATS = {
  points: 1250,
  level: "Volunteer",
  nextLevel: "Leader",
  hours: 45,
  eventsAttended: 12,
  badges: ["Early Bird", "Eco Warrior", "Top Donor"],
  recentActivity: [
    { id: 1, type: "Event", title: "Clean Air Campaign", date: "2 days ago", points: "+50", status: "completed" },
    { id: 2, type: "Donation", title: "Book Drive", date: "1 week ago", points: "+100", status: "verified" },
    { id: 3, type: "Workshop", title: "Mental Health 101", date: "2 weeks ago", points: "+30", status: "completed" },
  ]
};

// --- COMPONENTS ---

const DashboardCard = ({ children, className = "", delay = 0 }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.5 }}
    className={`relative bg-[#001d30]/60 backdrop-blur-xl border border-white/5 rounded-[2rem] p-6 overflow-hidden ${className}`}
  >
    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
    {children}
  </motion.div>
);

const StatRing = ({ percentage }: { percentage: number }) => {
  const radius = 30;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative w-20 h-20 flex items-center justify-center">
      <svg className="transform -rotate-90 w-full h-full">
        <circle cx="40" cy="40" r={radius} stroke="#002b49" strokeWidth="6" fill="transparent" />
        <motion.circle
          cx="40" cy="40" r={radius}
          stroke={BRAND.sky}
          strokeWidth="6"
          fill="transparent"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute text-xs font-bold text-white">{percentage}%</div>
    </div>
  );
};

export default function Dashboard() {
  const { user, isLoaded } = useUser();
  const { language: lang } = useLanguage();
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting(lang === 'mn' ? "Өглөөний мэнд" : "Good Morning");
    else if (hour < 18) setGreeting(lang === 'mn' ? "Өдрийн мэнд" : "Good Afternoon");
    else setGreeting(lang === 'mn' ? "Оройн мэнд" : "Good Evening");
  }, [lang]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-[#001829] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#00aeef] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Fallback if metadata isn't synced yet
  const studentId = (user?.unsafeMetadata?.studentId as string) || "ID PENDING";
  const fullName = user?.fullName || (user?.unsafeMetadata?.fullName as string) || "Member";

  return (
    <div className="min-h-screen bg-[#001829] text-white pt-28 pb-12 px-6 overflow-x-hidden font-sans">
      
      {/* 1. ATMOSPHERE */}
      <div className="absolute inset-0 pointer-events-none fixed">
         <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#00aeef] rounded-full blur-[250px] opacity-[0.05]" />
         <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#005691] rounded-full blur-[200px] opacity-[0.08]" />
         <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        
        {/* 2. HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
           <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
              <p className="text-[#00aeef] text-xs font-black uppercase tracking-widest mb-2 flex items-center gap-2">
                 <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_#22c55e]" />
                 Online Now
              </p>
              <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white">
                 {greeting}, <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00aeef] to-[#40c9ff]">{user?.firstName}</span>
              </h1>
           </motion.div>

           <motion.div 
             initial={{ opacity: 0, x: 20 }} 
             animate={{ opacity: 1, x: 0 }}
             className="flex gap-4"
           >
              <Link href="/events" className="px-6 py-3 bg-[#00aeef] hover:bg-[#009bd5] text-white font-bold rounded-xl text-xs uppercase tracking-wide transition-all shadow-lg shadow-[#00aeef]/20 flex items-center gap-2">
                 <Calendar size={16} />
                 {lang === 'mn' ? 'Арга Хэмжээ' : 'Events'}
              </Link>
              <button className="px-6 py-3 border border-white/10 hover:bg-white/5 rounded-xl text-xs font-bold uppercase tracking-wide transition-all">
                 {lang === 'mn' ? 'Тохиргоо' : 'Settings'}
              </button>
           </motion.div>
        </div>

        {/* 3. BENTO GRID */}
        <div className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-4 gap-6 auto-rows-[minmax(180px,auto)]">
           
           {/* A. DIGITAL ID CARD (Large - 2 cols) */}
           <DashboardCard className="md:col-span-3 lg:col-span-2 row-span-2 !p-0 group cursor-pointer border-[#00aeef]/20">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#00aeef] rounded-full blur-[100px] opacity-10 group-hover:opacity-20 transition-opacity" />
              
              <div className="relative h-full p-8 flex flex-col justify-between z-10">
                 <div className="flex justify-between items-start">
                    <div className="flex items-center gap-4">
                       <div className="w-16 h-16 rounded-2xl bg-white p-1 shadow-lg overflow-hidden">
                          <Image src={user?.imageUrl || "/logo.jpg"} alt="User" width={64} height={64} className="rounded-xl w-full h-full object-cover" />
                       </div>
                       <div>
                          <h2 className="text-2xl font-black leading-none mb-1">{fullName}</h2>
                          <p className="text-white/50 text-sm font-medium">{studentId}</p>
                       </div>
                    </div>
                    <div className="bg-[#00aeef]/10 border border-[#00aeef]/30 p-2 rounded-lg">
                       <Shield size={20} className="text-[#00aeef]" />
                    </div>
                 </div>

                 <div className="space-y-6 mt-8">
                    <div className="space-y-2">
                       <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-white/40">
                          <span>Progress to {MOCK_STATS.nextLevel}</span>
                          <span>{MOCK_STATS.points} / 2000 XP</span>
                       </div>
                       <div className="h-2 w-full bg-black/20 rounded-full overflow-hidden">
                          <motion.div 
                             initial={{ width: 0 }}
                             animate={{ width: "65%" }}
                             transition={{ duration: 1.5, ease: "circOut" }}
                             className="h-full bg-gradient-to-r from-[#00aeef] to-[#40c9ff] shadow-[0_0_15px_#00aeef]" 
                          />
                       </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                       <div className="bg-black/20 rounded-xl p-4 border border-white/5">
                          <p className="text-[#00aeef] text-xs font-bold uppercase mb-1">Rank</p>
                          <p className="text-xl font-bold">{MOCK_STATS.level}</p>
                       </div>
                       <div className="bg-black/20 rounded-xl p-4 border border-white/5">
                          <p className="text-[#fbbf24] text-xs font-bold uppercase mb-1">Impact</p>
                          <p className="text-xl font-bold">{MOCK_STATS.hours}h Vol.</p>
                       </div>
                    </div>
                 </div>
              </div>
           </DashboardCard>

           {/* B. UPCOMING EVENT (Medium - 2 Cols) */}
           <DashboardCard className="md:col-span-3 lg:col-span-2 !p-0 group bg-gradient-to-br from-[#005691]/80 to-[#001d30] border-[#00aeef]/20" delay={0.1}>
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1544027993-37dbfe43562a?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-30 group-hover:opacity-40 transition-opacity mix-blend-overlay" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#00101a] via-[#00101a]/20 to-transparent" />
              
              <div className="relative z-10 h-full p-8 flex flex-col justify-between">
                 <div className="flex justify-between">
                    <span className="bg-[#00aeef] text-white text-[10px] font-black uppercase px-3 py-1 rounded-full shadow-lg">Next Event</span>
                    <ArrowUpRight className="text-white group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                 </div>
                 
                 <div>
                    <div className="flex items-center gap-2 text-sky-300 text-xs font-bold uppercase tracking-widest mb-2">
                       <Clock size={12} />
                       <span>Tomorrow, 09:00</span>
                    </div>
                    <h3 className="text-2xl font-black text-white leading-tight mb-2">
                       Youth Leadership Summit
                    </h3>
                    <p className="text-white/60 text-sm flex items-center gap-2">
                       <MapPin size={14} /> Shangri-La Hall
                    </p>
                 </div>
              </div>
           </DashboardCard>

           {/* C. QUICK STAT 1 (Small) */}
           <DashboardCard className="md:col-span-2 lg:col-span-1 flex flex-col justify-between group" delay={0.2}>
              <div className="w-10 h-10 rounded-full bg-[#fbbf24]/10 flex items-center justify-center text-[#fbbf24]">
                 <Trophy size={20} />
              </div>
              <div>
                 <h4 className="text-3xl font-black text-white">{MOCK_STATS.badges.length}</h4>
                 <p className="text-white/40 text-xs font-bold uppercase tracking-wider">Badges Earned</p>
              </div>
              <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                 <ChevronRight size={16} className="text-[#fbbf24]" />
              </div>
           </DashboardCard>

           {/* D. QUICK STAT 2 (Small) */}
           <DashboardCard className="md:col-span-2 lg:col-span-1 flex flex-col justify-between group" delay={0.3}>
              <div className="w-10 h-10 rounded-full bg-[#10b981]/10 flex items-center justify-center text-[#10b981]">
                 <CheckCircle2 size={20} />
              </div>
              <div>
                 <h4 className="text-3xl font-black text-white">{MOCK_STATS.eventsAttended}</h4>
                 <p className="text-white/40 text-xs font-bold uppercase tracking-wider">Events Attended</p>
              </div>
           </DashboardCard>

           {/* E. ACTIVITY FEED (Wide or Tall depending on layout) */}
           <DashboardCard className="md:col-span-2 lg:col-span-2 row-span-2 !p-0" delay={0.4}>
              <div className="p-6 border-b border-white/5 flex justify-between items-center bg-black/10">
                 <h3 className="font-bold text-white text-sm uppercase tracking-wide flex items-center gap-2">
                    <Activity size={16} className="text-[#00aeef]" /> Recent Activity
                 </h3>
                 <MoreHorizontal size={16} className="text-white/30 cursor-pointer hover:text-white" />
              </div>
              
              <div className="p-4 space-y-2">
                 {MOCK_STATS.recentActivity.map((activity) => (
                    <div key={activity.id} className="group flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors cursor-default">
                       <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs shrink-0
                          ${activity.type === 'Event' ? 'bg-[#00aeef]/10 text-[#00aeef]' : ''}
                          ${activity.type === 'Donation' ? 'bg-[#fbbf24]/10 text-[#fbbf24]' : ''}
                          ${activity.type === 'Workshop' ? 'bg-[#f43f5e]/10 text-[#f43f5e]' : ''}
                       `}>
                          {activity.type[0]}
                       </div>
                       <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-bold text-white truncate">{activity.title}</h4>
                          <p className="text-xs text-white/40">{activity.date}</p>
                       </div>
                       <div className="text-right">
                          <span className="text-xs font-bold text-green-400 bg-green-400/10 px-2 py-1 rounded-md">
                             {activity.points}
                          </span>
                       </div>
                    </div>
                 ))}
              </div>
              
              <div className="p-4 border-t border-white/5 mt-auto">
                 <button className="w-full py-2 text-xs font-bold uppercase tracking-widest text-white/40 hover:text-white transition-colors">
                    View Full History
                 </button>
              </div>
           </DashboardCard>

           {/* F. CTA TILE */}
           <DashboardCard className="md:col-span-4 lg:col-span-2 bg-[#00aeef] !border-none group cursor-pointer" delay={0.5}>
              <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-overlay" />
              <div className="relative z-10 flex items-center justify-between h-full">
                 <div>
                    <h3 className="text-2xl font-black text-white mb-1">Make an Impact</h3>
                    <p className="text-white/80 text-xs font-medium">Donate now to support the next campaign.</p>
                 </div>
                 <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-[#00aeef] shadow-lg group-hover:scale-110 transition-transform">
                    <Zap size={24} className="fill-current" />
                 </div>
              </div>
           </DashboardCard>

        </div>
      </div>
    </div>
  );
}