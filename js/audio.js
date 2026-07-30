/**
 * Trình Tạo Âm Thanh Nhạc Cụ Dân Tộc (Đàn Tranh / Đàn Bầu Ambient Generator)
 * Sử dụng Web Audio API thuần để phát nhạc nền không gian văn hóa cổ truyền
 */

class AmbientSoundPlayer {
  constructor() {
    this.isPlaying = false;
    this.audioCtx = null;
    this.timer = null;
    // Thang âm Ngũ biến dân tộc Việt Nam (C4, D4, F4, G4, A4, C5, D5, F5, G5)
    this.pentatonicScale = [261.63, 293.66, 349.23, 392.00, 440.00, 523.25, 587.33, 698.46, 783.99];
  }

  initContext() {
    if (!this.audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.audioCtx = new AudioContext();
    }
  }

  playPluckNote(freq) {
    if (!this.audioCtx || !this.isPlaying) return;

    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();
    const filter = this.audioCtx.createBiquadFilter();

    // Giả lập tiếng đàn tranh: Sóng tam giác + Biquad Filter + Decay nhanh
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);

    // Lọc âm thanh cho tiếng ấm áp
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1200, this.audioCtx.currentTime);

    // Envelope biên độ (Attack nhanh, Decay dần)
    const now = this.audioCtx.currentTime;
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.15, now + 0.03); // Attack
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.5); // Decay tiếng vang

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.audioCtx.destination);

    osc.start(now);
    osc.stop(now + 2.6);
  }

  start() {
    this.initContext();
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    this.isPlaying = true;
    
    // Đánh nốt ngẫu nhiên theo nhịp nhàng
    const scheduleNextNote = () => {
      if (!this.isPlaying) return;
      
      const randomFreq = this.pentatonicScale[Math.floor(Math.random() * this.pentatonicScale.length)];
      this.playPluckNote(randomFreq);

      // Nhịp điệu thong thả (từ 1.2s đến 3.5s)
      const nextDelay = 1200 + Math.random() * 2300;
      this.timer = setTimeout(scheduleNextNote, nextDelay);
    };

    scheduleNextNote();
  }

  stop() {
    this.isPlaying = false;
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }

  toggle() {
    if (this.isPlaying) {
      this.stop();
    } else {
      this.start();
    }
    return this.isPlaying;
  }
}

const ambientPlayer = new AmbientSoundPlayer();
