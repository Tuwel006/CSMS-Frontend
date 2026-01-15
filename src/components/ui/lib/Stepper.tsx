import { Box, Stack, Text } from './';
import { Check } from 'lucide-react';

interface Step {
  label: string;
  description?: string;
}

interface StepperProps {
  steps: Step[];
  currentStep: number;
  onStepClick?: (step: number) => void;
}

export const Stepper = ({ steps, currentStep, onStepClick }: StepperProps) => {
  return (
    <Stack direction="row" justify="between" className="relative">
      {steps.map((step, index) => {
        const isCompleted = index < currentStep;
        const isCurrent = index === currentStep;
        const isClickable = onStepClick && index < currentStep;

        return (
          <Box key={index} className="flex-1 relative">
            <Stack direction="col" align="center" gap="xs">
              {/* Step Circle */}
              <Box
                onClick={() => isClickable && onStepClick(index)}
                className={`
                  w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all
                  ${isCompleted ? 'bg-green-500 text-white' : ''}
                  ${isCurrent ? 'bg-blue-600 text-white ring-4 ring-blue-200 dark:ring-blue-900' : ''}
                  ${!isCompleted && !isCurrent ? 'bg-gray-200 dark:bg-gray-700 text-gray-500' : ''}
                  ${isClickable ? 'cursor-pointer hover:scale-110' : ''}
                `}
              >
                {isCompleted ? <Check size={20} /> : index + 1}
              </Box>

              {/* Step Label */}
              <Stack direction="col" align="center" gap="none" className="text-center">
                <Text className={`text-xs font-semibold ${isCurrent ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400'}`}>
                  {step.label}
                </Text>
                {step.description && (
                  <Text className="text-xs text-gray-500 dark:text-gray-500">
                    {step.description}
                  </Text>
                )}
              </Stack>
            </Stack>

            {/* Connector Line */}
            {index < steps.length - 1 && (
              <Box className={`absolute top-5 left-[calc(50%+20px)] right-[calc(-50%+20px)] h-0.5 ${isCompleted ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-700'}`} />
            )}
          </Box>
        );
      })}
    </Stack>
  );
};
