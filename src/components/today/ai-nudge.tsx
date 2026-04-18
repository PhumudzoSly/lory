import { useState, useEffect } from "react";
import {
  IconSparkles,
  IconNews,
  IconMail,
  IconBell,
  IconCalendar,
} from "@tabler/icons-react";

/**
 * AiNudge component - AI-powered summary and upcoming events.
 * Rotates content on mount to simulate dynamic AI insights.
 */
export const AiNudge = () => {
  const summaries = [
    "You're having a highly productive day! Most of your core tasks are complete.",
    "Pacing well. A good time to tackle that lingering code review.",
    "You've been focused for a while. Consider taking a short break soon.",
    "Great momentum today! Just a few items left on your plate.",
  ];

  const nudgesPool = [
    {
      id: 1,
      title: "New PR assigned",
      description: "You were requested for review on 'Update auth flow'",
      icon: IconBell,
      color: "text-blue-500",
      source: "GitHub",
    },
    {
      id: 2,
      title: "Weekly Sync",
      description: "Starting in 15 minutes in the main channel.",
      icon: IconCalendar,
      color: "text-orange-500",
      source: "Calendar",
    },
    {
      id: 3,
      title: "React 19 RC released",
      description: "Check out the new hooks and compiler improvements.",
      icon: IconNews,
      color: "text-green-500",
      source: "Dev News",
    },
    {
      id: 4,
      title: "Client Email",
      description: "Follow up regarding the Q3 roadmap.",
      icon: IconMail,
      color: "text-purple-500",
      source: "Inbox",
    },
    {
      id: 5,
      title: "Reminder: Timesheets",
      description: "Don't forget to submit your hours for this week.",
      icon: IconBell,
      color: "text-yellow-500",
      source: "System",
    },
  ];

  // We need to import IconCalendar
  const [summary, setSummary] = useState(summaries[0]);
  const [nudges, setNudges] = useState(nudgesPool.slice(0, 2));

  useEffect(() => {
    // Randomize on mount
    const randomSummary =
      summaries[Math.floor(Math.random() * summaries.length)];

    // Pick 2 random nudges
    const shuffled = [...nudgesPool].sort(() => 0.5 - Math.random());
    const selectedNudges = shuffled.slice(0, 2);

    setSummary(randomSummary);
    setNudges(selectedNudges);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run on mount to rotate content per visit

  return (
    <div className="mx-auto w-full space-y-8 px-4">
      {/* Header section with an AI sparkle icon */}
      <header className="space-y-3">
        <div className="flex w-fit items-center gap-2 border-b border-transparent pb-0.5 group">
          <IconSparkles size={14} stroke={2.5} className="text-indigo-500/80" />
          <span className="text-[12px] font-bold uppercase tracking-[0.2em] text-indigo-500/80">
            AI NUDGE
          </span>
        </div>

        <div className="space-y-1 relative">
          <p className="max-w-xl text-lg font-medium leading-relaxed text-foreground/90">
            {summary}
          </p>

          <p className="max-w-2xl text-[13px] font-normal leading-relaxed text-muted-foreground/60">
            Prioritize what won't interfere much with your day.
          </p>
        </div>
      </header>

      {/* 2 upcoming things */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {nudges.map((nudge) => {
          const Icon = nudge.icon;
          return (
            <div
              key={nudge.id}
              className="group flex flex-col gap-3 border border-border/40 bg-card/20 p-5 transition-colors hover:bg-card/40 cursor-default"
            >
              <div className="flex items-center gap-2">
                <Icon size={16} stroke={2} className={nudge.color} />
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">
                  {nudge.source}
                </span>
              </div>
              <div>
                <h3 className="text-sm font-semibold tracking-tight text-foreground/90">
                  {nudge.title}
                </h3>
                <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground/80">
                  {nudge.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AiNudge;
