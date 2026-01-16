import React, { useState } from 'react';
import { Crown, Users, Trophy, Calendar, ArrowUpCircle } from 'lucide-react';
import { TenantDashboard } from '@/types/tenant';
import Button from './ui/Button';
import Card from './ui/lib/Card';
import { Stack } from './ui/lib/Stack';
import { Box } from './ui/lib/Box';
import ProgressBar from './ui/ProgressBar';
import UpgradePlanModal from './UpgradePlanModal';

interface ActivePlanCardProps {
  tenantData: TenantDashboard;
  onUpgrade?: () => void;
}

const ActivePlanCard: React.FC<ActivePlanCardProps> = ({ tenantData, onUpgrade }) => {
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  
  const { plan, usage } = tenantData;
  const isPlanUpgradable = plan.name !== 'Enterprise' && plan.name !== 'Premium';
  
  const usageItems = [
    { icon: <Calendar size={12} className="text-gray-600 dark:text-gray-400" />, label: 'Matches', current: usage.currentMatches, max: plan.maxMatches },
    { icon: <Trophy size={12} className="text-gray-600 dark:text-gray-400" />, label: 'Tournaments', current: usage.currentTournaments, max: plan.maxTournaments },
    { icon: <Users size={12} className="text-gray-600 dark:text-gray-400" />, label: 'Users', current: usage.currentUsers, max: plan.maxUsers },
  ];
  
  return (
    <>
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 border-blue-200 dark:border-blue-800">
        <Box p="md">
          <Stack gap="sm">
            <Stack direction="row" justify="between" align="center">
              <Stack direction="row" gap="sm" align="center">
                <Box p="sm" rounded="sm" className="bg-blue-500">
                  <Crown className="text-white" size={18} />
                </Box>
                <Stack gap="none">
                  <h3 className="text-xs font-semibold text-gray-700 dark:text-gray-300">Active Plan</h3>
                  <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{plan.name}</p>
                </Stack>
              </Stack>
              {isPlanUpgradable && (
                <Button
                  onClick={() => setShowUpgradeModal(true)}
                  variant="primary"
                  size="sm"
                  leftIcon={<ArrowUpCircle size={14} />}
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-xs px-3 py-1.5 rounded-xs"
                >
                  Upgrade
                </Button>
              )}
            </Stack>
            
            <Stack gap="sm">
              {usageItems.map(({ icon, label, current, max }) => (
                <ProgressBar key={label} icon={icon} label={label} current={current} max={max} />
              ))}
            </Stack>
            
            <Box p="sm" className="border-t border-blue-200 dark:border-blue-800">
              <p className="text-[10px] text-gray-600 dark:text-gray-400">
                Organization: <span className="font-semibold text-gray-900 dark:text-white">{tenantData.name}</span>
              </p>
            </Box>
          </Stack>
        </Box>
      </Card>
      
      {showUpgradeModal && (
        <UpgradePlanModal
          isOpen={showUpgradeModal}
          onClose={() => setShowUpgradeModal(false)}
          currentPlan={plan}
          onUpgrade={onUpgrade}
        />
      )}
    </>
  );
};

export default ActivePlanCard;
