import { useNavigate } from 'react-router-dom';
import type { MovieSummary } from '../types/index';

interface MovieSectionProps {
  title: string;
  movies: MovieSummary[];
  loading: boolean;
}

function MovieSection({ title, movies, loading }: MovieSectionProps) {
  const navigate = useNavigate();

  const handleMovieClick = (id: number) => {
    navigate(`/movie/${id}`);
  };

  return (
    <div className='recomendation-section'>
      <h2 className='section-title'>{title}</h2>
      <div className='movies-slider'>
        {loading ? (
          <p className='status-text'>Завантаження...</p>
        ) : movies.length > 0 ? (
          movies.map((movie) => (
            <div
              key={movie.id}
              className='movie-card'
              onClick={() => handleMovieClick(movie.id)}
            >
              <div className='image-container'>
                <img
                  src={`${import.meta.env.VITE_POSTER_URL}${movie.backdrop_path}`}
                  alt={movie.title}
                  className='movie-poster'
                />
                <div className='movie-overlay'>
                  <p className='movie-title-text'>{movie.title}</p>{' '}
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className='status-text'>Фільмів не знайдено</p>
        )}
      </div>
    </div>
  );
}
export default MovieSection;
