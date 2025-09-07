import { createContext, useContext, useState, type ReactNode } from 'react';

interface SearchContextType {
  isSearchOpen: boolean;
  searchValue: string;
  searchResults: any[];
  toggleSearch: () => void;
  setSearchValue: (value: string) => void;
  performSearch: (query: string) => void;
  clearSearch: () => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const SearchProvider = ({ children }: { children: ReactNode }) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    if (isSearchOpen) {
      setSearchValue('');
      setSearchResults([]);
    }
  };

  const performSearch = (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    // Mock search logic - replace with actual search implementation
    const mockResults = [
      { type: 'match', name: `${query} Match`, id: '1' },
      { type: 'team', name: `${query} Team`, id: '2' },
      { type: 'player', name: `${query} Player`, id: '3' }
    ].filter(item => item.name.toLowerCase().includes(query.toLowerCase()));

    setSearchResults(mockResults);
  };

  const clearSearch = () => {
    setSearchValue('');
    setSearchResults([]);
  };

  return (
    <SearchContext.Provider value={{
      isSearchOpen,
      searchValue,
      searchResults,
      toggleSearch,
      setSearchValue,
      performSearch,
      clearSearch
    }}>
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearch must be used within SearchProvider');
  }
  return context;
};