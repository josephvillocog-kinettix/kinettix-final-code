/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Check, Flame, Waves, Shield, Sun, CircleHelp } from 'lucide-react';
import { Ritual } from '../types';

interface RitualsTrackerProps {
  rituals: Ritual[];
  onToggleRitual: (id: string) => void;
}

export default function RitualsTracker({ rituals, onToggleRitual }: RitualsTrackerProps) {
  const completedCount = rituals.filter((r) => r.completed).length;
  const totalCount = rituals.length;
  const percentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Render element circles
  const getCategoryTheme = (category: string) => {
    switch (category) {
      case 'spiritual':
        return { bg: 'bg-[#211610]', border: 'border-amber-600/30', text: 'text-amber-500', icon: Sun };
      case 'physical':
        return { bg: 'bg-[#10191c]', border: 'border-teal-600/30', text: 'text-teal-400', icon: Waves };
      case 'communal':
        return { bg: 'bg-[#141c14]', border: 'border-emerald-600/30', text: 'text-emerald-400', icon: Shield };
      default:
        return { bg: 'bg-[#221c1a]', border: 'border-stone-600/30', text: 'text-stone-400', icon: CircleHelp };
    }
  };

  return (
    <div 
      className="bg-[#12100e] border border-[#2b211a] rounded-2xl p-5 shadow-2xl relative overflow-hidden"
      id="daily-rituals-tracker-container"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header Info */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="font-display text-base font-bold text-amber-100 tracking-wider">DAILY CLAN RITUALS</h2>
          <p className="text-[10px] text-stone-500 font-mono tracking-widest uppercase">Sacred Offerings</p>
        </div>

        {/* Completion Gauge on top right */}
        <div className="flex items-center gap-3">
          <div className="relative w-12 h-12 flex items-center justify-center">
            {/* SVG Progress Circle */}
            <svg className="absolute w-full h-full transform -rotate-90">
              <circle
                cx="24"
                cy="24"
                r="20"
                className="stroke-[#1d1612]"
                strokeWidth="3.5"
                fill="transparent"
              />
              <circle
                cx="24"
                cy="24"
                r="20"
                className="stroke-amber-600 transition-all duration-700 ease-out"
                strokeWidth="3.5"
                fill="transparent"
                strokeDasharray={125.6}
                strokeDashoffset={125.6 - (125.6 * percentage) / 100}
                strokeLinecap="round"
              />
            </svg>
            <span className="font-mono text-xs font-bold text-amber-500">{percentage}%</span>
          </div>
          <div className="text-right">
            <span className="block font-mono text-xs font-bold text-stone-300">
              {completedCount}/{totalCount}
            </span>
            <span className="block text-[9.5px] text-stone-600 uppercase font-bold tracking-wider">Aligned</span>
          </div>
        </div>
      </div>

      {/* Rituals list */}
      <div className="space-y-3" id="rituals-list-items">
        {rituals.map((ritual) => {
          const theme = getCategoryTheme(ritual.category);
          const Icon = theme.icon;

          return (
            <div
              key={ritual.id}
              onClick={() => onToggleRitual(ritual.id)}
              className={`flex items-start gap-4 p-3.5 rounded-xl border transition-all duration-200 cursor-pointer select-none group ${
                ritual.completed
                  ? 'bg-[#181412] border-amber-800/20 opacity-75'
                  : 'bg-[#16120f] border-[#221a15] hover:border-amber-600/30 hover:bg-[#1a1410]'
              }`}
              id={`ritual-item-${ritual.id}`}
            >
              {/* Specialized Checkbox button */}
              <div className="pt-0.5">
                <div className={`w-5.5 h-5.5 rounded-md border flex items-center justify-center transition-all duration-200 ${
                  ritual.completed
                    ? 'bg-gradient-to-br from-amber-700 to-amber-900 border-amber-600 text-amber-100 shadow-inner scale-95'
                    : 'border-[#4c3b30] bg-[#110c09] group-hover:border-amber-600/50 text-transparent'
                }`}>
                  <Check className="w-3.5 h-3.5 stroke-[3px]" />
                </div>
              </div>

              {/* Ritual Information */}
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-bold font-display tracking-wide ${
                    ritual.completed ? 'line-through text-stone-500' : 'text-stone-300 group-hover:text-amber-200'
                  }`}>
                    {ritual.title}
                  </span>
                  
                  {/* Small tag icon indicator */}
                  <div className={`p-0.5 rounded ${theme.bg} ${theme.border} ${theme.text}`}>
                    <Icon className="w-3 h-3" />
                  </div>
                </div>
                <p className={`text-[11px] mt-0.5 leading-relaxed font-sans ${
                  ritual.completed ? 'text-stone-600' : 'text-stone-500'
                }`}>
                  {ritual.description}
                </p>
              </div>

              {/* Wisdom energy gauge */}
              <div className="text-right self-center font-mono">
                <span className={`text-[10px] font-bold ${
                  ritual.completed ? 'text-amber-800' : 'text-amber-500/70 group-hover:text-amber-400'
                }`}>
                  +{ritual.rewardValue} SP
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Aesthetic Footer banner */}
      <div className="mt-4 pt-3 border-t border-[#1d1612] flex items-center justify-between text-[9px] text-stone-600 font-mono uppercase tracking-widest leading-none">
        <span>EMBER FIRE RITUAL CODES</span>
        <span className="flex items-center gap-1">
          <Flame className="w-3 h-3 text-amber-950 fill-amber-950/20" /> Aligned to Ancestors
        </span>
      </div>
    </div>
  );
}
