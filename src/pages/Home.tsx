import { useState } from 'react';
import { Gamepad2, Trophy } from 'lucide-react';
import PremiumModal from '../components/ui/PremiumModal';
import PaymentGateway from '../components/payment/PaymentGateway';
import PlanCard from '../components/ui/PlanCard';
import { useNavigate } from 'react-router-dom';
import useSubscribe from '@/hooks/useSubscribe';
import usePlans from '@/hooks/usePlans';

const Home = () => {
  const navigate = useNavigate();
  // Track which premium modal is open: 'classic', 'gold', or null
  const [openPremiumType, setOpenPremiumType] = useState<null | 'classic' | 'gold'>(null);
  const [showPayment, setShowPayment] = useState(false);
  const [paymentData, setPaymentData] = useState<any>(null);
  const { subscribe, loading: subscribeLoading, error: subscribeError } = useSubscribe();
  const { plans, loading: plansLoading, error: plansError } = usePlans();

  // Classic (lower level) plan data
  const classicData = {
    title: "Classic Plan (Free Trial)",
    description: "Start with a free trial and basic features. Upgrade anytime for more.",
    plans: [
      {
        id: 'classic-free',
        name: 'Free Trial',
        price: 0,
        period: 'one-time',
        highlight: true,
        badge: 'FREE'
      },
      {
        id: 'classic-monthly',
        name: 'Classic Monthly',
        price: 4.99,
        period: 'month'
      }
    ],
    features: [
      'Host up to 5 matches',
      'Basic match tracking',
      'Score management',
      'Player statistics'
    ]
  };

  // Gold (premium) plan data
  const goldData = {
    title: "Gold Plan",
    description: "Unlock all premium features, unlimited tournaments, and priority support.",
    plans: [
      {
        id: 'gold-monthly',
        name: 'Gold Monthly',
        price: 9.99,
        period: 'month'
      },
      {
        id: 'gold-yearly',
        name: 'Gold Yearly',
        price: 89.99,
        period: 'year',
        originalPrice: 119.88,
        highlight: true,
        badge: 'BEST VALUE'
      }
    ],
    features: [
      'Unlimited Tournament Creation',
      'Advanced Customization Options',
      'Real-time Match Analytics',
      'Priority Support',
      'Exclusive Badges & Emotes',
      'Ad-Free Experience'
    ]
  };

  // Dummy onSubscribe handler
  const handleSubscribe = (planId: string, amount: number) => {
    if (openPremiumType === 'gold' && amount !== 0) {
      setPaymentData({
        amount,
        currency: '$',
        description: `Gold Subscription - ${planId}`
      });
      setShowPayment(true);
      // Don't close modal yet, let PaymentGateway handle it
    } else {
      alert(`Subscribe to ${planId} for $${amount}`);
      subscribe({ role: "admin" });
      setOpenPremiumType(null);
    }
  };

  const handlePaymentSuccess = (transactionId: string) => {
    alert(`Payment successful! Transaction ID: ${transactionId}`);
    setShowPayment(false);
    setOpenPremiumType(null);
  };

  const handlePaymentError = (error: string) => {
    alert(`Payment failed: ${error}`);
    setShowPayment(false);
    // Optionally keep modal open for retry
  };
  console.log("Rendering Home Page");
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

        {/* Subscription Plans */}
        <div className="w-full max-w-7xl mx-auto px-4">
          {plansLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
              <p className="text-white mt-4">Loading plans...</p>
            </div>
          ) : plansError ? (
            <div className="text-center py-12">
              <p className="text-red-400">Error: {plansError}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {plans.map((plan) => (
                <PlanCard 
                  key={plan.id}
                  plan={plan}
                  onSelect={(planId) => {
                    console.log('Selected plan:', planId);
                    if (planId <= 2) {
                      setOpenPremiumType('classic');
                    } else {
                      setOpenPremiumType('gold');
                    }
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-16 text-center text-gray-500 text-sm">
          <p>Copyright / A Monisteral Fault .com | Creslient Perfectitis | Privacy Policy | Untadat Features</p>
        </div>
      </div>

      {/* Render the correct modal based on openPremiumType */}
      {openPremiumType === 'classic' && (
        <PremiumModal
          isOpen={true}
          onClose={() => setOpenPremiumType(null)}
          title={classicData.title}
          description={classicData.description}
          plans={classicData.plans}
          features={classicData.features}
          onSubscribe={handleSubscribe}
        />
      )}
      {openPremiumType === 'gold' && !showPayment && (
        <PremiumModal
          isOpen={true}
          onClose={() => setOpenPremiumType(null)}
          title={goldData.title}
          description={goldData.description}
          plans={goldData.plans}
          features={goldData.features}
          onSubscribe={handleSubscribe}
        />
      )}
      {openPremiumType === 'gold' && showPayment && paymentData && (
        <PaymentGateway
          paymentData={paymentData}
          onSuccess={handlePaymentSuccess}
          onError={handlePaymentError}
          onCancel={() => setShowPayment(false)}
        />
      )}
    </div>
  );
};

export default Home;