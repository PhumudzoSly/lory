import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/app/tasks')({
  component: () => <div className="flex items-center justify-center h-full text-muted-foreground">tasks content coming soon</div>,
});
