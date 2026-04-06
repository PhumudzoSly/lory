import { Card, CardContent } from "../ui/card";
import { IconBulb, IconCircleCheck, IconHistory, IconLeaf, IconTrees } from "@tabler/icons-react";

export function InfoPanel() {
  return (
    <div className="space-y-8">
      <Card className="overflow-hidden border border-border shadow-sm rounded-2xl">
        <div className="relative h-48 w-full">
          <img
            alt="Calm workspace with plants"
            className="w-full h-full object-cover"
            src="https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?q=80&w=2070&auto=format&fit=crop"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/40 to-transparent flex items-end p-6">
            <h3 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <IconLeaf className="size-6 text-primary" />
              Gentle Rhythms
            </h3>
          </div>
        </div>
        <CardContent className="p-6 bg-card">
          <p className="text-muted-foreground text-sm leading-relaxed mb-6 font-medium">
            By mapping your workday, Lory intelligently spaces out hydration
            and movement sessions. This ensures you sustain your peak flow without
            compromising your physical wellbeing.
          </p>
          <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest bg-primary/10 text-primary p-4 rounded-xl border border-primary/20">
            <IconCircleCheck className="size-4" />
            Smart Scheduling Active
          </div>
        </CardContent>
      </Card>

      <Card className="bg-accent/30 shadow-sm border rounded-2xl">
        <CardContent className="p-8">
          <h4 className="font-bold text-foreground mb-6 flex items-center gap-2 text-lg">
            <IconBulb className="size-5 text-amber-500" />
            Lory Insights
          </h4>
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="mt-1 w-8 h-8 rounded-lg bg-primary/10 flex-shrink-0 flex items-center justify-center border border-primary/20">
                <IconHistory className="size-4 text-primary" />
              </div>
              <p className="text-muted-foreground text-sm leading-snug">
                <strong className="text-foreground block mb-1.5">Peak Flow Timing</strong>
                Your deepest focus hours typically occur between 10:00 AM and 11:30 AM. Lory will prioritize no-distraction windows here.
              </p>
            </div>
            <div className="flex gap-4">
              <div className="mt-1 w-8 h-8 rounded-lg bg-secondary/20 flex-shrink-0 flex items-center justify-center border border-secondary/30">
                <IconTrees className="size-4 text-secondary-foreground" />
              </div>
              <p className="text-muted-foreground text-sm leading-snug">
                <strong className="text-foreground block mb-1.5">Rest Optimization</strong>
                Studies show a 5-minute break every 50 minutes increases daily output by up to 15%. Your schedule follows this science.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
