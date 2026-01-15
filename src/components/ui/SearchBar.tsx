import { Search, X } from 'lucide-react';

interface SearchBarProps {
  isOpen: boolean;
  onToggle: () => void;
  searchValue: string;
  onSearchChange: (value: string) => void;
  onSearch: (value: string) => void;
  placeholder?: string;
}

const SearchBar = ({ 
  isOpen, 
  onToggle, 
  searchValue, 
  onSearchChange, 
  onSearch,
  placeholder = "Search..." 
}: SearchBarProps) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onSearch(searchValue);
    }
  };

  return (
    <div className="flex items-center gap-2">
      {/* Search Input */}
      <div 
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'w-64 opacity-100' : 'w-0 opacity-0'
        }`}
      >
        <div className="relative">
          <input
            type="text"
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            autoFocus={isOpen}
            className="w-full px-3 py-1.5 text-sm bg-[var(--input-bg)] border border-[var(--card-border)] rounded-xs text-[var(--text)] placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          {searchValue && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Search Icon Button */}
      <button
        onClick={onToggle}
        className="p-1.5 text-[var(--text)] hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xs transition-colors flex items-center justify-center"
        aria-label="Toggle search"
      >
        <Search size={18} />
      </button>
    </div>
  );
};

export default SearchBar;