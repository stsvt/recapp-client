import { useNavigate } from 'react-router-dom';
import type { MovieSummary } from '../types/index';

interface MovieCardProps {
  movie: MovieSummary;
}

function MovieCard({ movie }: MovieCardProps) {
  const navigate = useNavigate();

  return (
    <div className='movie-card' onClick={() => navigate(`/movie/${movie.id}`)}>
      <div className='image-container'>
        <img
          src={`${import.meta.env.VITE_POSTER_URL}${movie.backdrop_path}`}
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
