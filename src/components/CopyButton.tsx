import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { Button } from './ui/button';

interface CopyButtonProps {
  text: string;
  className?: string;
}

export function CopyButton({ text, className }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  return (
    <Button
      onClick={handleCopy}
      variant="outline"
      size="sm"
      className={`transition-all duration-300 ${
        copied 
          ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0 scale-105' 
          : 'bg-white dark:bg-slate-700 backdrop-blur-sm border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-600 hover:scale-105 text-slate-700 dark:text-white'
      } ${className}`}
    >
      {copied ? (
        <>
          <Check className="h-4 w-4 mr-2 animate-in zoom-in" />
          Copied!
        </>
      ) : (
        <>
          <Copy className="h-4 w-4 mr-2" />
          Copy to Clipboard
        </>
      )}
    </Button>
  );
}

