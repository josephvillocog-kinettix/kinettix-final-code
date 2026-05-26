/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ShieldAlert, Compass, Sparkles, Flame, Eye, Leaf, HelpCircle, Sun, Waves, Moon } from 'lucide-react';
import { Totem } from '../types';

interface TotemListProps {
  totems: Totem[];
  activeTotemId: string | null;
  onAlignTotem: (totem: Totem) => void;
  isCustomLoading: boolean;
}

export default function TotemList({ totems, activeTotemId, onAlignTotem, isCustomLoading }: TotemListProps) {
  
  const getTotemIcon = (iconName: string) => {
    switch (iconName) {
      case 'Flame':
        return WaveFlameIcon;
      case 'Moon':
        return Moon;
      case 'Eye':
        return Eye;
      case 'Leaf':
        return Leaf;
      case 'Sun':
        return Sun;
      default:
        return HelpCircle;
    }
  };

  // Specific bespoke SVG or customized icons representing tribal fauna
  // Let's create custom indicators for Bison, Bear, Eagle, Wolf inside the component
  return (
    <div 
      className="bg-[#12100e] border border-[#2b211a] rounded-2xl p-5 shadow-2xl relative overflow-hidden"
      id="clan-totem-panel-container"
    >
      <div className="absolute top-0 left-0 w-32 h-32 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header Info */}
      <div className="mb-4">
        <h2 className="font-display text-base font-bold text-amber-100 tracking-wider">SACRED CLAN TOTEMS</h2>
        <p className="text-[10px] text-stone-500 font-mono tracking-widest uppercase">Guardian Guardians</p>
      </div>

      {/* Totem Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4" id="totem-animals-grid">
        {totems.map((totem) => {
          const isActive = totem.id === activeTotemId;
          
          return (
            <div
              key={totem.id}
              onClick={() => !isCustomLoading && onAlignTotem(totem)}
              className={`p-4 rounded-xl border transition-all duration-300 flex flex-col justify-between cursor-pointer select-none relative overflow-hidden group ${
                isActive
                  ? 'bg-[#1b140f] border-amber-600 shadow-[0_0_15px_rgba(217,119,6,0.15)] ring-1 ring-amber-600/30'
                  : 'bg-[#14110e] border-[#201813] hover:border-amber-600/30 hover:bg-[#1a1410]'
              }`}
              id={`totem-card-${totem.id}`}
            >
              {/* Colored Glow behind active or hovered totem */}
              <div className={`absolute top-0 right-0 w-24 h-24 rounded-full blur-2xl pointer-events-none transition-opacity duration-300 ${
                isActive ? 'opacity-20' : 'opacity-0 group-hover:opacity-10'
              } ${totem.colorTheme}`} />

              {/* Top Details */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-display text-xs font-extrabold tracking-wider text-amber-500 uppercase">
                    THE {totem.animal}
                  </span>
                  <div className={`text-[9px] font-mono uppercase tracking-widest px-2 py-0.5 rounded border border-transparent ${
                    isActive 
                      ? 'bg-amber-600/20 text-amber-400 border-amber-600/30' 
                      : 'bg-stone-900/60 text-stone-500 border-[#2b211a]'
                  }`}>
                    {totem.element}
                  </div>
                </div>

                <h3 className="text-sm font-bold text-neutral-300 font-sans tracking-wide leading-tight">
                  {totem.name}
                </h3>
                <p className="text-[11px] leading-relaxed text-stone-500 mt-1 pb-4">
                  {totem.description}
                </p>
              </div>

              {/* Bottom Action Area */}
              <div className="pt-3 border-t border-[#201813] flex items-center justify-between mt-auto">
                <span className="text-[10px] font-mono text-amber-600/80 font-semibold group-hover:text-amber-500 transition-colors">
                  {totem.blessingEffect}
                </span>

                <button
                  type="button"
                  className={`text-[9.5px] font-mono font-bold tracking-widest uppercase px-2.5 py-1.5 rounded transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-amber-600/20 text-amber-300 border border-amber-600/50'
                      : 'bg-stone-900text-stone-400 hover:text-amber-300 border border-[#2b211a] hover:border-amber-600/30'
                  }`}
                  disabled={isCustomLoading}
                >
                  {isActive ? 'ALIGNED' : 'ALIGN SPIRIT'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Simple custom component for stylized custom SVG representation to bypass icon imports limits
function WaveFlameIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
    </svg>
  );
}
