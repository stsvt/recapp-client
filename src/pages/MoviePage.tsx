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
import { fetchSimilarMovies } from '../services/moviesApi.ts';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Reviews } from '../components/reviews/Reviews.tsx';
import { MovieDetails } from '../components/movies/MovieDetails.tsx';
import { useEffect } from 'react';

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

    try {
      const response = await toggleActivityMovie(movieId!, type);
      await queryClient.invalidateQueries({ queryKey: ['movieStatus'] });
      toast.success(MESSAGE_MAP[response.data.message as Messages]);
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

      {movie.recommendations?.results?.length > 0 && (
        <>
          <div className='content-wrapper'>
            <h2 className='sub-section-title'>
              З цим фільмом також дивляться:
            </h2>
          </div>
          <MovieSection
            title=''
            movies={recommendations}
            loading={isRecsLoading}
          />
          {/* <MovieSection
            key={`recommendations-${movie.id}`}
            title=''
            movies={movie.recommendations.results}
            loading={false}
          /> */}
        </>
      )}

      <Reviews movieId={movieId} userId={user?._id} />
    </>
  );
}

export default MoviePage;
