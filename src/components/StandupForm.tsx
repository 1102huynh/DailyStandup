import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { Sparkles, RotateCcw, History, Download, Calendar, CheckCircle2, AlertCircle } from 'lucide-react';
import type { StandupInput, StandupOptions, ToneType, StyleType, StandupEntry } from '../types';
import { standupGenerator } from '../services/standupGenerator';
import { storageService } from '../services/storageService';
import { CopyButton } from './CopyButton';
import { HistoryList } from './HistoryList';
import { useAuth } from '../hooks/useAuth';

export function StandupForm() {
  const { user } = useAuth();
  const [input, setInput] = useState<StandupInput>({
    yesterday: '',
    today: '',
    blockers: ''
  });

  const [options, setOptions] = useState<StandupOptions>({
    tone: 'formal',
    style: 'standard'
  });

  const [generatedText, setGeneratedText] = useState('');
  const [history, setHistory] = useState<StandupEntry[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    loadHistory();
  }, [user]);

  useEffect(() => {
    setSuggestions(standupGenerator.getSuggestions(input));
  }, [input]);

  const loadHistory = () => {
    const localHistory = storageService.getLocalHistory();
    setHistory(localHistory);
  };

  const handleReset = () => {
    setInput({ yesterday: '', today: '', blockers: '' });
    setGeneratedText('');
    setSuggestions([]);
  };

  const handleLoadFromHistory = (entry: StandupEntry) => {
    setInput({
      yesterday: entry.yesterday,
      today: entry.today,
      blockers: entry.blockers
    });
    setOptions({
      tone: entry.tone,
      style: entry.style
    });
    setGeneratedText(entry.generatedText);
  };

  const handleExportHistory = () => {
    storageService.exportHistory(history);
  };

  const handleGenerate = () => {
    if (!input.yesterday && !input.today) {
      alert('Please fill in at least Yesterday and Today fields');
      return;
    }

    setIsGenerating(true);
    // Simulate generation delay for better UX
    setTimeout(() => {
      const generated = standupGenerator.generate(input, options);
      setGeneratedText(generated);

      // Save to localStorage
      storageService.saveToLocal({
        ...input,
        ...options,
        generatedText: generated
      });

      // Save to cloud if user is logged in
      if (user) {
        storageService.saveToCloud({
          ...input,
          ...options,
          generatedText: generated
        }, user.uid).catch(console.error);
      }

      // Reload history
      loadHistory();
      setIsGenerating(false);
    }, 800);
  };

  // ...existing code...

  const toneButtons: { value: ToneType; label: string; emoji: string; gradient: string }[] = [
    { value: 'formal', label: 'Formal', emoji: '💼', gradient: 'from-slate-500 to-slate-600' },
    { value: 'casual', label: 'Casual', emoji: '👋', gradient: 'from-blue-500 to-cyan-500' },
    { value: 'humorous', label: 'Humorous', emoji: '😄', gradient: 'from-yellow-500 to-orange-500' }
  ];

  const styleButtons: { value: StyleType; label: string; emoji: string; gradient: string }[] = [
    { value: 'short', label: 'Short', emoji: '⚡', gradient: 'from-purple-500 to-pink-500' },
    { value: 'standard', label: 'Standard', emoji: '📝', gradient: 'from-blue-500 to-indigo-500' },
    { value: 'manager', label: 'Manager', emoji: '👔', gradient: 'from-green-500 to-teal-500' },
    { value: 'developer', label: 'Developer', emoji: '💻', gradient: 'from-orange-500 to-red-500' }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="backdrop-blur-sm bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-2xl hover:shadow-3xl transition-all duration-300">
            <CardHeader className="border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
                  <Calendar className="h-5 w-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-2xl bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                    Generate Your Daily Standup
                  </CardTitle>
                  <CardDescription className="text-slate-600 dark:text-slate-200 font-medium">
                    Fill in your updates and choose your preferred tone and style
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              {/* Yesterday Input */}
              <div className="space-y-3">
                <Label htmlFor="yesterday" className="text-base font-semibold flex items-center gap-2 text-slate-800 dark:text-white">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  Yesterday's Achievements
                </Label>
                <Textarea
                  id="yesterday"
                  placeholder="What did you accomplish yesterday? (one item per line)&#10;Example:&#10;• Completed user authentication module&#10;• Fixed critical bug in payment system"
                  value={input.yesterday}
                  onChange={(e) => setInput({ ...input, yesterday: e.target.value })}
                  rows={5}
                  className="resize-none bg-white dark:bg-slate-800 backdrop-blur-sm border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-blue-500 transition-all text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-400"
                />
              </div>

              {/* Today Input */}
              <div className="space-y-3">
                <Label htmlFor="today" className="text-base font-semibold flex items-center gap-2 text-slate-800 dark:text-white">
                  <Sparkles className="h-5 w-5 text-blue-500" />
                  Today's Goals
                </Label>
                <Textarea
                  id="today"
                  placeholder="What will you work on today? (one item per line)&#10;Example:&#10;• Implement password reset feature&#10;• Review pull requests from team"
                  value={input.today}
                  onChange={(e) => setInput({ ...input, today: e.target.value })}
                  rows={5}
                  className="resize-none bg-white dark:bg-slate-800 backdrop-blur-sm border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-blue-500 transition-all text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-400"
                />
              </div>

              {/* Blockers Input */}
              <div className="space-y-3">
                <Label htmlFor="blockers" className="text-base font-semibold flex items-center gap-2 text-slate-800 dark:text-white">
                  <AlertCircle className="h-5 w-5 text-red-500" />
                  Blockers <span className="text-slate-500 dark:text-slate-300 font-normal text-sm">(optional)</span>
                </Label>
                <Textarea
                  id="blockers"
                  placeholder="Any blockers or issues? (one item per line)&#10;Example:&#10;• Waiting for API documentation&#10;• Need review on PR #123"
                  value={input.blockers}
                  onChange={(e) => setInput({ ...input, blockers: e.target.value })}
                  rows={4}
                  className="resize-none bg-white dark:bg-slate-800 backdrop-blur-sm border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-blue-500 transition-all text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-400"
                />
              </div>

              {/* Suggestions */}
              {suggestions.length > 0 && (
                <div className="bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/40 dark:to-purple-900/40 rounded-2xl p-5 space-y-2 border border-blue-300 dark:border-blue-700">
                  <p className="text-sm font-semibold text-blue-800 dark:text-blue-100 flex items-center gap-2">
                    <Sparkles className="h-4 w-4" />
                    Smart Suggestions
                  </p>
                  {suggestions.map((suggestion, idx) => (
                    <p key={idx} className="text-sm text-slate-800 dark:text-slate-100 pl-6 font-medium">
                      • {suggestion}
                    </p>
                  ))}
                </div>
              )}

              {/* Tone Selection */}
              <div className="space-y-3">
                <Label className="text-base font-semibold text-slate-800 dark:text-white">Select Tone</Label>
                <div className="flex gap-3 flex-wrap">
                  {toneButtons.map(({ value, label, emoji, gradient }) => (
                    <Button
                      key={value}
                      type="button"
                      variant={options.tone === value ? 'default' : 'outline'}
                      onClick={() => setOptions({ ...options, tone: value })}
                      className={`flex-1 min-w-[110px] transition-all duration-300 font-semibold ${
                        options.tone === value 
                          ? `bg-gradient-to-r ${gradient} hover:scale-105 shadow-lg text-white border-0` 
                          : 'bg-white dark:bg-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600 border-slate-300 dark:border-slate-600 text-slate-800 dark:text-white'
                      }`}
                    >
                      <span className="mr-2 text-lg">{emoji}</span>
                      {label}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Style Selection */}
              <div className="space-y-3">
                <Label className="text-base font-semibold text-slate-800 dark:text-white">Select Style</Label>
                <div className="grid grid-cols-2 gap-3">
                  {styleButtons.map(({ value, label, emoji, gradient }) => (
                    <Button
                      key={value}
                      type="button"
                      variant={options.style === value ? 'default' : 'outline'}
                      onClick={() => setOptions({ ...options, style: value })}
                      className={`transition-all duration-300 font-semibold ${
                        options.style === value 
                          ? `bg-gradient-to-r ${gradient} hover:scale-105 shadow-lg text-white border-0` 
                          : 'bg-white dark:bg-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600 border-slate-300 dark:border-slate-600 text-slate-800 dark:text-white'
                      }`}
                    >
                      <span className="mr-2 text-lg">{emoji}</span>
                      {label}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <Button
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                  size="lg"
                >
                  {isGenerating ? (
                    <>
                      <div className="h-5 w-5 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-5 w-5 mr-2" />
                      Generate Standup
                    </>
                  )}
                </Button>
                <Button
                  onClick={handleReset}
                  variant="outline"
                  size="lg"
                  className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-white/20 hover:bg-white dark:hover:bg-slate-800"
                >
                  <RotateCcw className="h-5 w-5" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Generated Output */}
          {generatedText && (
            <Card className="backdrop-blur-sm bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 border-green-300 dark:border-green-700 shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
              <CardHeader className="border-b border-green-300 dark:border-green-700 bg-gradient-to-r from-green-100/50 to-emerald-100/50 dark:from-green-900/30 dark:to-emerald-900/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg">
                      <CheckCircle2 className="h-5 w-5 text-white" />
                    </div>
                    <CardTitle className="text-2xl bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400 bg-clip-text text-transparent">
                      Generated Standup
                    </CardTitle>
                  </div>
                  <CopyButton text={generatedText} />
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <pre className="whitespace-pre-wrap font-sans bg-white dark:bg-slate-800 backdrop-blur-sm p-6 rounded-xl text-sm leading-relaxed text-slate-900 dark:text-white border border-green-200 dark:border-green-700 shadow-inner">
                  {generatedText}
                </pre>
              </CardContent>
            </Card>
          )}
        </div>

        {/* History Sidebar */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24 backdrop-blur-sm bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-2xl">
            <CardHeader className="border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg shadow-lg">
                    <History className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-xl text-slate-900 dark:text-white">History</CardTitle>
                    <CardDescription className="text-xs text-slate-600 dark:text-slate-200 font-medium">
                      {history.length} saved {history.length === 1 ? 'entry' : 'entries'}
                    </CardDescription>
                  </div>
                </div>
                {history.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleExportHistory}
                    className="hover:bg-white/50 dark:hover:bg-slate-800/50"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="max-h-[calc(100vh-16rem)] overflow-y-auto pt-4">
              <HistoryList
                entries={history}
                onSelect={handleLoadFromHistory}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

