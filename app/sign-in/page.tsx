"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  ArrowRight, 
  Lock, 
  User, 
  Loader2,
  KeyRound,
  ShieldCheck,
  Fingerprint,
  Zap
} from "lucide-react";
import { motion } from "framer-motion";
import { useSignIn } from "@clerk/nextjs";
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
  const { isLoaded, signIn, setActive } = useSignIn();
  const router = useRouter();

  // State
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // --- SUBMIT ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded || isLoading) return;

    setIsLoading(true);
    setError("");

    try {
      const result = await signIn.create({
        identifier,
        password,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        router.push("/dashboard");
      } else {
        // Handle MFA or other factors if enabled
        console.log(result);
        setError("Login verification required.");
      }
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2));
      // Clerk specific error codes
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
    <div className="min-h-screen w-full flex bg-[#001829] text-white font-sans overflow-hidden">
      
      {/* --- LEFT SIDE: FORM --- */}
      <div className="w-full lg:w-[55%] flex flex-col justify-center px-6 md:px-12 lg:px-24 py-12 relative z-10">
        
        {/* Logo Navigation */}
        <div className="absolute top-8 left-6 md:left-12 lg:left-24">
           <Link href="/" className="flex items-center gap-3 group opacity-80 hover:opacity-100 transition-opacity">
              <div className="w-8 h-8 rounded-full bg-[#00aeef] flex items-center justify-center text-white shadow-lg">
                 <span className="font-black text-[10px]">UC</span>
              </div>
              <span className="font-bold tracking-widest text-sm">UNICEF CLUB</span>
           </Link>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md w-full mx-auto"
        >
          {/* Header */}
          <div className="mb-10">
            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6">
                <KeyRound size={24} className="text-[#00aeef]" />
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-3 text-white">
                {CONTENT.header[lang]}
            </h1>
            <p className="text-white/60 text-lg">
                {CONTENT.sub[lang]}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Identifier (Student ID/Email) */}
            <div className="relative group">
               <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 w-4 h-4 group-focus-within:text-[#00aeef] transition-colors" />
               <input 
                 type="text" 
                 value={identifier}
                 onChange={(e) => setIdentifier(e.target.value)}
                 placeholder={CONTENT.inputs.identifier[lang]}
                 className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-10 pr-4 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#00aeef] focus:bg-[#00aeef]/5 transition-all"
                 required
               />
            </div>

            {/* Password */}
            <div className="space-y-2">
                <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 w-4 h-4 group-focus-within:text-[#00aeef] transition-colors" />
                    <input 
                        type="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder={CONTENT.inputs.pass[lang]}
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-10 pr-4 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#00aeef] focus:bg-[#00aeef]/5 transition-all"
                        required
                    />
                </div>
                <div className="text-right">
                    <Link href="#" className="text-xs text-[#00aeef] font-bold hover:text-white transition-colors">
                        {CONTENT.forgot[lang]}
                    </Link>
                </div>
            </div>

            {/* Error Message */}
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }} 
                animate={{ opacity: 1, height: "auto" }}
                className="text-red-400 text-xs text-center bg-red-500/10 p-3 rounded-lg border border-red-500/20"
              >
                {error}
              </motion.div>
            )}

            {/* Submit Button */}
            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-[#00aeef] hover:bg-[#009bd5] text-white font-black uppercase tracking-widest text-xs py-4 rounded-xl shadow-lg shadow-[#00aeef]/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                <>
                  {CONTENT.btn[lang]} <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Sign Up Link */}
          <div className="mt-12 text-center p-4 rounded-xl bg-[#00aeef]/5 border border-[#00aeef]/10">
             <span className="text-sm text-white/60">{CONTENT.signup.text[lang]} </span>
             <Link href="/join" className="text-[#00aeef] font-bold hover:underline ml-1">
               {CONTENT.signup.link[lang]}
             </Link>
          </div>

        </motion.div>
      </div>

      {/* --- RIGHT SIDE: VISUAL ATMOSPHERE --- */}
      <div className="hidden lg:block w-[45%] relative overflow-hidden bg-[#00101a] border-l border-white/5">
         
         <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.05] mix-blend-overlay z-10" />
         
         {/* Atmospheric Glows */}
         <motion.div 
            animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-[10%] -right-[10%] w-[800px] h-[800px] bg-[#00aeef] rounded-full blur-[200px]" 
         />

         {/* Center Visualization: The Portal/Lock */}
         <div className="absolute inset-0 flex items-center justify-center z-20">
            <div className="relative w-96 h-96">
                
                {/* Rotating Rings */}
                <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 rounded-full border border-white/5 border-dashed"
                />
                <motion.div 
                    animate={{ rotate: -360 }}
                    transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-12 rounded-full border border-white/10 border-dotted"
                />

                {/* Floating Shield/Lock Icon */}
                <motion.div 
                    animate={{ y: [0, -20, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute inset-0 flex items-center justify-center"
                >
                    <div className="relative w-32 h-32 bg-white/5 border border-white/20 backdrop-blur-3xl rounded-[2rem] flex items-center justify-center shadow-2xl shadow-[#00aeef]/20">
                        {/* Glow Behind Icon */}
                        <div className="absolute inset-0 bg-[#00aeef] opacity-20 blur-xl rounded-[2rem]" />
                        <ShieldCheck size={48} className="text-[#00aeef] relative z-10" />
                        
                        {/* Scan Line Animation */}
                        <motion.div 
                            animate={{ top: ["0%", "100%", "0%"] }}
                            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                            className="absolute left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#00aeef] to-transparent opacity-50"
                        />
                    </div>
                </motion.div>

                {/* Biometric/Data Decorations */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-20 flex flex-col items-center gap-2">
                    <Fingerprint size={32} className="text-white/20" />
                    <span className="text-[10px] font-mono text-[#00aeef] tracking-[0.2em] animate-pulse">SECURE ACCESS</span>
                </div>

            </div>
         </div>
      </div>

    </div>
  );
}