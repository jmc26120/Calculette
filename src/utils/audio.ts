// Subtle synthetic audio click using Web Audio API
class AudioManager {
  private ctx: AudioContext | null = null;
  public enabled = false;

  private initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
  }

  public playClick(type: 'number' | 'operator' | 'action' | 'error' = 'number') {
    if (!this.enabled) return;
    try {
      this.initContext();
      if (!this.ctx) return;
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      const now = this.ctx.currentTime;

      let freq = 600;
      let duration = 0.04;
      let wave: OscillatorType = 'sine';

      if (type === 'number') {
        freq = 520;
        duration = 0.03;
      } else if (type === 'operator') {
        freq = 780;
        duration = 0.04;
        wave = 'triangle';
      } else if (type === 'action') {
        freq = 880;
        duration = 0.05;
      } else if (type === 'error') {
        freq = 240;
        duration = 0.12;
        wave = 'sawtooth';
      }

      osc.type = wave;
      osc.frequency.setValueAtTime(freq, now);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc.start(now);
      osc.stop(now + duration);
    } catch {
      // Ignore audio permission or playback restrictions
    }
  }
}

export const audioManager = new AudioManager();
