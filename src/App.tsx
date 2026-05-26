/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Flame, Compass, HelpCircle, Heart, Star, Sparkles, MessageSquare, 
  Feather, Scroll, Wifi, Battery, BookOpen, Clock, RefreshCw, KeyRound, Check, Laptop, Smartphone,
  Menu, X
} from 'lucide-react';
import { Message, Ritual, Totem, OracleCard, SacredScripture } from './types';
import OracleChat from './components/OracleChat';
import RitualsTracker from './components/RitualsTracker';
import TotemList from './components/TotemList';
import RunicCardDraw from './components/RunicCardDraw';

// Predefined Tribal data for fallback and extra interactive components
const INITIAL_RITUALS: Ritual[] = [
  {
    id: 'rit-1',
    title: 'Ember Fire Meditation',
    description: 'De-clutter your mind by breathing deeply alongside a crackling fire for 2 minutes.',
    category: 'spiritual',
    completed: false,
    rewardValue: 15,
  },
  {
    id: 'rit-2',
    title: 'Walk the Wild Path',
    description: 'Walk bare-ground or feel the solid raw earth, aligning yourself with local roots.',
    category: 'physical',
    completed: false,
    rewardValue: 10,
  },
  {
    id: 'rit-3',
    title: 'Offerings of Silence',
    description: 'Douse all modern technological noise for 15 minutes of ancient mental silence.',
    category: 'spiritual',
    completed: false,
    rewardValue: 20,
  },
  {
    id: 'rit-4',
    title: 'Ancestral Veneration',
    description: 'Acknowledge the wisdom of the creators is inside you; hold deep inner gratitude.',
    category: 'communal',
    completed: false,
    rewardValue: 15,
  }
];

const CLAN_TOTEMS: Totem[] = [
  {
    id: 'tot-1',
    name: 'The Ember Stalker',
    animal: 'WOLF',
    description: 'Rider of fire trails. Hunter of truth who guards pathways through heavy shadow.',
    element: 'Fire',
    blessingEffect: 'Acute perception & tracking focus',
    iconName: 'Flame',
    colorTheme: 'from-orange-600/30 to-transparent',
  },
  {
    id: 'tot-2',
    name: 'The Cave Dweller',
    animal: 'BEAR',
    description: 'Sentinel of solid ground. Seeker of peaceful solitude who heals from deepest shelter.',
    element: 'Earth',
    blessingEffect: 'Deep skeletal strength & recovery',
    iconName: 'Leaf',
    colorTheme: 'from-emerald-600/30 to-transparent',
  },
  {
    id: 'tot-3',
    name: 'The Sky Visionary',
    animal: 'EAGLE',
    description: 'Master of highest winds. Gifted messenger who sails above temporary storms.',
    element: 'Air',
    blessingEffect: 'Clarity of perspective from above',
    iconName: 'Sun',
    colorTheme: 'from-amber-600/30 to-transparent',
  },
  {
    id: 'tot-4',
    name: 'The Plains Provider',
    animal: 'BISON',
    description: 'Guardian of river valleys. Anchored soul who shares plentiful crops with the clan.',
    element: 'Water',
    blessingEffect: 'Sustained community abundance',
    iconName: 'Moon',
    colorTheme: 'from-teal-600/30 to-transparent',
  }
];

const ORACLE_CARDS: OracleCard[] = [
  {
    id: 'card-1',
    name: 'The Shamanic Drum',
    symbol: 'ᛗ',
    element: 'Spirit',
    keyword: 'Alinement',
    description: 'Sound waves linking the earthly heartbeat to the stars. A portal to invisible rhythms.',
    uprightMeaning: 'Harmonious synchronicity. Your steps are rhythmic and fully supported by ancient flows.',
    reversedMeaning: 'Discordance. Stop trying to force a tempo that does not belong to your present journey.',
  },
  {
    id: 'card-2',
    name: 'The Primal Flame',
    symbol: 'ᚦ',
    element: 'Fire',
    keyword: 'Purging',
    description: 'A burning torch that devours old dry thickets to fertile ash for new wild shoots.',
    uprightMeaning: 'Sacrifice and creation. Let go of dead weights so your vibrant light may soar.',
    reversedMeaning: 'Inward heat or smoldering anger. Cleanse the smoke before it clouds your judgment.',
  },
  {
    id: 'card-3',
    name: 'The Obsidian Runic Stone',
    symbol: 'ᚠ',
    element: 'Earth',
    keyword: 'Rooting',
    description: 'Deep volcanic glass cooling into solid anchors, guarding memories of the first mountains.',
    uprightMeaning: 'Sturdy foundations. Seek counsel from physical facts, elders, and immovable boundaries.',
    reversedMeaning: 'Stagnancy. The safety of the stone slab has become a cage. It is time to wander.',
  },
  {
    id: 'card-4',
    name: 'The High Eagle Feather',
    symbol: 'ᚱ',
    element: 'Air',
    keyword: 'Visioning',
    description: 'Shed wind-rider wing tip. A needle indicating direction and divine perspective.',
    uprightMeaning: 'Swift solutions. Rising altitude grants sudden clarity. Look at the entire landscape.',
    reversedMeaning: 'Tunnel-vision. You are hyperfocused on single sand grains; detach and seek the horizon.',
  },
  {
    id: 'card-5',
    name: 'The Riverbed Stream',
    symbol: 'ᛚ',
    element: 'Water',
    keyword: 'Flowing',
    description: 'Polished pebbles washed by glacier water. A lesson in soft yielding defeating rigid granite.',
    uprightMeaning: 'Adaptability. Let temporary obstacles divert your course naturally; do not crash against them.',
    reversedMeaning: 'Stagnation. Still water turns stagnant. Find the exit route and flow onward.',
  }
];

export default function App() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'greeting',
      role: 'model',
      content: 'Decrypting primary matrix stream... Syncing with Naaji...',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [rituals, setRituals] = useState<Ritual[]>(INITIAL_RITUALS);
  const [activeTotemId, setActiveTotemId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sparks, setSparks] = useState<{ id: number; left: string; delay: string }[]>([]);

  // Mobile navigation state
  const [activeTab, setActiveTab] = useState<'shaman' | 'cards' | 'totems' | 'rituals' | 'scrolls'>('shaman');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Apps Script state
  const [scriptures, setScriptures] = useState<SacredScripture[]>([]);
  const [scripturesLoading, setScripturesLoading] = useState(false);
  const [scripturesError, setScripturesError] = useState<string | null>(null);

  // Synchronize initial greeting message with the first row text from the Google Sheets API column
  useEffect(() => {
    if (scriptures.length > 0 && scriptures[0]?.text) {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === 'greeting'
            ? { ...msg, content: scriptures[0].text }
            : msg
        )
      );
    }
  }, [scriptures]);

  // Simulated system time indicator inside top header
  const [systemTime, setSystemTime] = useState('');

  // Fetch decrypted Google Apps Script data
  useEffect(() => {
    setSystemTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    
    const fetchDecryptedData = async () => {
      setScripturesLoading(true);
      setScripturesError(null);
      try {
        const response = await fetch('/api/oracle/sacred-data');
        if (!response.ok) {
          throw new Error(`Server returned HTTP status ${response.status}`);
        }
        const parsed = await response.json();
        if (parsed.success && Array.isArray(parsed.data)) {
          setScriptures(parsed.data);
        } else {
          throw new Error(parsed.error || "Malformed scripture packet");
        }
      } catch (err: any) {
        console.error("Failed to call decrypted scriptures API:", err);
        setScripturesError(err.message || "Failed to communicate with spiritual Apps Script node.");
      } finally {
        setScripturesLoading(false);
      }
    };

    fetchDecryptedData();
  }, []);

  // Update time periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setSystemTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  // Spark float triggering
  const handleToggleRitual = (id: string) => {
    setRituals((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          const newStatus = !r.completed;
          if (newStatus) {
            const newSparks = Array.from({ length: 8 }).map(() => ({
              id: Math.random() + Date.now(),
              left: `${Math.random() * 80 + 10}%`,
              delay: `${Math.random() * 1.5}s`,
            }));
            setSparks((sp) => [...sp, ...newSparks]);
            setTimeout(() => {
              setSparks((sp) => sp.filter((s) => !newSparks.some((ns) => ns.id === s.id)));
            }, 3500);
          }
          return { ...r, completed: newStatus };
        }
        return r;
      })
    );
  };

  const handleSendMessage = async (text: string) => {
    if (isLoading) return;

    setError(null);
    setIsLoading(true);

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);

    try {
      const response = await fetch('/api/oracle/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: updatedMessages }),
      });

      if (!response.ok) {
        throw new Error('Failed to retrieve response from Oracle.');
      }

      const data = await response.json();
      
      const modelMsg: Message = {
        id: `model-${Date.now()}`,
        role: 'model',
        content: data.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, modelMsg]);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'The spiritual link to Naaji failed to materialize.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAlignTotem = (totem: Totem) => {
    setActiveTotemId(totem.id);
    const totemPrompt = `I choose to align with the spirit of the ${totem.animal} (The ${totem.name}, elements of ${totem.element}). Cast your wise tribal blessing for my path, oh keeper Naaji!`;
    setActiveTab('shaman'); // snap back to chat to see response
    handleSendMessage(totemPrompt);
  };

  const handleInterpretCard = (card: OracleCard, isReversed: boolean) => {
    const cardPrompt = `I draw the ancient Runic tarot card: "${card.name}" (${card.symbol} - Element: ${card.element}) in the [${
      isReversed ? 'REVERSED PATH' : 'UPRIGHT PATH'
    }] orientation. Read my spiritual destiny in the crackling embers.`;
    setActiveTab('shaman'); // snap back to chat to see response
    handleSendMessage(cardPrompt);
  };

  // Whisper unique decrypted scripture directly into chat and snap tab back to Shaman
  const handleWhisperScripture = (scripture: SacredScripture) => {
    const prompt = `I deciphered a deep sacred scroll. Keyword: "${scripture.keyword}", Code: "${scripture.code}". It whispers: "${scripture.text}". Guide my steps, wise Naaji!`;
    setActiveTab('shaman');
    handleSendMessage(prompt);
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: 'greeting',
        role: 'model',
        content: 'I have doused the old embers, seeker. A fresh slate of woodsmoke rises. Whisper your heart—the ancestors listen anew.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
    setError(null);
  };

  return (
    <div className="h-screen w-full bg-[#080605] text-stone-300 antialiased font-sans relative overflow-hidden flex flex-col">
      
      {/* Floating Ember Spark Particle Layer */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
        {sparks.map((spark) => (
          <div
            key={spark.id}
            className="spark w-1.5 h-1.5 rounded-full bg-gradient-to-tr from-amber-500 to-orange-500 shadow-[0_0_10px_rgba(245,158,11,0.9)]"
            style={{
              left: spark.left,
              animationDelay: spark.delay,
              bottom: '20px',
            }}
          />
        ))}
      </div>

      {/* Atmospheric Smoke Glowing Blurs */}
      <div className="absolute top-[8%] left-[-20%] w-[60%] h-[50%] bg-[#401d0d]/10 rounded-full blur-[200px] pointer-events-none" />
      <div className="absolute bottom-[10%] right-[-15%] w-[55%] h-[45%] bg-[#361c0c]/15 rounded-full blur-[200px] pointer-events-none" />

      {/* Interactive Main Viewport Area */}
      <main className="flex-1 min-h-0 relative w-full flex flex-col bg-[#0b0807]" id="smartphone-content-viewport">
        
        <div className="w-full max-w-md mx-auto px-4 pt-3 pb-6 flex-1 flex flex-col min-h-0" id="view-inner-body">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              className="flex-1 flex flex-col min-h-0"
            >
              {activeTab === 'shaman' && (
                <div className="flex-1 min-h-0 flex flex-col">
                  <OracleChat 
                    messages={messages}
                    onSendMessage={handleSendMessage}
                    onClearChat={handleClearChat}
                    isLoading={isLoading}
                    error={error}
                    scriptures={scriptures}
                    scripturesLoading={scripturesLoading}
                    scripturesError={scripturesError}
                  />
                </div>
              )}

              {activeTab === 'cards' && (
                <div className="flex-1 overflow-y-auto pr-1 min-h-0">
                  <RunicCardDraw 
                    cards={ORACLE_CARDS} 
                    onInterpretCard={handleInterpretCard}
                    isCustomLoading={isLoading}
                  />
                </div>
              )}

              {activeTab === 'totems' && (
                <div className="flex-1 overflow-y-auto pr-1 min-h-0">
                  <TotemList 
                    totems={CLAN_TOTEMS}
                    activeTotemId={activeTotemId}
                    onAlignTotem={handleAlignTotem}
                    isCustomLoading={isLoading}
                  />
                </div>
              )}

              {activeTab === 'rituals' && (
                <div className="flex-1 overflow-y-auto pr-1 min-h-0">
                  <RitualsTracker 
                    rituals={rituals}
                    onToggleRitual={handleToggleRitual}
                  />
                </div>
              )}

              {activeTab === 'scrolls' && (
                <div className="flex-1 overflow-y-auto pr-1 min-h-0 space-y-4 pb-4 flex flex-col">
                  {/* Fetched Google Script Manuscripts tab views */}
                  <div className="text-center py-2">
                    <h2 className="font-display text-base font-extrabold text-amber-100 tracking-wider">SACRED MANUSCRIPTS</h2>
                    <p className="text-[9px] text-[#e0a471] font-mono tracking-widest uppercase">Decrypted G-Sheets Matrix</p>
                  </div>

                  {scripturesError && (
                    <div className="p-3 bg-red-950/20 border border-red-500/20 text-red-300 text-xs rounded-xl flex items-start gap-2">
                      <HelpCircle className="w-4.5 h-4.5 text-red-500 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold">Apps Script Blocked</p>
                        <p className="text-red-300/80 mt-0.5">{scripturesError}</p>
                      </div>
                    </div>
                  )}

                  {scripturesLoading ? (
                    <div className="py-20 flex flex-col items-center justify-center space-y-3">
                      <RefreshCw className="w-8 h-8 text-amber-500 animate-spin" style={{ animationDuration: '3s' }} />
                      <span className="text-[10px] text-stone-500 font-mono uppercase tracking-widest">Calling Apps Script doGet()...</span>
                    </div>
                  ) : scriptures.length === 0 && !scripturesError ? (
                    <div className="p-5 text-center text-stone-500 text-xs italic">
                      No scriptures loaded yet. Click reload below to attempt manual contact.
                    </div>
                  ) : (
                    scriptures.map((scr, idx) => {
                      return (
                        <div 
                          key={idx}
                          className={`p-4 rounded-xl border relative overflow-hidden transition-all duration-200 ${
                            scr.enabled 
                              ? 'bg-[#181310] border-[#31251c]' 
                              : 'bg-[#12100e] border-[#1d1916] opacity-60'
                          }`}
                        >
                          {/* Watermark Rune Icon */}
                          <div className="absolute right-3 top-3 text-amber-600/10 pointer-events-none text-4xl select-none font-bold">
                            ᛗ
                          </div>

                          <div className="flex items-center justify-between mb-3 text-[9px] font-mono uppercase tracking-widest leading-none select-none">
                            <span className="text-stone-500">Scroll #{idx + 1}</span>
                            <span className={`px-2 py-0.5 rounded border ${
                              scr.enabled 
                                ? 'bg-amber-600/10 border-amber-600/20 text-amber-400 font-bold' 
                                : 'bg-stone-900 border-transparent text-stone-600'
                            }`}>
                              {scr.enabled ? "ACTIVE FORCE" : "DORMANT"}
                            </span>
                          </div>

                          {/* Main Scripture Text Panel */}
                          <div className="mb-4">
                            <div className="text-[10px] font-mono text-[#8a705e] uppercase tracking-wider font-bold mb-1">
                              Decrypted Revelation:
                            </div>
                            <p className="font-sans text-xs text-stone-200 leading-relaxed font-semibold italic">
                              &ldquo;{scr.text}&rdquo;
                            </p>
                            
                            <details className="mt-2 text-[9px] font-mono text-stone-600 cursor-pointer hover:text-stone-400">
                              <summary>Show Source Base64</summary>
                              <div className="mt-1.5 p-2 bg-[#0a0806] rounded border border-zinc-900 overflow-x-auto text-[8px] space-y-1">
                                <div><span className="text-[#a1785c]">Encrypted:</span> {scr.originalText}</div>
                              </div>
                            </details>
                          </div>

                          {/* Dual Metadata Block (Keyword & Code Decrypted) */}
                          <div className="grid grid-cols-2 gap-2 bg-[#120e0a] p-2.5 rounded-lg border border-[#231a14] mb-3">
                            <div>
                              <span className="text-[8.5px] font-mono text-[#aa876e] uppercase tracking-widest block leading-none">
                                Keyword:
                              </span>
                              <span className="text-[11.5px] font-mono text-amber-500 font-bold tracking-wide">
                                {scr.keyword}
                              </span>
                              <span className="text-[7.5px] font-mono text-stone-700 block mt-0.5">
                                Src: {scr.originalKeyword}
                              </span>
                            </div>

                            <div>
                              <span className="text-[8.5px] font-mono text-[#aa876e] uppercase tracking-widest block leading-none">
                                Code:
                              </span>
                              <span className="text-[11.5px] font-mono text-[#54ae88] font-bold tracking-wide">
                                {scr.code}
                              </span>
                              <span className="text-[7.5px] font-mono text-stone-700 block mt-0.5">
                                Src: {scr.originalCode}
                              </span>
                            </div>
                          </div>

                          {/* Inquire Button */}
                          {scr.enabled && (
                            <button
                              onClick={() => handleWhisperScripture(scr)}
                              className="w-full py-2 bg-[#2d1f16] hover:bg-[#3d2e23] border border-amber-600/20 text-amber-400 text-[10px] font-mono uppercase tracking-widest font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow"
                            >
                              <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
                              Inquire with Naaji
                            </button>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

    </div>
  );
}
