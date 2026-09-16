/**
 * Web Audio API Acoustic Engine for HDIMS
 * Synthesizes hospital telemetry sounds natively without external audio files.
 * Adheres to medical alarm acoustic conventions (IEC 60601-1-8 inspired).
 */

class HospitalSoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = true; // default muted so it doesn't blare unexpectedly
  private lastBeepTime: number = 0;
  private alarmInterval: number | null = null;

  constructor() {
    // AudioContext initialized lazily on first user interaction
  }

  private getContext(): AudioContext | null {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public setMuted(muted: boolean): void {
    this.isMuted = muted;
    if (muted && this.alarmInterval) {
      clearInterval(this.alarmInterval);
      this.alarmInterval = null;
    }
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  /**
   * Subtle rhythmic heartbeat blip (pitch modulates with SpO2)
   */
  public playHeartbeat(spo2: number = 98): void {
    if (this.isMuted) return;
    const now = Date.now();
    if (now - this.lastBeepTime < 350) return; // debounce
    this.lastBeepTime = now;

    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      // Frequency drops slightly with SpO2 desaturation (standard clinical oxymetry pitch behavior)
      const baseFreq = spo2 >= 95 ? 880 : spo2 >= 90 ? 740 : 620;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(baseFreq, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.85, ctx.currentTime + 0.04);

      gain.gain.setValueAtTime(0.04, ctx.currentTime); // gentle volume
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } catch {
      // Audio context policy safe fallback
    }
  }

  /**
   * Code Priority 1 Urgent Alarm (Dual-tone medical alert)
   */
  public playEmergencyChime(): void {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const tones = [980, 784, 980]; // high priority melodic chirp

      tones.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.12);

        gain.gain.setValueAtTime(0.08, now + idx * 0.12);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.12 + 0.09);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.12);
        osc.stop(now + idx * 0.12 + 0.1);
      });
    } catch {
      // Safe fallback
    }
  }

  /**
   * Gentle affirmative sound when clinical intervention order is placed
   */
  public playOrderConfirmation(): void {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      [523.25, 659.25, 783.99].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);

        gain.gain.setValueAtTime(0.05, now + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.15);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.16);
      });
    } catch {
      // Safe fallback
    }
  }
  /**
   * Toggle mute state
   */
  public toggleMute(): boolean {
    this.setMuted(!this.isMuted);
    return this.isMuted;
  }

  /**
   * Heartbeat blip alias
   */
  public playHeartbeatBeep(): void {
    this.playHeartbeat(98);
  }
}

export const soundEngine = new HospitalSoundEngine();
