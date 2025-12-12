import { LogIn, LogOut, Sparkles } from 'lucide-react';
import { Button } from './ui/button';
import { useAuth } from '../hooks/useAuth';

export function Header() {
  const { user, signIn, signOut } = useAuth();

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/70 dark:bg-slate-900/70 border-b border-white/20 shadow-lg">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          {/* Logo and Title */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl blur-lg opacity-50 animate-pulse"></div>
              <div className="relative bg-gradient-to-br from-blue-500 to-purple-600 p-3 rounded-2xl shadow-xl">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                Daily Standup Generator
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-200 mt-1 font-medium">
                Generate professional standup updates in seconds ✨
              </p>
            </div>
          </div>

          {/* User Section */}
          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4">
                <div className="hidden sm:flex items-center gap-3 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
                  {user.photoURL && (
                    <img
                      src={user.photoURL}
                      alt={user.displayName || 'User'}
                      className="w-10 h-10 rounded-full ring-2 ring-white shadow-lg"
                    />
                  )}
                  <div className="text-sm">
                    <p className="font-semibold text-slate-800 dark:text-white">{user.displayName}</p>
                    <p className="text-slate-500 dark:text-slate-200 text-xs">{user.email}</p>
                  </div>
                </div>
                <Button
                  onClick={signOut}
                  variant="outline"
                  size="sm"
                  className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-white/20 hover:bg-white/80 dark:hover:bg-slate-800/80"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            ) : (
              <Button
                onClick={signIn}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <LogIn className="h-4 w-4 mr-2" />
                Sign in with Google
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

