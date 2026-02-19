import MovieCard from './MovieCard';
import type { MovieSummary } from '../types/index';

interface MovieSectionProps {
  title: string;
  movies: MovieSummary[];
  loading: boolean;
}

function MovieSection({ title, movies, loading }: MovieSectionProps) {
  return (
    <div className='recomendation-section'>
      <h2 className='section-title'>{title}</h2>
      <div className='movies-slider'>
        {loading ? (
          <p className='status-text'>Завантаження...</p>
        ) : movies.length > 0 ? (
          movies.map((movie) => <MovieCard key={movie.id} movie={movie} />)
        ) : (
          <p className='status-text'>Фільмів не знайдено</p>
        )}
      </div>
    </div>
  );
}
export default MovieSection;
