// src/lib/sound.ts

let audioCtx: AudioContext | null = null;

// SỬA LỖI: Thêm 'sawtooth' vào danh sách type cho phép
export const playNote = (frequency: number, type: 'sine' | 'square' | 'triangle' | 'sawtooth' = 'sine', duration = 0.1) => {
  if (typeof window === 'undefined') return; 
  
  if (!audioCtx) {
    // SỬA LỖI: Thêm comment này để TypeScript bỏ qua lỗi 'any' của webkitAudioContext
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }

  const oscillator = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();

  oscillator.type = type;
  oscillator.frequency.value = frequency;

  gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration);

  oscillator.connect(gainNode);
  gainNode.connect(audioCtx.destination);

  oscillator.start();
  oscillator.stop(audioCtx.currentTime + duration);
};

export const playCompareSound = (value: number) => {
  playNote(200 + value * 6, 'sine', 0.1);
};

export const playSwapSound = () => {
  playNote(150, 'square', 0.15);
};

export const playSuccessSound = () => {
    playNote(400, 'triangle', 0.2);
    setTimeout(() => playNote(500, 'triangle', 0.2), 100);
    setTimeout(() => playNote(600, 'triangle', 0.4), 200);
};

export const playErrorSound = () => {
    // 'sawtooth' giờ đã hợp lệ
    playNote(100, 'sawtooth', 0.3);
};