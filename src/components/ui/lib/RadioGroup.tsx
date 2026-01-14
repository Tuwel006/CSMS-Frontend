import { ReactNode } from 'react';
import { Box, Stack, Text } from './';

interface RadioOption {
  value: string;
  label: string;
  description?: string;
  icon?: ReactNode;
}

interface RadioGroupProps {
  options: RadioOption[];
  value: string;
  onChange: (value: string) => void;
  name: string;
}

export const RadioGroup = ({ options, value, onChange, name }: RadioGroupProps) => {
  return (
    <Stack direction="row" gap="md" className="flex-wrap">
      {options.map((option) => {
        const isSelected = value === option.value;
        
        return (
          <Box
            key={option.value}
            onClick={() => onChange(option.value)}
            className={`
              flex-1 min-w-[200px] p-4 rounded-lg border-2 cursor-pointer transition-all
              ${isSelected 
                ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20' 
                : 'border-gray-300 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-600'
              }
            `}
          >
            <Stack direction="row" align="start" gap="sm">
              <input
                type="radio"
                name={name}
                value={option.value}
                checked={isSelected}
                onChange={() => onChange(option.value)}
                className="mt-1 w-4 h-4 text-blue-600 cursor-pointer"
              />
              <Stack direction="col" gap="xs" className="flex-1">
                <Stack direction="row" align="center" gap="xs">
                  {option.icon && <Box>{option.icon}</Box>}
                  <Text className={`font-semibold ${isSelected ? 'text-blue-600 dark:text-blue-400' : 'text-gray-900 dark:text-gray-100'}`}>
                    {option.label}
                  </Text>
                </Stack>
                {option.description && (
                  <Text className="text-sm text-gray-600 dark:text-gray-400">
                    {option.description}
                  </Text>
                )}
              </Stack>
            </Stack>
          </Box>
        );
      })}
    </Stack>
  );
};
