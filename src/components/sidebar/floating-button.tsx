import { DealWiseIcon } from '@/components/ui/dealwise-icon';
import { cn } from '@/lib/utils';

interface FloatingButtonProps {
  onClick: () => void;
  className?: string;
}

export function FloatingButton({ onClick, className }: FloatingButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn('ria-floating-btn', className)}
      aria-label="Open Investment Analyzer"
    >
      <DealWiseIcon className="w-8 h-8" />
    </button>
  );
} 