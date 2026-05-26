/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, RefreshCw, Feather, Flame, HelpCircle } from 'lucide-react';
import { OracleCard } from '../types';

interface RunicCardDrawProps {
  cards: OracleCard[];
  onInterpretCard: (card: OracleCard, isReversed: boolean) => void;
  isCustomLoading: boolean;
}

export default function RunicCardDraw({ cards, onInterpretCard, isCustomLoading }: RunicCardDrawProps) {
  const [drawnCard, setDrawnCard] = useState<OracleCard | null>(null);
  const [isReversed, setIsReversed] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [hasInterpreted, setHasInterpreted] = useState(false);

  const handleDrawCard = () => {
    if (isAnimating || isCustomLoading) return;
    
    setIsAnimating(true);
    setHasInterpreted(false);
    
    // Animate a short delay for spiritual suspense
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * cards.length);
      const randomCard = cards[randomIndex];
      const randomIsReversed = Math.random() < 0.25; // 25% chance of card reversal

      setDrawnCard(randomCard);
      setIsReversed(randomIsReversed);
      setIsAnimating(false);
    }, 800);
  };

  const handleReset = () => {
    setDrawnCard(null);
    setHasInterpreted(false);
  };

  const handleSeekInterpretation = () => {
    if (!drawnCard || isCustomLoading || hasInterpreted) return;
    onInterpretCard(drawnCard, isReversed);
    setHasInterpreted(true);
  };

  return (
    <div 
      className="bg-[#12100e] border border-[#2b211a] rounded-2xl p-5 shadow-2xl flex flex-col justify-between relative overflow-hidden"
      id="runic-oracle-card-panel"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header Panel */}
      <div className="mb-5 flex justify-between items-start">
        <div>
          <h2 className="font-display text-base font-bold text-amber-100 tracking-wider">RUNIC ORACLE DECKS</h2>
          <p className="text-[10px] text-stone-500 font-mono tracking-widest uppercase">Consult Spiritual Fates</p>
        </div>

        {drawnCard && (
          <button
            onClick={handleReset}
            className="p-1 px-2.5 font-mono text-[9.5px] font-bold text-stone-500 hover:text-amber-500 hover:bg-[#1a1410] border border-[#2b211a] hover:border-amber-600/30 rounded-lg transition-all cursor-pointer flex items-center gap-1.5"
            id="reset-draw-button"
          >
            <RefreshCw className="w-3 h-3" /> SHUFFLE
          </button>
        )}
      </div>

      {/* Card Arena */}
      <div className="flex flex-col items-center justify-center py-4 min-h-[350px]">
        {!drawnCard ? (
          /* Unflipped Card Pile */
          <div className="flex flex-col items-center justify-center space-y-5 text-center">
            {/* Wooden Runic Back Cover Visual */}
            <motion.div
              whileHover={{ scale: 1.05, rotate: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleDrawCard}
              className="w-44 h-64 bg-gradient-to-br from-[#1d1612] via-[#100b08] to-[#2b1f18] rounded-2xl border-2 border-dashed border-[#574335] hover:border-amber-600/70 shadow-[0_15px_30px_rgba(0,0,0,0.5)] cursor-pointer flex items-center justify-center relative p-4 group"
              id="unfetched-draw-card-trigger"
            >
              {/* Internal Framing */}
              <div className="absolute inset-2 border border-dashed border-[#3e2f24] rounded-xl group-hover:border-amber-600/30 transition-all pointer-events-none" />

              <div className="flex flex-col items-center text-[#543d2f] group-hover:text-amber-500/80 transition-colors">
                <div className="w-14 h-14 rounded-full border border-current flex items-center justify-center mb-3 animate-pulse">
                  <Flame className="w-6 h-6 stroke-[1.5]" />
                </div>
                <span className="font-display text-xs tracking-widest font-extrabold select-none">DRAW RUNIC TALE</span>
                <span className="text-[9px] font-mono mt-2 tracking-wide uppercase opacity-70">Focus your spiritual energy</span>
              </div>
            </motion.div>
            
            <p className="text-xs text-stone-500 max-w-xs leading-relaxed font-sans">
              Draw from the tribal circle. This will unveil your current path and its elemental alignment.
            </p>
          </div>
        ) : (
          /* Revealed Card Front */
          <div className="w-full flex flex-col items-center">
            <motion.div
              initial={{ rotateY: 90, opacity: 0, scale: 0.8 }}
              animate={{ rotateY: 0, opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className={`w-44 h-64 bg-[#181310] border-2 border-amber-600/60 rounded-2xl shadow-[0_15px_30px_rgba(217,119,6,0.1)] relative p-4 flex flex-col justify-between overflow-hidden ${
                isReversed ? 'rotate-180' : ''
              }`}
            >
              {/* Delicate gold-dust background mesh */}
              <div className="absolute inset-0 bg-radial-gradient from-amber-500/5 to-transparent pointer-events-none" />
              <div className="absolute inset-1.5 border border-[#3c2a1d] rounded-xl pointer-events-none" />

              {/* Card Banner Details */}
              <div className="flex items-center justify-between text-stone-500 font-mono text-[8px] uppercase select-none z-10">
                <span>RUNE ORACLE</span>
                <span className="text-amber-600 font-bold">{drawnCard.element}</span>
              </div>

              {/* Runic Symbol Visual */}
              <div className="flex flex-col items-center justify-center shrink-0 py-2 select-none z-10">
                <span className="text-5xl font-sans text-amber-500/90 glow-amber select-none cursor-default font-extrabold tracking-wide">
                  {drawnCard.symbol}
                </span>
                <span className="text-[9px] text-amber-700 font-mono tracking-widest uppercase mt-2.5 font-bold">
                  {drawnCard.keyword}
                </span>
              </div>

              {/* Card Name Block */}
              <div className="text-center z-10 select-none pb-1">
                <h3 className="font-display text-sm font-bold text-amber-100 tracking-wider">
                  {drawnCard.name}
                </h3>
                <span className="text-[9px] font-mono block mt-0.5 text-stone-500 uppercase tracking-widest">
                  {isReversed ? '⚓ REVERSED PATH' : '☼ UPRIGHT PATH'}
                </span>
              </div>
            </motion.div>

            {/* Revealed Text Summary */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-5 text-center max-w-sm"
              id="drawn-card-details"
            >
              <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-[#9c7757] mb-1">
                Sacred Insight
              </h4>
              <p className="text-stone-300 font-sans text-xs leading-relaxed font-medium">
                {drawnCard.description}
              </p>
              <p className="text-[11.5px] font-sans italic text-stone-500 mt-2">
                &ldquo;{isReversed ? drawnCard.reversedMeaning : drawnCard.uprightMeaning}&rdquo;
              </p>

              {/* Guardian Summon Button */}
              <button
                onClick={handleSeekInterpretation}
                disabled={isCustomLoading || hasInterpreted}
                className="mt-4 w-full cursor-pointer py-2.5 rounded-xl bg-[#211611] text-xs font-mono font-extrabold hover:bg-amber-600/20 text-amber-400 hover:text-amber-300 border border-amber-600/30 transition-all duration-200 flex items-center justify-center gap-2 uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed shadow"
                id="shamanic-prompt-card-draw-button"
              >
                <Feather className="w-3.5 h-3.5" />
                {hasInterpreted ? 'Guidance Cast in Chat' : 'Seek Tribal Interpretation'}
              </button>
            </motion.div>
          </div>
        )}
      </div>

      {/* Card metadata bar */}
      <div className="text-[8.5px] font-mono text-stone-600 leading-none uppercase tracking-widest flex items-center justify-between border-t border-[#1d1612] pt-3 z-10 select-none">
        <span>RITUAL DECK: SMOKE SERIES</span>
        <span>5 ELEMENTAL SIGILS</span>
      </div>
    </div>
  );
}
