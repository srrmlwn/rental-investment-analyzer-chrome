import React from 'react';
import { Calculator } from 'lucide-react';
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
      <Calculator className="w-6 h-6" />
    </button>
  );
} 