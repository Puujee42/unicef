"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  ArrowRight, 
  Mail, 
  Lock, 
  User, 
  Loader2,
  IdCard,
  Building,
  GraduationCap,
  Sparkles,
  CheckCircle2,
  ChevronDown,
  Search,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSignUp } from "@clerk/nextjs";
import { useTheme } from "next-themes";
import { useLanguage } from "../context/LanguageContext";

// --- UNIVERSITY LIST DATA ---
const UNIVERSITIES = [
  { id: "NUM", en: "National University of Mongolia", mn: "Монгол Улсын Их Сургууль (МУИС)" },
  { id: "MUST", en: "Mongolian University of Science and Technology", mn: "Шинжлэх Ухаан, Технологийн Их Сургууль (ШУТИС)" },
  { id: "UFE", en: "University of Finance and Economics", mn: "Санхүү, Эдийн Засгийн Их Сургууль (СЭЗИС)" },
  { id: "MNUMS", en: "Mongolian National University of Medical Sciences", mn: "Анагаахын Шинжлэх Ухааны Үндэсний Их Сургууль (АШУҮИС)" },
  { id: "MSUE", en: "Mongolian State University of Education", mn: "Боловсролын Их Сургууль (МУБИС)" },
  { id: "MSUA", en: "Mongolian State University of Agriculture", mn: "Хөдөө Аж Ахуйн Их Сургууль (ХААИС)" },
  { id: "MSUAC", en: "Mongolian State University of Arts and Culture", mn: "Соёл, Урлагийн Их Сургууль (СУИС)" },
  { id: "MNDU", en: "National Defense University", mn: "Үндэсний Батлан Хамгаалахын Их Сургууль" },
  { id: "LEUM", en: "Law Enforcement University of Mongolia", mn: "Хууль Сахиулахын Их Сургууль" },
  { id: "UBU", en: "Ulaanbaatar University", mn: "Улаанбаатарын Их Сургууль (УБИС)" },
  { id: "IDER", en: "Ider University", mn: "Идэр Их Сургууль" },
  { id: "OTU", en: "Otgontenger University", mn: "Отгонтэнгэр Их Сургууль" },
  { id: "HUREE", en: "Huree University", mn: "Хүрээ Дээд Сургууль" },
  { id: "MJHU", en: "Mongolia-Japan Humanitarian University", mn: "Монгол-Японы Хүмүүнлэгийн Их Сургууль" },
  { id: "ACH", en: "Ach Medical University", mn: "Ач Анагаах Ухааны Их Сургууль" },
  { id: "IZIU", en: "Ikh Zasag International University", mn: "Их Засаг Олон Улсын Их Сургууль" },
  { id: "ORKHON", en: "Orkhon University", mn: "Орхон Их Сургууль" },
  { id: "MIU", en: "Mongolia International University", mn: "Монгол Олон Улсын Их Сургууль" },
  { id: "MANDAKH", en: "Mandakh University", mn: "Мандах Их Сургууль" },
  { id: "CHINGGIS", en: "Chinggis Khaan University", mn: "Чингис Хаан Их Сургууль" },
  { id: "GAZARCHIN", en: "Gazarchin Institute", mn: "Газарчин Дээд Сургууль" },
];

const CONTENT = {
  header: { en: "Student Registration", mn: "Оюутны Бүртгэл" },
  sub: { en: "Choose your university and use your Student ID to join.", mn: "Сургуулиа сонгож, оюутны кодоо ашиглан нэгдээрэй." },
  inputs: {
    university: { en: "Search University...", mn: "Сургуулиа хайх..." },
    studentId: { en: "Student ID (e.g., S.SS24000)", mn: "Оюутны код (Жш: S.SS24000)" },
    fullname: { en: "Full Name", mn: "Бүтэн Нэр" },
    email: { en: "School Email", mn: "Сургуулийн Имэйл" },
    pass: { en: "Password", mn: "Нууц үг" },
  },
  btn: { en: "Create Account", mn: "Бүртгүүлэх" },
  verify: { en: "Verify Email", mn: "Имэйл баталгаажуулах" },
  login: { text: { en: "Already a member?", mn: "Бүртгэлтэй юу?" }, link: { en: "Access Portal", mn: "Нэвтрэх" } }
};

export default function SignUpPage() {
  const { language: lang } = useLanguage();
  const { theme } = useTheme();
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();

  const [mounted, setMounted] = useState(false);
  const [university, setUniversity] = useState("");
  const [uniSearch, setUniSearch] = useState("");
  const [isUniOpen, setIsUniOpen] = useState(false);
  
  const [studentId, setStudentId] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsUniOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!mounted) return null;
  const isDark = theme === "dark" || !theme;

  const filteredUnis = UNIVERSITIES.filter(u => 
    u.en.toLowerCase().includes(uniSearch.toLowerCase()) || 
    u.mn.toLowerCase().includes(uniSearch.toLowerCase())
  );

  const selectedUni = UNIVERSITIES.find(u => u.id === university);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded || isLoading) return;
    if (!university) { setError("Please select your university."); return; }
    setIsLoading(true);
    setError("");

    try {
      await signUp.create({
        username: studentId.toUpperCase(),
        emailAddress: email,
        password,
        unsafeMetadata: { fullName, studentId: studentId.toUpperCase(), role: "member", university }
      });
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setPendingVerification(true);
    } catch (err: any) {
      setError(err.errors?.[0]?.longMessage || "Registration failed.");
    } finally { setIsLoading(false); }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded || isLoading) return;
    setIsLoading(true);
    setError("");
    try {
      const result = await signUp.attemptEmailAddressVerification({ code: code.trim() });
      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        router.push("/dashboard");
      }
    } catch (err: any) { setError(err.errors?.[0]?.longMessage || "Verification failed."); }
    finally { setIsLoading(false); }
  };

  return (
    <div className={`min-h-screen w-full flex overflow-hidden font-sans transition-colors duration-700
      ${isDark ? "bg-[#001829] text-white" : "bg-slate-50 text-slate-900"}`}>
      
      <div className="w-full lg:w-[55%] flex flex-col justify-center px-6 md:px-12 lg:px-24 py-12 relative z-10 overflow-y-auto">
        <div className="absolute inset-0 opacity-[0.03] bg-[url('/noise.png')] mix-blend-overlay pointer-events-none" />
        
        {/* LOGO */}
     
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-md w-full mx-auto relative z-10">
          <h1 className={`text-4xl md:text-5xl font-black tracking-tighter mb-4 transition-colors ${isDark ? "text-white" : "text-[#001829]"}`}>
            {CONTENT.header[lang]}
          </h1>
          <p className={`text-lg mb-10 font-medium opacity-60 transition-colors ${isDark ? "text-white" : "text-slate-600"}`}>
            {CONTENT.sub[lang]}
          </p>

          {!pendingVerification ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* --- SEARCHABLE UNIVERSITY DROPDOWN --- */}
              <div className="relative" ref={dropdownRef}>
                 <div 
                   onClick={() => setIsUniOpen(!isUniOpen)}
                   className={`relative w-full border rounded-2xl py-4 pl-12 pr-10 text-xs font-bold transition-all cursor-pointer flex items-center
                    ${isDark 
                        ? "bg-white/5 border-white/10 text-white" 
                        : "bg-white border-slate-200 text-slate-900 shadow-sm"}`}
                 >
                    <Building className={`absolute left-4 w-4 h-4 ${isDark ? "text-white/20" : "text-slate-400"}`} />
                    <span className={university ? "" : "opacity-40"}>
                        {university ? selectedUni?.[lang] : CONTENT.inputs.university[lang]}
                    </span>
                    <ChevronDown size={16} className={`absolute right-4 transition-transform duration-300 ${isUniOpen ? "rotate-180" : ""}`} />
                 </div>

                 <AnimatePresence>
                    {isUniOpen && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className={`absolute top-full left-0 right-0 mt-2 z-50 rounded-2xl border shadow-2xl overflow-hidden backdrop-blur-xl
                            ${isDark ? "bg-[#002b49] border-white/10" : "bg-white border-slate-200"}`}
                        >
                            <div className={`p-2 border-b ${isDark ? "border-white/5" : "border-slate-100"}`}>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                                    <input 
                                        autoFocus
                                        placeholder={lang === 'mn' ? "Хайх..." : "Search..."}
                                        value={uniSearch}
                                        onChange={(e) => setUniSearch(e.target.value)}
                                        className={`w-full py-2 pl-9 pr-4 text-xs font-bold rounded-xl focus:outline-none
                                            ${isDark ? "bg-white/5 text-white" : "bg-slate-50 text-slate-900"}`}
                                    />
                                </div>
                            </div>
                            <div className="max-h-[240px] overflow-y-auto custom-scrollbar">
                                {filteredUnis.length > 0 ? filteredUnis.map((uni) => (
                                    <div 
                                        key={uni.id}
                                        onClick={() => {
                                            setUniversity(uni.id);
                                            setIsUniOpen(false);
                                            setUniSearch("");
                                        }}
                                        className={`px-4 py-3 text-xs font-bold cursor-pointer transition-colors
                                            ${university === uni.id ? "bg-[#00aeef] text-white" : isDark ? "hover:bg-white/5" : "hover:bg-slate-50"}`}
                                    >
                                        {uni[lang]}
                                    </div>
                                )) : (
                                    <div className="px-4 py-8 text-center text-xs opacity-40">No results found</div>
                                )}
                            </div>
                        </motion.div>
                    )}
                 </AnimatePresence>
              </div>

              {/* STANDARD INPUTS */}
              {[
                { id: 'sid', val: studentId, set: setStudentId, icon: IdCard, label: CONTENT.inputs.studentId[lang], type: 'text', upper: true },
                { id: 'name', val: fullName, set: setFullName, icon: User, label: CONTENT.inputs.fullname[lang], type: 'text' },
                { id: 'email', val: email, set: setEmail, icon: Mail, label: CONTENT.inputs.email[lang], type: 'email' },
                { id: 'pass', val: password, set: setPassword, icon: Lock, label: CONTENT.inputs.pass[lang], type: 'password' },
              ].map((input) => (
                <div key={input.id} className="relative group">
                  <input.icon className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors
                    ${isDark ? "text-white/20 group-focus-within:text-[#00aeef]" : "text-slate-400 group-focus-within:text-[#00aeef]"}`} />
                  <input 
                    type={input.type} 
                    value={input.val}
                    onChange={(e) => input.set(input.upper ? e.target.value.toUpperCase() : e.target.value)}
                    placeholder={input.label}
                    className={`w-full border rounded-2xl py-4 pl-12 pr-4 text-xs font-bold transition-all focus:outline-none focus:ring-2 focus:ring-[#00aeef]/50
                      ${isDark 
                        ? "bg-white/5 border-white/10 text-white placeholder:text-white/20" 
                        : "bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 shadow-sm"}`}
                    required
                  />
                </div>
              ))}

              {error && <p className="text-rose-500 text-[10px] font-bold text-center bg-rose-500/10 p-3 rounded-xl border border-rose-500/20 uppercase tracking-widest">{error}</p>}

              <button type="submit" disabled={isLoading} className="w-full bg-[#00aeef] hover:bg-[#009bd5] text-white font-black uppercase tracking-[0.2em] text-[10px] py-5 rounded-2xl shadow-xl transition-all active:scale-[0.98] flex items-center justify-center gap-3">
                {isLoading ? <Loader2 className="animate-spin" size={18} /> : <>{CONTENT.btn[lang]} <ArrowRight size={16} /></>}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerify} className="space-y-6">
               <div className="text-center">
                  <div className={`w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 border-2 transition-colors ${isDark ? "bg-[#00aeef]/10 border-[#00aeef]/30" : "bg-sky-50 border-sky-100"}`}>
                     <Mail size={36} className="text-[#00aeef]" />
                  </div>
                  <h3 className={`text-2xl font-black ${isDark ? "text-white" : "text-[#001829]"}`}>Verify Email</h3>
                  <p className="text-sm mt-3 font-medium opacity-60">Sent code to <span className="font-black text-[#00aeef]">{email}</span></p>
               </div>
               <input type="text" value={code} onChange={(e) => setCode(e.target.value)} placeholder="000000" className={`w-full border rounded-2xl py-5 text-center text-sm font-black tracking-[0.5em] focus:outline-none ${isDark ? "bg-white/5 border-white/10 text-white" : "bg-white border-slate-200"}`} />
               <button type="submit" className="w-full bg-[#00aeef] text-white font-black uppercase tracking-[0.2em] text-[10px] py-5 rounded-2xl shadow-xl">{isLoading ? "Validating..." : CONTENT.verify[lang]}</button>
            </form>
          )}

          <div className="mt-10 text-center p-5 rounded-2xl border transition-all ${isDark ? 'bg-white/5 border-white/5' : 'bg-white border-slate-100 shadow-sm'}">
             <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">Already a member?</span>
             <Link href="/sign-in" className="text-[#00aeef] text-[10px] font-black uppercase tracking-widest hover:underline ml-2">Sign In</Link>
          </div>
        </motion.div>
      </div>

      {/* --- RIGHT SIDE: ID CARD VISUAL --- */}
      <div className={`hidden lg:block w-[45%] relative overflow-hidden border-l transition-colors duration-700 ${isDark ? "bg-[#00101a] border-white/5" : "bg-sky-50 border-slate-200"}`}>
         <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay z-10" />
         <motion.div animate={{ scale: [1, 1.2, 1], opacity: isDark ? [0.2, 0.4, 0.2] : [0.4, 0.6, 0.4] }} transition={{ duration: 10, repeat: Infinity }} className={`absolute top-0 right-0 w-[800px] h-[800px] rounded-full blur-[200px] ${isDark ? "bg-[#00aeef]" : "bg-sky-200"}`} />

         <div className="absolute inset-0 flex items-center justify-center z-20">
            <motion.div initial={{ rotateY: 45 }} animate={{ rotateY: -12 }} transition={{ duration: 1.5, type: "spring" }} className={`relative w-[400px] h-[600px] border rounded-[3rem] backdrop-blur-3xl shadow-2xl overflow-hidden flex flex-col p-10 ${isDark ? "bg-white/5 border-white/10" : "bg-white/60 border-white"}`}>
               <div className="absolute -top-32 -left-32 w-64 h-64 bg-[#00aeef] rounded-full blur-[80px] opacity-40" />
               <div className="flex justify-between items-start mb-16 relative z-10">
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center shadow-xl p-0.5 bg-white`}>
                     <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#00aeef] to-[#005691]" />
                  </div>
                  <div className="text-right">
                     <h3 className="font-black text-xl tracking-tighter line-clamp-1">{university || "University"}</h3>
                     <p className="text-[#00aeef] text-[10px] font-black uppercase tracking-[0.2em]">Membership Card</p>
                  </div>
               </div>
               <div className="relative z-10 flex-1 flex flex-col justify-center text-center space-y-6">
                  <div className={`w-32 h-32 mx-auto rounded-[2.5rem] border flex items-center justify-center shadow-2xl relative bg-white/5 border-white/10`}>
                     <GraduationCap size={56} className="text-sky-400" />
                     <div className="absolute -bottom-3 -right-3 bg-[#00aeef] rounded-full p-2 border-4 border-white shadow-lg"><CheckCircle2 size={16} className="text-white" /></div>
                  </div>
                  <div>
                     <h2 className="text-3xl font-black tracking-tight leading-tight line-clamp-2">{fullName || "Full Name"}</h2>
                     <p className="text-[#00aeef] font-black tracking-[0.3em] text-xs mt-2">{studentId || "S.ID2025"}</p>
                  </div>
                  <div className={`w-full h-px mx-auto ${isDark ? 'bg-white/10' : 'bg-slate-200'}`} />
                  <div className="text-left"><p className="text-[#00aeef] text-[9px] font-black uppercase tracking-[0.2em] mb-1">University</p><p className="text-[10px] font-bold line-clamp-1">{selectedUni?.[lang] || "Select University"}</p></div>
               </div>
               <div className="mt-auto flex justify-center opacity-20"><div className="h-10 w-full bg-gradient-to-r from-transparent via-current to-transparent" /></div>
            </motion.div>
         </div>
      </div>
    </div>
  );
}