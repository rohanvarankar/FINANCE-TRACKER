"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChatBubbleLeftRightIcon, 
  XMarkIcon, 
  PaperAirplaneIcon,
  SparklesIcon,
  UserIcon
} from "@heroicons/react/24/outline";
import api from "@/lib/api";
import { getToken } from "@/utils/auth";

export default function ChatbotBubble() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [history, setHistory] = useState([
    { role: "assistant", content: "Hi! I'm your Finance AI Advisor. How can I help you navigate your wealth today?" }
  ]);
  const [loading, setLoading] = useState(false);
  const chatRef = useRef(null);

  // Auto-scroll to latest message
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [history, loading]);

  // Prevent background scrolling on mobile when Chatbot is open
  useEffect(() => {
    if (isOpen) {
      if (window.innerWidth < 640) document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; }
  }, [isOpen]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim() || loading) return;

    const userMessage = { role: "user", content: message };
    setHistory(prev => [...prev, userMessage]);
    setMessage("");
    setLoading(true);

    try {
      const token = getToken();
      const res = await api.post("/ai/chatbot", { 
        message: userMessage.content,
        history: history.slice(-6) // Send last few messages for context
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setHistory(prev => [...prev, { role: "assistant", content: res.data.reply }]);
    } catch (err) {
      setHistory(prev => [...prev, { role: "assistant", content: "Sorry, I'm having trouble connecting to my brain right now. Please check your connection or try again later!" }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-8 sm:right-8 z-[100] flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.92, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: 20, scale: 0.92, filter: "blur(10px)" }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed inset-0 sm:absolute sm:inset-auto sm:bottom-[90px] sm:right-0 z-[110] 
                       w-full h-[100dvh] sm:w-[420px] sm:h-[650px] max-h-[100dvh] sm:max-h-[calc(100vh-140px)]
                       bg-[#0a0f1d]/95 backdrop-blur-3xl sm:border border-white/10 sm:rounded-[2rem] 
                       shadow-[0_0_80px_-15px_rgba(79,70,229,0.3)] flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 sm:p-5 border-b border-white/5 bg-gradient-to-r from-indigo-900/40 to-teal-900/10 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3 relative">
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
                  <SparklesIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div>
                  <h3 className="text-[13px] sm:text-sm font-extrabold text-white tracking-wide">AI Advisor</h3>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="relative flex h-2 w-2">
                       <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                       <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    <span className="text-[9px] sm:text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Online</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="w-10 h-10 rounded-xl hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-all active:scale-95 bg-white/5"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            {/* Messages Area */}
            <div 
              ref={chatRef}
              className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 scrollbar-hide scroll-smooth"
            >
              {history.map((msg, i) => (
                <motion.div 
                  initial={{ opacity: 0, y: 15, x: msg.role === 'user' ? 10 : -10 }}
                  animate={{ opacity: 1, y: 0, x: 0 }}
                  transition={{ type: "spring", stiffness: 200, damping: 20, delay: i === history.length -1 ? 0.05 : 0 }}
                  key={i} 
                  className={`flex items-end gap-2.5 sm:gap-3 w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.role !== 'user' && (
                    <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-lg bg-slate-800 border border-white/10 text-indigo-400 mb-1">
                      <SparklesIcon className="w-4 h-4" />
                    </div>
                  )}
                  
                  <div className={`p-4 rounded-[1.25rem] text-[13.5px] sm:text-[14.5px] leading-relaxed relative max-w-[85%] ${
                    msg.role === 'user' 
                      ? 'bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white rounded-br-sm shadow-md shadow-indigo-500/20' 
                      : 'bg-white/5 text-slate-200 border border-white/5 rounded-bl-sm backdrop-blur-md shadow-xl'
                  }`}>
                    {msg.content}
                  </div>

                  {msg.role === 'user' && (
                    <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-lg bg-indigo-600/20 text-indigo-400 border border-indigo-500/20 mb-1">
                      <UserIcon className="w-4 h-4" />
                    </div>
                  )}
                </motion.div>
              ))}
              
              {/* Thinking Indicator */}
              {loading && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-end gap-3 max-w-[85%]">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-lg bg-slate-800 border border-white/10 text-indigo-400 mb-1">
                    <SparklesIcon className="w-4 h-4 animate-pulse" />
                  </div>
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-sm rounded-bl-sm flex gap-1.5 items-center h-[52px]">
                     <span className="w-1.5 h-1.5 rounded-full bg-indigo-400/80 animate-bounce" style={{animationDelay: "0ms"}} />
                     <span className="w-1.5 h-1.5 rounded-full bg-indigo-400/80 animate-bounce" style={{animationDelay: "150ms"}} />
                     <span className="w-1.5 h-1.5 rounded-full bg-indigo-400/80 animate-bounce" style={{animationDelay: "300ms"}} />
                  </div>
                </motion.div>
              )}
            </div>

            {/* Input Form */}
            <form onSubmit={handleSendMessage} className="p-4 sm:p-5 border-t border-white/5 bg-[#0a0f1d] shrink-0">
              <div className="relative group/input">
                <input 
                  type="text" 
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Ask for financial advice..." 
                  className="w-full bg-white/5 border border-white/10 focus:border-indigo-500/60 rounded-2xl py-4 sm:py-4 pl-5 pr-14 text-sm font-medium text-white placeholder:text-slate-500 outline-none transition-all shadow-inner"
                />
                <button 
                  type="submit"
                  disabled={!message.trim() || loading}
                  className="absolute right-1.5 top-1.5 bottom-1.5 w-11 sm:w-11 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center transition-all disabled:opacity-30 disabled:hover:scale-100 disabled:cursor-not-allowed hover:scale-105 shadow-md shadow-indigo-600/30"
                >
                  <PaperAirplaneIcon className="w-5 h-5 -rotate-45" />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating CTA Button */}
      {/* On mobile, if chat is open, we hide or overlay the button. Since mobile is full screen, the outer wrapper just sits behind. */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="mt-4 w-14 h-14 sm:w-16 sm:h-16 rounded-[1.25rem] sm:rounded-3xl bg-gradient-to-br from-indigo-500 to-indigo-700 text-white flex items-center justify-center shadow-2xl shadow-indigo-600/40 relative group overflow-hidden z-[105]"
      >
        <div className="absolute inset-0 bg-white/20 translate-y-[100%] group-hover:translate-y-[0%] transition-transform duration-500 ease-out" />
        <AnimatePresence mode="popLayout">
          {isOpen ? (
            <motion.div key="close" initial={{ rotate: -90, opacity: 0, scale: 0 }} animate={{ rotate: 0, opacity: 1, scale: 1 }} exit={{ rotate: 90, opacity: 0, scale: 0 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
              <XMarkIcon className="w-6 h-6 sm:w-8 sm:h-8 relative z-10" />
            </motion.div>
          ) : (
            <motion.div key="chat" initial={{ rotate: 90, opacity: 0, scale: 0 }} animate={{ rotate: 0, opacity: 1, scale: 1 }} exit={{ rotate: -90, opacity: 0, scale: 0 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
               <ChatBubbleLeftRightIcon className="w-6 h-6 sm:w-8 sm:h-8 relative z-10" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
