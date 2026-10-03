// Lightweight procedural Web Audio synthesizer for tactile UI micro-interactions
// No external audio files or network requests required.

class SoundManager {
  private ctx: AudioContext | null = null;
  private isEnabled = false;

  constructor() {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("portfolio_sound_enabled");
        this.isEnabled = stored === "true";
      } catch {
        this.isEnabled = false;
      }
    }
  }

  get enabled(): boolean {
    return this.isEnabled;
  }

  setEnabled(enabled: boolean): boolean {
    this.isEnabled = enabled;
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("portfolio_sound_enabled", String(this.isEnabled));
      } catch {}
    }

    if (this.ctx) {
      if (!this.isEnabled) {
        // Suspend audio context immediately to ensure total silence
        this.ctx.suspend().catch(() => {});
      } else if (this.ctx.state === "suspended") {
        this.ctx.resume().catch(() => {});
      }
    }

    if (this.isEnabled) {
      this.ensureContext();
      this.playChime();
    }

    return this.isEnabled;
  }

  toggle(): boolean {
    return this.setEnabled(!this.isEnabled);
  }

  private ensureContext() {
    if (!this.isEnabled) return;
    if (!this.ctx && typeof window !== "undefined") {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === "suspended" && this.isEnabled) {
      this.ctx.resume().catch(() => {});
    }
  }

  playClick() {
    if (!this.isEnabled) return;
    this.ensureContext();
    if (!this.ctx || this.ctx.state !== "running") return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sine";
      const now = this.ctx.currentTime;
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(300, now + 0.03);

      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.03);
    } catch {}
  }

  playPop() {
    if (!this.isEnabled) return;
    this.ensureContext();
    if (!this.ctx || this.ctx.state !== "running") return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "triangle";
      const now = this.ctx.currentTime;
      osc.frequency.setValueAtTime(400, now);
      osc.frequency.exponentialRampToValueAtTime(750, now + 0.035);

      gain.gain.setValueAtTime(0.03, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.035);
    } catch {}
  }

  playNote(noteIndex: number) {
    if (!this.isEnabled) return;
    this.ensureContext();
    if (!this.ctx || this.ctx.state !== "running") return;

    try {
      // Pentatonic scale (C4, D4, E4, G4, A4, C5)
      const scale = [261.63, 293.66, 329.63, 392.0, 440.0, 523.25];
      const freq = scale[noteIndex % scale.length];

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sine";
      const now = this.ctx.currentTime;
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.025, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.12);
    } catch {}
  }

  playChime() {
    if (!this.isEnabled) return;
    this.ensureContext();
    if (!this.ctx || this.ctx.state !== "running") return;

    try {
      const notes = [523.25, 659.25, 783.99]; // C5, E5, G5 chord
      const now = this.ctx.currentTime;

      notes.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now + idx * 0.04);

        gain.gain.setValueAtTime(0.03, now + idx * 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.04 + 0.18);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + idx * 0.04);
        osc.stop(now + idx * 0.04 + 0.18);
      });
    } catch {}
  }
}

export const soundFx = new SoundManager();
