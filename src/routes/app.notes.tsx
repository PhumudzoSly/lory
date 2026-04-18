import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/app/notes')({
  component: () => <div className="flex items-center justify-center h-full text-muted-foreground">notes content coming soon</div>,
});
