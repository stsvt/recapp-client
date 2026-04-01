import { useEffect, useState, useCallback } from 'react';
import {
  CaretLeftIcon,
  MagnifyingGlassIcon,
  XIcon,
} from '@phosphor-icons/react';
import type { MovieSummary } from '../types';
import { searchMovies } from '../services/moviesApi.ts';
import { Button } from './ui/Button.tsx';
import MovieCard from './movies/MovieCard.tsx';
import SkeletonCard from './SkeletonCard';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<MovieSummary[]>([]);
  const [loading, setLoading] = useState(false);

  const handleClose = useCallback(() => {
    setQuery('');
    setResults([]);
    onClose();
  }, [onClose]);

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

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, handleClose]);

  if (!isOpen) return null;

  return (
    <div className='search-overlay'>
      <div className='search-container'>
        <header className='search-header'>
          <Button
            variant='icon'
            onClick={handleClose}
            icon={<CaretLeftIcon size={28} />}
          />
          <div className='search-input-wrapper'>
            <MagnifyingGlassIcon size={24} className='search-icon-inner' />
            <input
              autoFocus
              type='text'
              placeholder='Фільми, серіали, актори...'
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <Button variant='icon' onClick={onClose} icon={<XIcon size={28} />} />
        </header>

        <div className='search-results-area'>
          {loading && results.length === 0 && (
            <div className='search-results-grid'>
              {[...Array(12)].map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          )}

          {results.length > 0 && (
            <div
              className={`search-results-grid ${loading ? 'results-updating' : ''}`}
            >
              {results.map((movie) => (
                <div key={movie.id} className='movie-card-animated'>
                  <MovieCard movie={movie} />
                </div>
              ))}
            </div>
          )}

          {!loading && results.length === 0 && (
            <>
              {query.trim() ? (
                <p className='no-results'>
                  За запитом "{query}" нічого не знайдено
                </p>
              ) : (
                <div className='popular-tags'>
                  <h3>Популярні запити</h3>
                  <div className='tags-row'>
                    {['Служниця', 'Інтерстеллар', 'Месники'].map((tag) => (
                      <span key={tag} onClick={() => setQuery(tag)}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default SearchModal;
