import { Gamepad2, User, Settings } from 'lucide-react';
import useAuthToken from '../../hooks/useAuthToken';

const ProtectedHeader = () => {
  const { payload, clearToken } = useAuthToken();

  return (
    <header className="bg-slate-900 text-white px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Gamepad2 className="text-green-400" size={32} />
        </div>
        
        <nav className="flex items-center gap-8">
          <a href="#" className="text-green-400 border-b-2 border-green-400 pb-1">Home</a>
          <a href="#" className="hover:text-green-400">Matches</a>
          <a href="#" className="hover:text-green-400">Tournaments</a>
          <a href="#" className="hover:text-green-400">Leaderboards</a>
          <a href="#" className="hover:text-green-400">Profile</a>
        </nav>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <User className="bg-gray-600 rounded-full p-1" size={32} />
            <span className="text-white">{payload?.email || 'PlayerX'}</span>
          </div>
          
          <button onClick={clearToken}>
            <Settings className="hover:text-green-400 cursor-pointer" size={20} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default ProtectedHeader;