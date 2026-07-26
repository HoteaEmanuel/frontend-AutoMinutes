import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

type EmptyStateAccent = 'blue' | 'amber' | 'emerald' | 'primary';

const accentStyles: Record<EmptyStateAccent, string> = {
  blue: 'bg-status-in-progress-soft text-status-in-progress',
  amber: 'bg-status-open-soft text-status-open',
  emerald: 'bg-status-done-soft text-status-done',
  primary: 'bg-accent text-accent-foreground',
};

type EmptyStateProps = {
  icon: LucideIcon;
  title: string;
  description?: string;
  accent?: EmptyStateAccent;
  className?: string;
};

const EmptyState = ({ icon: Icon, title, description, accent = 'primary', className }: EmptyStateProps) => (
  <div className={cn('flex flex-col items-center gap-3 py-8 text-center', className)}>
    <div
      className={cn(
        'flex size-14 shrink-0 items-center justify-center rounded-2xl',
        accentStyles[accent],
      )}
    >
      <Icon className="size-6" />
    </div>
    <div className="flex flex-col gap-1">
      <p className="text-sm font-semibold text-foreground">{title}</p>
      {description && <p className="text-xs text-muted-foreground">{description}</p>}
    </div>
  </div>
);

export default EmptyState;
