import { fetchMovieDetails } from '../services/moviesApi.ts';
import { useParams } from 'react-router-dom';
import MovieSection from '../components/movies/MovieSection.tsx';
import MovieStatusButton from '../components/movies/MovieStatusButton.tsx';
import Spinner from '../components/ui/Spinner.tsx';
import type { Movie } from '../types';
import { HeartIcon, BookmarkSimpleIcon } from '@phosphor-icons/react';
import {
  getMovieStatus,
  toggleActivityMovie,
} from '../services/activitiesApi.ts';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { useQuery } from '@tanstack/react-query';
import { Reviews } from '../components/reviews/Reviews.tsx';
import { MovieDetails } from '../components/movies/MovieDetails.tsx';
import { useEffect } from 'react';

function MoviePage() {
  const { user } = useAuth();
  const { id: movieId } = useParams<{ id: string }>();

  const { data: movie, isLoading: isMovieLoading } = useQuery<Movie>({
    queryKey: ['movie', movieId],
    queryFn: async () => {
      return await fetchMovieDetails(movieId!);
    },
    enabled: Boolean(movieId),
  });

  const { data: statusData } = useQuery({
    queryKey: ['movieStatus', movieId],
    queryFn: () => getMovieStatus(movieId!),
    enabled: Boolean(movieId) && Boolean(user),
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [movieId]);

  const isLiked = statusData?.liked || false;
  const isWatched = statusData?.watched || false;

  if (isMovieLoading) {
    return <Spinner />;
  }

  if (!movie) {
    return null;
  }

  const handleToggleActivity = async (type: 'liked' | 'watched') => {
    if (!user) {
      toast.error(
        'Будь ласка, увійдіть в акаунт, щоб додавати фільми до списків',
        {
          icon: '🔒',
          duration: 4000,
        }
      );
      return;
    }

    try {
      await toggleActivityMovie(movieId!, type);
      toast.success('Список оновлено');
    } catch (error: unknown) {
      const msg =
        error instanceof Error ? error.message : 'Не вдалося оновити статус';
      toast.error(msg);
    }
  };

  return (
    <>
      <MovieDetails movie={movie} />
      <div className='content-wrapper'>
        <div className='check-buttons'>
          <MovieStatusButton
            label='Хочу переглянути'
            isActive={isLiked}
            onClick={() => handleToggleActivity('liked')}
            Icon={HeartIcon}
          />
          <MovieStatusButton
            label='Переглянуто'
            isActive={isWatched}
            onClick={() => handleToggleActivity('watched')}
            Icon={BookmarkSimpleIcon}
            activeColor='#fff'
          />
        </div>
      </div>

      {movie.recommendations?.results?.length > 0 && (
        <>
          <div className='content-wrapper'>
            <h2 className='sub-section-title'>
              Фільми схожі на "{movie.title}"
            </h2>
          </div>
          <MovieSection
            key={`recommendations-${movie.id}`}
            title=''
            movies={movie.recommendations.results}
            loading={false}
          />
        </>
      )}

      <Reviews movieId={movieId} userId={user?._id} />
    </>
  );
}

export default MoviePage;
