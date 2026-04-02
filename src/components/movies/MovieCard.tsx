import { useNavigate } from 'react-router-dom';
import type { MovieSummary } from '../../types';

interface MovieCardProps {
  movie: MovieSummary;
}

function MovieCard({ movie }: MovieCardProps) {
  const navigate = useNavigate();

  const handleNavigation = () => {
    const targetId = movie.id || movie.tmdbId;
    if (!targetId) {
      console.error('Missing movie ID in object:', movie);
      return;
    }
    navigate(`/movie/${targetId}`);
  };

  return (
    <div className='movie-card' onClick={handleNavigation}>
      <div className='image-container'>
        <img
          src={`${import.meta.env.VITE_POSTER_URL}${movie.backdrop_path || movie.posterPath}`}
          alt={movie.title || movie.name}
          className='movie-poster'
        />
        <div className='movie-overlay'>
          <p className='movie-title-text'>{movie.title || movie.name}</p>
        </div>
      </div>
    </div>
  );
}

export default MovieCard;
