import { useState } from 'react';
import { Gamepad2, Trophy } from 'lucide-react';
import PremiumModal from '../components/ui/PremiumModal';

const Home = () => {
  const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false);
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden" style={{backgroundImage: 'url("https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80")', backgroundSize: 'cover', backgroundPosition: 'center'}}>
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] px-6 bg-black/50">
        {/* Main Content */}
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Start Your Game!
          </h1>
          <p className="text-xl text-gray-300 mb-2">Choose your challenge:</p>
          <div className="w-24 h-1 bg-gradient-to-r from-green-400 to-blue-400 mx-auto rounded"></div>
        </div>

        {/* Game Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full">
          {/* Single Match Card */}
          <div className="bg-slate-800/50 backdrop-blur-sm border-2 border-green-400 rounded-2xl p-8 hover:bg-slate-700/50 transition-all duration-300 group">
            <div className="text-center">
              <div className="mb-6">
                <Gamepad2 className="text-green-400 mx-auto mb-4" size={64} />
              </div>
              <h2 className="text-2xl font-bold text-green-400 mb-4">Create Single Match</h2>
              <p className="text-gray-300 mb-6 leading-relaxed">
                Quickly set a casual 1v1 or team match.<br />
                No fuss, just pure gaming fun.
              </p>
              <div className="mb-6">
                <span className="text-3xl font-bold text-green-400">FREE</span>
              </div>
              <button className="w-full bg-green-400 text-slate-900 py-3 px-6 rounded-xl font-semibold hover:bg-green-300 transition-colors">
                Start Match Now
              </button>
            </div>
          </div>

          {/* Tournament Card */}
          <div className="bg-slate-800/50 backdrop-blur-sm border-2 border-yellow-400 rounded-2xl p-8 hover:bg-slate-700/50 transition-all duration-300 group relative">
            {/* Premium Badge */}
            <div className="absolute -top-4 -right-4 bg-yellow-400 text-slate-900 px-3 py-1 rounded-full text-sm font-bold transform rotate-12">
              PREMIUM
            </div>
            
            <div className="text-center">
              <div className="mb-6">
                <Trophy className="text-yellow-400 mx-auto mb-4" size={64} />
              </div>
              <h2 className="text-2xl font-bold text-blue-400 mb-4">Create Tournament</h2>
              <p className="text-gray-300 mb-6 leading-relaxed">
                Organize competitive brackets, invite<br />
                friends, and track standings.
              </p>
              <div className="mb-2">
                <span className="text-xl font-bold text-white">Premium Feature</span>
                <span className="text-yellow-400 ml-2">🔒</span>
              </div>
              <button 
                onClick={() => setIsPremiumModalOpen(true)}
                className="w-full bg-blue-400 text-slate-900 py-3 px-6 rounded-xl font-semibold hover:bg-blue-300 transition-colors"
              >
                Unlock Tournament Features
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-16 text-center text-gray-500 text-sm">
          <p>Copyright / A Monisteral Fault .com | Creslient Perfectitis | Privacy Policy | Untadat Features</p>
        </div>
      </div>
      
      <PremiumModal 
        isOpen={isPremiumModalOpen} 
        onClose={() => setIsPremiumModalOpen(false)} 
      />
    </div>
  );
};

export default Home;