/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Flame, Compass, HelpCircle, Heart, Star, Sparkles, MessageSquare, 
  Feather, Scroll, Wifi, Battery, BookOpen, Clock, RefreshCw, KeyRound, Check, Laptop, Smartphone,
  Menu, X, Lock
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

// Client-side decryption helper in case application is deployed statically (e.g. Vercel) without Express proxy
function decryptKinettix(base64Str: string, key: string = "Kinettix"): string {
  try {
    const decoded = atob(base64Str);
    let dec = '';
    for (let i = 0; i < decoded.length; i++) {
      const charCode = decoded.charCodeAt(i) ^ key.charCodeAt(i % key.length);
      dec += String.fromCharCode(charCode);
    }
    return dec;
  } catch (error) {
    console.error("Client decryption error:", error);
    return "Decryption Failed";
  }
}

export default function App() {
  // Generate stable small floating image particles for general global background
  const globalImageParticles = useMemo(() => {
    const imagesList = [
      '/assets/guardians.png',
      '/assets/keepers.png',
      '/assets/pathfinders.png',
      '/assets/raiders.png',
      '/assets/stormbreakers.png',
      '/assets/voyagers.png'
    ];

    return Array.from({ length: 18 }).map((_, i) => {
      const imgPath = imagesList[i % imagesList.length];
      const size = Math.floor(Math.random() * 8) + 10; // 10px to 18px (extremely small)
      return {
        id: `global-img-part-${i}`,
        src: imgPath,
        size,
        duration: Math.random() * 10 + 15, // 15s to 25s (subtle, non-distracting)
        delay: Math.random() * 12, // staggered starts
        left: Math.random() * 100, // random start horizontal %
        swayX: Math.random() * 40 - 20, // sway factor
        opacity: Math.random() * 0.12 + 0.12 // extremely low opacity (0.12 to 0.24) so it's transparent and readable
      };
    });
  }, []);

  // Generate stable fire embers/flames simulating a bonfire burning bottom to top
  const stableFireParticles = useMemo(() => {
    return Array.from({ length: 28 }).map((_, i) => {
      const size = Math.floor(Math.random() * 60) + 50; // 50px to 110px for glowing embers/flames
      const left = Math.random() * 105 - 2.5; // span across screen
      const duration = Math.random() * 3.5 + 2.5; // 2.5s to 6s
      const delay = Math.random() * 5;
      const sway = Math.random() * 80 - 40;
      const opacity = Math.random() * 0.14 + 0.12; // warm subtle glow
      
      const colors = [
        'rgba(239, 68, 68, 0.4)',   // red
        'rgba(249, 115, 22, 0.5)',  // orange
        'rgba(245, 158, 11, 0.45)', // amber
        'rgba(251, 146, 60, 0.4)',  // light orange
        'rgba(253, 224, 71, 0.3)'   // yellow
      ];
      const glowColor = colors[i % colors.length];

      return {
        id: `fire-ember-${i}`,
        size,
        left,
        duration,
        delay,
        sway,
        opacity,
        glowColor
      };
    });
  }, []);

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

  // Fetch decrypted Google Apps Script data (made standalone to call from retry actions)
  const fetchDecryptedData = async () => {
    setScripturesLoading(true);
    setScripturesError(null);
    try {
      let success = false;
      let data: any = null;

      // Try proxy Express backend first
      try {
        const response = await fetch('/api/oracle/sacred-data');
        if (response.ok) {
          const parsed = await response.json();
          if (parsed.success && Array.isArray(parsed.data)) {
            data = parsed.data;
            success = true;
          }
        }
      } catch (expressErr) {
        console.warn("Express backend /api/oracle/sacred-data was not reachable. Statically deployed?", expressErr);
      }

      // If proxy failed, perform Direct Client-Side Fetch & Decryption fallback
      if (!success) {
        console.log("Activating direct client-side path fallback for static hosting compatibility...");
        const targetUrl = "https://script.google.com/macros/s/AKfycbwq1-0-ctmpRuUMvjiqXXTIZjVSqMNXlH46plW33OkC7NT5WpClYg64Mnmd8IWkfTco/exec";
        const directResponse = await fetch(targetUrl);
        if (!directResponse.ok) {
          throw new Error(`Direct connection to Google Apps Script failed: HTTP ${directResponse.status}`);
        }
        const rows = await directResponse.json();
        if (!Array.isArray(rows)) {
          throw new Error("Invalid structure returned from Google Apps Script.");
        }

        data = rows.map((row: any) => {
          const textDec = row.text ? decryptKinettix(row.text) : "";
          const keywordDec = row.keyword ? decryptKinettix(row.keyword) : "";
          const codeDec = row.code ? decryptKinettix(row.code) : "";
          const finalcodeDec = row.finalcode ? decryptKinettix(row.finalcode) : "";
          const enabled = row.enabled !== false && row.enabled !== "FALSE" && row.enabled !== "false" && row.enabled !== 0 && row.enabled !== "0";

          return {
            originalText: row.text,
            originalKeyword: row.keyword,
            originalCode: row.code,
            originalFinalCode: row.finalcode || "",
            text: textDec,
            keyword: keywordDec,
            code: codeDec,
            finalcode: finalcodeDec,
            enabled
          };
        });
        success = true;
      }

      if (success && data) {
        setScriptures(data);
      } else {
        throw new Error("Unable to read scriptures via Express proxy or direct client connection.");
      }
    } catch (err: any) {
      console.error("Failed to load scriptures:", err);
      setScripturesError(err.message || "Failed to communicate with spiritual Apps Script node.");
    } finally {
      setScripturesLoading(false);
    }
  };

  useEffect(() => {
    setSystemTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    fetchDecryptedData();
  }, []);

  // Compute if the portal is closed based on spreadsheet API status
  const isPortalGateClosed = useMemo(() => {
    if (scripturesLoading) return false;
    if (scriptures.length === 0) return false; // don't block yet if scriptures haven't loaded
    // Check if first row is explicitly disabled or if all rows are disabled
    return scriptures[0]?.enabled === false || scriptures.every(s => !s.enabled);
  }, [scriptures, scripturesLoading]);

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
      let isExpressChatOk = false;
      let replyText = "";

      try {
        const response = await fetch('/api/oracle/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: updatedMessages }),
        });

        if (response.ok) {
          const data = await response.json();
          replyText = data.text;
          isExpressChatOk = true;
        }
      } catch (expressChatErr) {
        console.warn("Express backend chatbot was not reachable. Statically deployed?", expressChatErr);
      }

      if (!isExpressChatOk) {
        // Premium contextual offline/static chatbot response fallback
        const lastUserMsg = text.toLowerCase();
        if (lastUserMsg.includes("wolf") || lastUserMsg.includes("stalker")) {
          replyText = "The spirit of the Ember Stalker Wolf walks in your shadow, seeker. Its flaming tracks illuminate the deep and overgrown trails of your mind. Keep your senses sharp, for wisdom is hunted with patience.";
        } else if (lastUserMsg.includes("bear") || lastUserMsg.includes("dweller")) {
          replyText = "The spirit of the Cave Dweller Bear calls you to quiet shelter and deep inner healing. Calm your thoughts, for the skeleton of your soul grows strong only when the mind surrenders to peaceful solitude.";
        } else if (lastUserMsg.includes("eagle") || lastUserMsg.includes("visionary") || lastUserMsg.includes("feather")) {
          replyText = "The master of safe winds, the Sky Visionary Eagle, lends you her high wings. The heavy storms of today are but tiny lines of water from above. Rise with courage, and claim clarity.";
        } else if (lastUserMsg.includes("bison") || lastUserMsg.includes("provider")) {
          replyText = "The Plains Provider Bison anchors your feet to the fertile river valleys of our clan. Trust in the steady rhythm of the soil and the collective warmth of the embers. Abundance will sustain you.";
        } else if (lastUserMsg.includes("card") || lastUserMsg.includes("runic") || lastUserMsg.includes("tarot")) {
          replyText = "The obsidian stone and runic card hum with ancient energy. The elements ask you to surrender dead weight. Let the old dry branches feed the fire today, so new wild roots may shoot.";
        } else if (lastUserMsg.includes("scroll") || lastUserMsg.includes("deciphered")) {
          replyText = "My kindred seeker, you have successfully unlocked a sacred scripture. Its dynamic frequency whispers directly to our crackling Oak fire. Keep executing your daily rituals to ground this destiny.";
        } else {
          const fallbacks = [
            "The oak fire crackles softly. The ancestors whisper that you should look deep within the quiet wood, where all answers wait.",
            "Like the wild river that contours around the granite slabs, you must bend instead of breaking. Seek the open path of least resistance.",
            "The owl calls from the dark pine branches, reminding us that wisdom is not found in loud voices, but in silent waiting.",
            "Allow the smoke of the sacred hearth to carry your burdens into the endless sky. You are grounded, and you are protected."
          ];
          replyText = fallbacks[Math.floor(Math.random() * fallbacks.length)];
        }
      }

      const modelMsg: Message = {
        id: `model-${Date.now()}`,
        role: 'model',
        content: replyText,
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

  if (scripturesLoading) {
    return (
      <div className="h-screen w-full bg-[#080605] text-[#d6c9c2] antialiased font-sans relative overflow-hidden flex flex-col justify-center items-center">
        {/* Ambient warm orange/deep red smoke glow */}
        <div className="absolute top-[20%] left-[-10%] w-[50%] h-[50%] bg-[#401d0d]/15 rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute bottom-[20%] right-[-10%] w-[50%] h-[50%] bg-[#361c0c]/20 rounded-full blur-[150px] pointer-events-none" />

        {/* Dynamic Bonfire Flame & Smoke Simulation (bottom to top) */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
          {/* Flame Base Glow */}
          <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-amber-950/30 via-[#120b08]/20 to-transparent blur-xl pointer-events-none" />
          
          {/* Smooth billowing fire/heat masses */}
          {stableFireParticles.map((ember) => (
            <motion.div
              key={`loader-fire-${ember.id}`}
              initial={{ y: "15vh", x: 0, opacity: 0, scale: 0.2 }}
              animate={{
                y: ["15vh", "-115vh"],
                opacity: [0, ember.opacity, ember.opacity * 0.9, ember.opacity * 0.25, 0],
                scale: [0.3, 1.1, 0.9, 0.4, 0.1],
                x: [0, ember.sway, -ember.sway / 2, ember.sway * 0.8]
              }}
              transition={{
                duration: ember.duration,
                repeat: Infinity,
                delay: ember.delay,
                ease: "linear"
              }}
              className="absolute rounded-full blur-2xl pointer-events-none mix-blend-screen"
              style={{
                width: `${ember.size}px`,
                height: `${ember.size * 1.4}px`,
                bottom: 0,
                left: `${ember.left}%`,
                background: `radial-gradient(circle, ${ember.glowColor} 0%, rgba(0,0,0,0) 70%)`
              }}
            />
          ))}

          {/* Crackling crisp sparks shooting upwards rapidly */}
          {Array.from({ length: 28 }).map((_, i) => {
            const size = Math.floor(Math.random() * 4) + 2.5; // 2.5px to 6.5px crisp dots
            const startLeft = Math.random() * 100;
            const delay = Math.random() * 6;
            const duration = Math.random() * 2.8 + 1.8; // speedy
            const sway = Math.random() * 120 - 60;
            return (
              <motion.div
                key={`spark-ember-loader-${i}`}
                initial={{ y: "10vh", x: 0, opacity: 0 }}
                animate={{
                  y: ["10vh", "-110vh"],
                  opacity: [0, 1, 0.9, 0],
                  scale: [0.3, 1.2, 0.4],
                  x: [0, sway, -sway * 0.5]
                }}
                transition={{
                  duration,
                  repeat: Infinity,
                  delay,
                  ease: "easeInOut"
                }}
                className="absolute rounded-full bg-gradient-to-t from-amber-400 via-orange-500 to-yellow-200 shadow-[0_0_8px_#f59e0b] pointer-events-none"
                style={{
                  width: `${size}px`,
                  height: `${size}px`,
                  bottom: 0,
                  left: `${startLeft}%`
                }}
              />
            );
          })}
        </div>

        {/* Floating background particles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-10">
          {globalImageParticles?.slice(0, 8).map((img) => (
            <motion.img
              key={`loader-part-${img.id}`}
              src={img.src}
              alt="loading decor particle"
              referrerPolicy="no-referrer"
              initial={{ y: "110%", opacity: 0, scale: 0.1 }}
              animate={{
                y: ["110%", "-10%"],
                opacity: [0, img.opacity * 0.8, img.opacity * 0.8, 0],
                scale: [0.5, 1, 0.5],
                x: [0, img.swayX, -img.swayX],
                rotate: [0, 360]
              }}
              transition={{
                duration: img.duration * 0.8,
                repeat: Infinity,
                delay: img.delay * 0.5,
                ease: "linear"
              }}
              className="absolute pointer-events-none select-none z-10 object-contain filter grayscale border-transparent"
              style={{
                width: `${img.size}px`,
                height: `${img.size}px`,
                bottom: 0,
                left: `${img.left}%`
              }}
            />
          ))}
        </div>

        {/* Central Card */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="z-10 text-center space-y-6 max-w-sm px-6 py-8 rounded-2xl bg-[#110d0b] border border-[#231a14] shadow-2xl relative mx-4"
        >
          {/* Pulsing Ember */}
          <div className="relative mx-auto w-16 h-16 flex items-center justify-center bg-amber-950/20 border border-amber-500/10 rounded-full">
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
              className="absolute inset-[2px] rounded-full border-t border-r border-amber-500/40 border-l-transparent border-b-transparent"
            />
            
            <img 
              src="/assets/Asset_1.png" 
              alt="Asset Logo" 
              className="w-10 h-10 object-contain drop-shadow-[0_0_8px_rgba(245,158,11,0.4)] animate-pulse" 
              referrerPolicy="no-referrer"
            />
          </div>

          <div className="space-y-2">
            <h2 className="font-display font-black text-amber-100 uppercase tracking-widest text-sm">
              Communing with Ancestors
            </h2>
            <p className="text-stone-500 font-mono text-[9px] tracking-widest uppercase">
              Aligning Portal Gate Frequencies
            </p>
          </div>

          <div className="flex gap-1 justify-center items-center">
            <span className="w-1 h-1 rounded-full bg-amber-500 animate-[pulse_1s_infinite_100ms]" />
            <span className="w-1 h-1 rounded-full bg-amber-500 animate-[pulse_1s_infinite_300ms]" />
            <span className="w-1 h-1 rounded-full bg-amber-500 animate-[pulse_1s_infinite_500ms]" />
          </div>

          <div className="pt-2 text-[9px] font-mono text-amber-700/60 leading-normal uppercase">
            Syncing decoded G-Sheets scroll network...
          </div>
        </motion.div>
      </div>
    );
  }

  if (isPortalGateClosed) {
    return (
      <div className="h-screen w-full bg-[#080605] text-[#d6c9c2] antialiased font-sans relative overflow-hidden flex flex-col justify-center items-center">
        {/* Ambient warm orange/deep red smoke glow */}
        <div className="absolute top-[20%] left-[-10%] w-[50%] h-[50%] bg-red-950/15 rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute bottom-[20%] right-[-10%] w-[50%] h-[50%] bg-orange-950/10 rounded-full blur-[150px] pointer-events-none" />

        {/* Dynamic Bonfire Flame & Smoke Simulation (bottom to top) */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
          {/* Flame Base Glow */}
          <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-red-950/50 via-[#120b08]/30 to-transparent blur-xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/4 right-1/4 h-36 bg-gradient-to-t from-orange-600/15 via-transparent to-transparent blur-2xl pointer-events-none" />

          {/* Smooth billowing fire/heat masses */}
          {stableFireParticles.map((ember) => (
            <motion.div
              key={ember.id}
              initial={{ y: "15vh", x: 0, opacity: 0, scale: 0.2 }}
              animate={{
                y: ["15vh", "-115vh"],
                opacity: [0, ember.opacity, ember.opacity * 0.9, ember.opacity * 0.25, 0],
                scale: [0.3, 1.1, 0.9, 0.4, 0.1],
                x: [0, ember.sway, -ember.sway / 2, ember.sway * 0.8]
              }}
              transition={{
                duration: ember.duration,
                repeat: Infinity,
                delay: ember.delay,
                ease: "linear"
              }}
              className="absolute rounded-full blur-2xl pointer-events-none mix-blend-screen"
              style={{
                width: `${ember.size}px`,
                height: `${ember.size * 1.4}px`,
                bottom: 0,
                left: `${ember.left}%`,
                background: `radial-gradient(circle, ${ember.glowColor} 0%, rgba(0,0,0,0) 70%)`
              }}
            />
          ))}

          {/* Crackling crisp sparks shooting upwards rapidly */}
          {Array.from({ length: 28 }).map((_, i) => {
            const size = Math.floor(Math.random() * 4) + 2.5; // 2.5px to 6.5px crisp dots
            const startLeft = Math.random() * 100;
            const delay = Math.random() * 6;
            const duration = Math.random() * 2.8 + 1.8; // speedy
            const sway = Math.random() * 120 - 60;
            return (
              <motion.div
                key={`spark-ember-closed-${i}`}
                initial={{ y: "10vh", x: 0, opacity: 0 }}
                animate={{
                  y: ["10vh", "-110vh"],
                  opacity: [0, 1, 0.9, 0],
                  scale: [0.3, 1.2, 0.4],
                  x: [0, sway, -sway * 0.5]
                }}
                transition={{
                  duration,
                  repeat: Infinity,
                  delay,
                  ease: "easeInOut"
                }}
                className="absolute rounded-full bg-gradient-to-t from-amber-400 via-orange-500 to-yellow-200 shadow-[0_0_8px_#f59e0b] pointer-events-none"
                style={{
                  width: `${size}px`,
                  height: `${size}px`,
                  bottom: 0,
                  left: `${startLeft}%`
                }}
              />
            );
          })}
        </div>

        {/* Global floating background elements (mystical gray totems) */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
          {globalImageParticles?.slice(0, 8).map((img) => (
            <motion.img
              key={`closed-part-${img.id}`}
              src={img.src}
              alt="closed asset decor particle"
              referrerPolicy="no-referrer"
              initial={{ y: "110%", opacity: 0, scale: 0.1 }}
              animate={{
                y: ["110%", "-10%"],
                opacity: [0, img.opacity * 0.6, img.opacity * 0.6, 0],
                scale: [0.5, 0.9, 0.5],
                x: [0, img.swayX, -img.swayX],
                rotate: [0, 360]
              }}
              transition={{
                duration: img.duration * 1.1,
                repeat: Infinity,
                delay: img.delay * 0.4,
                ease: "linear"
              }}
              className="absolute pointer-events-none select-none z-10 object-contain filter grayscale border-transparent"
              style={{
                width: `${img.size}px`,
                height: `${img.size}px`,
                bottom: 0,
                left: `${img.left}%`
              }}
            />
          ))}
        </div>

        {/* Main interactive Closed Card wrapper */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="z-10 text-center space-y-6 max-w-sm px-6 py-8 rounded-2xl bg-[#0e0c0b]/95 border border-red-950/40 backdrop-blur-sm shadow-[0_0_50px_rgba(220,38,38,0.06)] relative mx-4"
        >
          {/* Logo / Locked Banner */}
          <div className="relative mx-auto w-16 h-16 flex items-center justify-center bg-red-950/20 border border-red-500/10 rounded-full">
            <div className="absolute inset-[2px] rounded-full border border-red-500/30 animate-pulse" />
            
            <img 
              src="/assets/Asset_1.png" 
              alt="Portal Gate Closed" 
              className="w-10 h-10 object-contain drop-shadow-[0_0_8px_rgba(239,68,68,0.4)] animate-pulse select-none pointer-events-none" 
              referrerPolicy="no-referrer"
            />
          </div>

          <div className="space-y-2">
            <h2 className="font-display font-black text-red-400 uppercase tracking-widest text-sm text-[13px]">
              Portal Gate Closed
            </h2>
            <p className="text-zinc-500 font-mono text-[9px] tracking-widest uppercase">
              Ancestral Portal Inactive
            </p>
          </div>

          <div className="h-[1px] w-24 mx-auto bg-gradient-to-r from-transparent via-red-950 to-transparent" />

          <p className="font-sans text-xs text-stone-400 leading-relaxed max-w-xs mx-auto">
            The shamans have sealed the gateway. The tribal hearth burns low, and the tribe portal node matches a dormant status from the tribal chief matrix.
          </p>
          
          <p className="font-sans text-[11px] text-[#f59e0b] italic font-semibold max-w-xs mx-auto leading-relaxed">
            &ldquo;Seek the campfire signals again once the clan leaders have unsealed the gate.&rdquo;
          </p>

          <div className="pt-4 border-t border-red-950/20">
            <p className="font-mono text-[10px] uppercase tracking-widest text-red-500 font-bold animate-pulse">
              [ Gateway Sealed ]
            </p>
            <p className="font-sans text-[11px] text-stone-400 mt-1.5 leading-relaxed">
              Please come back again once the gate has been unsealed by the leaders.
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

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
        {/* Global extremely small floating totem assets decoration */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
          {globalImageParticles.map((img) => (
            <motion.img
              key={img.id}
              src={img.src}
              alt="sacred totem global decoration"
              referrerPolicy="no-referrer"
              initial={{ y: "110%", opacity: 0, scale: 0.1 }}
              animate={{
                y: ["110%", "-10%"],
                opacity: [0, img.opacity, img.opacity, img.opacity * 0.4, 0],
                scale: [0.5, 1, 1, 0.7, 0.3],
                x: [0, img.swayX, -img.swayX, img.swayX / 2],
                rotate: [0, 180, 360]
              }}
              transition={{
                duration: img.duration,
                repeat: Infinity,
                delay: img.delay,
                ease: "linear"
              }}
              className="absolute pointer-events-none select-none z-0 object-contain"
              style={{
                width: `${img.size}px`,
                height: `${img.size}px`,
                bottom: 0,
                left: `${img.left}%`
              }}
            />
          ))}
        </div>
        
        <div className="w-full max-w-md mx-auto px-4 pt-3 pb-6 flex-1 flex flex-col min-h-0 z-10" id="view-inner-body">
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
