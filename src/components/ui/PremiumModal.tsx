import { X, Rocket, Check } from 'lucide-react';

interface PremiumModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PremiumModal = ({ isOpen, onClose }: PremiumModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-2xl max-w-2xl w-full relative border border-slate-700">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <Rocket className="text-cyan-400" size={24} />
            <span className="text-cyan-400 font-bold">Premium Feature</span>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <h2 className="text-3xl font-bold text-white mb-2">Create Unforgettable Tournaments!</h2>
          <p className="text-gray-300 mb-8">
            You still wimlbe pour alo Tournarne And temvon that qpige wol por tseas fnat
            your delitey fna d apuule.
          </p>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div className="border-2 border-cyan-400 rounded-xl p-6 bg-slate-900/50">
              <h3 className="text-cyan-400 font-bold mb-2">Monthly</h3>
              <div className="text-3xl font-bold text-cyan-400 mb-2">$9.99<span className="text-lg text-gray-400">/month</span></div>
              <p className="text-gray-400 text-sm">Cancel anytime.</p>
            </div>
            
            <div className="border-2 border-yellow-400 rounded-xl p-6 bg-slate-900/50 relative">
              <div className="absolute -top-2 -right-2 bg-yellow-400 text-black px-2 py-1 rounded-full text-xs font-bold">
                BEST VALUE
              </div>
              <h3 className="text-white font-bold mb-2">Yearly</h3>
              <div className="text-3xl font-bold text-white mb-1">$89.99<span className="text-lg text-gray-400">/year</span></div>
              <p className="text-cyan-400 text-sm font-bold">Save $29.89 (25%)!</p>
            </div>
          </div>

          {/* Features */}
          <div className="mb-8">
            <h4 className="text-cyan-400 font-bold mb-4">What's Included:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Check className="text-green-400" size={16} />
                  <span className="text-gray-300 text-sm">Unlimited Tournament Creation</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="text-green-400" size={16} />
                  <span className="text-gray-300 text-sm">Advanced Customization Options</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="text-green-400" size={16} />
                  <span className="text-gray-300 text-sm">Real-time Match Analytics</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Check className="text-green-400" size={16} />
                  <span className="text-gray-300 text-sm">Priority Support</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="text-green-400" size={16} />
                  <span className="text-gray-300 text-sm">Exclusive Badges & Emotes</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="text-green-400" size={16} />
                  <span className="text-gray-300 text-sm">Ad-Free Experience</span>
                </div>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-4">
            <button className="flex-1 bg-cyan-400 text-black py-3 px-6 rounded-xl font-semibold hover:bg-cyan-300 transition-colors">
              Subscribe Now
            </button>
            <button 
              onClick={onClose}
              className="flex-1 bg-gray-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-gray-500 transition-colors"
            >
              Maybe Later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PremiumModal;