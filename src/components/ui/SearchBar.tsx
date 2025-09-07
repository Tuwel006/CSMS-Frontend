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
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchValue);
  };

  return (
    <div className="flex items-center">
      {/* Search Input - Expands from right to left */}
      <div 
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'w-64 opacity-100' : 'w-0 opacity-0'
        }`}
      >
        <form onSubmit={handleSubmit} className="relative">
          <input
            type="text"
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={placeholder}
            className="w-full pl-4 pr-10 py-2 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg text-[var(--text)] placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            autoFocus={isOpen}
          />
          {searchValue && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X size={16} />
            </button>
          )}
        </form>
      </div>

      {/* Search Icon Button */}
      <button
        onClick={onToggle}
        className="ml-2 p-2 text-[var(--text)] hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
        aria-label="Toggle search"
      >
        <Search size={20} />
      </button>
    </div>
  );
};

export default SearchBar;