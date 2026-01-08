import React from 'react';
import Button from '../../../components/ui/Button';

interface ExtrasWarningModalProps {
  isOpen: boolean;
  pendingValue: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const ExtrasWarningModal = React.memo(({ isOpen, pendingValue, onConfirm, onCancel }: ExtrasWarningModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/40 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg p-6 w-11/12 max-w-md shadow-lg">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
            <svg className="w-6 h-6 text-yellow-600 dark:text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-lg font-bold">Change Extra Runs Setting?</h2>
        </div>
        
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          {pendingValue 
            ? "Enabling extra runs will add 1 run to the team score for Wide and No Ball deliveries (standard cricket rules)."
            : "Disabling extra runs means Wide and No Ball will NOT add extra runs to the team score (gully cricket rules). Only runs scored by batsman will count."}
        </p>

        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="primary" onClick={onConfirm}>
            Confirm Change
          </Button>
        </div>
      </div>
    </div>
  );
});

export default ExtrasWarningModal;
