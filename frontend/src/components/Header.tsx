import React, { useState, useEffect } from 'react';
import { Activity, Shield, Wifi, AlertOctagon, HeartHandshake, FileDown, FileText, Volume2, VolumeX, QrCode, FileUp, Ambulance, MessageSquare } from 'lucide-react';
import { RiskTier } from '../types/hdims';

interface HeaderProps {
  activeTier: RiskTier;
  jitActiveCount: number;
  isAudioMuted: boolean;
  onToggleAudio: () => void;
  onOpenAbhaQr: () => void;
  onOpenLabAnalyzer: () => void;
  onOpenReferral: () => void;
  onOpenFamilySms: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTier,
  jitActiveCount,
  isAudioMuted,
  onToggleAudio,
  onOpenAbhaQr,
  onOpenLabAnalyzer,
  onOpenReferral,
  onOpenFamilySms,
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
    <header className="w-full bg-[#0A1224] border-b border-clinical-border px-6 py-3 flex flex-col gap-2.5 sticky top-0 z-50 shadow-xl">
      {/* Top Row: Brand, Core Status & Global Documents */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Brand & Hospital Subhead */}
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <Activity className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-extrabold tracking-tight text-white flex items-center gap-2">
                HDIMS
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
                  v2.4 Clinician Intelligence
                </span>
              </h1>
            </div>
            <p className="text-xs text-slate-400 font-medium">
              Govt. Medical College & Hospital — Ward 4B High-Dependency Unit
            </p>
          </div>
        </div>

        {/* Global Tools, Downloads & Controls */}
        <div className="flex flex-wrap items-center gap-2.5 text-xs">
          {/* ABDM Status */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-slate-300 font-medium flex items-center gap-1.5">
              <Wifi className="w-3.5 h-3.5 text-emerald-400" />
              ABDM Gateway: Live Sync
            </span>
          </div>

          {/* Zero-Touch Protocol */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800">
            <Shield className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-slate-300 font-medium">
              Zero Patient Burden: <strong className="text-cyan-400">Enforced</strong>
            </span>
          </div>

          {/* Download Pitch Deck Button */}
          <a
            href="/HDIMS_Pitch_Deck.pptx"
            download="HDIMS_Pitch_Deck.pptx"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold transition shadow-sm shadow-cyan-500/20"
            title="Download complete PPTX presentation deck"
          >
            <FileDown className="w-3.5 h-3.5" />
            <span>Pitch Deck (.pptx)</span>
          </a>

          {/* Download PDF Report Button */}
          <a
            href="/HDIMS_Executive_Report.pdf"
            target="_blank"
            download="HDIMS_Executive_Report.pdf"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 font-bold border border-cyan-500/40 transition shadow-sm"
            title="Download complete PDF Executive Report and Judge Q&A Playbook"
          >
            <FileText className="w-3.5 h-3.5 text-cyan-400" />
            <span>Report (.pdf)</span>
          </a>

          {/* Audio Mute/Unmute Toggle */}
          <button
            onClick={onToggleAudio}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition shadow-sm ${
              !isAudioMuted
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30'
                : 'bg-slate-850 text-slate-400 border-slate-750 hover:bg-slate-800'
            }`}
            title={isAudioMuted ? 'Telemetry Audio: MUTED (Click to Enable Heartbeat & Alarms)' : 'Telemetry Audio: ACTIVE (Click to Mute)'}
          >
            {!isAudioMuted ? <Volume2 className="w-3.5 h-3.5 text-emerald-400 animate-pulse" /> : <VolumeX className="w-3.5 h-3.5 text-slate-400" />}
            <span className="font-semibold text-xs">{!isAudioMuted ? 'Audio: ON' : 'Audio: MUTE'}</span>
          </button>

          {/* Clock */}
          <div className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 font-mono text-slate-300 font-semibold">
            {time || '00:00:00'}
          </div>
        </div>
      </div>

      {/* Bottom Row: Clinician Direct Action Buttons & Critical Status Strip */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800/80">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mr-1 flex items-center gap-1">
            Clinician Tools:
          </span>

          {/* ABHA QR & 5-Second Digest Button */}
          <button
            onClick={onOpenAbhaQr}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-950/70 hover:bg-cyan-900/90 text-cyan-300 border border-cyan-500/40 text-xs font-bold transition shadow-sm hover:border-cyan-400"
            title="Scan patient ABHA QR code and generate 5-second clinical fast-digest"
          >
            <QrCode className="w-3.5 h-3.5 text-cyan-400" />
            <span>ABHA QR &amp; 5s Digest</span>
          </button>

          {/* Lab Report & Rx Paper OCR Analyzer */}
          <button
            onClick={onOpenLabAnalyzer}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-950/70 hover:bg-blue-900/90 text-blue-300 border border-blue-500/40 text-xs font-bold transition shadow-sm hover:border-blue-400"
            title="Upload laboratory biomarker reports or physical prescription papers for instant clinical contraindication analysis"
          >
            <FileUp className="w-3.5 h-3.5 text-blue-400" />
            <span>Lab &amp; Rx Paper OCR</span>
          </button>

          {/* Cross-Hospital Referral Handshake */}
          <button
            onClick={onOpenReferral}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-950/70 hover:bg-purple-900/90 text-purple-300 border border-purple-500/40 text-xs font-bold transition shadow-sm hover:border-purple-400"
            title="Dispatch Green Corridor referral with live bidirectional telemetry handshake to tertiary centers like AIIMS"
          >
            <Ambulance className="w-3.5 h-3.5 text-purple-400" />
            <span>Green Corridor Referral</span>
          </button>

          {/* Family plain-SMS advocate feed */}
          <button
            onClick={onOpenFamilySms}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-950/70 hover:bg-emerald-900/90 text-emerald-300 border border-emerald-500/40 text-xs font-bold transition shadow-sm hover:border-emerald-400"
            title="View or send plain-language automated SMS / WhatsApp updates to rural family member"
          >
            <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
            <span>Family SMS Advocate</span>
          </button>
        </div>

        {/* Right side: Active JIT Token count & Code Priority */}
        <div className="flex items-center gap-2.5 text-xs">
          {/* Active Emergency JIT Token Count */}
          <div className={`flex items-center gap-2 px-3 py-1 rounded-lg border transition-all ${
            jitActiveCount > 0
              ? 'bg-purple-950/40 border-purple-500/50 text-purple-300 shadow-sm shadow-purple-500/20'
              : 'bg-slate-900/80 border-slate-800 text-slate-400'
          }`}>
            <HeartHandshake className={`w-3.5 h-3.5 ${jitActiveCount > 0 ? 'text-purple-400 animate-bounce' : 'text-slate-500'}`} />
            <span>
              Active JIT Grants: <strong className={jitActiveCount > 0 ? 'text-purple-300' : 'text-slate-400'}>{jitActiveCount}</strong>
            </span>
          </div>

          {/* Critical Escalation Banner if in Red */}
          {activeTier === 'CRITICAL' && (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-rose-500/20 border border-rose-500/50 text-rose-400 font-semibold animate-pulse">
              <AlertOctagon className="w-3.5 h-3.5" />
              <span>CODE PRIORITY 1</span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
