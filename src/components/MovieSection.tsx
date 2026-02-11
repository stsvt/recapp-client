import { useNavigate } from 'react-router-dom';

interface Movie {
  id: number;
  backdrop_path: string;
  title: string;
}

interface MovieSectionProps {
  title: string;
  movies: Movie[];
  loading: boolean;
}

function MovieSection({ title, movies, loading }: MovieSectionProps) {
  const POSTER_URL = 'https://image.tmdb.org/t/p/w500';
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
                  src={`${POSTER_URL}${movie.backdrop_path}`}
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
