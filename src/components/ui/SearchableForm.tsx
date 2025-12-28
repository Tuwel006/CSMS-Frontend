import { useState, useCallback, useRef } from 'react';
import Input from './Input';

interface InputField {
  key: string;
  type: 'text' | 'select' | 'number';
  label: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  width?: string;
  validation?: {
    required?: boolean;
  };
}

interface DropdownConfig {
  id: string;
  triggerFields: string[];
  searchFunction: (params: Record<string, string>) => Promise<any>;
  displayFormat: (item: any) => string;
  onSelect: (item: any) => void;
  position?: 'below' | 'above';
  maxHeight?: string;
  minChars?: number;
}

interface SearchableFormProps {
  title?: string;
  inputs: InputField[];
  values: Record<string, any>;
  onValueChange: (key: string, value: any) => void;
  dropdowns?: DropdownConfig[];
  layout?: {
    columns?: number;
    gap?: string;
    className?: string;
  };
  onSubmit?: (values: Record<string, any>) => void;
  submitLabel?: string;
}

const SearchableForm = ({ title, inputs, values, onValueChange, dropdowns = [], layout }: SearchableFormProps) => {
  const [dropdownStates, setDropdownStates] = useState<Record<string, { suggestions: any[]; show: boolean }>>({});
  const searchTimeouts = useRef<Record<string, number>>({});

  const debouncedSearch = useCallback(
    async (dropdownId: string) => {
      const dropdown = dropdowns.find(d => d.id === dropdownId);
      if (!dropdown) return;
      
      const params: Record<string, string> = {};
      let hasValue = false;
      
      dropdown.triggerFields.forEach(field => {
        if (values[field]) {
          params[field] = values[field];
          hasValue = true;
        }
      });

      if (hasValue) {
        try {
          const response = await dropdown.searchFunction(params);
          const items = response?.data?.data || [];
          setDropdownStates(prev => ({
            ...prev,
            [dropdownId]: { suggestions: items, show: items.length > 0 }
          }));
        } catch (error) {
          console.error('Search error:', error);
          setDropdownStates(prev => ({
            ...prev,
            [dropdownId]: { suggestions: [], show: false }
          }));
        }
      } else {
        setDropdownStates(prev => ({
          ...prev,
          [dropdownId]: { suggestions: [], show: false }
        }));
      }
    },
    [dropdowns, values]
  );

  const handleInputChange = (key: string, value: any) => {
    onValueChange(key, value);
    
    dropdowns.forEach(dropdown => {
      if (dropdown.triggerFields.includes(key)) {
        if (searchTimeouts.current[dropdown.id]) {
          window.clearTimeout(searchTimeouts.current[dropdown.id]);
        }
        searchTimeouts.current[dropdown.id] = window.setTimeout(() => debouncedSearch(dropdown.id), 300);
      }
    });
  };

  const handleSelect = (dropdownId: string, item: any) => {
    const dropdown = dropdowns.find(d => d.id === dropdownId);
    dropdown?.onSelect(item);
    setDropdownStates(prev => ({
      ...prev,
      [dropdownId]: { ...prev[dropdownId], show: false }
    }));
  };

  const getGridColumns = () => {
    const cols = layout?.columns || Math.min(inputs.length, 3);
    return `grid-cols-${cols}`;
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 ${layout?.className || ''}`}>
      {title && <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">{title}</h2>}
      
      <div className={`grid ${getGridColumns()} gap-${layout?.gap || '4'} mb-4`}>
        {inputs.map((input) => (
          <div 
            key={input.key} 
            className={input.className || ''}
            style={{ width: input.width }}
          >
            <Input
              type="text"
              label={input.label}
              placeholder={input.placeholder}
              value={values[input.key] || ''}
              onChange={(value: string) => handleInputChange(input.key, value)}
              required={input.required}
              disabled={input.disabled}
            />
          </div>
        ))}
      </div>
      
      {dropdowns.map(dropdown => {
        const state = dropdownStates[dropdown.id];
        if (!state?.show) return null;
        
        return (
          <div key={dropdown.id} className="relative mb-4">
            <div className={`absolute z-10 w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg overflow-auto ${
              dropdown.position === 'above' ? 'bottom-full mb-2' : 'top-full mt-2'
            }`} style={{ maxHeight: dropdown.maxHeight || '240px' }}>
              {state.suggestions.map((item, index) => (
                <div
                  key={index}
                  className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-600 last:border-b-0"
                  onClick={() => handleSelect(dropdown.id, item)}
                >
                  {dropdown.displayFormat(item)}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default SearchableForm
export type { InputField, DropdownConfig, SearchableFormProps }
