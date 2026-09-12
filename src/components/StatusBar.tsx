import { useMemo } from 'react';
import { FileText, Type, Clock } from 'lucide-react';

interface StatusBarProps {
  content: string;
}

export default function StatusBar({ content }: StatusBarProps) {
  const stats = useMemo(() => {
    const tmp = document.createElement('div');
    tmp.innerHTML = content;
    const text = tmp.textContent || tmp.innerText || '';
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const chars = text.length;
    const readTime = Math.max(1, Math.ceil(words / 200));
    return { words, chars, readTime };
  }, [content]);

  return (
    <div className="flex items-center justify-between px-4 lg:px-6 py-1.5 border-t border-border bg-cream/50 text-[11px] text-text-muted">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1">
          <Type className="w-3 h-3" />
          <span>{stats.words} {getWordForm(stats.words)}</span>
        </div>
        <div className="flex items-center gap-1">
          <FileText className="w-3 h-3" />
          <span>{stats.chars} символов</span>
        </div>
      </div>
      <div className="flex items-center gap-1">
        <Clock className="w-3 h-3" />
        <span>~{stats.readTime} мин чтения</span>
      </div>
    </div>
  );
}

function getWordForm(count: number): string {
  const lastTwo = count % 100;
  const lastOne = count % 10;
  if (lastTwo >= 11 && lastTwo <= 19) return 'слов';
  if (lastOne === 1) return 'слово';
  if (lastOne >= 2 && lastOne <= 4) return 'слова';
  return 'слов';
}
