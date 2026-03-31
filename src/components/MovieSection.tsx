import MovieCard from './MovieCard';
import SkeletonCard from './SkeletonCard';
import type { MovieSummary } from '../types/index';
import { useEffect, useRef, useState } from 'react';
import { Button } from './Button';
import { CaretLeftIcon, CaretRightIcon } from '@phosphor-icons/react';

interface MovieSectionProps {
  title: string;
  movies: MovieSummary[];
  loading: boolean;
  id?: string;
}

function MovieSection({ id, title, movies, loading }: MovieSectionProps) {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = () => {
    if (sliderRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
      setCanScrollLeft(scrollLeft > 5);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 5);
    }
  };

  useEffect(() => {
    if (!loading && movies.length > 0) {
      setTimeout(checkScroll, 100);
    }

    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [loading, movies]);

  const scroll = (direction: 'left' | 'right') => {
    if (sliderRef.current) {
      const card = sliderRef.current.querySelector(
        '.movie-card'
      ) as HTMLElement;
      if (!card) return;

      const cardWidth = card.offsetWidth + 15;
      const scrollAmount = cardWidth * 5;

      sliderRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div id={id}>
      <h2 className='section-title'>{title}</h2>
      <div className='slider-wrapper'>
        {!loading && movies.length > 0 && (
          <>
            <Button
              className={`nav-btn prev ${!canScrollLeft ? 'is-hidden' : ''}`}
              variant='icon'
              icon={<CaretLeftIcon size={28} />}
              onClick={() => scroll('left')}
            />
            <Button
              className={`nav-btn next ${!canScrollRight ? 'is-hidden' : ''}`}
              variant='icon'
              icon={<CaretRightIcon size={28} />}
              onClick={() => scroll('right')}
            />
          </>
        )}

        <div className='movies-slider' ref={sliderRef} onScroll={checkScroll}>
          {loading ? (
            [...Array(8)].map((_, i) => <SkeletonCard key={i} />)
          ) : movies && movies.length > 0 ? (
            movies.map((movie, index) => (
              <MovieCard
                key={movie.tmdbId || movie.id || `movie-${index}`}
                movie={movie}
              />
            ))
          ) : (
            <p className='status-text'>Фільмів не знайдено</p>
          )}
        </div>
      </div>
    </div>
  );
}
export default MovieSection;
