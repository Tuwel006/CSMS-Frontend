import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { Crown, Zap, Shield, CheckCircle, RefreshCw, AlertCircle } from 'lucide-react';
import { cn } from '../lib/utils';
import usePlans from '../hooks/usePlans';
import useSubscribe from '../hooks/useSubscribe';
import PaymentGateway from '../components/payment/PaymentGateway';
import PlanCard from '../components/ui/lib/PlanCard';

const Home = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const isDark = theme === 'dark';
  const { plans, loading, error, refetch } = usePlans();
  const { subscribe } = useSubscribe();
  
  const [showPayment, setShowPayment] = useState(false);
  const [paymentData, setPaymentData] = useState<any>(null);

  console.log('Home render:', { plans, loading, error, plansLength: plans?.length });

  const handlePlanSelect = (planId: number) => {
    const plan = plans.find(p => p.id === planId);
    if (!plan) return;
    
    if (parseFloat(plan.price) === 0) {
      subscribe({ userId: "user123", role: "admin" });
      navigate('/admin');
    } else {
      setPaymentData({
        amount: parseFloat(plan.price),
        currency: plan.currency,
        description: `${plan.name} - ${plan.billing_cycle}ly`
      });
      setShowPayment(true);
    }
  };

  const handlePaymentSuccess = () => {
    subscribe({ userId: "user123", role: "admin" });
    setShowPayment(false);
    navigate('/admin');
  };

  const benefits = [
    { icon: Zap, title: 'Instant Setup', description: 'Get your cricket club running in minutes' },
    { icon: Crown, title: 'Professional Tools', description: 'Advanced scoring and tournament management' },
    { icon: Shield, title: 'Secure & Reliable', description: 'Your data is safe with enterprise-grade security' },
    { icon: CheckCircle, title: 'Proven Success', description: 'Trusted by 500+ cricket clubs worldwide' }
  ];

  const PlanSkeleton = () => (
    <div className={cn('p-4 rounded-xs border animate-pulse', isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200')}>
      <div className="space-y-3">
        <div className={cn('h-3 rounded w-20 mx-auto', isDark ? 'bg-gray-700' : 'bg-gray-200')} />
        <div className={cn('h-8 rounded w-16 mx-auto', isDark ? 'bg-gray-700' : 'bg-gray-200')} />
        <div className="space-y-2">
          {[1,2,3].map(i => <div key={i} className={cn('h-2 rounded', isDark ? 'bg-gray-700' : 'bg-gray-200')} />)}
        </div>
        <div className={cn('h-8 rounded', isDark ? 'bg-gray-700' : 'bg-gray-200')} />
      </div>
    </div>
  );

  const ErrorState = () => (
    <div className="text-center py-12">
      <AlertCircle className={cn('w-12 h-12 mx-auto mb-4', isDark ? 'text-red-400' : 'text-red-600')} />
      <h3 className={cn('text-lg font-semibold mb-2', isDark ? 'text-white' : 'text-gray-900')}>Unable to Load Plans</h3>
      <p className={cn('text-sm mb-4', isDark ? 'text-gray-400' : 'text-gray-600')}>Please try again</p>
      <button onClick={refetch} className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xs text-sm">
        <RefreshCw className="w-4 h-4" /> Try Again
      </button>
    </div>
  );

  const EmptyState = () => (
    <div className="text-center py-12">
      <Crown className={cn('w-12 h-12 mx-auto mb-4', isDark ? 'text-gray-400' : 'text-gray-600')} />
      <h3 className={cn('text-lg font-semibold mb-2', isDark ? 'text-white' : 'text-gray-900')}>No Plans Available</h3>
      <p className={cn('text-sm', isDark ? 'text-gray-400' : 'text-gray-600')}>Check back soon</p>
    </div>
  );

  // Render plans section content
  const renderPlansContent = () => {
    if (loading) {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1,2,3].map(i => <PlanSkeleton key={i} />)}
        </div>
      );
    }
    
    if (error) {
      return <ErrorState />;
    }
    
    if (!plans || plans.length === 0) {
      return <EmptyState />;
    }
    
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {plans.map(plan => (
          <PlanCard key={plan.id} plan={plan} onSelect={handlePlanSelect} />
        ))}
      </div>
    );
  };

  return (
    <div className={cn('min-h-screen relative', isDark ? 'bg-gradient-to-br from-gray-900 to-gray-800' : 'bg-gradient-to-br from-blue-50 to-white')}>      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <h1 className={cn('text-3xl md:text-5xl font-bold bg-gradient-to-r bg-clip-text text-transparent', isDark ? 'from-white to-gray-300' : 'from-gray-900 to-gray-600')}>
            Choose Your Plan
          </h1>
          <p className={cn('text-sm max-w-2xl mx-auto', isDark ? 'text-gray-300' : 'text-gray-600')}>
            Subscribe to create your club and access the admin dashboard
          </p>
        </div>

        {/* Benefits */}
        <div className="space-y-4">
          <div className="text-center">
            <h2 className={cn('text-xl font-bold', isDark ? 'text-white' : 'text-gray-900')}>Why Choose CSMS?</h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {benefits.map((benefit, i) => (
              <div key={i} className={cn('p-3 rounded-xs text-center', isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200')}>
                <benefit.icon className={cn('w-6 h-6 mx-auto mb-2', isDark ? 'text-blue-400' : 'text-blue-600')} />
                <h3 className={cn('text-xs font-semibold mb-1', isDark ? 'text-white' : 'text-gray-900')}>{benefit.title}</h3>
                <p className={cn('text-[10px]', isDark ? 'text-gray-400' : 'text-gray-600')}>{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Plans */}
        <div className="space-y-4">
          <div className="text-center">
            <h2 className={cn('text-xl font-bold', isDark ? 'text-white' : 'text-gray-900')}>Subscription Plans</h2>
          </div>
          {renderPlansContent()}
        </div>
      </div>

      {showPayment && paymentData && (
        <PaymentGateway
          paymentData={paymentData}
          onSuccess={handlePaymentSuccess}
          onError={() => setShowPayment(false)}
          onCancel={() => setShowPayment(false)}
        />
      )}
    </div>
  );
};

export default Home;