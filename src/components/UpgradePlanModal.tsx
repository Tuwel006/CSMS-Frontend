import React, { useState } from 'react';
import { Check, Crown } from 'lucide-react';
import { Plan } from '@/types/tenant';
import Button from './ui/Button';
import Modal from './ui/Modal';
import Card from './ui/lib/Card';
import { Stack } from './ui/lib/Stack';
import { Box } from './ui/lib/Box';
import Grid from './ui/lib/Grid';
import InfoRow from './ui/lib/InfoRow';
import { showToast } from '@/utils/toast';

interface UpgradePlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPlan: Plan;
  onUpgrade?: () => void;
}

const AVAILABLE_PLANS: Plan[] = [
  { id: 1, name: 'Free', maxMatches: 10, maxTournaments: 2, maxUsers: 5 },
  { id: 2, name: 'Basic', maxMatches: 50, maxTournaments: 10, maxUsers: 20 },
  { id: 3, name: 'Pro', maxMatches: 200, maxTournaments: 50, maxUsers: 100 },
  { id: 4, name: 'Premium', maxMatches: 1000, maxTournaments: 200, maxUsers: 500 },
];

const UpgradePlanModal: React.FC<UpgradePlanModalProps> = ({
  isOpen,
  onClose,
  currentPlan,
  onUpgrade,
}) => {
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [upgrading, setUpgrading] = useState(false);
  
  const availableUpgrades = AVAILABLE_PLANS.filter(p => p.id > currentPlan.id);
  
  const handleUpgrade = async () => {
    if (!selectedPlan) return;
    
    setUpgrading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      showToast.success(`Successfully upgraded to ${selectedPlan.name} plan!`);
      onUpgrade?.();
      onClose();
    } catch (error) {
      showToast.error('Failed to upgrade plan');
    } finally {
      setUpgrading(false);
    }
  };
  
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Upgrade Your Plan"
      subtitle={`Current: ${currentPlan.name}`}
      maxWidth="lg"
      footer={
        availableUpgrades.length > 0 && (
          <Stack direction="row" gap="sm">
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1 text-xs py-2 rounded-xs"
              disabled={upgrading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpgrade}
              variant="primary"
              className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-xs py-2 rounded-xs"
              disabled={!selectedPlan || upgrading}
            >
              {upgrading ? 'Upgrading...' : `Upgrade to ${selectedPlan?.name || 'Plan'}`}
            </Button>
          </Stack>
        )
      }
    >
      {availableUpgrades.length === 0 ? (
        <Stack align="center" gap="sm" className="py-8">
          <Crown size={48} className="text-yellow-500" />
          <h3 className="text-base font-bold text-gray-900 dark:text-white">
            You're on the highest plan!
          </h3>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            You're already enjoying all the premium features.
          </p>
        </Stack>
      ) : (
        <Grid cols={{ default: 1, md: 2 }} gap={3}>
          {availableUpgrades.map((plan) => (
            <Card
              key={plan.id}
              onClick={() => setSelectedPlan(plan)}
              className={`relative cursor-pointer transition-all ${
                selectedPlan?.id === plan.id
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-md scale-[1.02]'
                  : 'hover:border-blue-300 dark:hover:border-blue-700'
              }`}
              bodyClassName="p-4"
            >
              {selectedPlan?.id === plan.id && (
                <Box p="xs" rounded="sm" className="absolute -top-2 -right-2 bg-blue-500 text-white">
                  <Check size={14} />
                </Box>
              )}
              
              <Stack gap="sm">
                <Stack direction="row" gap="sm" align="center">
                  <Box p="sm" rounded="sm" className="bg-gradient-to-br from-blue-500 to-indigo-600">
                    <Crown className="text-white" size={16} />
                  </Box>
                  <h3 className="text-base font-bold text-gray-900 dark:text-white">{plan.name}</h3>
                </Stack>
                
                <Stack gap="sm">
                  <InfoRow label="Matches" value={plan.maxMatches.toString()} />
                  <InfoRow label="Tournaments" value={plan.maxTournaments.toString()} />
                  <InfoRow label="Users" value={plan.maxUsers.toString()} />
                </Stack>
              </Stack>
            </Card>
          ))}
        </Grid>
      )}
    </Modal>
  );
};

export default UpgradePlanModal;
