import { Header } from './components/Header';
import { StandupForm } from './components/StandupForm';
import { ToastContainer } from './components/Toast';
import { useToast } from './hooks/useToast';

function AppContent() {
  const { toasts, removeToast } = useToast();

  return (
    <>
      {/* Toast notifications */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />

      {/* Main content */}
      <div className="relative z-10">
        <Header />
        <StandupForm />
        <footer className="container mx-auto px-4 py-8 text-center">
          <div className="backdrop-blur-sm bg-white/30 dark:bg-slate-900/30 rounded-2xl p-6 border border-white/20 shadow-lg">
            <p className="text-sm text-slate-700 dark:text-slate-100 font-medium">
              Made with ❤️ for developers
            </p>
            <p className="text-xs text-slate-600 dark:text-slate-200 mt-2">
              Daily Standup Generator © 2025 | Boost your team productivity
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-950 dark:via-blue-950 dark:to-indigo-950">
      {/* Animated background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 dark:bg-purple-900 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-blue-300 dark:bg-blue-900 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-indigo-300 dark:bg-indigo-900 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <AppContent />
    </div>
  );
}

export default App;

