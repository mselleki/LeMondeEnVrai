import { useState, useEffect, useRef } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { fuzzySearchCountries } from '../../utils/geography';
import countriesData from '../../data/countries.sample.json';
import type { Country } from '../../types';
import * as Flag from 'country-flag-icons/react/3x2';

export default function SearchBar() {
  const { setSelectedCountry } = useAppStore();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Country[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (query.trim()) {
      const matches = fuzzySearchCountries(query, countriesData.countries);
      setResults(matches.slice(0, 8));
      setIsOpen(true);
      setSelectedIndex(-1);
    } else {
      setResults([]);
      setIsOpen(false);
    }
  }, [query]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (country: Country) => {
    setSelectedCountry(country);
    setQuery('');
    setIsOpen(false);
    inputRef.current?.blur();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === 'Enter' && selectedIndex >= 0 && results[selectedIndex]) {
      e.preventDefault();
      handleSelect(results[selectedIndex]);
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      inputRef.current?.blur();
    }
  };

  return (
    <div ref={searchRef} className="relative w-full max-w-md">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => query.trim() && setIsOpen(true)}
          placeholder="Rechercher un pays..."
          className="w-full px-4 py-3 pl-12 pr-4 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
          aria-label="Rechercher un pays"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
        />
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Dropdown */}
      {isOpen && results.length > 0 && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-96 overflow-y-auto">
          <ul role="listbox" className="py-2">
            {results.map((country, index) => {
              const FlagComponent = country.code ? (Flag[country.code as keyof typeof Flag] as React.ComponentType<{ className?: string; title?: string }>) : null;
              return (
                <li
                  key={country.id}
                  role="option"
                  aria-selected={index === selectedIndex}
                  onClick={() => handleSelect(country)}
                  className={`px-4 py-3 cursor-pointer transition-colors flex items-center gap-3 ${
                    index === selectedIndex
                      ? 'bg-primary-50 text-primary-900'
                      : 'hover:bg-gray-50 text-gray-900'
                  }`}
                >
                  {FlagComponent ? (
                    <FlagComponent className="w-8 h-6 object-cover rounded" title={country.name} />
                  ) : (
                    <span className="text-2xl">🌍</span>
                  )}
                  <div className="flex-1">
                    <div className="font-medium">{country.name}</div>
                    {country.nameFr && country.name !== country.nameFr && (
                      <div className="text-sm text-gray-600">{country.nameFr}</div>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {isOpen && query.trim() && results.length === 0 && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg p-4 text-center text-gray-500">
          Aucun résultat trouvé
        </div>
      )}
    </div>
  );
}
