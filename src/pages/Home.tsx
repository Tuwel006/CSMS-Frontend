import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { Crown, Zap, Shield, CheckCircle, RefreshCw, AlertCircle } from 'lucide-react';
import { cn } from '../lib/utils';
import usePlans from '../hooks/usePlans';
import { useTenantDashboard } from '../hooks/useTenantDashboard';
import PaymentGateway from '../components/payment/PaymentGateway';
import PlanCard from '../components/ui/lib/PlanCard';
import ActivePlanCard from '../components/ActivePlanCard';
import { PageLoader } from '../components/ui/loading';
import { TenantService } from '../services/tenantService';
import { showToast } from '../utils/toast';

const Home = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const isDark = theme === 'dark';
  const { plans, loading, error, refetch } = usePlans();
  const { tenantData, loading: tenantLoading, refetch: refetchTenant } = useTenantDashboard();

  const [showPayment, setShowPayment] = useState(false);
  const [paymentData] = useState<any>(null);

  const handlePaymentSuccess = () => {
    setShowPayment(false);
    refetchTenant();
  };
  const [showOrgNameModal, setShowOrgNameModal] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState<number | null>(null);
  const [orgName, setOrgName] = useState('');

  console.log('Home render:', { plans, loading, error, plansLength: plans?.length, tenantData });

  const handlePlanSelect = (planId: number) => {
    const plan = plans.find(p => p.id === planId);
    if (!plan) return;

    setSelectedPlanId(planId);
    setShowOrgNameModal(true);
  };

  const handleOrgNameSubmit = async () => {
    if (!orgName.trim() || !selectedPlanId) {
      showToast.error('Please enter organization name');
      return;
    }

    try {
      await TenantService.createTenant({
        organizationName: orgName,
        planId: selectedPlanId
      });

      showToast.success('Organization created successfully!');
      setShowOrgNameModal(false);
      refetchTenant();
      navigate('/admin');
    } catch (error) {
      showToast.error('Failed to create organization');
    }
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
          {[1, 2, 3].map(i => <div key={i} className={cn('h-2 rounded', isDark ? 'bg-gray-700' : 'bg-gray-200')} />)}
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
          {[1, 2, 3].map(i => <PlanSkeleton key={i} />)}
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
            {tenantData ? 'Your Dashboard' : 'Choose Your Plan'}
          </h1>
          <p className={cn('text-sm max-w-2xl mx-auto', isDark ? 'text-gray-300' : 'text-gray-600')}>
            {tenantData ? 'Manage your organization and track usage' : 'Subscribe to create your club and access the admin dashboard'}
          </p>
        </div>

        {/* Active Plan or Plans Selection */}
        {tenantLoading ? (
          <PageLoader fullScreen={false} />
        ) : tenantData ? (
          <div className="space-y-6">
            <ActivePlanCard tenantData={tenantData} onUpgrade={refetchTenant} />

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <button
                onClick={() => navigate('/admin')}
                className={cn('p-4 rounded-xs border transition-all hover:scale-[1.02] hover:shadow-md', isDark ? 'bg-gray-800 border-gray-700 hover:border-blue-500' : 'bg-white border-gray-200 hover:border-blue-500')}
              >
                <Shield className={cn('w-6 h-6 mx-auto mb-2', isDark ? 'text-blue-400' : 'text-blue-600')} />
                <h3 className={cn('text-sm font-bold mb-0.5', isDark ? 'text-white' : 'text-gray-900')}>Admin Dashboard</h3>
                <p className={cn('text-[10px]', isDark ? 'text-gray-400' : 'text-gray-600')}>Manage organization</p>
              </button>

              <button
                onClick={() => navigate('/matches')}
                className={cn('p-4 rounded-xs border transition-all hover:scale-[1.02] hover:shadow-md', isDark ? 'bg-gray-800 border-gray-700 hover:border-blue-500' : 'bg-white border-gray-200 hover:border-blue-500')}
              >
                <Zap className={cn('w-6 h-6 mx-auto mb-2', isDark ? 'text-blue-400' : 'text-blue-600')} />
                <h3 className={cn('text-sm font-bold mb-0.5', isDark ? 'text-white' : 'text-gray-900')}>Matches</h3>
                <p className={cn('text-[10px]', isDark ? 'text-gray-400' : 'text-gray-600')}>View & manage</p>
              </button>

              <button
                onClick={() => navigate('/teams')}
                className={cn('p-4 rounded-xs border transition-all hover:scale-[1.02] hover:shadow-md', isDark ? 'bg-gray-800 border-gray-700 hover:border-blue-500' : 'bg-white border-gray-200 hover:border-blue-500')}
              >
                <Crown className={cn('w-6 h-6 mx-auto mb-2', isDark ? 'text-blue-400' : 'text-blue-600')} />
                <h3 className={cn('text-sm font-bold mb-0.5', isDark ? 'text-white' : 'text-gray-900')}>Teams</h3>
                <p className={cn('text-[10px]', isDark ? 'text-gray-400' : 'text-gray-600')}>Manage teams</p>
              </button>
            </div>
          </div>
        ) : (
          <>
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
          </>
        )}
      </div>

      {showOrgNameModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={cn('max-w-md w-full rounded-xs p-6', isDark ? 'bg-gray-800' : 'bg-white')}>
            <h3 className={cn('text-lg font-bold mb-4', isDark ? 'text-white' : 'text-gray-900')}>
              Create Your Organization
            </h3>
            <input
              type="text"
              value={orgName}
              onChange={(e) => setOrgName(e.target.value)}
              placeholder="Enter organization name"
              className={cn('w-full px-4 py-2 rounded-xs border mb-4', isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900')}
            />
            <div className="flex gap-2">
              <button
                onClick={() => setShowOrgNameModal(false)}
                className={cn('flex-1 px-4 py-2 rounded-xs', isDark ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-900')}
              >
                Cancel
              </button>
              <button
                onClick={handleOrgNameSubmit}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xs"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

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