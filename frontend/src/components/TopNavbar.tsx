import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Wifi, 
  User, 
  ChevronDown, 
  Volume2, 
  VolumeX,
  ShieldCheck,
  Sparkles
} from 'lucide-react';

interface TopNavbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  isAudioMuted: boolean;
  onToggleAudio: () => void;
  onOpenOcrModal: () => void;
  onOpenGuardrails: () => void;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({
  searchQuery,
  onSearchChange,
  isAudioMuted,
  onToggleAudio,
  onOpenOcrModal,
  onOpenGuardrails,
}) => {
  const [time, setTime] = useState<string>('');

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('en-US', { hour12: false }));
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="h-14 bg-[#f3f4f5] px-5 md:px-8 flex items-center justify-between gap-4 sticky top-0 z-30">
      {/* Search Bar matching screenshot */}
      <div className="flex-1 max-w-md relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search patients, records..."
          className="w-full pl-9 pr-4 py-2 rounded-full bg-white border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#728f5e] transition"
        />
      </div>

      {/* Right Controls & Profile */}
      <div className="flex items-center gap-3 text-xs">
        <div className="hidden items-center gap-1.5 rounded-full border border-cyan-200 bg-cyan-50 px-2.5 py-1 text-[11px] font-semibold text-cyan-800 sm:flex">
          <span className="h-2 w-2 rounded-full bg-cyan-500"></span>
          <span>Live backend</span>
        </div>

        {/* Security Guardrails Badge */}
        <button
          onClick={onOpenGuardrails}
          className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition cursor-pointer"
          title="Inspect DISHA & ABAC Security Guardrails"
        >
          <ShieldCheck className="w-3.5 h-3.5 text-cyan-600" />
          <span>View guardrails</span>
        </button>

        {/* Audio Toggle */}
        <button
          onClick={onToggleAudio}
          className={`p-2 rounded-lg border transition ${
            !isAudioMuted
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
              : 'bg-slate-100 text-slate-500 border-slate-200'
          }`}
          title={isAudioMuted ? 'Audio: Muted' : 'Audio: Active'}
        >
          {!isAudioMuted ? <Volume2 className="w-4 h-4 text-emerald-600" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
        </button>

        {/* Clock */}
        <div className="font-mono text-slate-500 font-semibold px-2 py-1 text-xs">
          {time || '00:00:00'}
        </div>

        {/* Dr. Smith Profile matching screenshot */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200">
          <div className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold text-xs">
            DS
          </div>
          <div className="hidden lg:flex flex-col text-left leading-tight">
            <span className="font-bold text-slate-800 text-xs">Dr. Smith</span>
            <span className="text-[10px] text-slate-400">Attending Physician</span>
          </div>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
        </div>
      </div>
    </header>
  );
};
