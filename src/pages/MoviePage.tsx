import { BookmarkSimpleIcon, HeartIcon } from '@phosphor-icons/react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { useParams } from 'react-router-dom';
import { MovieDetails } from '../components/movies/MovieDetails.tsx';
import MovieSection from '../components/movies/MovieSection.tsx';
import MovieStatusButton from '../components/movies/MovieStatusButton.tsx';
import { Reviews } from '../components/reviews/Reviews.tsx';
import Spinner from '../components/ui/Spinner.tsx';
import { useAuth } from '../context/AuthContext';
import {
  getMovieStatus,
  toggleActivityMovie,
} from '../services/activitiesApi.ts';
import {
  fetchMovieDetails,
  fetchSimilarMovies,
} from '../services/moviesApi.ts';
import type { Movie } from '../types';

type Messages =
  | 'Movie removed from liked list'
  | 'Movie added to liked list'
  | 'Movie added to watched list'
  | 'Movie removed from watched list';

const MESSAGE_MAP = {
  'Movie removed from liked list': 'Фільм видалено зі списку вподобань',
  'Movie added to liked list': 'Фільм додано до списку вподобань',
  'Movie added to watched list': 'Фільм додано до переглянутих',
  'Movie removed from watched list': 'Фільм видалено з переглянутих',
};

function MoviePage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { id: movieId } = useParams<{ id: string }>();

  const { data: movie, isLoading: isMovieLoading } = useQuery<Movie>({
    queryKey: ['movie', movieId],
    queryFn: async () => {
      return await fetchMovieDetails(movieId!);
    },
    enabled: Boolean(movieId),
  });

  const { data: recommendations, isLoading: isRecsLoading } = useQuery({
    queryKey: ['similarMovies', movieId],
    queryFn: () => fetchSimilarMovies(movieId!),
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

    const queryKey = ['movieStatus', movieId];
    const previousStatus = queryClient.getQueryData<{ liked?: boolean; watched?: boolean }>(queryKey);

    queryClient.setQueryData(queryKey, (old: { liked?: boolean; watched?: boolean } | undefined) => {
      if (!old) return { [type]: true };
      return {
        ...old,
        [type]: !old[type],
      };
    });

    try {
      const response = await toggleActivityMovie(movieId!, type);
    
      toast.success(MESSAGE_MAP[response.data.message as Messages]);
    } catch (error: unknown) {
      queryClient.setQueryData(queryKey, previousStatus);
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
            isActive={statusData?.liked}
            onClick={() => handleToggleActivity('liked')}
            Icon={HeartIcon}
          />
          <MovieStatusButton
            label='Переглянуто'
            isActive={statusData?.watched}
            onClick={() => handleToggleActivity('watched')}
            Icon={BookmarkSimpleIcon}
            activeColor='#fff'
          />
        </div>
      </div>

      <div className='content-wrapper'>
        <h2 className='sub-section-title'>З цим фільмом також дивляться:</h2>
        {recommendations.length > 0 ? (
          <MovieSection
            title=''
            movies={recommendations}
            loading={isRecsLoading}
          />
        ) : (
          <MovieSection
            key={`recommendations-${movie.id}`}
            title=''
            movies={movie.recommendations.results}
            loading={false}
          />
        )}
      </div>

      <Reviews movieId={movieId} userId={user?._id} />
    </>
  );
}

export default MoviePage;
