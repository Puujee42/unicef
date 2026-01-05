"use client";

import React, { useState, useEffect } from "react";
import {
  Users, Calendar, Trash2, Plus,
  ShieldAlert, Loader2, Upload, X,
  ImageIcon, MapPin, Search, Pencil,
  ChevronDown, Briefcase, School, Newspaper,
  Star
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";

// --- TYPES ---
interface EventType {
  _id: string;
  title: { en: string; mn: string };
  description: { en: string; mn: string };
  date: string;
  timeString: string;
  location: { en: string; mn: string };
  category: string;
  status: string;
  image: string;
}

interface UserType {
  _id: string;
  fullName: string;
  studentId: string;
  role: string;
  badges: string[];
}

interface OpportunityType {
  _id: string;
  type: string;
  title: { en: string; mn: string };
  provider: { en: string; mn: string };
  location: { en: string; mn: string };
  deadline: string;
  description: { en: string; mn: string };
  requirements: { en: string[]; mn: string[] };
  tags: string[];
  link: string;
  image: string;
}

interface ClubType {
  _id: string;
  clubId: string;
  name: { en: string; mn: string };
  description: { en: string; mn: string };
  image: string;
  website: string;
  email: string;
}

interface NewsType {
  _id: string;
  title: { en: string; mn: string };
  summary: { en: string; mn: string };
  content: { en: string; mn: string };
  author: string;
  publishedDate: string;
  image: string;
  tags: string[];
  featured: boolean;
}

export default function AdminDashboard() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const { theme } = useTheme();
  
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<'events' | 'opportunities'  | 'news' | 'users'>('events');
  
  // Data State
  const [events, setEvents] = useState<EventType[]>([]);
  const [users, setUsers] = useState<UserType[]>([]);
  const [opportunities, setOpportunities] = useState<OpportunityType[]>([]);
  const [news, setNews] = useState<NewsType[]>([]);
  
  // UI State
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);

  // Form State
  const [showEventForm, setShowEventForm] = useState(false);
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [newEvent, setNewEvent] = useState({
    titleEn: "", titleMn: "", 
    descEn: "", descMn: "",
    date: "", time: "",
    locEn: "", locMn: "",
    category: "campaign",
    imageFile: null as File | null,
    currentImageUrl: ""
  });

  const [showOppForm, setShowOppForm] = useState(false);
  const [editingOppId, setEditingOppId] = useState<string | null>(null);
  const [newOpp, setNewOpp] = useState({
    type: "scholarship",
    titleEn: "", titleMn: "",
    providerEn: "", providerMn: "",
    locEn: "", locMn: "",
    descEn: "", descMn: "",
    deadline: "", link: "",
    tags: "", reqEn: "", reqMn: "",
    imageFile: null as File | null,
    currentImageUrl: ""
  });

 

  const [showNewsForm, setShowNewsForm] = useState(false);
  const [editingNewsId, setEditingNewsId] = useState<string | null>(null);
  const [newNews, setNewNews] = useState({
    titleEn: "", titleMn: "",
    summaryEn: "", summaryMn: "",
    contentEn: "", contentMn: "",
    author: "Admin",
    tags: "",
    featured: false,
    imageFile: null as File | null,
    currentImageUrl: ""
  });

  const [badgeInput, setBadgeInput] = useState<{ [key: string]: string }>({});

  // 1. SECURITY & HYDRATION
  useEffect(() => {
    setMounted(true);
    const init = async () => {
      if (!isLoaded) return;
      if (!user) { router.push("/sign-in"); return; }
      if (user.publicMetadata.role !== "admin") {
        router.push("/");
        return;
      }
      setIsAuthorized(true);
      await fetchData();
    };
    init();
  }, [isLoaded, user, router]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [eventsRes, usersRes, oppsRes, newsRes] = await Promise.all([
        fetch('/api/admin/events'),
        fetch('/api/admin/users'),
        fetch('/api/admin/opportunities'),
        fetch('/api/admin/news')
      ]);
      if (eventsRes.ok && usersRes.ok && oppsRes.ok  && newsRes.ok) {
        setEvents(await eventsRes.json());
        setUsers(await usersRes.json());
        setOpportunities(await oppsRes.json());
       
        setNews(await newsRes.json());
      }
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  if (!mounted) return null;
  const isDark = theme === "dark" || !theme;

  // --- EVENT ACTIONS ---
  const handleDeleteEvent = async (id: string) => {
    if (!confirm("Delete this event?")) return;
    setEvents(prev => prev.filter(e => e._id !== id));
    await fetch(`/api/admin/events?id=${id}`, { method: 'DELETE' });
  };

  const handleEditEvent = (event: EventType) => {
    setEditingEventId(event._id);
    setNewEvent({
        titleEn: event.title.en, titleMn: event.title.mn,
        descEn: event.description.en, descMn: event.description.mn,
        date: new Date(event.date).toISOString().split('T')[0],
        time: event.timeString,
        locEn: event.location.en, locMn: event.location.mn,
        category: event.category, imageFile: null,
        currentImageUrl: event.image
    });
    setShowEventForm(true);
  };

  const handleCreateEvent = () => {
    setEditingEventId(null);
    setNewEvent({
        titleEn: "", titleMn: "", descEn: "", descMn: "",
        date: "", time: "", locEn: "", locMn: "",
        category: "campaign", imageFile: null, currentImageUrl: ""
    });
    setShowEventForm(true);
  };

  const handleSubmitEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEventId && !newEvent.imageFile) return alert("Image required");
    setIsSubmitting(true);
    try {
        const formData = new FormData();
        formData.append("titleEn", newEvent.titleEn); formData.append("titleMn", newEvent.titleMn);
        formData.append("descEn", newEvent.descEn); formData.append("descMn", newEvent.descMn);
        formData.append("date", newEvent.date); formData.append("timeString", newEvent.time);
        formData.append("locEn", newEvent.locEn); formData.append("locMn", newEvent.locMn);
        formData.append("category", newEvent.category);
        if (newEvent.imageFile) formData.append("image", newEvent.imageFile);
        if (editingEventId) formData.append("id", editingEventId);

        const method = editingEventId ? 'PUT' : 'POST';
        const res = await fetch('/api/admin/events', { method, body: formData });
        if (res.ok) { setShowEventForm(false); fetchData(); }
    } catch (error) { console.error(error); } finally { setIsSubmitting(false); }
  };

  // --- OPPORTUNITY ACTIONS ---
  const handleDeleteOpp = async (id: string) => {
    if (!confirm("Delete this opportunity?")) return;
    setOpportunities(prev => prev.filter(o => o._id !== id));
    await fetch(`/api/admin/opportunities?id=${id}`, { method: 'DELETE' });
  };

  const handleEditOpp = (opp: OpportunityType) => {
    setEditingOppId(opp._id);
    setNewOpp({
        type: opp.type,
        titleEn: opp.title.en, titleMn: opp.title.mn,
        providerEn: opp.provider.en, providerMn: opp.provider.mn,
        locEn: opp.location.en, locMn: opp.location.mn,
        descEn: opp.description.en, descMn: opp.description.mn,
        deadline: opp.deadline, link: opp.link,
        tags: opp.tags.join(', '),
        reqEn: opp.requirements.en.join('\n'), reqMn: opp.requirements.mn.join('\n'),
        imageFile: null, currentImageUrl: opp.image
    });
    setShowOppForm(true);
  };

  const handleCreateOpp = () => {
    setEditingOppId(null);
    setNewOpp({
        type: "scholarship",
        titleEn: "", titleMn: "", providerEn: "", providerMn: "",
        locEn: "", locMn: "", descEn: "", descMn: "",
        deadline: "", link: "", tags: "", reqEn: "", reqMn: "",
        imageFile: null, currentImageUrl: ""
    });
    setShowOppForm(true);
  };

  const handleSubmitOpp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingOppId && !newOpp.imageFile) return alert("Image required");
    setIsSubmitting(true);
    try {
        const formData = new FormData();
        formData.append("type", newOpp.type);
        formData.append("titleEn", newOpp.titleEn); formData.append("titleMn", newOpp.titleMn);
        formData.append("providerEn", newOpp.providerEn); formData.append("providerMn", newOpp.providerMn);
        formData.append("locEn", newOpp.locEn); formData.append("locMn", newOpp.locMn);
        formData.append("descEn", newOpp.descEn); formData.append("descMn", newOpp.descMn);
        formData.append("deadline", newOpp.deadline); formData.append("link", newOpp.link);
        formData.append("tags", newOpp.tags);
        formData.append("reqEn", newOpp.reqEn); formData.append("reqMn", newOpp.reqMn);
        if (newOpp.imageFile) formData.append("image", newOpp.imageFile);
        if (editingOppId) formData.append("id", editingOppId);

        const method = editingOppId ? 'PUT' : 'POST';
        const res = await fetch('/api/admin/opportunities', { method, body: formData });
        if (res.ok) { setShowOppForm(false); fetchData(); }
    } catch (error) { console.error(error); } finally { setIsSubmitting(false); }
  };

  // --- CLUB ACTIONS ---
 

 

  
  
  // --- NEWS ACTIONS ---
  const handleDeleteNews = async (id: string) => {
    if (!confirm("Delete this article?")) return;
    setNews(prev => prev.filter(n => n._id !== id));
    await fetch(`/api/admin/news?id=${id}`, { method: 'DELETE' });
  };

  const handleEditNews = (article: NewsType) => {
    setEditingNewsId(article._id);
    setNewNews({
        titleEn: article.title.en, titleMn: article.title.mn,
        summaryEn: article.summary.en, summaryMn: article.summary.mn,
        contentEn: article.content.en, contentMn: article.content.mn,
        author: article.author,
        tags: article.tags.join(', '),
        featured: article.featured,
        imageFile: null, currentImageUrl: article.image
    });
    setShowNewsForm(true);
  };

  const handleCreateNews = () => {
    setEditingNewsId(null);
    setNewNews({
        titleEn: "", titleMn: "", summaryEn: "", summaryMn: "",
        contentEn: "", contentMn: "", author: "Admin",
        tags: "", featured: false, imageFile: null, currentImageUrl: ""
    });
    setShowNewsForm(true);
  };

  const handleSubmitNews = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingNewsId && !newNews.imageFile) return alert("Image required");
    setIsSubmitting(true);
    try {
        const formData = new FormData();
        formData.append("titleEn", newNews.titleEn); formData.append("titleMn", newNews.titleMn);
        formData.append("summaryEn", newNews.summaryEn); formData.append("summaryMn", newNews.summaryMn);
        formData.append("contentEn", newNews.contentEn); formData.append("contentMn", newNews.contentMn);
        formData.append("author", newNews.author);
        formData.append("tags", newNews.tags);
        formData.append("featured", String(newNews.featured));
        if (newNews.imageFile) formData.append("image", newNews.imageFile);
        if (editingNewsId) formData.append("id", editingNewsId);

        const method = editingNewsId ? 'PUT' : 'POST';
        const res = await fetch('/api/admin/news', { method, body: formData });
        if (res.ok) { setShowNewsForm(false); fetchData(); }
    } catch (error) { console.error(error); } finally { setIsSubmitting(false); }
  };

  // --- USER ACTIONS ---
  const handleDeleteUser = async (id: string) => {
    if (!confirm("Remove this member?")) return;
    setUsers(prev => prev.filter(u => u._id !== id));
    await fetch(`/api/admin/users?id=${id}`, { method: 'DELETE' });
  };

  const handleAssignBadge = async (userId: string) => {
    const badge = badgeInput[userId];
    if (!badge) return;
    setUsers(prev => prev.map(u => u._id === userId ? { ...u, badges: [...u.badges, badge] } : u));
    setBadgeInput(prev => ({...prev, [userId]: ""}));
    await fetch('/api/admin/users', {
        method: 'PUT',
        body: JSON.stringify({ userId, action: 'assign_badge', badgeName: badge })
    });
  };

  if (!isAuthorized) return (
    <div className={`min-h-screen flex flex-col items-center justify-center gap-4 transition-colors duration-700 ${isDark ? "bg-[#001829] text-[#00aeef]" : "bg-slate-50 text-[#00aeef]"}`}>
        <Loader2 className="w-12 h-12 animate-spin" />
        <p className="font-mono text-xs uppercase tracking-[0.3em] opacity-40">Command Access Required</p>
    </div>
  );

  return (
    <div className={`min-h-screen transition-colors duration-700 font-sans overflow-x-hidden
        ${isDark ? "bg-[#001829] text-white" : "bg-slate-50 text-slate-900"}`}>
        
        {/* ATMOSPHERE */}
        <div className="fixed inset-0 pointer-events-none">
            <div className={`absolute top-[-10%] right-[-10%] w-[800px] h-[800px] rounded-full blur-[200px] transition-opacity duration-700
                ${isDark ? "bg-[#00aeef] opacity-[0.08]" : "bg-sky-200 opacity-[0.4]"}`} />
            <div className={`absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full blur-[150px] transition-opacity duration-700
                ${isDark ? "bg-[#005691] opacity-[0.06]" : "bg-blue-100 opacity-[0.3]"}`} />
            <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto pt-28 px-6 pb-20">
            
            {/* HEADER */}
            <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-16">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_#22c55e]" />
                        <span className={`font-mono text-[10px] uppercase tracking-[0.3em] ${isDark ? "text-[#00aeef]" : "text-sky-600"}`}>
                            Admin Console v2.5
                        </span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black tracking-tighter leading-none">Command Center</h1>
                </motion.div>

                <div className={`p-1.5 rounded-2xl flex items-center border transition-all duration-500 overflow-x-auto
                    ${isDark ? "bg-white/5 border-white/10 backdrop-blur-md shadow-2xl" : "bg-white border-slate-200 shadow-xl shadow-slate-200/40"}`}>
                    {['events', 'opportunities', 'news', 'users'].map((tab) => (
                        <button key={tab} onClick={() => setActiveTab(tab as any)} 
                                className={`relative z-10 px-6 py-3 text-[10px] font-black uppercase tracking-widest transition-colors duration-500 whitespace-nowrap
                                ${activeTab === tab ? (isDark ? 'text-[#001829]' : 'text-white') : (isDark ? 'text-white/40 hover:text-white' : 'text-slate-400 hover:text-slate-900')}`}>
                            {tab}
                            {activeTab === tab && (
                                <motion.div layoutId="tab-highlight" className="absolute inset-0 bg-[#00aeef] rounded-xl -z-10 shadow-lg" />
                            )}
                        </button>
                    ))}
                </div>
            </div>

            <AnimatePresence mode="wait">
                {activeTab === 'events' && (
                    <motion.div key="events" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-10">
                            <h2 className="text-2xl font-black flex items-center gap-3"><Calendar className="text-[#00aeef]" /> Manage Events</h2>
                            <button onClick={handleCreateEvent} className="w-full sm:w-auto flex items-center justify-center gap-3 bg-[#00aeef] text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-[#00aeef]/20 hover:bg-[#009bd5] transition-all active:scale-95">
                                <Plus size={16} /> Add Event
                            </button>
                        </div>
                        <div className="grid gap-5">
                            {loading ? <div className="py-20 flex justify-center"><Loader2 className="animate-spin text-[#00aeef]" /></div> : events.map((event, i) => (
                                <motion.div key={event._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                                    className={`group relative p-5 rounded-[2rem] border flex items-center gap-6 transition-all duration-300
                                    ${isDark ? "bg-[#00101a]/60 border-white/5 hover:bg-[#001d30]" : "bg-white border-slate-100 hover:border-sky-200 shadow-lg shadow-slate-200/20"}`}>
                                    <div className="w-28 h-24 rounded-2xl overflow-hidden relative shadow-lg shrink-0">
                                        <img src={event.image} alt="" className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg border transition-colors
                                                ${isDark ? "bg-[#00aeef]/10 border-[#00aeef]/20 text-[#00aeef]" : "bg-sky-50 border-sky-100 text-sky-600"}`}>
                                                {event.category}
                                            </span>
                                            <span className={`text-[10px] font-bold transition-colors ${isDark ? "text-white/30" : "text-slate-400"}`}>
                                                {new Date(event.date).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <h3 className={`text-xl font-black truncate leading-tight ${isDark ? "text-white" : "text-slate-900"}`}>{event.title.en}</h3>
                                    </div>
                                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0 pr-2">
                                        <button onClick={() => handleEditEvent(event)} className={`p-3.5 rounded-xl transition-all ${isDark ? "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500 hover:text-black" : "bg-amber-50 text-amber-600 hover:bg-amber-500 hover:text-white"}`}>
                                            <Pencil size={18} />
                                        </button>
                                        <button onClick={() => handleDeleteEvent(event._id)} className={`p-3.5 rounded-xl transition-all ${isDark ? "bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white" : "bg-rose-50 text-rose-600 hover:bg-rose-500 hover:text-white"}`}>
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {activeTab === 'opportunities' && (
                    <motion.div key="opportunities" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-10">
                            <h2 className="text-2xl font-black flex items-center gap-3"><Briefcase className="text-[#00aeef]" /> Manage Opportunities</h2>
                            <button onClick={handleCreateOpp} className="w-full sm:w-auto flex items-center justify-center gap-3 bg-[#00aeef] text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-[#00aeef]/20 hover:bg-[#009bd5] transition-all active:scale-95">
                                <Plus size={16} /> Add Opportunity
                            </button>
                        </div>
                        <div className="grid gap-5">
                            {loading ? <div className="py-20 flex justify-center"><Loader2 className="animate-spin text-[#00aeef]" /></div> : opportunities.map((opp, i) => (
                                <motion.div key={opp._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                                    className={`group relative p-5 rounded-[2rem] border flex items-center gap-6 transition-all duration-300
                                    ${isDark ? "bg-[#00101a]/60 border-white/5 hover:bg-[#001d30]" : "bg-white border-slate-100 hover:border-sky-200 shadow-lg shadow-slate-200/20"}`}>
                                    <div className="w-28 h-24 rounded-2xl overflow-hidden relative shadow-lg shrink-0 flex items-center justify-center bg-white/5 border border-white/10">
                                        {opp.image ? <img src={opp.image} alt="" className="object-cover w-full h-full" /> : <Briefcase className="text-white/20" />}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg border transition-colors
                                                ${isDark ? "bg-[#00aeef]/10 border-[#00aeef]/20 text-[#00aeef]" : "bg-sky-50 border-sky-100 text-sky-600"}`}>
                                                {opp.type}
                                            </span>
                                            <span className={`text-[10px] font-bold transition-colors ${isDark ? "text-white/30" : "text-slate-400"}`}>
                                                Due: {opp.deadline}
                                            </span>
                                        </div>
                                        <h3 className={`text-xl font-black truncate leading-tight ${isDark ? "text-white" : "text-slate-900"}`}>{opp.title.en}</h3>
                                        <p className="text-xs opacity-50 truncate">{opp.provider.en}</p>
                                    </div>
                                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0 pr-2">
                                        <button onClick={() => handleEditOpp(opp)} className={`p-3.5 rounded-xl transition-all ${isDark ? "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500 hover:text-black" : "bg-amber-50 text-amber-600 hover:bg-amber-500 hover:text-white"}`}>
                                            <Pencil size={18} />
                                        </button>
                                        <button onClick={() => handleDeleteOpp(opp._id)} className={`p-3.5 rounded-xl transition-all ${isDark ? "bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white" : "bg-rose-50 text-rose-600 hover:bg-rose-500 hover:text-white"}`}>
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}

               

                {activeTab === 'news' && (
                    <motion.div key="news" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-10">
                            <h2 className="text-2xl font-black flex items-center gap-3"><Newspaper className="text-[#00aeef]" /> Manage News</h2>
                            <button onClick={handleCreateNews} className="w-full sm:w-auto flex items-center justify-center gap-3 bg-[#00aeef] text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-[#00aeef]/20 hover:bg-[#009bd5] transition-all active:scale-95">
                                <Plus size={16} /> Create Article
                            </button>
                        </div>
                        <div className="grid gap-5">
                            {loading ? <div className="py-20 flex justify-center"><Loader2 className="animate-spin text-[#00aeef]" /></div> : news.map((article, i) => (
                                <motion.div key={article._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                                    className={`group relative p-5 rounded-[2rem] border flex items-center gap-6 transition-all duration-300
                                    ${isDark ? "bg-[#00101a]/60 border-white/5 hover:bg-[#001d30]" : "bg-white border-slate-100 hover:border-sky-200 shadow-lg shadow-slate-200/20"}`}>
                                    <div className="w-28 h-24 rounded-2xl overflow-hidden relative shadow-lg shrink-0">
                                        <img src={article.image} alt="" className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700" />
                                        {article.featured && (
                                            <div className="absolute top-2 right-2 bg-amber-500 text-white p-1 rounded-lg shadow-lg">
                                                <Star size={12} fill="currentColor" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className={`text-[10px] font-bold transition-colors ${isDark ? "text-white/30" : "text-slate-400"}`}>
                                                {new Date(article.publishedDate).toLocaleDateString()}
                                            </span>
                                            <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded border ${isDark ? "text-white/20 border-white/10" : "text-slate-400 border-slate-200"}`}>
                                                By {article.author}
                                            </span>
                                        </div>
                                        <h3 className={`text-xl font-black truncate leading-tight ${isDark ? "text-white" : "text-slate-900"}`}>{article.title.en}</h3>
                                        <p className="text-xs opacity-50 truncate">{article.summary.en}</p>
                                    </div>
                                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0 pr-2">
                                        <button onClick={() => handleEditNews(article)} className={`p-3.5 rounded-xl transition-all ${isDark ? "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500 hover:text-black" : "bg-amber-50 text-amber-600 hover:bg-amber-500 hover:text-white"}`}>
                                            <Pencil size={18} />
                                        </button>
                                        <button onClick={() => handleDeleteNews(article._id)} className={`p-3.5 rounded-xl transition-all ${isDark ? "bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white" : "bg-rose-50 text-rose-600 hover:bg-rose-500 hover:text-white"}`}>
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {activeTab === 'users' && (
                    <motion.div key="users" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                         <div className={`border rounded-[2.5rem] overflow-hidden transition-all duration-500
                            ${isDark ? "bg-[#00101a]/60 border-white/5 backdrop-blur-md shadow-2xl" : "bg-white border-slate-200 shadow-2xl shadow-slate-200/40"}`}>
                            <div className="overflow-x-auto custom-scrollbar">
                                <table className="w-full text-left">
                                    <thead className={`text-[10px] font-black uppercase tracking-[0.2em] transition-colors
                                        ${isDark ? "bg-white/5 text-[#00aeef]" : "bg-slate-50 text-sky-600"}`}>
                                        <tr><th className="p-8">Member Identity</th><th className="p-8">Access Level</th><th className="p-8">Badges & Awards</th><th className="p-8 text-right">Actions</th></tr>
                                    </thead>
                                    <tbody className={`divide-y transition-colors ${isDark ? "divide-white/5" : "divide-slate-100"}`}>
                                        {users.map((u, i) => (
                                            <motion.tr key={u._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }} 
                                                className={`transition-colors ${isDark ? "hover:bg-[#00aeef]/5" : "hover:bg-sky-50/50"}`}>
                                                <td className="p-8">
                                                    <p className={`font-black text-lg leading-none ${isDark ? "text-white" : "text-slate-900"}`}>{u.fullName}</p>
                                                    <p className={`text-[10px] font-mono mt-2 transition-colors ${isDark ? "text-white/30" : "text-slate-400"}`}>{u.studentId}</p>
                                                </td>
                                                <td className="p-8">
                                                    <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border transition-all
                                                        ${u.role === 'admin' ? (isDark ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 'bg-amber-50 text-amber-600 border-amber-200') : (isDark ? 'bg-white/5 text-white/40 border-white/10' : 'bg-slate-50 text-slate-400 border-slate-200')}`}>
                                                        {u.role}
                                                    </span>
                                                </td>
                                                <td className="p-8">
                                                    <div className="flex flex-wrap gap-2">
                                                        {u.badges.map((b, i) => <span key={i} className={`px-3 py-1 text-[9px] font-black uppercase tracking-tighter rounded-lg border ${isDark ? "bg-[#00aeef]/10 text-[#00aeef] border-[#00aeef]/20" : "bg-sky-50 text-sky-600 border-sky-100"}`}>{b}</span>)}
                                                        <div className={`flex items-center rounded-xl p-1 border transition-all focus-within:ring-2 ring-[#00aeef]/30
                                                            ${isDark ? "bg-black/20 border-white/5" : "bg-slate-50 border-slate-200"}`}>
                                                            <input className={`bg-transparent text-[10px] font-bold w-24 outline-none px-3 placeholder:opacity-30 ${isDark ? "text-white" : "text-slate-900"}`} 
                                                                placeholder="+ Add Badge" value={badgeInput[u._id] || ''} 
                                                                onChange={(e) => setBadgeInput({...badgeInput, [u._id]: e.target.value})} 
                                                            />
                                                            <button onClick={() => handleAssignBadge(u._id)} className="p-1.5 rounded-lg bg-[#00aeef] text-white hover:bg-[#009bd5] transition-all">
                                                                <Plus size={12} strokeWidth={4} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="p-8 text-right">
                                                    {u.role !== 'admin' && <button onClick={() => handleDeleteUser(u._id)} className="text-slate-300 hover:text-rose-500 transition-colors"><Trash2 size={18} /></button>}
                                                </td>
                                            </motion.tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>

        {/* EVENT FORM MODAL */}
        <AnimatePresence>
            {showEventForm && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowEventForm(false)} className="absolute inset-0 bg-black/60 backdrop-blur-xl" />
                    <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
                        className={`relative border rounded-[3rem] w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl
                        ${isDark ? "bg-[#001829] border-white/10" : "bg-white border-slate-200"}`}>
                        <div className={`p-8 border-b flex justify-between items-center transition-colors ${isDark ? "bg-white/5 border-white/5" : "bg-slate-50 border-slate-100"}`}>
                            <h2 className="text-2xl font-black flex items-center gap-4">
                               <div className={`w-12 h-12 rounded-[1.25rem] flex items-center justify-center shadow-lg transition-colors ${editingEventId ? 'bg-amber-500 text-white' : 'bg-[#00aeef] text-white'}`}>
                                  {editingEventId ? <Pencil size={20} /> : <Plus size={20} />} 
                               </div> {editingEventId ? "Update Event" : "Create Event"}
                            </h2>
                            <button onClick={() => setShowEventForm(false)} className="w-10 h-10 rounded-full flex items-center justify-center bg-white/5 hover:bg-rose-500 hover:text-white transition-all"><X size={20} /></button>
                        </div>
                        <form onSubmit={handleSubmitEvent} className="p-8 space-y-6 overflow-y-auto custom-scrollbar flex-1">
                            <div className={`relative border-2 border-dashed rounded-[2rem] p-10 text-center transition-all group cursor-pointer ${isDark ? "border-white/10 hover:border-[#00aeef] hover:bg-white/5" : "border-slate-200 hover:border-[#00aeef] hover:bg-sky-50/50"}`}>
                                <input type="file" accept="image/*" required={!editingEventId} onChange={(e) => e.target.files?.[0] && setNewEvent({...newEvent, imageFile: e.target.files[0]})} className="absolute inset-0 opacity-0 cursor-pointer z-20" />
                                {newEvent.imageFile ? <div className="text-[#10b981] font-black text-xs uppercase tracking-widest"><ImageIcon className="inline mr-2" /> New file selected</div> : newEvent.currentImageUrl ? <img src={newEvent.currentImageUrl} className="w-full h-32 object-cover rounded-xl opacity-60" /> : <div className="text-slate-400 font-black text-[10px] uppercase tracking-widest"><Upload className="inline mr-2" /> Upload Banner</div>}
                            </div>
                            <div className="grid sm:grid-cols-2 gap-6">
                                <input placeholder="Title (EN)" required className={`modern-input ${isDark ? 'dark' : 'light'}`} value={newEvent.titleEn} onChange={e => setNewEvent({...newEvent, titleEn: e.target.value})} />
                                <input placeholder="Title (MN)" required className={`modern-input ${isDark ? 'dark' : 'light'}`} value={newEvent.titleMn} onChange={e => setNewEvent({...newEvent, titleMn: e.target.value})} />
                            </div>
                            <div className="grid sm:grid-cols-2 gap-6">
                                <input type="date" required className={`modern-input ${isDark ? 'dark' : 'light'}`} value={newEvent.date} onChange={e => setNewEvent({...newEvent, date: e.target.value})} />
                                <select className={`modern-input ${isDark ? 'dark' : 'light'}`} value={newEvent.category} onChange={e => setNewEvent({...newEvent, category: e.target.value})}><option value="campaign">Campaign</option><option value="workshop">Workshop</option><option value="fundraiser">Fundraiser</option></select>
                            </div>
                            <textarea placeholder="Description (EN)" className={`modern-input h-24 resize-none ${isDark ? 'dark' : 'light'}`} value={newEvent.descEn} onChange={e => setNewEvent({...newEvent, descEn: e.target.value})} />
                            <textarea placeholder="Description (MN)" className={`modern-input h-24 resize-none ${isDark ? 'dark' : 'light'}`} value={newEvent.descMn} onChange={e => setNewEvent({...newEvent, descMn: e.target.value})} />
                            <div className="grid sm:grid-cols-2 gap-6">
                                <input placeholder="Location (EN)" className={`modern-input ${isDark ? 'dark' : 'light'}`} value={newEvent.locEn} onChange={e => setNewEvent({...newEvent, locEn: e.target.value})} />
                                <input placeholder="Location (MN)" className={`modern-input ${isDark ? 'dark' : 'light'}`} value={newEvent.locMn} onChange={e => setNewEvent({...newEvent, locMn: e.target.value})} />
                            </div>
                            <input placeholder="Time String (e.g. 10:00 - 12:00)" className={`modern-input ${isDark ? 'dark' : 'light'}`} value={newEvent.time} onChange={e => setNewEvent({...newEvent, time: e.target.value})} />
                            <button type="submit" disabled={isSubmitting} className={`w-full py-5 text-white font-black text-[10px] uppercase tracking-[0.3em] rounded-[1.5rem] shadow-2xl transition-all active:scale-[0.98] ${editingEventId ? 'bg-amber-500' : 'bg-[#00aeef]'}`}>{isSubmitting ? <Loader2 className="animate-spin" /> : (editingEventId ? "Save Changes" : "Publish Event")}</button>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>

        {/* OPPORTUNITY FORM MODAL */}
        <AnimatePresence>
            {showOppForm && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowOppForm(false)} className="absolute inset-0 bg-black/60 backdrop-blur-xl" />
                    <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
                        className={`relative border rounded-[3rem] w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl
                        ${isDark ? "bg-[#001829] border-white/10" : "bg-white border-slate-200"}`}>
                        <div className={`p-8 border-b flex justify-between items-center transition-colors ${isDark ? "bg-white/5 border-white/5" : "bg-slate-50 border-slate-100"}`}>
                            <h2 className="text-2xl font-black flex items-center gap-4">
                               <div className={`w-12 h-12 rounded-[1.25rem] flex items-center justify-center shadow-lg transition-colors ${editingOppId ? 'bg-amber-500 text-white' : 'bg-[#00aeef] text-white'}`}>
                                  {editingOppId ? <Pencil size={20} /> : <Plus size={20} />} 
                               </div> {editingOppId ? "Update Opportunity" : "New Opportunity"}
                            </h2>
                            <button onClick={() => setShowOppForm(false)} className="w-10 h-10 rounded-full flex items-center justify-center bg-white/5 hover:bg-rose-500 hover:text-white transition-all"><X size={20} /></button>
                        </div>
                        <form onSubmit={handleSubmitOpp} className="p-8 space-y-6 overflow-y-auto custom-scrollbar flex-1">
                            <div className={`relative border-2 border-dashed rounded-[2rem] p-10 text-center transition-all group cursor-pointer ${isDark ? "border-white/10 hover:border-[#00aeef] hover:bg-white/5" : "border-slate-200 hover:border-[#00aeef] hover:bg-sky-50/50"}`}>
                                <input type="file" accept="image/*" required={!editingOppId} onChange={(e) => e.target.files?.[0] && setNewOpp({...newOpp, imageFile: e.target.files[0]})} className="absolute inset-0 opacity-0 cursor-pointer z-20" />
                                {newOpp.imageFile ? <div className="text-[#10b981] font-black text-xs uppercase tracking-widest"><ImageIcon className="inline mr-2" /> New file selected</div> : newOpp.currentImageUrl ? <img src={newOpp.currentImageUrl} className="w-full h-32 object-cover rounded-xl opacity-60" /> : <div className="text-slate-400 font-black text-[10px] uppercase tracking-widest"><Upload className="inline mr-2" /> Upload Banner</div>}
                            </div>
                            <div className="grid sm:grid-cols-2 gap-6">
                                <select className={`modern-input ${isDark ? 'dark' : 'light'}`} value={newOpp.type} onChange={e => setNewOpp({...newOpp, type: e.target.value})}><option value="scholarship">Scholarship</option><option value="internship">Internship</option><option value="volunteer">Volunteer</option></select>
                                <input type="date" required className={`modern-input ${isDark ? 'dark' : 'light'}`} value={newOpp.deadline} onChange={e => setNewOpp({...newOpp, deadline: e.target.value})} />
                            </div>
                            <div className="grid sm:grid-cols-2 gap-6">
                                <input placeholder="Title (EN)" required className={`modern-input ${isDark ? 'dark' : 'light'}`} value={newOpp.titleEn} onChange={e => setNewOpp({...newOpp, titleEn: e.target.value})} />
                                <input placeholder="Title (MN)" required className={`modern-input ${isDark ? 'dark' : 'light'}`} value={newOpp.titleMn} onChange={e => setNewOpp({...newOpp, titleMn: e.target.value})} />
                            </div>
                            <div className="grid sm:grid-cols-2 gap-6">
                                <input placeholder="Provider (EN)" required className={`modern-input ${isDark ? 'dark' : 'light'}`} value={newOpp.providerEn} onChange={e => setNewOpp({...newOpp, providerEn: e.target.value})} />
                                <input placeholder="Provider (MN)" required className={`modern-input ${isDark ? 'dark' : 'light'}`} value={newOpp.providerMn} onChange={e => setNewOpp({...newOpp, providerMn: e.target.value})} />
                            </div>
                            <div className="grid sm:grid-cols-2 gap-6">
                                <input placeholder="Location (EN)" className={`modern-input ${isDark ? 'dark' : 'light'}`} value={newOpp.locEn} onChange={e => setNewOpp({...newOpp, locEn: e.target.value})} />
                                <input placeholder="Location (MN)" className={`modern-input ${isDark ? 'dark' : 'light'}`} value={newOpp.locMn} onChange={e => setNewOpp({...newOpp, locMn: e.target.value})} />
                            </div>
                            <textarea placeholder="Description (EN)" className={`modern-input h-24 resize-none ${isDark ? 'dark' : 'light'}`} value={newOpp.descEn} onChange={e => setNewOpp({...newOpp, descEn: e.target.value})} />
                            <textarea placeholder="Description (MN)" className={`modern-input h-24 resize-none ${isDark ? 'dark' : 'light'}`} value={newOpp.descMn} onChange={e => setNewOpp({...newOpp, descMn: e.target.value})} />
                            <textarea placeholder="Requirements (EN) - line separated" className={`modern-input h-24 resize-none ${isDark ? 'dark' : 'light'}`} value={newOpp.reqEn} onChange={e => setNewOpp({...newOpp, reqEn: e.target.value})} />
                            <textarea placeholder="Requirements (MN) - line separated" className={`modern-input h-24 resize-none ${isDark ? 'dark' : 'light'}`} value={newOpp.reqMn} onChange={e => setNewOpp({...newOpp, reqMn: e.target.value})} />
                            <input placeholder="Link" className={`modern-input ${isDark ? 'dark' : 'light'}`} value={newOpp.link} onChange={e => setNewOpp({...newOpp, link: e.target.value})} />
                            <input placeholder="Tags (comma separated)" className={`modern-input ${isDark ? 'dark' : 'light'}`} value={newOpp.tags} onChange={e => setNewOpp({...newOpp, tags: e.target.value})} />
                            <button type="submit" disabled={isSubmitting} className={`w-full py-5 text-white font-black text-[10px] uppercase tracking-[0.3em] rounded-[1.5rem] shadow-2xl transition-all active:scale-[0.98] ${editingOppId ? 'bg-amber-500' : 'bg-[#00aeef]'}`}>{isSubmitting ? <Loader2 className="animate-spin" /> : (editingOppId ? "Save Changes" : "Publish Opportunity")}</button>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>

        {/* CLUB FORM MODAL */}
       

        {/* NEWS FORM MODAL */}
        <AnimatePresence>
            {showNewsForm && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowNewsForm(false)} className="absolute inset-0 bg-black/60 backdrop-blur-xl" />
                    <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
                        className={`relative border rounded-[3rem] w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl
                        ${isDark ? "bg-[#001829] border-white/10" : "bg-white border-slate-200"}`}>
                        <div className={`p-8 border-b flex justify-between items-center transition-colors ${isDark ? "bg-white/5 border-white/5" : "bg-slate-50 border-slate-100"}`}>
                            <h2 className="text-2xl font-black flex items-center gap-4">
                               <div className={`w-12 h-12 rounded-[1.25rem] flex items-center justify-center shadow-lg transition-colors ${editingNewsId ? 'bg-amber-500 text-white' : 'bg-[#00aeef] text-white'}`}>
                                  {editingNewsId ? <Pencil size={20} /> : <Plus size={20} />} 
                               </div> {editingNewsId ? "Update Article" : "Create Article" }
                            </h2>
                            <button onClick={() => setShowNewsForm(false)} className="w-10 h-10 rounded-full flex items-center justify-center bg-white/5 hover:bg-rose-500 hover:text-white transition-all"><X size={20} /></button>
                        </div>
                        <form onSubmit={handleSubmitNews} className="p-8 space-y-6 overflow-y-auto custom-scrollbar flex-1">
                            <div className={`relative border-2 border-dashed rounded-[2rem] p-10 text-center transition-all group cursor-pointer ${isDark ? "border-white/10 hover:border-[#00aeef] hover:bg-white/5" : "border-slate-200 hover:border-[#00aeef] hover:bg-sky-50/50"}`}>
                                <input type="file" accept="image/*" required={!editingNewsId} onChange={(e) => e.target.files?.[0] && setNewNews({...newNews, imageFile: e.target.files[0]})} className="absolute inset-0 opacity-0 cursor-pointer z-20" />
                                {newNews.imageFile ? <div className="text-[#10b981] font-black text-xs uppercase tracking-widest"><ImageIcon className="inline mr-2" /> New file selected</div> : newNews.currentImageUrl ? <img src={newNews.currentImageUrl} className="w-full h-32 object-cover rounded-xl opacity-60" /> : <div className="text-slate-400 font-black text-[10px] uppercase tracking-widest"><Upload className="inline mr-2" /> Upload Cover Image</div>}
                            </div>
                            <div className="grid sm:grid-cols-2 gap-6">
                                <input placeholder="Title (EN)" required className={`modern-input ${isDark ? 'dark' : 'light'}`} value={newNews.titleEn} onChange={e => setNewNews({...newNews, titleEn: e.target.value})} />
                                <input placeholder="Title (MN)" required className={`modern-input ${isDark ? 'dark' : 'light'}`} value={newNews.titleMn} onChange={e => setNewNews({...newNews, titleMn: e.target.value})} />
                            </div>
                            <textarea placeholder="Summary (EN)" className={`modern-input h-20 resize-none ${isDark ? 'dark' : 'light'}`} value={newNews.summaryEn} onChange={e => setNewNews({...newNews, summaryEn: e.target.value})} />
                            <textarea placeholder="Summary (MN)" className={`modern-input h-20 resize-none ${isDark ? 'dark' : 'light'}`} value={newNews.summaryMn} onChange={e => setNewNews({...newNews, summaryMn: e.target.value})} />
                            <textarea placeholder="Content (EN)" className={`modern-input h-40 resize-none ${isDark ? 'dark' : 'light'}`} value={newNews.contentEn} onChange={e => setNewNews({...newNews, contentEn: e.target.value})} />
                            <textarea placeholder="Content (MN)" className={`modern-input h-40 resize-none ${isDark ? 'dark' : 'light'}`} value={newNews.contentMn} onChange={e => setNewNews({...newNews, contentMn: e.target.value})} />
                            <div className="grid sm:grid-cols-2 gap-6">
                                <input placeholder="Author" className={`modern-input ${isDark ? 'dark' : 'light'}`} value={newNews.author} onChange={e => setNewNews({...newNews, author: e.target.value})} />
                                <input placeholder="Tags (comma separated)" className={`modern-input ${isDark ? 'dark' : 'light'}`} value={newNews.tags} onChange={e => setNewNews({...newNews, tags: e.target.value})} />
                            </div>
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input type="checkbox" className="w-5 h-5 accent-[#00aeef]" checked={newNews.featured} onChange={e => setNewNews({...newNews, featured: e.target.checked})} />
                                <span className="text-xs font-bold uppercase tracking-widest opacity-60">Feature this article</span>
                            </label>
                            <button type="submit" disabled={isSubmitting} className={`w-full py-5 text-white font-black text-[10px] uppercase tracking-[0.3em] rounded-[1.5rem] shadow-2xl transition-all active:scale-[0.98] ${editingNewsId ? 'bg-amber-500' : 'bg-[#00aeef]'}`}>{isSubmitting ? <Loader2 className="animate-spin" /> : (editingNewsId ? "Save Changes" : "Publish Article")}</button>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>

        <style jsx>{`
            .modern-input {
                width: 100%;
                border-radius: 1.25rem;
                padding: 1rem 1.25rem;
                outline: none;
                transition: all 0.3s;
                font-size: 0.75rem;
                font-weight: 700;
                border: 1px solid transparent;
            }
            .modern-input.dark { background: rgba(255,255,255,0.03); border-color: rgba(255,255,255,0.08); color: white; }
            .modern-input.light { background: #f8fafc; border-color: #e2e8f0; color: #0f172a; }
            .modern-input:focus { border-color: #00aeef; box-shadow: 0 0 0 4px rgba(0,174,239,0.1); }
            
            .custom-scrollbar::-webkit-scrollbar { width: 6px; }
            .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
            .dark .custom-scrollbar::-webkit-scrollbar-thumb { background: #1e293b; }
            .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        `}</style>
    </div>
  );
}