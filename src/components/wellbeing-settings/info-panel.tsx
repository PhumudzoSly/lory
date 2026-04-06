import { IconCircleCheck, IconShieldCheck } from "@tabler/icons-react";

export function InfoPanel() {
  return (
    <div className="space-y-8">
      <div className="bg-primary p-8 rounded-2xl text-primary-foreground shadow-xl shadow-primary/10 relative overflow-hidden">
        <div className="relative z-10">
          <IconShieldCheck className="mb-4 size-10" />
          <h4 className="text-xl font-bold mb-3 tracking-tight">
            Why this matters?
          </h4>
          <p className="text-primary-foreground/80 text-sm leading-relaxed mb-6">
            Lory uses clinical ergonomics and productivity research to protect
            your most valuable asset: your health. Balancing intense focus with
            strict recovery periods prevents burnout, RSI, and long-term strain.
          </p>
          <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-widest text-primary-foreground bg-primary-foreground/20 p-3 rounded-lg border border-primary-foreground/30">
            <IconCircleCheck className="size-4" />
            Sanctuary Active
          </div>
        </div>
        <div className="absolute bottom-0 right-0 w-48 h-48 bg-white/5 rounded-full -mb-24 -mr-12 blur-2xl"></div>
      </div>

      <div className="bg-card rounded-2xl shadow-sm overflow-hidden">
        <img
          alt="Calm workspace with plants"
          className="w-full h-48 object-cover opacity-80"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBLmyTxv7Mrjc0wo7NqOH1vRghMsECYeXfVnKjo5xEmqz7XAhb4ggMtVYWcINHBQXRyqYh-FnpNPLoT3DSIQclfDE_OAPhyf9MdHV7qdFUfQbDC3Y1YNIViReUUwtLduHhGkjNaJwL4tsSctjnfwU-Q9BbnRY49vcnVY0UaAJ2XBBxMp7ijZUQ4p-vc9zYWGpaCXC36_Qy6_hdGGfFalgSBY_PcFrYd40nOmhQXgHiDl_VcrdRvBf2Aw3ptQ5rbymheVrt1yxqfIAx1"
        />
        <div className="p-6">
          <h4 className="font-bold text-foreground mb-2">Pro Tip</h4>
          <p className="text-muted-foreground text-sm">
            Keep the top of your monitor exactly at eye level. Looking down
            constantly changes the natural curvature of your cervical spine.
          </p>
        </div>
      </div>

      <div className="bg-card rounded-2xl shadow-sm overflow-hidden">
        <img
          alt="Zen meditation stones"
          className="w-full h-48 object-cover opacity-80"
          src="https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=800&auto=format&fit=crop"
        />
        <div className="p-6">
          <h4 className="font-bold text-foreground mb-2">Mindfulness</h4>
          <p className="text-muted-foreground text-sm">
            Box breathing (inhale 4s, hold 4s, exhale 4s, hold 4s) has been
            clinically proven to lower cortisol and reset the nervous system in
            just 2 minutes.
          </p>
        </div>
      </div>
    </div>
  );
}
