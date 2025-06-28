import { useState } from 'react';
import { Button } from './button';
import { Copy, Check } from 'lucide-react';
import { cn } from '../../utils/cn';

interface CopyButtonProps {
  onCopy: () => Promise<boolean>;
  tooltip?: string;
  className?: string;
  size?: 'sm' | 'lg' | 'default' | 'icon';
}

export function CopyButton({ onCopy, tooltip = "Copy analysis as CSV", className, size = 'sm' }: CopyButtonProps) {
  const [isCopied, setIsCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleCopy = async () => {
    setIsLoading(true);
    try {
      const success = await onCopy();
      if (success) {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      }
    } catch (error) {
      console.error('Copy failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="outline"
      size={size}
      onClick={handleCopy}
      disabled={isLoading}
      className={cn(
        "transition-all duration-200",
        isCopied && "bg-green-50 border-green-200 text-green-700",
        className
      )}
      title={tooltip}
    >
      {isLoading ? (
        <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
      ) : isCopied ? (
        <Check className="w-4 h-4" />
      ) : (
        <Copy className="w-4 h-4" />
      )}
    </Button>
  );
} 