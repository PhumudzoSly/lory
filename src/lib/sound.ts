export const playChime = (() => {
  let audioCtx: AudioContext | null = null;
  return () => {
    const Ctx = window.AudioContext;
    if (!Ctx) {
      return;
    }
    audioCtx = audioCtx ?? new Ctx();
    const ctx = audioCtx;
    const now = ctx.currentTime;

    const master = ctx.createGain();
    master.gain.setValueAtTime(0.0001, now);
    master.gain.exponentialRampToValueAtTime(0.06, now + 0.02);
    master.gain.exponentialRampToValueAtTime(0.0001, now + 0.3);
    master.connect(ctx.destination);

    const a = ctx.createOscillator();
    a.type = "sine";
    a.frequency.setValueAtTime(740, now);
    a.frequency.exponentialRampToValueAtTime(660, now + 0.2);
    a.connect(master);

    const b = ctx.createOscillator();
    b.type = "triangle";
    b.frequency.setValueAtTime(980, now);
    b.frequency.exponentialRampToValueAtTime(880, now + 0.2);
    b.connect(master);

    a.start(now);
    b.start(now);
    a.stop(now + 0.32);
    b.stop(now + 0.28);
  };
})();
