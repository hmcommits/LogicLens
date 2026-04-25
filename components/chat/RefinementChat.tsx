"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useChatStore } from "@/store/chatStore";
import { useGenerationStore } from "@/store/generationStore";
import { useRefiner } from "@/hooks/useRefiner";
import { Send, Terminal, ChevronDown, ChevronUp, Bot, User, Loader2 } from "lucide-react";

export default function RefinementChat() {
  const { messages, isOpen, setIsOpen, isStreaming } = useChatStore();
  const logicGraph = useGenerationStore((s) => s.logicGraph);
  const status = useGenerationStore((s) => s.status);
  const { refine } = useRefiner();
  
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isStreaming) return;

    const userMsg = input.trim();
    setInput("");
    await refine(userMsg);
  };

  // Only show the chat drawer if generation is complete or we are currently refining
  if (status !== "done" && status !== "refining" && status !== "error") return null;

  return (
    <div className="absolute bottom-8 left-0 right-0 z-40 flex justify-center pointer-events-none">
      <motion.div 
        className="w-[600px] pointer-events-auto bg-[#0d111a] border border-[rgba(255,255,255,0.08)] rounded-t-xl shadow-2xl flex flex-col"
        initial={false}
        animate={{ 
          height: isOpen ? "400px" : "48px",
          y: isOpen ? 0 : 0
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        {/* Header / Toggle */}
        <motion.button 
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-between px-4 py-3 border-b border-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.02)] transition-colors rounded-t-xl w-full"
          whileHover={{ backgroundColor: "rgba(255,255,255,0.03)" }}
          whileTap={{ scale: 0.99 }}
        >
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-[#00d4ff]" />
            <span className="text-sm font-medium text-white font-[family-name:var(--font-jetbrains-mono)]">
              Refinement Chat
            </span>
          </div>
          {isOpen ? <ChevronDown className="w-4 h-4 text-gray-400" /> : <ChevronUp className="w-4 h-4 text-gray-400" />}
        </motion.button>

        {/* Content Area */}
        <AnimatePresence>
          {isOpen && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex flex-col overflow-hidden"
            >
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {/* AI Reasoning Block */}
                {logicGraph?.aiReasoning && messages.length === 0 && (
                  <div className="bg-[rgba(0,212,255,0.05)] border border-[rgba(0,212,255,0.1)] rounded-lg p-3 text-xs text-[#a1a1aa] font-[family-name:var(--font-jetbrains-mono)]">
                    <span className="text-[#00d4ff] font-bold block mb-1">AI Reasoning:</span>
                    {logicGraph.aiReasoning}
                  </div>
                )}

                {/* Messages */}
                {messages.length === 0 ? (
                  <div className="text-center text-sm text-gray-500 mt-10">
                    Ask LogicLens to modify the generated app! (e.g. "make the button red" or "add a password field")
                  </div>
                ) : (
                  messages.map((msg) => (
                    <motion.div 
                      key={msg.id} 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
                    >
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${msg.role === "user" ? "bg-brand text-white" : "bg-[rgba(0,212,255,0.2)] text-[#00d4ff]"}`}>
                        {msg.role === "user" ? <User className="w-3 h-3" /> : <Bot className="w-3 h-3" />}
                      </div>
                      <div className={`px-3 py-2 rounded-lg text-sm max-w-[85%] ${msg.role === "user" ? "bg-[rgba(255,255,255,0.05)] text-gray-200" : "bg-transparent text-[#a1a1aa] font-[family-name:var(--font-jetbrains-mono)]"}`}>
                        {msg.content}
                      </div>
                    </motion.div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <form onSubmit={handleSubmit} className="p-3 border-t border-[rgba(255,255,255,0.05)] bg-[rgba(0,0,0,0.2)]">
                <div className="relative flex items-center">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={isStreaming ? "Applying patches..." : "Type a refinement..."}
                    disabled={isStreaming}
                    className="w-full bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.1)] rounded-lg pl-4 pr-10 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#00d4ff] transition-colors"
                  />
                  <motion.button 
                    type="submit"
                    disabled={!input.trim() || isStreaming}
                    className="absolute right-2 p-1.5 rounded-md text-gray-400 hover:text-[#00d4ff] hover:bg-[rgba(0,212,255,0.1)] disabled:opacity-50 disabled:hover:bg-transparent transition-colors"
                    whileHover={input.trim() && !isStreaming ? { scale: 1.1 } : {}}
                    whileTap={input.trim() && !isStreaming ? { scale: 0.9 } : {}}
                  >
                    {isStreaming ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
