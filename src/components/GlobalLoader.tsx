import { useEffect, useState } from 'react';
import { useTheme } from '../context/ThemeContext';

const GlobalLoader = () => {
  const [loading, setLoading] = useState(true);
  const { theme } = useTheme();

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  if (!loading) return null;

  return (
    <div className={`fixed inset-0 z-[9999] flex items-center justify-center backdrop-blur-md ${theme === 'dark' ? 'bg-black/60' : 'bg-white/60'}`}>
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Loading...</p>
      </div>
    </div>
  );
};

export default GlobalLoader;
