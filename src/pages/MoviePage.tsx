import { useEffect, useState } from 'react';
import { fetchMovieDetails } from '../services/apiMovies';
import { useNavigate, useParams } from 'react-router-dom';
import MovieSection from '../components/MovieSection';
import Dashboard from '../components/Dashboard';
import MovieStatusButton from '../components/MovieStatusButton';
import Spinner from '../components/Spinner';
import type { Movie, CrewMember, Genre } from '../types/index';
import {
  HeartIcon,
  BookmarkSimpleIcon,
  CaretLeftIcon,
} from '@phosphor-icons/react';
import { getMovieStatus, toggleActivityMovie } from '../services/activity';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

function MoviePage() {
  const { user } = useAuth();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [isWatched, setIsWatched] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      if (!id) return;
      try {
        setLoading(true);

        const movieData = await fetchMovieDetails(id);
        let statusData;

        if (user) {
          statusData = await getMovieStatus(id);
        }

        if (movieData) setMovie(movieData);

        if (statusData) {
          setIsLiked(statusData.liked);
          setIsWatched(statusData.watched);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id, user]);

  if (loading) return <Spinner />;

  if (!movie) return null;

  const directorData = movie.credits?.crew?.find(
    (p: CrewMember) => p.job === 'Director'
  );
  const directorName = directorData?.name || 'Невідомо';

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
      await toggleActivityMovie(id!, type);
      if (type === 'liked') setIsLiked(!isLiked);
      if (type === 'watched') setIsWatched(!isWatched);
      toast.success('Список оновлено');
    } catch (error: unknown) {
      const msg =
        error instanceof Error ? error.message : 'Не вдалося оновити статус';
      toast.error(msg);
    }
  };

  return (
    <div className='full-screen'>
      <Dashboard />
      <div className='movie-page-content'>
        <button
          className='back-button'
          onClick={() => navigate(-1)}
          title='Назад'
        >
          <CaretLeftIcon size={28} />
        </button>
        <div className='content-wrapper'>
          <header className='movie-header'>
            <h1>{movie.title}</h1>
            <p className='original-title'>{movie.original_title}</p>
          </header>

          <section className='main-info-grid'>
            <div
              className='poster-column'
              style={{
                position: 'relative',
                width: '240px',
                minHeight: '360px',
                backgroundColor: '#1a1a1a',
                borderRadius: '4px',
                overflow: 'hidden',
              }}
            >
              {isImageLoading && (
                <div className='image-loader-overlay shimmer-wave'></div>
              )}
              <img
                src={`${import.meta.env.VITE_IMAGE_URL}${movie.poster_path || movie.backdrop_path}`}
                alt={movie.title}
                onLoad={() => setIsImageLoading(false)}
                style={{
                  display: isImageLoading ? 'none' : 'block',
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
            </div>

            <div className='details-column'>
              <div className='stats-row'>
                <span>
                  {movie.release_date
                    ? new Date(movie.release_date).getFullYear()
                    : '—'}
                </span>
                <span className='dot'>•</span>
                <span>
                  {Math.floor(movie.runtime / 60)} год {movie.runtime % 60} хв
                </span>
                <span className='dot'>•</span>
                <span className='imdb-tag'>
                  IMDb {movie.vote_average?.toFixed(1) || '0.0'}/10
                </span>
              </div>

              <div className='genres-row'>
                {movie.genres?.map((g: Genre) => (
                  <span key={g.id} className='genre-pill'>
                    {g.name}
                  </span>
                ))}
              </div>

              <div className='cast-info'>
                <p className='cast-row'>
                  <strong className='cast-label'>Режисер</strong>
                  <button
                    className='actor-link-btn'
                    onClick={() =>
                      navigate(`/person/${directorData?.id}`, {
                        state: { name: directorName },
                      })
                    }
                  >
                    <span className='cast-value'>{directorName}</span>
                  </button>
                </p>
                <p className='cast-row'>
                  <strong className='cast-label'>У ролях</strong>
                  <span className='cast-value'>
                    {movie.credits?.cast
                      ?.slice(0, 10)
                      .map((actor, index, array) => (
                        <span key={`${actor.id}-${index}`}>
                          <button
                            className='actor-link-btn'
                            onClick={() =>
                              navigate(`/person/${actor.id}`, {
                                state: { name: actor.name },
                              })
                            }
                          >
                            {actor.name}
                          </button>
                          {index < array.length - 1 ? ', ' : ''}
                        </span>
                      )) || 'Дані відсутні'}
                  </span>
                </p>
              </div>
            </div>
          </section>
          <article className='description-section'>
            <p>{movie.overview}</p>
          </article>
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
          <section className='similar-movies-full-width'>
            <div className='similar-title-container'>
              <h2 className='section-title'>Фільми схожі на "{movie.title}"</h2>
            </div>
            <MovieSection
              key={`recommendations-${movie.id}`}
              title=''
              movies={movie.recommendations.results}
              loading={false}
            />
          </section>
        )}
      </div>
    </div>
  );
}

export default MoviePage;
