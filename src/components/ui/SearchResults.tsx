import { useSearch } from '../../context/SearchContext';

const SearchResults = () => {
  const { searchResults, searchValue, isSearchOpen } = useSearch();

  if (!isSearchOpen || !searchValue || searchResults.length === 0) {
    return null;
  }

  return (
    <div className="absolute top-full right-0 mt-2 w-64 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg shadow-lg z-50">
      <div className="p-3 border-b border-[var(--card-border)]">
        <h4 className="text-sm font-medium text-[var(--text)]">Search Results</h4>
      </div>
      <div className="max-h-64 overflow-y-auto">
        {searchResults.map((result) => (
          <div
            key={result.id}
            className="p-3 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer border-b border-[var(--card-border)] last:border-b-0"
          >
            <div className="flex items-center gap-2">
              <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
                {result.type}
              </span>
              <span className="text-sm text-[var(--text)]">{result.name}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchResults;