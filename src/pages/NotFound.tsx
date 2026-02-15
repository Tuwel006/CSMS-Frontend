import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft, Search } from 'lucide-react';
import { Box, Stack } from '../components/ui/lib';
import Button from '../components/ui/Button';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center p-6">
      {/* Structural Accent Line */}
      <div className="fixed top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-cyan-600/30 to-transparent" />

      <div className="max-w-md w-full">
        <Stack align="center" gap="xl">
          {/* Minimalist Illustration */}
          <div className="relative">
            <h1 className="text-8xl md:text-9xl font-black text-[var(--text)] opacity-[0.03] select-none tracking-tighter">
              404
            </h1>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-[1px] bg-cyan-600 opacity-50" />
            </div>
          </div>

          <Stack align="center" gap="sm">
            <h2 className="text-xl font-black text-[var(--text)] uppercase tracking-[0.2em]">
              Path Not Found
            </h2>
            <p className="text-[var(--text-secondary)] text-center text-xs md:text-sm leading-relaxed max-w-[280px]">
              The requested resource is unavailable or has been relocated within the system.
            </p>
          </Stack>

          {/* Simple Classic Container */}
          <Box className="w-full border border-[var(--card-border)] bg-[var(--card-bg)] rounded-sm p-1.5 shadow-sm">
            <div className="border border-[var(--card-border)] rounded-sm p-6 space-y-6">
              <div className="grid grid-cols-1 gap-2">
                <Button
                  variant="primary"
                  onClick={() => navigate('/')}
                  className="h-10 font-black uppercase tracking-widest text-[9px] bg-cyan-600 hover:bg-cyan-700"
                  leftIcon={<Home size={14} />}
                >
                  Return to Dashboard
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate(-1)}
                  className="h-10 font-black uppercase tracking-widest text-[9px] border-[var(--card-border)]"
                  leftIcon={<ArrowLeft size={14} />}
                >
                  Previous Page
                </Button>
              </div>

              <div className="pt-4 border-t border-[var(--card-border)]">
                <div className="flex items-center justify-center gap-4">
                  <button
                    onClick={() => navigate('/matches')}
                    className="text-[var(--text-secondary)] hover:text-cyan-600 text-[9px] font-black uppercase tracking-widest transition-colors flex items-center gap-1.5"
                  >
                    <Search size={12} strokeWidth={3} />
                    View Matches
                  </button>
                  <div className="w-1 h-1 rounded-full bg-[var(--card-border)]" />
                  <button
                    onClick={() => navigate('/login')}
                    className="text-[var(--text-secondary)] hover:text-cyan-600 text-[9px] font-black uppercase tracking-widest transition-colors"
                  >
                    System Login
                  </button>
                </div>
              </div>
            </div>
          </Box>

          {/* Minimal Branding */}
          <div className="flex flex-col items-center gap-1.5 opacity-30">
            <h3 className="text-[10px] font-black text-[var(--text)] tracking-tighter uppercase font-outfit">
              CSMS <span className="text-cyan-600">Portal</span>
            </h3>
            <div className="w-4 h-[1px] bg-cyan-600" />
          </div>
        </Stack>
      </div>
    </div>
  );
};

export default NotFound;