import { useEffect, useState } from 'react';
import { MagnifyingGlassIcon, XIcon } from '@phosphor-icons/react';
import type { MovieSummary } from '../types';
import { searchMovies } from '../services/apiMovies';
import MovieCard from './MovieCard';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<MovieSummary[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;

    if (!query.trim()) {
      setResults([]);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setLoading(true);
      try {
        const data = await searchMovies(query);
        if (isMounted) {
          setResults(data || []);
        }
      } catch (error) {
        console.error('Search failed:', error);
      } finally {
        if (isMounted) setLoading(false);
      }
    }, 500);

    return () => {
      isMounted = false;
      clearTimeout(delayDebounceFn);
    };
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className='search-overlay'>
      <div className='search-container'>
        <header className='search-header'>
          <div className='search-input-wrapper'>
            <MagnifyingGlassIcon size={30} className='search-icon-inner' />
            <input
              autoFocus
              type='text'
              placeholder='Фільми, серіали, актори...'
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <button className='close-search' onClick={onClose}>
            <XIcon size={30} />
          </button>
        </header>

        <div className='search-results-area'>
          {loading && <div className='loader'>Пошук...</div>}

          {results.length > 0 ? (
            <div className='search-results-grid'>
              {results.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          ) : query && !loading ? (
            <p className='no-results'>
              За запитом "{query}" нічого не знайдено
            </p>
          ) : (
            <div className='popular-tags'>
              <h3>Популярні запити</h3>
              <div className='tags-row'>
                <span>Служниця</span>
                <span>Інтерстеллар</span>
                <span>Месники</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SearchModal;
