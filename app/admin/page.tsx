"use client";

import React, { useState, useEffect } from "react";
import { 
  Users, Calendar, Trash2, Plus, 
  ShieldAlert, Loader2, Upload, X, 
  ImageIcon, MapPin, Search, Pencil,
  ChevronDown
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

export default function AdminDashboard() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const { theme } = useTheme();
  
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<'events' | 'users'>('events');
  
  // Data State
  const [events, setEvents] = useState<EventType[]>([]);
  const [users, setUsers] = useState<UserType[]>([]);
  
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
      const [eventsRes, usersRes] = await Promise.all([
        fetch('/api/admin/events'),
        fetch('/api/admin/users')
      ]);
      if (eventsRes.ok && usersRes.ok) {
        setEvents(await eventsRes.json());
        setUsers(await usersRes.json());
      }
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  if (!mounted) return null;
  const isDark = theme === "dark" || !theme;

  // --- ACTIONS ---
  const handleDeleteEvent = async (id: string) => {
    if (!confirm("Delete this event?")) return;
    setEvents(prev => prev.filter(e => e._id !== id));
    await fetch(`/api/admin/events?id=${id}`, { method: 'DELETE' });
  };

  const handleDeleteUser = async (id: string) => {
    if (!confirm("Remove this member?")) return;
    setUsers(prev => prev.filter(u => u._id !== id));
    await fetch(`/api/admin/users?id=${id}`, { method: 'DELETE' });
  };

  const handleEditClick = (event: EventType) => {
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

  const handleCreateClick = () => {
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

                <div className={`p-1.5 rounded-2xl flex items-center border transition-all duration-500
                    ${isDark ? "bg-white/5 border-white/10 backdrop-blur-md shadow-2xl" : "bg-white border-slate-200 shadow-xl shadow-slate-200/40"}`}>
                    {['events', 'users'].map((tab) => (
                        <button key={tab} onClick={() => setActiveTab(tab as any)} 
                                className={`relative z-10 px-8 py-3 text-[10px] font-black uppercase tracking-widest transition-colors duration-500 
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
                {activeTab === 'events' ? (
                    <motion.div key="events" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-10">
                            <div className="relative group w-full max-w-md">
                                <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${isDark ? "text-white/20" : "text-slate-400"}`} />
                                <input placeholder="Search records..." className={`w-full rounded-2xl py-4 pl-12 pr-4 text-xs font-bold transition-all focus:outline-none focus:ring-2 focus:ring-[#00aeef]/50
                                    ${isDark ? "bg-[#002b49]/40 border-white/10 text-white" : "bg-white border-slate-200 text-slate-900 shadow-sm"}`} />
                            </div>
                            <button onClick={handleCreateClick} className="w-full sm:w-auto flex items-center justify-center gap-3 bg-[#00aeef] text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-[#00aeef]/20 hover:bg-[#009bd5] transition-all active:scale-95">
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
                                        <button onClick={() => handleEditClick(event)} className={`p-3.5 rounded-xl transition-all ${isDark ? "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500 hover:text-black" : "bg-amber-50 text-amber-600 hover:bg-amber-500 hover:text-white"}`}>
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
                ) : (
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

        {/* MODAL FORM */}
        <AnimatePresence>
            {showEventForm && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowEventForm(false)} className="absolute inset-0 bg-black/60 backdrop-blur-xl" />

                    <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
                        className={`relative border rounded-[3rem] w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl
                        ${isDark ? "bg-[#001829] border-white/10" : "bg-white border-slate-200"}`}>
                        
                        <div className={`p-8 border-b flex justify-between items-center transition-colors
                            ${isDark ? "bg-white/5 border-white/5" : "bg-slate-50 border-slate-100"}`}>
                            <h2 className="text-2xl font-black flex items-center gap-4">
                               <div className={`w-12 h-12 rounded-[1.25rem] flex items-center justify-center shadow-lg transition-colors
                                  ${editingEventId ? 'bg-amber-500 text-white' : 'bg-[#00aeef] text-white'}`}>
                                  {editingEventId ? <Pencil size={20} /> : <Plus size={20} />}
                               </div> 
                               {editingEventId ? "Update Event" : "Create Event"}
                            </h2>
                            <button onClick={() => setShowEventForm(false)} className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${isDark ? "bg-white/5 text-white/40 hover:bg-rose-500 hover:text-white" : "bg-slate-100 text-slate-400 hover:bg-rose-500 hover:text-white"}`}><X size={20} /></button>
                        </div>

                        <form onSubmit={handleSubmitEvent} className="p-8 space-y-6 overflow-y-auto custom-scrollbar flex-1">
                            {/* File Upload */}
                            <div className={`relative border-2 border-dashed rounded-[2rem] p-10 text-center transition-all group cursor-pointer
                                ${isDark ? "border-white/10 hover:border-[#00aeef] hover:bg-white/5" : "border-slate-200 hover:border-[#00aeef] hover:bg-sky-50/50"}`}>
                                <input type="file" accept="image/*" required={!editingEventId} onChange={(e) => e.target.files?.[0] && setNewEvent({...newEvent, imageFile: e.target.files[0]})} className="absolute inset-0 opacity-0 cursor-pointer z-20" />
                                {newEvent.imageFile ? (
                                    <div className="flex flex-col items-center gap-2 text-[#10b981] font-black text-xs uppercase tracking-widest"><ImageIcon size={32} /> New file selected</div>
                                ) : newEvent.currentImageUrl ? (
                                    <div className="space-y-4">
                                         <img src={newEvent.currentImageUrl} alt="" className="w-full h-32 object-cover rounded-xl opacity-60 border border-white/20 shadow-sm" />
                                         <p className="text-[10px] font-black uppercase text-[#00aeef] tracking-widest">Update Banner Image</p>
                                     </div>
                                ) : (
                                    <div className="flex flex-col items-center gap-4 text-slate-400 group-hover:text-[#00aeef] transition-colors">
                                        <div className={`w-16 h-16 rounded-3xl flex items-center justify-center border transition-colors ${isDark ? "bg-white/5 border-white/10" : "bg-slate-50 border-slate-200"}`}><Upload size={24} /></div>
                                        <p className="text-[10px] font-black uppercase tracking-[0.2em]">Drop high-res banner</p>
                                    </div>
                                )}
                            </div>

                            <div className="grid sm:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <label className="block text-[10px] font-black uppercase tracking-widest opacity-40 ml-2">Titles</label>
                                    <input placeholder="Title (EN)" required className={`modern-input ${isDark ? 'dark' : 'light'}`} value={newEvent.titleEn} onChange={e => setNewEvent({...newEvent, titleEn: e.target.value})} />
                                    <input placeholder="Title (MN)" required className={`modern-input ${isDark ? 'dark' : 'light'}`} value={newEvent.titleMn} onChange={e => setNewEvent({...newEvent, titleMn: e.target.value})} />
                                </div>
                                <div className="space-y-4">
                                    <label className="block text-[10px] font-black uppercase tracking-widest opacity-40 ml-2">Timeline</label>
                                    <div className="relative">
                                        <select className={`modern-input appearance-none cursor-pointer pr-10 ${isDark ? 'dark' : 'light'}`} value={newEvent.category} onChange={e => setNewEvent({...newEvent, category: e.target.value})}>
                                            <option value="campaign">Campaign</option><option value="workshop">Workshop</option><option value="fundraiser">Fundraiser</option>
                                        </select>
                                        <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 opacity-40 pointer-events-none" />
                                    </div>
                                    <input type="date" required className={`modern-input ${isDark ? 'dark' : 'light'}`} value={newEvent.date} onChange={e => setNewEvent({...newEvent, date: e.target.value})} />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <label className="block text-[10px] font-black uppercase tracking-widest opacity-40 ml-2">Descriptions</label>
                                <textarea placeholder="Details (English)..." className={`modern-input h-24 resize-none ${isDark ? 'dark' : 'light'}`} value={newEvent.descEn} onChange={e => setNewEvent({...newEvent, descEn: e.target.value})} />
                                <textarea placeholder="Details (Mongolian)..." className={`modern-input h-24 resize-none ${isDark ? 'dark' : 'light'}`} value={newEvent.descMn} onChange={e => setNewEvent({...newEvent, descMn: e.target.value})} />
                            </div>

                            <div className="grid sm:grid-cols-2 gap-6">
                                <input placeholder="Location (EN)" required className={`modern-input ${isDark ? 'dark' : 'light'}`} value={newEvent.locEn} onChange={e => setNewEvent({...newEvent, locEn: e.target.value})} />
                                <input placeholder="Location (MN)" required className={`modern-input ${isDark ? 'dark' : 'light'}`} value={newEvent.locMn} onChange={e => setNewEvent({...newEvent, locMn: e.target.value})} />
                                <input placeholder="Time (e.g. 14:00 - 18:00)" required className={`modern-input sm:col-span-2 ${isDark ? 'dark' : 'light'}`} value={newEvent.time} onChange={e => setNewEvent({...newEvent, time: e.target.value})} />
                            </div>

                            <button type="submit" disabled={isSubmitting}
                                className={`w-full py-5 text-white font-black text-[10px] uppercase tracking-[0.3em] rounded-[1.5rem] shadow-2xl transition-all active:scale-[0.98] flex items-center justify-center gap-3 mt-4
                                ${editingEventId ? 'bg-amber-500 shadow-amber-500/20' : 'bg-[#00aeef] shadow-[#00aeef]/20'}`}>
                                {isSubmitting ? <Loader2 className="animate-spin" /> : (editingEventId ? "Commit Changes" : "Publish Event Record")}
                            </button>
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