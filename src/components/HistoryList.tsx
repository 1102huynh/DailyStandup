import { Card, CardContent, CardHeader } from './ui/card';
import type { StandupEntry } from '../types';
import { Calendar, Clock, TrendingUp } from 'lucide-react';
import { CopyButton } from './CopyButton';

interface HistoryListProps {
  entries: StandupEntry[];
  onSelect: (entry: StandupEntry) => void;
}

export function HistoryList({ entries, onSelect }: HistoryListProps) {
  if (entries.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto w-20 h-20 bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800 rounded-full flex items-center justify-center mb-4">
          <TrendingUp className="h-10 w-10 text-slate-400 dark:text-slate-300" />
        </div>
        <p className="text-slate-600 dark:text-slate-200 text-sm font-medium">No history yet</p>
        <p className="text-slate-500 dark:text-slate-300 text-xs mt-1">Generate your first standup!</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {entries.map((entry, index) => (
        <Card
          key={entry.id}
          className="cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-[1.02] bg-white dark:bg-slate-800 backdrop-blur-sm border-slate-200 dark:border-slate-700 group animate-in fade-in slide-in-from-bottom-2"
          style={{ animationDelay: `${index * 50}ms` }}
          onClick={() => onSelect(entry)}
        >
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-200">
                <Calendar className="h-3.5 w-3.5" />
                <span>{entry.createdAt.toLocaleDateString()}</span>
                <Clock className="h-3.5 w-3.5 ml-1" />
                <span>{entry.createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
            </div>
            <div className="flex gap-2 mt-2">
              <span className="px-2 py-1 rounded-lg bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/40 dark:to-purple-900/40 text-xs font-semibold text-blue-800 dark:text-blue-200 border border-blue-300 dark:border-blue-700">
                {entry.tone}
              </span>
              <span className="px-2 py-1 rounded-lg bg-gradient-to-r from-green-100 to-teal-100 dark:from-green-900/40 dark:to-teal-900/40 text-xs font-semibold text-green-800 dark:text-green-200 border border-green-300 dark:border-green-700">
                {entry.style}
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <pre className="text-xs whitespace-pre-wrap font-sans text-slate-700 dark:text-slate-100 line-clamp-3 leading-relaxed">
              {entry.generatedText}
            </pre>
            <div className="mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200" onClick={(e) => e.stopPropagation()}>
              <CopyButton text={entry.generatedText} />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

