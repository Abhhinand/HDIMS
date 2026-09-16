import React, { useEffect, useRef } from 'react';
import { soundEngine } from '../engine/soundEngine';

interface EcgCanvasProps {
  pulseRate: number;
  spo2?: number;
  respirationRate?: number;
  isCritical?: boolean;
}

export const EcgCanvas: React.FC<EcgCanvasProps> = ({
  pulseRate,
  spo2 = 98,
  respirationRate = 18,
  isCritical = false
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let x = 0;
    const width = canvas.width;
    const height = canvas.height;

    // Channel heights (Tri-Channel layout)
    const ch1Mid = height * 0.28; // Lead II ECG
    const ch2Mid = height * 0.65; // Plethysmograph (SpO2)
    const ch3Mid = height * 0.88; // Respiration (RR)

    // Clear canvas background once
    ctx.fillStyle = '#070D18';
    ctx.fillRect(0, 0, width, height);

    // Speed scales with pulseRate
    const speed = Math.max(1.8, (pulseRate / 70) * 2.2);

    let lastRPeakTriggered = false;

    const render = () => {
      // 1. Sweep eraser bar ahead of cursor
      ctx.fillStyle = '#070D18';
      ctx.fillRect(x, 0, 18, height);

      // 2. Draw subtle grid in erased bar
      ctx.strokeStyle = 'rgba(34, 211, 238, 0.04)';
      ctx.lineWidth = 1;
      const nearestGridX = Math.floor(x / 20) * 20;
      ctx.beginPath();
      ctx.moveTo(nearestGridX, 0);
      ctx.lineTo(nearestGridX, height);
      ctx.stroke();

      for (let gy = 20; gy < height; gy += 20) {
        ctx.beginPath();
        ctx.moveTo(x, gy);
        ctx.lineTo(x + 18, gy);
        ctx.stroke();
      }

      // Divider lines between channels
      ctx.strokeStyle = 'rgba(30, 47, 77, 0.4)';
      ctx.beginPath();
      ctx.moveTo(x, height * 0.48);
      ctx.lineTo(x + 18, height * 0.48);
      ctx.moveTo(x, height * 0.78);
      ctx.lineTo(x + 18, height * 0.78);
      ctx.stroke();

      // ==========================================
      // CHANNEL 1: LEAD II ECG (Cardiac Potential)
      // ==========================================
      const ecgPeriod = Math.max(50, 6000 / pulseRate);
      const ecgPhase = (x % ecgPeriod) / ecgPeriod;

      let ecgY = 0;
      if (ecgPhase > 0.15 && ecgPhase < 0.20) {
        // P-wave
        ecgY = -Math.sin((ecgPhase - 0.15) * Math.PI / 0.05) * 7;
      } else if (ecgPhase > 0.25 && ecgPhase < 0.27) {
        // Q-dip
        ecgY = 4;
      } else if (ecgPhase >= 0.27 && ecgPhase <= 0.32) {
        // R-peak (sharp electric spike)
        const peakProgress = (ecgPhase - 0.27) / 0.05;
        if (peakProgress < 0.5) {
          ecgY = -34 * (peakProgress / 0.5);
        } else {
          ecgY = -34 + 44 * ((peakProgress - 0.5) / 0.5);
        }
        // Trigger heartbeat blip on R-peak
        if (!lastRPeakTriggered && peakProgress > 0.4) {
          soundEngine.playHeartbeat(spo2);
          lastRPeakTriggered = true;
        }
      } else if (ecgPhase > 0.32 && ecgPhase < 0.35) {
        // S-dip
        ecgY = 7;
        lastRPeakTriggered = false;
      } else if (ecgPhase > 0.42 && ecgPhase < 0.55) {
        // T-wave
        ecgY = -Math.sin((ecgPhase - 0.42) * Math.PI / 0.13) * 12;
      }

      ctx.strokeStyle = isCritical ? '#EF4444' : '#22D3EE';
      ctx.lineWidth = 1.8;
      ctx.shadowColor = isCritical ? '#EF4444' : '#22D3EE';
      ctx.shadowBlur = isCritical ? 6 : 3;

      ctx.beginPath();
      ctx.moveTo(x - speed, ch1Mid);
      ctx.lineTo(x, ch1Mid + ecgY);
      ctx.stroke();

      // ==========================================
      // CHANNEL 2: PLETHYSMOGRAPH (SpO2 Arterial Wave)
      // ==========================================
      const plethPeriod = ecgPeriod;
      const plethPhase = (x % plethPeriod) / plethPeriod;
      // Amplitude compresses severely if SpO2 drops
      const plethAmp = Math.max(4, (spo2 / 100) * 16);

      let plethY = 0;
      if (plethPhase < 0.3) {
        // Rapid systolic upstroke
        plethY = -Math.sin(plethPhase * Math.PI / 0.3) * plethAmp;
      } else if (plethPhase < 0.45) {
        // Dicrotic notch
        plethY = -plethAmp * 0.45 + Math.sin((plethPhase - 0.3) * Math.PI / 0.15) * 3;
      } else {
        // Diastolic runoff
        const decay = (plethPhase - 0.45) / 0.55;
        plethY = -plethAmp * 0.3 * (1 - decay);
      }

      ctx.strokeStyle = spo2 <= 91 ? '#F59E0B' : '#10B981';
      ctx.shadowColor = spo2 <= 91 ? '#F59E0B' : '#10B981';
      ctx.shadowBlur = 3;
      ctx.lineWidth = 1.5;

      ctx.beginPath();
      ctx.moveTo(x - speed, ch2Mid);
      ctx.lineTo(x, ch2Mid + plethY);
      ctx.stroke();

      // ==========================================
      // CHANNEL 3: RESPIRATION / CAPNOGRAPHY (RR)
      // ==========================================
      const respPeriod = Math.max(120, 18000 / respirationRate);
      const respPhase = (x % respPeriod) / respPeriod;
      const respY = -Math.sin(respPhase * Math.PI * 2) * 8;

      ctx.strokeStyle = '#38BDF8';
      ctx.shadowColor = '#38BDF8';
      ctx.shadowBlur = 2;
      ctx.lineWidth = 1.2;

      ctx.beginPath();
      ctx.moveTo(x - speed, ch3Mid);
      ctx.lineTo(x, ch3Mid + respY);
      ctx.stroke();

      ctx.shadowBlur = 0;

      x += speed;
      if (x >= width) {
        x = 0;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [pulseRate, spo2, respirationRate, isCritical]);

  return (
    <div className="relative w-full rounded-xl overflow-hidden border border-clinical-border bg-[#070D18]">
      {/* Waveform Channel Badges */}
      <div className="absolute top-2 left-3 flex items-center gap-3 z-10 pointer-events-none">
        <div className="flex items-center gap-1.5">
          <span className={`inline-block w-2 h-2 rounded-full ${isCritical ? 'bg-rose-500 animate-ping' : 'bg-cyan-400'}`}></span>
          <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-wider">
            I: Lead II ECG ({pulseRate} bpm)
          </span>
        </div>
        <span className="text-slate-600 text-xs">|</span>
        <div className="flex items-center gap-1.5">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
          <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-wider">
            II: Pleth (SpO2 {spo2}%)
          </span>
        </div>
        <span className="text-slate-600 text-xs">|</span>
        <div className="flex items-center gap-1.5">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-sky-400"></span>
          <span className="text-[10px] font-mono font-bold text-sky-400 uppercase tracking-wider">
            III: Resp ({respirationRate}/min)
          </span>
        </div>
      </div>

      <canvas
        ref={canvasRef}
        width={760}
        height={180}
        className="w-full h-[180px] block"
      />
    </div>
  );
};
