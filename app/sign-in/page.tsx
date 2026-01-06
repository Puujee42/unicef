"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  ArrowRight, 
  Lock, 
  User, 
  Loader2,
  KeyRound,
  ShieldCheck,
  Fingerprint
} from "lucide-react";
import { motion } from "framer-motion";
import { useSignIn } from "@clerk/nextjs";
import { useTheme } from "next-themes";
import { useLanguage } from "../context/LanguageContext";

// --- CONTENT ---
const CONTENT = {
  header: { en: "Welcome Back", mn: "Тавтай Морилно Уу" },
  sub: { 
    en: "Access your dashboard and member resources.", 
    mn: "Гишүүний булан болон мэдээлэл рүү нэвтрэх." 
  },
  inputs: {
    identifier: { en: "Student ID or Email", mn: "Оюутны код эсвэл Имэйл" },
    pass: { en: "Password", mn: "Нууц үг" },
  },
  btn: { en: "Sign In", mn: "Нэвтрэх" },
  forgot: { en: "Forgot password?", mn: "Нууц үгээ мартсан?" },
  signup: {
    text: { en: "Not a member yet?", mn: "Гишүүн болоогүй юу?" },
    link: { en: "Join Club", mn: "Бүртгүүлэх" }
  }
};

export default function SignInPage() {
  const { language: lang } = useLanguage();
  const { theme } = useTheme();
  const { isLoaded, signIn, setActive } = useSignIn();
  const router = useRouter();

  const [mounted, setMounted] = useState(false);
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;
  const isDark = theme === "dark" || !theme;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded || isLoading) return;
    setIsLoading(true);
    setError("");

    try {
      const result = await signIn.create({ identifier, password });
      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        router.push("/dashboard");
      } else {
        setError("Login verification required.");
      }
    } catch (err: any) {
      if (err.errors?.[0]?.code === "form_password_incorrect") {
        setError("Incorrect password.");
      } else if (err.errors?.[0]?.code === "form_identifier_not_found") {
        setError("Account not found.");
      } else {
        setError("Invalid credentials. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`min-h-screen w-full flex overflow-hidden font-sans transition-colors duration-700
      ${isDark ? "bg-[#001829] text-white" : "bg-slate-50 text-slate-900"}`}>
      
      {/* --- LEFT SIDE: FORM --- */}
      <div className="w-full lg:w-[55%] flex flex-col justify-center px-6 md:px-12 lg:px-24 py-12 relative z-10">
        
        {/* Atmosphere Background */}
        <div className="absolute inset-0 opacity-[0.03] bg-[url('/noise.png')] mix-blend-overlay pointer-events-none" />
        
        {/* Logo Navigation */}
        <div className="absolute top-10 left-6 md:left-12 lg:left-24">
           <Link href="/" className="flex items-center gap-3 group">
              <div className="relative w-10 h-10 overflow-hidden rounded-full border border-[#00aeef]/20 shadow-xl transition-transform group-hover:scale-110">
                 <Image src="/logo.jpg" alt="Logo" fill className="object-cover" />
              </div>
              <div className="flex flex-col">
                <span className={`font-black tracking-tight leading-none ${isDark ? "text-white" : "text-[#001829]"}`}>UNICEF CLUB</span>
                <span className="text-[#00aeef] text-[10px] font-bold tracking-widest uppercase">Mongolia</span>
              </div>
           </Link>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full mx-auto relative z-10"
        >
          {/* Header */}
          <div className="mb-12">
            <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center mb-8 border-2 shadow-lg transition-colors
              ${isDark ? "bg-[#00aeef]/10 border-[#00aeef]/20" : "bg-white border-sky-100"}`}>
                <KeyRound size={28} className="text-[#00aeef]" />
            </div>
            <h1 className={`text-4xl md:text-6xl font-black tracking-tighter mb-4 transition-colors duration-500
              ${isDark ? "text-white" : "text-[#001829]"}`}>
                {CONTENT.header[lang]}
            </h1>
            <p className={`text-lg font-medium opacity-60 transition-colors duration-500
              ${isDark ? "text-white" : "text-slate-600"}`}>
                {CONTENT.sub[lang]}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Identifier */}
            <div className="relative group">
               <User className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors
                 ${isDark ? "text-white/20 group-focus-within:text-[#00aeef]" : "text-slate-400 group-focus-within:text-[#00aeef]"}`} size={18} />
               <input 
                 type="text" 
                 value={identifier}
                 onChange={(e) => setIdentifier(e.target.value)}
                 placeholder={CONTENT.inputs.identifier[lang]}
                 className={`w-full border rounded-2xl py-4.5 pl-12 pr-4 text-xs font-black uppercase tracking-widest transition-all focus:outline-none focus:ring-2 focus:ring-[#00aeef]/50
                   ${isDark 
                    ? "bg-white/5 border-white/10 text-white placeholder:text-white/20" 
                    : "bg-white border-slate-200 text-[#001829] placeholder:text-slate-400 shadow-sm"}`}
                 required
               />
            </div>

            {/* Password */}
            <div className="space-y-3">
                <div className="relative group">
                    <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors
                      ${isDark ? "text-white/20 group-focus-within:text-[#00aeef]" : "text-slate-400 group-focus-within:text-[#00aeef]"}`} size={18} />
                    <input 
                        type="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder={CONTENT.inputs.pass[lang]}
                        className={`w-full border rounded-2xl py-4.5 pl-12 pr-4 text-xs font-black uppercase tracking-widest transition-all focus:outline-none focus:ring-2 focus:ring-[#00aeef]/50
                          ${isDark 
                            ? "bg-white/5 border-white/10 text-white placeholder:text-white/20" 
                            : "bg-white border-slate-200 text-[#001829] placeholder:text-slate-400 shadow-sm"}`}
                        required
                    />
                </div>
                <div className="text-right">
                    <Link href="#" className="text-[10px] text-[#00aeef] font-black uppercase tracking-widest hover:text-[#001829] dark:hover:text-white transition-colors">
                        {CONTENT.forgot[lang]}
                    </Link>
                </div>
            </div>

            {/* Error Message */}
            {error && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-rose-500 text-[10px] font-black text-center bg-rose-500/10 p-4 rounded-xl border border-rose-500/20 uppercase tracking-[0.2em]">
                {error}
              </motion.div>
            )}

            {/* Submit Button */}
            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-[#00aeef] hover:bg-[#009bd5] text-white font-black uppercase tracking-[0.2em] text-[10px] py-5 rounded-2xl shadow-xl shadow-[#00aeef]/20 transition-all active:scale-[0.98] flex items-center justify-center gap-3"
            >
              {isLoading ? <Loader2 className="animate-spin" size={20} /> : <>{CONTENT.btn[lang]} <ArrowRight size={18} /></>}
            </button>
          </form>

          {/* Sign Up Link */}
          <div className={`mt-12 text-center p-6 rounded-2xl border transition-all
            ${isDark ? "bg-[#00aeef]/5 border-white/5" : "bg-white border-slate-100 shadow-sm"}`}>
             <span className={`text-[10px] font-black uppercase tracking-widest opacity-60 ${isDark ? "text-white" : "text-slate-500"}`}>
                {CONTENT.signup.text[lang]} 
             </span>
             <Link href="/join" className="text-[#00aeef] text-[10px] font-black uppercase tracking-widest hover:underline ml-2">
               {CONTENT.signup.link[lang]}
             </Link>
          </div>

        </motion.div>
      </div>

      {/* --- RIGHT SIDE: VISUAL ATMOSPHERE --- */}
      <div className={`hidden lg:block w-[45%] relative overflow-hidden border-l transition-colors duration-700
         ${isDark ? "bg-[#00101a] border-white/5" : "bg-sky-50 border-slate-200"}`}>
         
         <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay z-10" />
         
         {/* Atmospheric Glows */}
         <motion.div 
            animate={{ scale: [1, 1.2, 1], opacity: isDark ? [0.1, 0.2, 0.1] : [0.3, 0.5, 0.3] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className={`absolute -top-[10%] -right-[10%] w-[800px] h-[800px] rounded-full blur-[200px] 
              ${isDark ? "bg-[#00aeef]" : "bg-sky-200"}`} 
         />

         {/* Center Visualization */}
         <div className="absolute inset-0 flex items-center justify-center z-20">
            <div className="relative w-[400px] h-[400px]">
                
                {/* Rotating Rings */}
                <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                    className={`absolute inset-0 rounded-full border border-dashed transition-colors
                      ${isDark ? "border-white/5" : "border-sky-300"}`}
                />
                <motion.div 
                    animate={{ rotate: -360 }}
                    transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
                    className={`absolute inset-12 rounded-full border border-dotted transition-colors
                      ${isDark ? "border-white/10" : "border-sky-400"}`}
                />

                {/* Shield/Lock Container */}
                <motion.div 
                    animate={{ y: [0, -20, 0] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute inset-0 flex items-center justify-center"
                >
                    <div className={`relative w-40 h-40 border backdrop-blur-3xl rounded-[3rem] flex items-center justify-center shadow-2xl transition-all
                      ${isDark ? "bg-white/5 border-white/10 shadow-[#00aeef]/10" : "bg-white border-white shadow-sky-100"}`}>
                        
                        <div className="absolute inset-0 bg-[#00aeef] opacity-10 blur-2xl rounded-[3rem]" />
                        <ShieldCheck size={64} className="text-[#00aeef] relative z-10" />
                        
                        <motion.div 
                            animate={{ top: ["0%", "100%", "0%"] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                            className="absolute left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#00aeef] to-transparent opacity-50"
                        />
                    </div>
                </motion.div>

                {/* Footer Decor */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-20 flex flex-col items-center gap-3">
                    <Fingerprint size={40} className={`transition-colors ${isDark ? "text-white/10" : "text-sky-200"}`} />
                    <span className="text-[9px] font-black text-[#00aeef] tracking-[0.4em] animate-pulse">ENCRYPTED SESSION</span>
                </div>
            </div>
         </div>
      </div>
    </div>
  );
}