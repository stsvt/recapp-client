import { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { CaretLeftIcon } from '@phosphor-icons/react';
import { getPersonContent, getPersonDetails } from '../services/person';
import type {
  PersonDetails,
  BaseWork,
  MovieSummary,
  ActorMovie,
} from '../types';
import MovieSection from '../components/MovieSection';
import Dashboard from '../components/Dashboard';
import Spinner from '../components/Spinner';

interface PersonState extends Partial<PersonDetails> {
  isDirector?: boolean;
}

function PersonPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const initialName = location.state?.name || '';

  const [person, setPerson] = useState<PersonState | null>(
    initialName ? { name: initialName } : null
  );
  const [loading, setLoading] = useState(true);
  const [isImageLoading, setIsImageLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    window.scrollTo(0, 0);
    setIsImageLoading(true);

    const fetchData = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const [details, worksData] = await Promise.all([
          getPersonDetails(id),
          getPersonContent(id, 'works'),
        ]);

        if (isMounted) {
          if (!details) {
            navigate('/404');
            return;
          }

          const worksArray = Array.isArray(worksData) ? worksData : [];
          const isDirector = worksArray.length > 0;
          let movies = worksArray;

          if (!isDirector) {
            const actorMovies = await getPersonContent(id, 'movies');
            movies = Array.isArray(actorMovies) ? actorMovies : [];
          }

          setPerson({
            ...details,
            works: isDirector ? (movies as BaseWork[]) : undefined,
            movies: !isDirector ? (movies as ActorMovie[]) : undefined,
            isDirector,
          });
        }
      } catch (error) {
        console.error('Failed to load person data', error);
        if (isMounted) navigate('/404');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();
    return () => {
      isMounted = false;
    };
  }, [id, navigate]);

  const displayMovies = useMemo((): MovieSummary[] => {
    const rawMovies = person?.works || person?.movies || [];
    if (!Array.isArray(rawMovies)) return [];

    return rawMovies
      .filter(
        (movie, index, self) =>
          movie &&
          movie.id &&
          index === self.findIndex((m) => m.id === movie.id)
      )
      .map((movie) => ({
        id: movie.id,
        title: movie.title,
        backdrop_path: movie.poster_path || '',
      }));
  }, [person]);

  if (loading) return <Spinner />;
  if (!person || !person.name) return null;

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
            <h1>{person.name}</h1>
            {person.name_en && (
              <p className='original-title'>{person.name_en}</p>
            )}
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
                src={`${import.meta.env.VITE_IMAGE_URL}${person.profile_path}`}
                alt={person.name}
                onLoad={() => setIsImageLoading(false)}
                style={{
                  display: isImageLoading ? 'none' : 'block',
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
                onError={(e) => {
                  e.currentTarget.src = '/placeholder-actor.png';
                  setIsImageLoading(false);
                }}
              />
            </div>

            <div className='details-column'>
              <div className='cast-info'>
                <p className='cast-row'>
                  <strong className='person-label'>Дата народження</strong>
                  <span className='cast-value'>
                    {person.birthday
                      ? new Date(person.birthday).toLocaleDateString('uk-UA')
                      : 'невідомо'}
                  </span>
                </p>

                {person.place_of_birth && (
                  <p className='cast-row'>
                    <strong className='person-label'>Місце народження</strong>
                    <span className='cast-value'>{person.place_of_birth}</span>
                  </p>
                )}

                <p className='cast-row'>
                  <strong className='person-label'>Кар'єра</strong>
                  <span className='cast-value'>
                    {person.isDirector ? 'Режисер, Сценарист' : 'Актор'}
                  </span>
                </p>

                {person.birthday && !person.deathday && (
                  <p className='cast-row'>
                    <strong className='person-label'>Вік</strong>
                    <span className='cast-value'>
                      {Math.floor(
                        (new Date().getTime() -
                          new Date(person.birthday).getTime()) /
                          31557600000
                      )}{' '}
                      років
                    </span>
                  </p>
                )}

                {person.deathday && (
                  <p className='cast-row'>
                    <strong className='person-label'>Дата смерті</strong>
                    <span className='cast-value'>
                      {new Date(person.deathday).toLocaleDateString('uk-UA')}
                    </span>
                  </p>
                )}
              </div>
            </div>
          </section>

          {person.biography && (
            <article className='description-section'>
              <h2 className='section-title'>Біографія</h2>
              <p style={{ color: '#ccc', lineHeight: '1.6' }}>
                {person.biography}
              </p>
            </article>
          )}
        </div>

        {displayMovies.length > 0 && (
          <section className='similar-movies-full-width'>
            <div className='similar-title-container'>
              <h2 className='section-title'>
                {person.isDirector
                  ? 'Фільми зняті режисером'
                  : 'Фільми за участю актора'}
              </h2>
            </div>
            <MovieSection title='' movies={displayMovies} loading={false} />
          </section>
        )}
      </div>
    </div>
  );
}

export default PersonPage;
