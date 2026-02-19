import { useEffect, useState } from 'react';
import { fetchMovieDetails } from '../services/apiMovies';
import { useNavigate, useParams } from 'react-router-dom';
import MovieSection from '../components/MovieSection';
import Dashboard from '../components/Dashboard';
import MovieStatusButton from '../components/MovieStatusButton';
import Spinner from '../components/Spinner';
import type { Movie, CrewMember, CastMember, Genre } from '../types/index';
import {
  HeartIcon,
  BookmarkSimpleIcon,
  CaretLeftIcon,
} from '@phosphor-icons/react';

function MoviePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isWatched, setIsWatched] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    window.scrollTo(0, 0);
    setIsImageLoading(true);

    const loadData = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const data = await fetchMovieDetails(id);
        if (isMounted) {
          if (!data) {
            navigate('/404');
          } else {
            setMovie(data);
          }
        }
      } catch (error) {
        console.error('Failed to fetch movie:', error);
        if (isMounted) navigate('/404');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, [id, navigate]);

  if (loading) return <Spinner />;

  if (!movie) return null;

  const director =
    movie.credits?.crew?.find((p: CrewMember) => p.job === 'Director')?.name ||
    'Невідомо';
  const topCast = movie.credits?.cast
    ?.slice(0, 10)
    .map((a: CastMember) => a.name)
    .join(', ');

  const toggleFavorite = () => setIsFavorite(!isFavorite);
  const toggleWatched = () => setIsWatched(!isWatched);

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
                <div className='image-loader-overlay shimmer-wave'>
                </div>
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
                  <span className='cast-value'>{director}</span>
                </p>
                <p className='cast-row'>
                  <strong className='cast-label'>У ролях</strong>
                  <span className='cast-value'>
                    {topCast || 'Дані відсутні'}
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
              isActive={isFavorite}
              onClick={toggleFavorite}
              Icon={HeartIcon}
            />
            <MovieStatusButton
              label='Переглянуто'
              isActive={isWatched}
              onClick={toggleWatched}
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
