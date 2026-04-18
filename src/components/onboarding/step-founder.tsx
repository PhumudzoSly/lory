import { IconQuote } from "@tabler/icons-react";

export function StepFounder() {
  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3 text-muted-foreground/50">
        <IconQuote size={16} stroke={2} />
        <h2 className="text-[11px] font-bold uppercase tracking-[0.25em]">
          A note from the founder
        </h2>
      </div>

      <div className="space-y-5 text-[14px] leading-relaxed text-foreground/80">
        <p>
          Hi, I'm <span className="font-medium text-foreground/95">Phumudzo</span>.
          I built Lory because I work hard — maybe a little too hard, if I'm
          being honest.
        </p>
        <p>
          Late nights. Long sprints. The kind of focus that feels productive
          until your body quietly starts sending you the bill.
        </p>
        <p>
          Somewhere along the way I realised that the same care I pour into the
          job — the discipline, the follow-through, the attention to detail —
          deserves to be poured into the body and mind carrying that job too.
        </p>
        <p>
          Lory isn't about doing less. It's about remembering the other half of
          the equation. A stretch. A glass of water. A pause to breathe before
          the next thing.
        </p>
        <p className="text-foreground/95">
          Thanks for giving Lory a chance. I hope it's kind to you.
        </p>
        <p className="text-[13px] text-muted-foreground/60">— Phumudzo</p>
      </div>
    </div>
  );
}
