import { useState } from 'react';
import { Gamepad2, User, Settings, Menu, X } from 'lucide-react';


const PublicHeader = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogin = () => {
    window.location.href = '/login';
  };

  return (
    <header className="bg-slate-900 text-white px-4 sm:px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Gamepad2 className="text-green-400" size={32} />
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <a href="#" className="text-green-400 border-b-2 border-green-400 pb-1">Home</a>
          <a href="#" className="hover:text-green-400">Matches</a>
          <a href="#" className="hover:text-green-400">Tournaments</a>
          <a href="#" className="hover:text-green-400">Leaderboards</a>
          <a href="#" className="hover:text-green-400">Profile</a>
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-4">
          <div className="flex items-center gap-2">
            <User className="bg-gray-600 rounded-full p-1" size={32} />
            <button onClick={handleLogin} className="text-white hover:text-green-400">
              Login
            </button>
          </div>
          <Settings className="hover:text-green-400 cursor-pointer" size={20} />
        </div>

        {/* Mobile Menu Button */}
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden text-white"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden mt-4 pb-4 border-t border-gray-700">
          <nav className="flex flex-col gap-4 mt-4">
            <a href="#" className="text-green-400 border-b border-green-400 pb-2">Home</a>
            <a href="#" className="hover:text-green-400">Matches</a>
            <a href="#" className="hover:text-green-400">Tournaments</a>
            <a href="#" className="hover:text-green-400">Leaderboards</a>
            <a href="#" className="hover:text-green-400">Profile</a>
          </nav>
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-700">
            <button onClick={handleLogin} className="flex items-center gap-2 text-white hover:text-green-400">
              <User className="bg-gray-600 rounded-full p-1" size={24} />
              Login
            </button>
            <Settings className="hover:text-green-400 cursor-pointer" size={20} />
          </div>
        </div>
      )}
    </header>
  );
};

export default PublicHeader;