import { IconSparkles } from "@tabler/icons-react";

export function StepWelcome() {
  return (
    <div className="space-y-8 text-center">
      <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-foreground/5">
        <IconSparkles size={20} stroke={1.75} className="text-foreground/70" />
      </div>
      <div className="space-y-3">
        <h2 className="text-[20px] font-semibold tracking-tight text-foreground/90">
          Welcome to Lory
        </h2>
        <p className="mx-auto max-w-md text-[13px] leading-relaxed text-muted-foreground/70">
          Lory is your companion for healthy work. In the next few steps we'll
          learn a little about you and your work rhythm so we can offer thoughtful
          nudges at the right moments.
        </p>
        <p className="mx-auto max-w-md text-[13px] leading-relaxed text-muted-foreground/50">
          Every step is optional. You can always come back and finish this later.
        </p>
      </div>
    </div>
  );
}
