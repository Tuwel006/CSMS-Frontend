import { useState, useRef, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { cn } from '../../lib/utils';

interface SuggestInputProps {
  value: string;
  onChange: (value: string) => void;
  onSearch?: (query: string) => void;
  suggestions?: string[];
  placeholder?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const SuggestInput = ({
  value,
  onChange,
  onSearch,
  suggestions = [],
  placeholder,
  size = 'sm',
  className
}: SuggestInputProps) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-3 text-base',
    lg: 'px-5 py-4 text-lg'
  };

  const filteredSuggestions = suggestions.filter(suggestion =>
    suggestion.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    setQuery(value);
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    setIsOpen(true);
    onSearch?.(newQuery);
  };

  const handleSuggestionSelect = (suggestion: string) => {
    setQuery(suggestion);
    onChange(suggestion);
    setIsOpen(false);
  };

  const handleInputBlur = () => {
    setTimeout(() => {
      onChange(query);
    }, 200);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={handleInputChange}
        onFocus={() => setIsOpen(true)}
        onBlur={handleInputBlur}
        placeholder={placeholder}
        className={cn(
          'w-full rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2',
          sizeClasses[size],
          isDark 
            ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500/20'
            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500/20',
          className
        )}
      />

      {isOpen && filteredSuggestions.length > 0 && (
        <div className={cn(
          'absolute z-10 w-full mt-1 max-h-60 overflow-auto rounded-lg border shadow-lg',
          isDark ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-300'
        )}>
          {filteredSuggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => handleSuggestionSelect(suggestion)}
              className={cn(
                'w-full px-3 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 first:rounded-t-lg last:rounded-b-lg',
                isDark ? 'text-white' : 'text-gray-900'
              )}
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SuggestInput;