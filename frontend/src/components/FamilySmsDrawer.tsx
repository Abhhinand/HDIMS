import React, { useState } from 'react';
import { MessageSquare, Send, ShieldCheck, CheckCheck, X, Phone, User } from 'lucide-react';
import { Patient } from '../types/hdims';
import { soundEngine } from '../engine/soundEngine';

interface FamilySmsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  patient: Patient;
  onSendCustomSms: (smsText: string) => void;
}

export const FamilySmsDrawer: React.FC<FamilySmsDrawerProps> = ({
  isOpen,
  onClose,
  patient,
  onSendCustomSms,
}) => {
  const [customMsg, setCustomMsg] = useState('');
  const [messages, setMessages] = useState<string[]>([
    `[14:00 PM] GMCH Ward 4B: Patient Ramesh Kumar is under continuous monitoring. Zero action or OTP required from patient.`,
    `[14:15 PM] CLINICAL UPDATE: Dr. Alok Verma (Cardiology) has stepped in for oxygen titration. Emergency care team is actively attending.`,
    `[14:28 PM] COMFORT NOTICE: Oxygen saturation stabilized at 97%. Dual antiplatelet regimen verified against AIIMS digital history.`
  ]);

  if (!isOpen) return null;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customMsg.trim()) return;
    soundEngine.playOrderConfirmation();
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const formatted = `[${timestamp}] GMCH Ward 4B (Direct from Doctor): ${customMsg.trim()}`;
    setMessages((prev) => [...prev, formatted]);
    onSendCustomSms(customMsg.trim());
    setCustomMsg('');
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#0B1527] border border-cyan-500/40 rounded-2xl w-full max-w-lg flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-5 py-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                Family Trust & Automated Plain-SMS Feed
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-normal border border-emerald-500/30">
                  Zero Patient Burden
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">
                Direct updates dispatched to registered family caregiver
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Contact Strip */}
        <div className="px-5 py-2.5 bg-slate-950/80 border-b border-slate-800/80 flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-2 text-slate-300">
            <User className="w-3.5 h-3.5 text-cyan-400" />
            <span>Recipient: <strong>{patient.emergencyContact.name}</strong> ({patient.emergencyContact.relationship})</span>
          </div>
          <div className="flex items-center gap-1.5 text-emerald-400">
            <Phone className="w-3 h-3" />
            <span>{patient.emergencyContact.phone}</span>
          </div>
        </div>

        {/* SMS Chat Feed */}
        <div className="p-5 overflow-y-auto max-h-[320px] space-y-3 text-xs">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className="p-3 rounded-xl bg-slate-900 border border-slate-800/90 text-slate-200 flex flex-col gap-1 shadow-sm"
            >
              <div className="flex items-center justify-between text-[10px] text-slate-500">
                <span>SMS Gateway: Delivered</span>
                <CheckCheck className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <p className="leading-relaxed font-sans">{msg}</p>
            </div>
          ))}
        </div>

        {/* Quick Send Form */}
        <form onSubmit={handleSend} className="p-4 bg-slate-900 border-t border-slate-800 flex items-center gap-2">
          <input
            type="text"
            placeholder="Type custom plain-language family notification..."
            value={customMsg}
            onChange={(e) => setCustomMsg(e.target.value)}
            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/60"
          />
          <button
            type="submit"
            className="px-3.5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition flex items-center gap-1.5 shadow-md shadow-cyan-500/20 flex-shrink-0"
          >
            <Send className="w-3.5 h-3.5" />
            Send SMS
          </button>
        </form>
      </div>
    </div>
  );
};
