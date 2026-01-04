"use client";

import React, { useState } from "react";
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
  CheckCircle2
} from "lucide-react";
import { motion } from "framer-motion";
import { useSignUp } from "@clerk/nextjs";
import { useLanguage } from "../context/LanguageContext";

// --- CONTENT ---
const CONTENT = {
  header: { en: "Student Registration", mn: "Оюутны Бүртгэл" },
  sub: { 
    en: "Join the MNUMS UNICEF Club using your Student ID.", 
    mn: "Оюутны кодоо ашиглан клубт нэгдээрэй." 
  },
  inputs: {
    studentId: { en: "Student ID (e.g., S.SS24000)", mn: "Оюутны код (Жш: S.SS24000)" },
    fullname: { en: "Full Name", mn: "Бүтэн Нэр" },
    email: { en: "University Email", mn: "Сургуулийн Имэйл" },
    pass: { en: "Password", mn: "Нууц үг" },
    code: { en: "Verification Code", mn: "Баталгаажуулах код" }
  },
  btn: { en: "Create Account", mn: "Бүртгүүлэх" },
  verify: { en: "Verify Email", mn: "Имэйл баталгаажуулах" },
  login: {
    text: { en: "Already a member?", mn: "Бүртгэлтэй юу?" },
    link: { en: "Access Portal", mn: "Нэвтрэх" }
  },
  university: { en: "MNUMS", mn: "АШУҮИС" }
};

export default function SignUpPage() {
  const { language: lang } = useLanguage();
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();

  // Form State
  const [studentId, setStudentId] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // --- SUBMIT ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded || isLoading) return;

    setIsLoading(true);
    setError("");

    try {
      await signUp.create({
        username: studentId, // Mapping Student ID to Username
        emailAddress: email,
        password,
        unsafeMetadata: {
          fullName,
          studentId,
          role: "student",
          university: "MNUMS"
        },
      });

      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setPendingVerification(true);
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2));
      setError(err.errors[0]?.longMessage || "Registration failed. Check your ID/Email.");
    } finally {
      setIsLoading(false);
    }
  };

  // --- VERIFY ---
  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded || isLoading) return;

    setIsLoading(true);
    setError("");

    try {
      const result = await signUp.attemptEmailAddressVerification({ code });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        
        // Optional: Sync user to your DB here
        // await fetch('/api/sync-user', { ... });

        router.push("/dashboard");
      } else {
        setError("Verification code incorrect.");
      }
    } catch (err: any) {
      setError("Verification failed. Please try again.");
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
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-3 text-white">
            {CONTENT.header[lang]}
          </h1>
          <p className="text-white/60 mb-10 text-lg">
            {CONTENT.sub[lang]}
          </p>

          {!pendingVerification ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* University Field (Disabled/Fixed) */}
              <div className="relative group opacity-60">
                 <Building className="absolute left-4 top-1/2 -translate-y-1/2 text-[#00aeef] w-4 h-4" />
                 <input 
                   type="text" 
                   value={CONTENT.university[lang]}
                   disabled
                   className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-10 pr-4 text-sm text-white/50 cursor-not-allowed"
                 />
                 <div className="absolute right-4 top-1/2 -translate-y-1/2 text-green-500">
                    <CheckCircle2 size={16} />
                 </div>
              </div>

              {/* Student ID */}
              <div className="relative group">
                 <IdCard className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 w-4 h-4 group-focus-within:text-[#00aeef] transition-colors" />
                 <input 
                   type="text" 
                   value={studentId}
                   onChange={(e) => setStudentId(e.target.value.toUpperCase())}
                   placeholder={CONTENT.inputs.studentId[lang]}
                   className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-10 pr-4 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#00aeef] focus:bg-[#00aeef]/5 transition-all uppercase"
                   required
                 />
              </div>

              {/* Full Name */}
              <div className="relative group">
                 <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 w-4 h-4 group-focus-within:text-[#00aeef] transition-colors" />
                 <input 
                   type="text" 
                   value={fullName}
                   onChange={(e) => setFullName(e.target.value)}
                   placeholder={CONTENT.inputs.fullname[lang]}
                   className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-10 pr-4 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#00aeef] focus:bg-[#00aeef]/5 transition-all"
                   required
                 />
              </div>

              {/* Email */}
              <div className="relative group">
                 <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 w-4 h-4 group-focus-within:text-[#00aeef] transition-colors" />
                 <input 
                   type="email" 
                   value={email}
                   onChange={(e) => setEmail(e.target.value)}
                   placeholder={CONTENT.inputs.email[lang]}
                   className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-10 pr-4 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#00aeef] focus:bg-[#00aeef]/5 transition-all"
                   required
                 />
              </div>

              {/* Password */}
              <div className="relative group">
                 <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 w-4 h-4 group-focus-within:text-[#00aeef] transition-colors" />
                 <input 
                   type="password" 
                   value={password}
                   onChange={(e) => setPassword(e.target.value)}
                   placeholder={CONTENT.inputs.pass[lang]}
                   className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-10 pr-4 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#00aeef] focus:bg-[#00aeef]/5 transition-all"
                   required
                 />
              </div>

              {/* Error Message */}
              {error && (
                <p className="text-red-400 text-xs text-center bg-red-500/10 p-2 rounded-lg border border-red-500/20">
                  {error}
                </p>
              )}

              {/* Submit Button */}
              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-[#00aeef] hover:bg-[#009bd5] text-white font-black uppercase tracking-widest text-xs py-4 rounded-xl shadow-lg shadow-[#00aeef]/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2 mt-4"
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
          ) : (
            // --- VERIFICATION FORM ---
            <form onSubmit={handleVerify} className="space-y-6">
               <div className="text-center">
                  <div className="w-16 h-16 bg-[#00aeef]/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-[#00aeef]/30">
                     <Mail size={32} className="text-[#00aeef]" />
                  </div>
                  <h3 className="text-xl font-bold">Check your email</h3>
                  <p className="text-white/50 text-sm mt-2">
                    We sent a code to <span className="text-white font-bold">{email}</span>
                  </p>
               </div>

               <div className="relative group">
                 <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 w-4 h-4 group-focus-within:text-[#00aeef] transition-colors" />
                 <input 
                   type="text" 
                   value={code}
                   onChange={(e) => setCode(e.target.value)}
                   placeholder={CONTENT.inputs.code[lang]}
                   className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-10 pr-4 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#00aeef] focus:bg-[#00aeef]/5 transition-all tracking-widest text-center font-mono"
                   required
                 />
               </div>

               {error && (
                <p className="text-red-400 text-xs text-center">{error}</p>
               )}

               <button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-[#00aeef] hover:bg-[#009bd5] text-white font-black uppercase tracking-widest text-xs py-4 rounded-xl shadow-lg transition-all"
              >
                {isLoading ? "Verifying..." : CONTENT.verify[lang]}
              </button>
            </form>
          )}

          {/* Login Link */}
          <div className="mt-8 text-center p-4 rounded-xl bg-[#00aeef]/5 border border-[#00aeef]/10">
             <span className="text-sm text-white/60">{CONTENT.login.text[lang]} </span>
             <Link href="/sign-in" className="text-[#00aeef] font-bold hover:underline">
               {CONTENT.login.link[lang]}
             </Link>
          </div>

        </motion.div>
      </div>

      {/* --- RIGHT SIDE: VISUAL ATMOSPHERE --- */}
      <div className="hidden lg:block w-[45%] relative overflow-hidden bg-[#00101a] border-l border-white/5">
         
         <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.05] mix-blend-overlay z-10" />
         
         {/* Atmospheric Glows */}
         <motion.div 
            animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#00aeef] rounded-full blur-[200px] opacity-[0.2]" 
         />

         {/* 3D ID Card Simulation */}
         <div className="absolute inset-0 flex items-center justify-center z-20">
            <motion.div 
               initial={{ opacity: 0, rotateY: 90 }}
               animate={{ opacity: 1, rotateY: -10 }}
               transition={{ duration: 1.2, type: "spring" }}
               className="relative w-[380px] h-[580px] bg-white/5 border border-white/10 rounded-[2.5rem] backdrop-blur-3xl shadow-2xl overflow-hidden flex flex-col p-8"
            >
               {/* Card Shine */}
               <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-transparent pointer-events-none" />
               <div className="absolute -top-32 -left-32 w-64 h-64 bg-[#00aeef] rounded-full blur-[80px] opacity-40" />

               {/* ID Header */}
               <div className="flex justify-between items-start mb-12 relative z-10">
                  <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-lg">
                     <div className="w-8 h-8 rounded-full bg-[#00aeef]" />
                  </div>
                  <div className="text-right">
                     <h3 className="font-black text-white text-lg tracking-wide">MNUMS</h3>
                     <p className="text-[#00aeef] text-[10px] font-bold uppercase tracking-widest">Student Access</p>
                  </div>
               </div>

               {/* ID Body */}
               <div className="relative z-10 flex-1 flex flex-col justify-center text-center space-y-4">
                  <div className="w-28 h-28 mx-auto rounded-full border-2 border-white/20 flex items-center justify-center bg-white/5 backdrop-blur-md relative">
                     <GraduationCap size={48} className="text-white/80" />
                     <div className="absolute -bottom-2 -right-2 bg-green-500 rounded-full p-1.5 border-4 border-[#00101a]">
                        <CheckCircle2 size={12} className="text-white" />
                     </div>
                  </div>
                  <div>
                     <h2 className="text-2xl font-black text-white">{fullName || "Your Name"}</h2>
                     <p className="text-[#00aeef] font-mono tracking-widest text-sm mt-1">
                        {studentId || "S.SS24000"}
                     </p>
                  </div>
                  <div className="w-full h-px bg-white/10 my-4" />
                  <div className="grid grid-cols-2 gap-4 text-xs text-white/50 uppercase tracking-widest font-bold">
                     <div>
                        <p className="mb-1 text-[#00aeef]">Role</p>
                        <p className="text-white">Member</p>
                     </div>
                     <div>
                        <p className="mb-1 text-[#00aeef]">Exp</p>
                        <p className="text-white">2026</p>
                     </div>
                  </div>
               </div>

               {/* ID Footer */}
               <div className="relative z-10 mt-auto">
                  <div className="w-full h-12 bg-white/10 rounded-lg flex items-center justify-center gap-2 overflow-hidden">
                     {/* Fake Barcode */}
                     {[...Array(20)].map((_, i) => (
                        <div key={i} className="h-6 w-1 bg-white/30" style={{ width: Math.random() > 0.5 ? 2 : 4, opacity: Math.random() }} />
                     ))}
                  </div>
               </div>
            </motion.div>
         </div>
      </div>

    </div>
  );
}