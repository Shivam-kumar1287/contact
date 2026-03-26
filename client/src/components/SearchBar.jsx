import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';

const SearchBar = ({ onSearch, loading }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('search') || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (query.trim() === '') {
      toast.error('Please enter a search term');
      return;
    }

    // Update URL with search parameter
    setSearchParams({ search: query });
    onSearch(query);
  };

  const handleClear = () => {
    setQuery('');
    setSearchParams({});
    onSearch('');
  };

  return (
    <div className="mb-8">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="flex-1 relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, email, or phone..."
            className="input-field pr-10"
            disabled={loading}
          />
          {query && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary flex items-center gap-2"
        >
          {loading ? (
            <div className="loading-spinner h-5 w-5"></div>
          ) : (
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          )}
          Search
        </button>
      </form>
    </div>
  );
};

export default SearchBar;
