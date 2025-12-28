import { useState } from 'react';
import PremiumModal from '../components/ui/PremiumModal';
import PaymentGateway from '../components/payment/PaymentGateway';
import PlanCard from '../components/ui/PlanCard';
import useRoleUpdate from '../hooks/useRoleUpdate';

const HomePage = () => {
  const [showFreeModal, setShowFreeModal] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [paymentData, setPaymentData] = useState<any>(null);
  const { mutate } = useRoleUpdate();

  const freeTrialData = {
    title: "Create 5 Matches Free!",
    description: "Start with 5 free matches, then add payment details to continue hosting more matches.",
    plans: [
      {
        id: 'free-matches',
        name: '5 Free Matches',
        price: 0,
        period: 'one-time',
        highlight: true,
        badge: 'FREE'
      },
      {
        id: 'monthly-basic',
        name: 'Monthly Plan',
        price: 7.99,
        period: 'month',
        originalPrice: 9.99
      }
    ],
    features: [
      'Host 5 matches for free',
      'Basic match tracking',
      'Score management',
      'Player statistics',
      'Add payment for unlimited matches'
    ]
  };

  const premiumData = {
    title: "Unlock Premium Features!",
    description: "Get full access to all premium features and take your cricket management to the next level.",
    plans: [
      {
        id: 'monthly',
        name: 'Monthly',
        price: 9.99,
        period: 'month'
      },
      {
        id: 'yearly',
        name: 'Yearly',
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

  const handleSubscribe = (planId: string, amount: number) => {
    console.log('Subscribe clicked:', planId, amount);
    
    if (planId === 'free-matches' && amount === 0) {
      mutate({ userId: "user123", role: 'admin' });
      return;
    }
    
    setPaymentData({
      amount,
      currency: '$',
      description: `${planId.includes('free') ? 'Free Plan Setup' : 'Premium Subscription'} - ${planId}`
    });
    setShowFreeModal(false);
    setShowPremiumModal(false);
    setShowPayment(true);
  };

  const handlePaymentSuccess = (transactionId: string) => {
    console.log('Payment successful:', transactionId);
    setShowPayment(false);
    // Handle successful payment
  };

  const handlePaymentError = (error: string) => {
    console.error('Payment failed:', error);
    setShowPayment(false);
    // Handle payment error
  };

  const mockPlans = [
    {
      id: 1,
      name: "Starter",
      description: "Perfect for small cricket clubs and local tournaments",
      price: "29.99",
      currency: "USD",
      billing_cycle: "monthly",
      is_popular: false,
      analytics_enabled: false,
      custom_branding: false,
      api_access: false,
      priority_support: false,
      live_streaming: false,
      advanced_reporting: false,
      max_matches_per_month: 10,
      max_tournaments_per_month: 2,
      max_users: 5
    },
    {
      id: 2,
      name: "Professional",
      description: "Ideal for cricket academies and regional tournaments",
      price: "99.99",
      currency: "USD",
      billing_cycle: "monthly",
      is_popular: true,
      analytics_enabled: true,
      custom_branding: true,
      api_access: true,
      priority_support: true,
      live_streaming: true,
      advanced_reporting: true,
      max_matches_per_month: 50,
      max_tournaments_per_month: 10,
      max_users: 25
    },
    {
      id: 3,
      name: "Enterprise",
      description: "For cricket boards and large-scale tournament management",
      price: "299.99",
      currency: "USD",
      billing_cycle: "monthly",
      is_popular: false,
      analytics_enabled: true,
      custom_branding: true,
      api_access: true,
      priority_support: true,
      live_streaming: true,
      advanced_reporting: true,
      max_matches_per_month: null,
      max_tournaments_per_month: null,
      max_users: null
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Choose Your Plan</h1>
          <p className="text-xl text-gray-600">Select the perfect plan for your cricket management needs</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {mockPlans.map((plan) => (
            <PlanCard 
              key={plan.id}
              plan={plan}
              onSelect={(planId) => {
                console.log('Selected plan:', planId);
                setShowPremiumModal(true);
              }}
            />
          ))}
        </div>
      </div>

      {showFreeModal && (
        <>
          {console.log('freeTrialData', freeTrialData)}
          <PremiumModal
            isOpen={showFreeModal}
            onClose={() => setShowFreeModal(false)}
            title={freeTrialData.title}
            description={freeTrialData.description}
            plans={freeTrialData.plans}
            features={freeTrialData.features}
            onSubscribe={handleSubscribe}
          />
        </>
      )}

      {showPremiumModal && (
        <PremiumModal
          isOpen={showPremiumModal}
          onClose={() => setShowPremiumModal(false)}
          title={premiumData.title}
          description={premiumData.description}
          plans={premiumData.plans}
          features={premiumData.features}
          onSubscribe={handleSubscribe}
        />
      )}

      {showPayment && paymentData && (
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

export default HomePage;