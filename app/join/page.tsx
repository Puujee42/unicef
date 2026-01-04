"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  UserPlus, 
  LogIn, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "../context/LanguageContext";

// --- CONTENT ---
const CONTENT = {
  header: { 
    en: "How do you want to join?", 
    mn: "Та хэрхэн нэгдэхийг хүсч байна вэ?" 
  },
  sub: {
    en: "We'll personalize your onboarding experience accordingly.",
    mn: "Бид таны бүртгэлийн үйл явцыг танд тохируулан бэлдэх болно."
  },
  options: {
    signup: {
      title: { en: "I'm a new member", mn: "Би шинэ гишүүн" },
      desc: { en: "Register to join the club and access events.", mn: "Клубт элсэж, арга хэмжээнүүдэд оролцох." },
      badge: { en: "Recommended", mn: "Санал болгож буй" }
    },
    signin: {
      title: { en: "I'm already a member", mn: "Би гишүүн болсон" },
      desc: { en: "Log in to manage your profile and contributions.", mn: "Профайл болон идэвх оролцоогоо хянах." }
    }
  },
  btn: {
    signup: { en: "Create Account", mn: "Бүртгэл Үүсгэх" },
    signin: { en: "Log In", mn: "Нэвтрэх" }
  },
  footer: {
    en: "Back to Home",
    mn: "Нүүр хуудас руу буцах"
  }
};

export default function JoinPage() {
  const { language: lang } = useLanguage();
  const router = useRouter();
  const [selected, setSelected] = useState<'signup' | 'signin'>('signup');

  const handleContinue = () => {
    if (selected === 'signup') {
      router.push('/sign-up');
    } else {
      router.push('/sign-in');
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-[#001829] text-white overflow-hidden font-sans">
      
      {/* --- LEFT COLUMN: INTERACTION --- */}
      <div className="w-full lg:w-[55%] xl:w-[50%] relative flex flex-col justify-center px-8 md:px-16 lg:px-24 z-10">
        
        {/* Background Noise for Texture */}
        <div className="absolute inset-0 opacity-[0.03] bg-[url('/noise.png')] mix-blend-overlay pointer-events-none" />

        {/* Logo/Home Link */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-10 left-8 md:left-16 lg:left-24"
        >
          <Link href="/" className="flex items-center gap-3 group">
             <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#00aeef] to-[#005691] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <span className="font-black text-white text-xs">UC</span>
             </div>
             <div className="flex flex-col">
                <span className="font-bold text-white leading-none">UNICEF CLUB</span>
                <span className="text-[#00aeef] text-[10px] font-bold tracking-widest uppercase">Mongolia</span>
             </div>
          </Link>
        </motion.div>

        {/* Main Content Form */}
        <div className="max-w-lg w-full py-20">
           <motion.h1 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.1 }}
             className="text-4xl md:text-5xl font-black tracking-tight mb-4 text-white"
           >
             {CONTENT.header[lang]}
           </motion.h1>
           <motion.p 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.2 }}
             className="text-white/60 text-lg mb-12"
           >
             {CONTENT.sub[lang]}
           </motion.p>

           {/* OPTION CARDS */}
           <div className="space-y-6">
              
              {/* Option 1: Sign Up */}
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                onClick={() => setSelected('signup')}
                className={`relative group p-6 rounded-3xl border-2 cursor-pointer transition-all duration-300 flex items-start gap-6
                  ${selected === 'signup' 
                    ? "bg-[#00aeef]/10 border-[#00aeef] shadow-[0_0_30px_-5px_rgba(0,174,239,0.2)]" 
                    : "bg-white/5 border-white/5 hover:border-white/20 hover:bg-white/10"}
                `}
              >
                 <div className={`p-4 rounded-2xl transition-colors duration-300 ${selected === 'signup' ? "bg-[#00aeef] text-white" : "bg-white/10 text-white/50 group-hover:text-white"}`}>
                    <UserPlus size={24} strokeWidth={2} />
                 </div>
                 <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                       <h3 className="font-bold text-lg">{CONTENT.options.signup.title[lang]}</h3>
                       {/* Radio Circle */}
                       <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${selected === 'signup' ? "border-[#00aeef] bg-[#00aeef]" : "border-white/20"}`}>
                          {selected === 'signup' && <CheckCircle2 size={14} className="text-white" />}
                       </div>
                    </div>
                    <p className="text-sm text-white/50">{CONTENT.options.signup.desc[lang]}</p>
                 </div>
                 
                 {/* Badge */}
                 <div className="absolute -top-3 right-8 bg-[#00aeef] text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-lg">
                    {CONTENT.options.signup.badge[lang]}
                 </div>
              </motion.div>

              {/* Option 2: Sign In */}
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                onClick={() => setSelected('signin')}
                className={`relative group p-6 rounded-3xl border-2 cursor-pointer transition-all duration-300 flex items-start gap-6
                  ${selected === 'signin' 
                    ? "bg-[#00aeef]/10 border-[#00aeef] shadow-[0_0_30px_-5px_rgba(0,174,239,0.2)]" 
                    : "bg-white/5 border-white/5 hover:border-white/20 hover:bg-white/10"}
                `}
              >
                 <div className={`p-4 rounded-2xl transition-colors duration-300 ${selected === 'signin' ? "bg-[#00aeef] text-white" : "bg-white/10 text-white/50 group-hover:text-white"}`}>
                    <LogIn size={24} strokeWidth={2} />
                 </div>
                 <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                       <h3 className="font-bold text-lg">{CONTENT.options.signin.title[lang]}</h3>
                       <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${selected === 'signin' ? "border-[#00aeef] bg-[#00aeef]" : "border-white/20"}`}>
                          {selected === 'signin' && <CheckCircle2 size={14} className="text-white" />}
                       </div>
                    </div>
                    <p className="text-sm text-white/50">{CONTENT.options.signin.desc[lang]}</p>
                 </div>
              </motion.div>

           </div>

           {/* Continue Button */}
           <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.5 }}
             className="mt-12"
           >
              <button 
                onClick={handleContinue}
                className="w-full bg-[#00aeef] hover:bg-[#009bd5] text-white font-black text-sm uppercase tracking-widest py-5 rounded-2xl shadow-xl shadow-[#00aeef]/20 transition-all flex items-center justify-center gap-3 group"
              >
                 {CONTENT.btn[selected][lang]}
                 <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
           </motion.div>

           {/* Footer Link */}
           <motion.div 
             initial={{ opacity: 0 }} 
             animate={{ opacity: 1 }} 
             transition={{ delay: 0.6 }}
             className="mt-8 text-center"
           >
              <Link href="/" className="text-white/30 text-xs font-bold uppercase tracking-widest hover:text-white transition-colors">
                 {CONTENT.footer[lang]}
              </Link>
           </motion.div>

        </div>
      </div>

      {/* --- RIGHT COLUMN: VISUAL ATMOSPHERE --- */}
      <div className="hidden lg:block w-[45%] xl:w-[50%] relative overflow-hidden bg-[#00101a]">
         {/* Animated Background Elements */}
         <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.05] mix-blend-overlay z-10" />
         
         {/* Floating Glows */}
         <motion.div 
            animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-[20%] -right-[20%] w-[1000px] h-[1000px] bg-[#00aeef] rounded-full blur-[250px] opacity-[0.3]" 
         />
         <motion.div 
            animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            className="absolute -bottom-[20%] -left-[10%] w-[800px] h-[800px] bg-[#005691] rounded-full blur-[250px] opacity-[0.3]" 
         />

         {/* Abstract Art: Glass Card in the "Ocean" */}
         <div className="absolute inset-0 flex items-center justify-center z-20">
            <motion.div 
               initial={{ opacity: 0, scale: 0.9, rotateY: -10 }}
               animate={{ opacity: 1, scale: 1, rotateY: 0 }}
               transition={{ duration: 1.5, type: "spring" }}
               className="relative w-[400px] h-[500px] bg-white/5 border border-white/10 rounded-[3rem] backdrop-blur-3xl shadow-2xl overflow-hidden flex flex-col items-center justify-center text-center p-12"
            >
               <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-50" />
               <div className="absolute -top-20 -left-20 w-40 h-40 bg-[#00aeef] rounded-full blur-2xl opacity-50" />
               <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-[#fbbf24] rounded-full blur-3xl opacity-30" />

               <div className="relative z-10 space-y-6">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#00aeef] to-[#00dbde] flex items-center justify-center mx-auto shadow-lg shadow-[#00aeef]/40 animate-float-slow">
                     <Sparkles size={32} className="text-white" />
                  </div>
                  <h2 className="text-4xl font-black text-white leading-tight">
                     For Every <br />
                     <span className="text-[#00aeef]">Child</span>
                  </h2>
                  <p className="text-white/60 text-sm font-medium leading-relaxed">
                     Join a global network of changemakers dedicated to building a brighter future.
                  </p>
                  <div className="h-1 w-20 bg-white/20 rounded-full mx-auto" />
               </div>
            </motion.div>
         </div>
      </div>

    </div>
  );
}