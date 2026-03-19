"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChatBubbleLeftRightIcon, 
  XMarkIcon, 
  PaperAirplaneIcon,
  SparklesIcon,
  UserIcon,
  CommandLineIcon
} from "@heroicons/react/24/outline";
import api from "@/lib/api";
import { getToken } from "@/utils/auth";

export default function ChatbotBubble() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [history, setHistory] = useState([
    { role: "assistant", content: "Hi! I'm your Finance Advisor. How can I help you today?" }
  ]);
  const [loading, setLoading] = useState(false);
  const chatRef = useRef(null);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [history]);

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
      setHistory(prev => [...prev, { role: "assistant", content: "Sorry, I'm having trouble connecting to my brain right now. Please try again later!" }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-10 right-10 z-[100]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="absolute bottom-20 right-0 w-[400px] h-[600px] bg-[#0f172a]/95 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-6 border-b border-white/5 bg-indigo-600/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30">
                  <SparklesIcon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">AI Advisor</h3>
                  <div className="flex items-center gap-1.5 status">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-bold text-emerald-500 uppercase">Live Now</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-lg hover:bg-white/5 flex items-center justify-center text-slate-400 hover:text-white transition-all"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div 
              ref={chatRef}
              className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide"
            >
              {history.map((msg, i) => (
                <motion.div 
                  initial={{ opacity: 0, x: msg.role === 'user' ? 10 : -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  key={i} 
                  className={`flex items-start gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border border-white/10 ${msg.role === 'user' ? 'bg-white/5 text-slate-400' : 'bg-indigo-600/10 text-indigo-400'}`}>
                    {msg.role === 'user' ? <UserIcon className="w-4 h-4" /> : <CommandLineIcon className="w-4 h-4" />}
                  </div>
                  <div className={`p-4 rounded-2xl max-w-[80%] text-sm leading-relaxed ${msg.role === 'user' ? 'bg-white/5 text-white border border-white/5 rounded-tr-none' : 'bg-indigo-600/5 text-slate-200 border border-indigo-500/10 rounded-tl-none'}`}>
                    {msg.content}
                  </div>
                </motion.div>
              ))}
              {loading && (
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-lg bg-indigo-600/10 text-indigo-400 flex items-center justify-center shrink-0 border border-indigo-500/10">
                    <SparklesIcon className="w-4 h-4 animate-pulse" />
                  </div>
                  <div className="p-4 rounded-2xl bg-indigo-600/5 text-slate-400 border border-indigo-500/10 animate-pulse text-xs font-bold uppercase tracking-widest">
                    Thinking...
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <form onSubmit={handleSendMessage} className="p-6 border-t border-white/5 bg-white/[0.02]">
              <div className="relative">
                <input 
                  type="text" 
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Ask me anything..." 
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-6 pr-14 text-sm font-medium text-white placeholder:text-slate-600 outline-none focus:border-indigo-500/50 transition-all"
                />
                <button 
                  type="submit"
                  disabled={!message.trim() || loading}
                  className="absolute right-2 top-2 w-10 h-10 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center transition-all disabled:opacity-50 disabled:bg-slate-700"
                >
                  <PaperAirplaneIcon className="w-5 h-5 -rotate-45" />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 rounded-[1.5rem] bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center shadow-2xl shadow-indigo-600/40 relative group overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
              <XMarkIcon className="w-8 h-8" />
            </motion.div>
          ) : (
            <motion.div key="chat" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
              <ChatBubbleLeftRightIcon className="w-8 h-8" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
