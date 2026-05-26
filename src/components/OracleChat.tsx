/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { 
  Send, Sparkles, Trash2, Flame, RefreshCw, Feather, User, AlertCircle, 
  KeyRound, CheckCircle2, Unlock, HelpCircle, ArrowLeft, ShieldAlert, Lock, Scroll, Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Message, SacredScripture } from '../types';

interface OracleChatProps {
  messages: Message[];
  onSendMessage: (text: string) => void;
  onClearChat: () => void;
  isLoading: boolean;
  error: string | null;
  scriptures: SacredScripture[];
  scripturesLoading: boolean;
  scripturesError: string | null;
}

export default function OracleChat({
  messages,
  onSendMessage,
  onClearChat,
  isLoading,
  error,
  scriptures,
  scripturesLoading,
  scripturesError,
}: OracleChatProps) {
  // Chat input state
  const [inputText, setInputText] = useState('');
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Decryption Flow States
  const [enteredCode, setEnteredCode] = useState('');
  const [codeError, setCodeError] = useState<string | null>(null);
  const [matchedScripture, setMatchedScripture] = useState<SacredScripture | null>(null);

  const [enteredAnswer, setEnteredAnswer] = useState('');
  const [answerError, setAnswerError] = useState<string | null>(null);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isFinalCodeShown, setIsFinalCodeShown] = useState(false);
  const [copied, setCopied] = useState(false);

  // Auto scroll chat to bottom when unlocked and chatting
  useEffect(() => {
    if (isUnlocked) {
      chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading, isUnlocked]);

  // Generate stable particles for the final screen celebration (Fire embers rising)
  const celebrationParticles = useMemo(() => {
    return Array.from({ length: 50 }).map((_, i) => {
      const p = Math.random();
      let colorClass = '';
      if (p < 0.45) {
        // Vibrant orange/red flame sparks
        colorClass = 'from-red-600 via-orange-500 to-amber-400 shadow-[0_0_8px_rgba(239,68,68,0.7)]';
      } else if (p < 0.85) {
        // Bright golden embers
        colorClass = 'from-amber-500 via-yellow-400 to-amber-300 shadow-[0_0_8px_rgba(245,158,11,0.8)]';
      } else {
        // Supercharged heat sparks (almost white-hot / neon yellow)
        colorClass = 'from-yellow-300 to-white shadow-[0_0_10px_rgba(255,255,255,0.9)]';
      }

      const size = Math.floor(Math.random() * 5) + 3; // 3px to 8px
      const isDistant = Math.random() > 0.6; // some are smaller and slower for parallax depth

      return {
        id: i,
        size: isDistant ? Math.max(2, size - 2) : size,
        duration: isDistant ? Math.random() * 4 + 5 : Math.random() * 3 + 3, // 3s to 9s
        delay: Math.random() * 6,
        left: Math.random() * 100, // random start horizontal %
        sway: Math.random() * 24 - 12, // wider sway for wind draft
        className: `bg-gradient-to-t ${colorClass} ${isDistant ? 'opacity-40 blur-[0.5px]' : 'opacity-95 blur-[0.2px]'}`
      };
    });
  }, []);

  // Handle first phase: Code Verification
  const handleVerifyCode = (e?: React.FormEvent) => {
    e?.preventDefault();
    setCodeError(null);
    const cleanedCode = enteredCode.trim();
    if (!cleanedCode) {
      setCodeError("Please type a Kinettix code first.");
      return;
    }

    if (scriptures.length === 0) {
      setCodeError("The scriptures are not loaded yet. Please wait or reload.");
      return;
    }

    // Lookup in scriptures
    const found = scriptures.find((scr) => {
      const matchDecrypted = scr.code.trim().toLowerCase() === cleanedCode.toLowerCase();
      const matchRaw = scr.originalCode.trim().toLowerCase() === cleanedCode.toLowerCase();
      return matchDecrypted || matchRaw;
    });

    if (found) {
      setMatchedScripture(found);
      setCodeError(null);
    } else {
      setCodeError("ACCESS DENIED. Invalid security code or matrix mismatch.");
    }
  };

  // Handle second phase: Clue/Answer verification
  const handleVerifyAnswer = (e?: React.FormEvent) => {
    e?.preventDefault();
    setAnswerError(null);
    const cleanedAnswer = enteredAnswer.trim();
    if (!cleanedAnswer) {
      setAnswerError("Please enter your answer to Decrypt.");
      return;
    }

    if (!matchedScripture) return;

    // Is input equal to keyword?
    const matchKeyword = matchedScripture.keyword.trim().toLowerCase() === cleanedAnswer.toLowerCase();
    const matchRawKeyword = matchedScripture.originalKeyword.trim().toLowerCase() === cleanedAnswer.toLowerCase();

    if (matchKeyword || matchRawKeyword) {
      setIsUnlocked(true);
      setIsFinalCodeShown(true);
      setAnswerError(null);

      // System notification to trigger wise Shaman chatbot interpretation
      const unlockedPrompt = `Ancient gate code "${matchedScripture.code}" decrypted successfully with answer "${matchedScripture.keyword}"!`;
      onSendMessage(unlockedPrompt);
    } else {
      setAnswerError("INCORRECT! The tribal key failed to resonate. Please try again.");
    }
  };

  // Chat message submission
  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;
    onSendMessage(inputText);
    setInputText('');
  };

  // Quick reset to code-search to try another
  const handleResetSearch = () => {
    setEnteredCode('');
    setMatchedScripture(null);
    setEnteredAnswer('');
    setAnswerError(null);
    setIsUnlocked(false);
    setIsFinalCodeShown(false);
    setCopied(false);
    setCodeError(null);
  };

  const sampleQuestions = [
    { text: "What is my animal totem today?", icon: Feather },
    { text: "How do I reconcile with a restless mind?", icon: Flame },
    { text: "Whisper active winds to guide my decisions.", icon: Sparkles },
  ];

  return (
    <div 
      className="flex flex-col h-full bg-[#12100e] border border-[#2b211a] rounded-2xl shadow-2xl relative overflow-hidden"
      id="kinettix-code-reactor"
    >
      {/* Topmost Glow Accent Line */}
      <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-amber-600 via-orange-500 to-amber-700 z-10" />

      {/* Header Bar */}
      <div className="p-4 border-b border-[#2b211a]/80 bg-[#1a1410] flex items-center justify-between shrink-0 select-none z-10">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="shrink-0">
            <svg className="w-9 h-9 drop-shadow-[0_0_8px_rgba(245,158,11,0.2)]" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M 12 4 L 38 4 L 64 49 L 38 96 L 12 96 L 38 49 Z" fill="#2EA6EB" />
              <polygon points="56,4 93,4 69,45 43,26" fill="#89D027" />
              <polygon points="43,72 69,53 93,96 56,96" fill="#F7941D" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <h2 className="font-display font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-emerald-400 to-amber-400 text-lg leading-tight">
                KINETTIX CODE
              </h2>
              {isUnlocked && (
                <span className="text-[7.5px] font-mono bg-emerald-950/80 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.5 rounded-full font-black animate-pulse">
                  VERIFIED
                </span>
              )}
            </div>
          </div>
        </div>

      </div>


      {/* Main Flow View Router */}
      <div className="flex-1 overflow-y-auto flex flex-col min-h-0 bg-[#0c0907]">
        <AnimatePresence mode="wait">
          
          {/* STEP 1: LOAD SCREEN - VERIFY SACRED CODE */}
          {!matchedScripture && (
            <motion.div
              key="step-code-entry"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.22 }}
              className="flex-1 flex flex-col justify-between p-6 space-y-6"
            >
              {/* Decorative branding/welcome banner */}
              <div className="space-y-2 text-center pt-4">
                <div className="inline-flex p-3 rounded-2xl bg-amber-950/20 border border-amber-800/10 text-amber-500 shadow-inner">
                  <KeyRound className="w-7 h-7 animate-pulse" />
                </div>
                <h3 className="font-display text-base font-black text-amber-100 uppercase tracking-widest">
                  Kinettix Portal Gate
                </h3>
                <p className="text-stone-500 font-sans text-xs max-w-sm mx-auto leading-relaxed">
                  Decipher the cryptographic frequencies of the tribe spirit shaman.
                </p>
              </div>

              {/* Main Code Verification Form */}
              <form 
                onSubmit={handleVerifyCode} 
                className="w-full max-w-sm mx-auto p-5 bg-[#14100c] border border-amber-900/15 rounded-2xl shadow-xl space-y-4"
                id="verify-code-form"
              >
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-[#d69f68] uppercase tracking-widest font-black block">
                    ENTER GATE REVELATION CODE
                  </label>
                  <p className="text-[9px] text-stone-500 font-sans leading-none pb-1.5">
                    Verify against the decrypted matrix
                  </p>
                  <input
                    type="text"
                    value={enteredCode}
                    onChange={(e) => {
                      setEnteredCode(e.target.value);
                      setCodeError(null);
                    }}
                    placeholder="e.g. Decrypted code"
                    className="w-full bg-black/60 border border-amber-800/30 rounded-xl px-4 py-3 text-sm text-amber-100 placeholder-stone-700 font-mono focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/25 transition-all text-center uppercase shadow-inner"
                    id="gate-code-input"
                  />
                </div>

                {codeError && (
                  <div className="p-3 bg-red-950/20 border border-red-500/25 rounded-xl text-[10.5px] font-mono text-red-400 leading-tight flex items-start gap-2 shadow-md">
                    <ShieldAlert className="w-4 h-4 text-red-500 shrink-0 mt-0.5 animate-pulse" />
                    <span>{codeError}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={scripturesLoading}
                  className="w-full py-3 bg-gradient-to-r from-amber-700 to-amber-900 border border-amber-600/30 hover:border-amber-400 text-amber-100 hover:text-white text-xs font-mono font-bold uppercase tracking-widest rounded-xl shadow-lg hover:shadow-amber-500/10 cursor-pointer transition-all duration-200 flex items-center justify-center gap-2"
                  id="submit-code-btn"
                >
                  {scripturesLoading ? (
                    <RefreshCw className="w-3.5 h-3.5 text-amber-400 animate-spin" />
                  ) : (
                    <Unlock className="w-3.5 h-3.5" />
                  )}
                  <span>INITIATE GATEWAY SYNC</span>
                </button>
              </form>

              {/* API Signals Node Drawer (so user knows what codes are valid) */}
              <div className="w-full max-w-sm mx-auto bg-black/35 rounded-xl border border-[#2b211a]/40 p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <RefreshCw className="w-3 h-3 animate-spin text-amber-600" />
                    </div>
                  <span className="text-[7.5px] font-mono text-stone-600">
                    {scripturesLoading ? "Syncing..." : `${scriptures.length} Active Nodes`}
                  </span>
                </div>

                {scripturesError && (
                  <div className="p-2 bg-red-950/25 rounded border border-red-500/20 text-[9px] font-mono text-red-400">
                    ⚠️ Link error: {scripturesError}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* STEP 2: SHOW QUESTION & ANSWER TEXT FIELD */}
          {matchedScripture && !isUnlocked && (
            <motion.div
              key="step-answer-question"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.2 }}
              className="flex-1 flex flex-col justify-between p-4 space-y-4"
            >
              {/* Question text placed directly on the page layout, occupying ~48% height to meet screen size requirements */}
              <div 
                className="w-full shrink-0 min-h-[48vh] h-[48vh] max-h-[50vh] flex items-center justify-center select-none overflow-y-auto no-scrollbar"
                id="giant-question-text-wrapper"
              >
                <div className="w-full max-h-full overflow-y-auto no-scrollbar py-3">
                  <p 
                    className={`font-sans font-extrabold italic text-amber-100/95 leading-relaxed tracking-wide text-center px-4 select-text selection:bg-amber-900/50 transition-all duration-300 ${
                      matchedScripture.text.length > 130
                        ? "text-[clamp(1.0rem,3.8vw,1.6rem)] md:text-[clamp(1.1rem,2.8vh,1.9rem)]"
                        : matchedScripture.text.length > 70
                        ? "text-[clamp(1.1rem,4.5vw,1.9rem)] md:text-[clamp(1.3rem,3.3vh,2.3rem)]"
                        : "text-[clamp(1.2rem,5.5vw,2.3rem)] md:text-[clamp(1.4rem,4vh,2.6rem)]"
                    }`}
                  >
                    &ldquo;{matchedScripture.text}&rdquo;
                  </p>
                </div>
              </div>

              {/* Answer submission form */}
              <form 
                onSubmit={handleVerifyAnswer}
                className="w-full max-w-sm mx-auto p-4 bg-[#14100c] border border-amber-900/15 rounded-2xl shadow-xl space-y-3 shrink-0"
                id="verify-answer-form"
              >
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-[9.5px] font-mono text-[#d69f68] uppercase tracking-widest font-black">
                      ENTER YOUR ANSWER
                    </label>
                  </div>
                  <input
                    type="text"
                    value={enteredAnswer}
                    onChange={(e) => {
                      setEnteredAnswer(e.target.value);
                      setAnswerError(null);
                    }}
                    placeholder="Enter keyword answer..."
                    className="w-full bg-black/60 border border-amber-800/30 rounded-xl px-4 py-2.5 text-xs text-amber-200 placeholder-stone-700 font-mono focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/25 transition-all text-center tracking-widest capitalize shadow-inner"
                    id="clue-answer-input"
                  />
                </div>

                {answerError && (
                  <div className="p-2.5 bg-red-950/25 border border-red-500/20 rounded-lg text-[9.5px] font-mono text-red-400 font-medium">
                    ⚠️ {answerError}
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-emerald-700 to-emerald-900 hover:from-emerald-600 hover:to-emerald-800 border border-emerald-600/30 text-emerald-100 hover:text-white text-xs font-mono font-semibold uppercase tracking-widest py-2.5 rounded-xl cursor-pointer shadow-md transition-all"
                  id="decrypt-submit-btn"
                >
                  DECRYPT REVELATION
                </button>
              </form>
            </motion.div>
          )}

          {/* STEP 3: NEW PAGE SHOWING DETAILED FINAL CODE FIELD */}
          {isUnlocked && matchedScripture && isFinalCodeShown && (
            <motion.div
              key="step-final-code-screen"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="flex-1 flex flex-col justify-center items-center p-6 space-y-8 relative overflow-hidden h-full min-h-[450px]"
            >
              {/* Celebration Floating Graphics */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
                {/* Fire light base glow (bonfire reflection) */}
                <div className="absolute bottom-0 inset-x-0 h-48 bg-gradient-to-t from-orange-950/40 via-red-950/15 to-transparent blur-3xl opacity-80" />
                <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-80 h-32 bg-amber-500/10 rounded-full blur-3xl animate-pulse" />

                {celebrationParticles.map((p) => (
                  <motion.div
                    key={p.id}
                    initial={{ y: "10px", opacity: 0, scale: 0 }}
                    animate={{
                      y: ["10px", "-480px"],
                      opacity: [0, 1, 0.8, 0.3, 0],
                      scale: [0.3, 1.3, 1.1, 0.5, 0],
                      x: [0, p.sway, -p.sway, p.sway / 2]
                    }}
                    transition={{
                      duration: p.duration,
                      repeat: Infinity,
                      delay: p.delay,
                      ease: "linear"
                    }}
                    className={`absolute rounded-full pointer-events-none ${p.className}`}
                    style={{
                      width: `${p.size}px`,
                      height: `${p.size}px`,
                      bottom: 0,
                      left: `${p.left}%`
                    }}
                  />
                ))}
              </div>

              {/* Top Banner and success indicator */}
              <div className="space-y-3 text-center pt-2 z-10">
                <div className="inline-flex p-3 rounded-full bg-emerald-950/45 border border-emerald-500/25 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.15)] animate-pulse">
                  <Check className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="font-display text-lg font-black text-emerald-400 uppercase tracking-widest">
                    DECRYPTION SUCCESSFUL
                  </h3>
                  <p className="text-stone-400 font-sans text-xs max-w-sm mx-auto leading-relaxed mt-1">
                    You have unlocked the ultimate frequency. The ancient tribal gate has swung open.
                  </p>
                </div>
              </div>

              {/* Final Code Card */}
              <div className="w-full max-w-sm mx-auto p-6 bg-[#16120f]/95 border border-amber-500/10 rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.6)] relative overflow-hidden flex flex-col items-center space-y-4 z-10">
                <div className="absolute top-0 right-0 p-2 text-[8px] font-mono text-amber-500/20 uppercase tracking-wider select-none">
                  SECURE SECRETS NODE
                </div>
                
                {/* Visual Label */}
                <span className="text-[10px] font-mono text-[#d69f68] uppercase tracking-widest font-black leading-none mt-2">
                  FINAL DECRYPTED CODE
                </span>

                {/* Highly Stylized Display Container for finalcode */}
                <div className="w-full py-4 px-5 bg-black/75 border border-emerald-500/20 rounded-xl text-center relative group min-h-[64px] flex items-center justify-center shadow-inner">
                  <span className="font-mono font-extrabold text-[#5cc78f] text-xl tracking-wider select-all">
                    {matchedScripture.finalcode || "N/A"}
                  </span>
                </div>

                {/* Click to Copy Control */}
                <button
                  type="button"
                  onClick={() => {
                    const code = matchedScripture.finalcode || "";
                    if (code) {
                      navigator.clipboard.writeText(code);
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    }
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase transition-all flex items-center gap-2 cursor-pointer ${
                    copied 
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/40' 
                      : 'bg-[#211610] hover:bg-[#342217] text-amber-300 hover:text-amber-100 border border-amber-900/40 hover:border-amber-500/40 shadow-sm'
                  }`}
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                      <span>COPIED TO SPELLBOOK!</span>
                    </>
                  ) : (
                    <>
                      <Scroll className="w-3.5 h-3.5 text-amber-500" />
                      <span>COPY FINAL CODE</span>
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 4: SUCCESS STATE + UNLOCKED SACRED CONSOLE / SHAMAN CHAT */}
          {isUnlocked && matchedScripture && !isFinalCodeShown && (
            <motion.div
              key="step-unlocked-state"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="flex-1 flex flex-col min-h-0"
            >
              
              {/* Successfully Unlocked Banner Block */}
              <div className="px-4 py-3 bg-[#131b14] border-b border-emerald-800/20 select-none shrink-0 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30 text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5 animate-bounce" />
                  </div>
                  <div>
                    <h4 className="text-[10px] font-mono text-emerald-400 font-black uppercase tracking-widest font-bold">
                      TRIBAL REVELATION DECODED
                    </h4>
                    <p className="text-[8px] text-stone-500 font-sans leading-none">
                      Active synchronized link with Naaji established successfully
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsFinalCodeShown(true)}
                    className="px-2 py-0.5 bg-emerald-950/40 hover:bg-[#162719] border border-emerald-500/25 text-[8.5px] font-mono text-emerald-400 rounded transition-all uppercase tracking-wider cursor-pointer"
                  >
                    FINAL CODE
                  </button>
                  <div className="px-2 py-0.5 bg-zinc-950 font-mono text-[9px] text-[#5cc78f] border border-emerald-800/25 rounded">
                    KEY: {matchedScripture.keyword.toUpperCase()}
                  </div>
                </div>
              </div>

              {/* Messages Chat Screen */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
                {messages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                    <div className="w-16 h-16 rounded-full border border-dashed border-[#543b2a] flex items-center justify-center text-amber-500/40 animate-pulse">
                      <Sparkles className="w-8 h-8" />
                    </div>
                    <div>
                      <p className="font-display text-sm text-stone-300 font-semibold">The fire pits burn quiet...</p>
                      <p className="text-xs text-stone-500 mt-1 max-w-xs font-sans leading-relaxed">
                        Step into the circle. Whisper your query or ask the interpreter about your fate.
                      </p>
                    </div>
                  </div>
                ) : (
                  messages.map((msg) => {
                    const isModel = msg.role === 'model';
                    return (
                      <div
                        key={msg.id}
                        className={`flex gap-3 max-w-[90%] ${isModel ? 'self-start mr-auto' : 'self-end ml-auto flex-row-reverse'}`}
                        id={`message-bubble-${msg.id}`}
                      >
                        {/* Avatar */}
                        <div className={`p-2 rounded-full shrink-0 border h-9 w-9 flex items-center justify-center ${
                          isModel 
                            ? 'bg-[#211610] text-amber-400 border-amber-600/30 shadow-inner' 
                            : 'bg-[#2a2622] text-stone-300 border-stone-600/30'
                        }`}>
                          {isModel ? <Feather className="w-4 h-4" /> : <User className="w-4 h-4" />}
                        </div>

                        {/* Speech Bubble */}
                        <div className={`p-3.5 rounded-2xl relative ${
                          isModel
                            ? 'bg-[#181411] border border-[#2b211a] text-stone-300 rounded-tl-sm shadow-md'
                            : 'bg-[#291f17] border border-[#443326] text-amber-100 rounded-tr-sm shadow-md'
                        }`}>
                          <p className="text-xs font-sans leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                          <span className="text-[8px] font-mono text-stone-600 mt-1.5 block text-right select-none">
                            {msg.timestamp}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}

                {error && (
                  <div className="p-3 bg-red-950/20 border border-red-500/20 text-red-400 text-[11px] rounded-xl flex items-start gap-2 max-w-[90%] self-start animate-fade-in">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold">Spirit Matrix Interrupted</p>
                      <p className="text-red-400/80 mt-0.5 text-[10px]">{error}</p>
                    </div>
                  </div>
                )}

                {isLoading && (
                  <div className="flex gap-3 self-start mr-auto animate-pulse">
                    <div className="p-2 rounded-full bg-[#211610] border border-amber-600/20 text-amber-500/60 h-9 w-9 flex items-center justify-center">
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    </div>
                    <div className="p-3 bg-[#181411] border border-[#2b211a] text-stone-500 rounded-2xl rounded-tl-sm text-[11px] italic flex items-center gap-2">
                      <span className="flex items-center gap-1">
                        <span className="w-1 h-1 rounded-full bg-amber-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-1 h-1 rounded-full bg-amber-500 animate-bounce" style={{ animationDelay: '200ms' }} />
                        <span className="w-1 h-1 rounded-full bg-amber-500 animate-bounce" style={{ animationDelay: '400ms' }} />
                      </span>
                      <span>The Shaman deciphers the smoke trail...</span>
                    </div>
                  </div>
                )}
                <div ref={chatBottomRef} />
              </div>

              {/* Chat Send Form */}
              <form 
                onSubmit={handleChatSubmit} 
                className="p-3 border-t border-[#2b211a] bg-[#1a1410] flex gap-2 items-center shrink-0 z-10" 
                id="unlocked-oracle-chat-form"
              >
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Ask Tribal gods about this scripture..."
                  className="flex-1 bg-[#100c09] border border-[#2b211a]/85 rounded-xl px-3.5 py-2.5 text-xs text-stone-200 placeholder-stone-600 focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600/20 transition-all font-sans"
                  disabled={isLoading}
                  id="unlocked-text-chat-field"
                />
                <button
                  type="submit"
                  className="p-2.5 rounded-xl bg-gradient-to-br from-amber-700 to-amber-900 border border-amber-600/30 text-amber-100 hover:text-white hover:from-amber-600 hover:to-amber-800 disabled:opacity-40 disabled:cursor-not-allowed shadow-md transition-all cursor-pointer"
                  disabled={!inputText.trim() || isLoading}
                  id="unlocked-chat-send-btn"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

    </div>
  );
}

