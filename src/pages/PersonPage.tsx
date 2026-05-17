import { CaretLeftIcon } from '@phosphor-icons/react';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import MovieSection from '../components/movies/MovieSection.tsx';
import { Button } from '../components/ui/Button.tsx';
import Spinner from '../components/ui/Spinner.tsx';
import { getPersonContent, getPersonDetails } from '../services/personApi.ts';
import type {
  ActorMovie,
  BaseWork,
  MovieSummary,
  PersonDetails,
} from '../types';

interface PersonData extends PersonDetails {
  isDirector: boolean;
  displayWorks: (BaseWork | ActorMovie)[];
}

function PersonPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const initialName = location.state?.name || '';

  const [prevId, setPrevId] = useState(id);
  const [isImageLoading, setIsImageLoading] = useState(true);

  if (id !== prevId) {
    setPrevId(id);
    setIsImageLoading(true);
  }

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  const {
    data: person,
    isLoading,
    isError,
  } = useQuery<PersonData>({
    queryKey: ['person', id],
    queryFn: async () => {
      if (!id) throw new Error('ID is required');

      const [details, worksData] = await Promise.all([
        getPersonDetails(id),
        getPersonContent(id, 'works'),
      ]);

      if (!details) {
        throw new Error('Person not found');
      }

      const worksArray = Array.isArray(worksData) ? worksData : [];
      const isDirector = worksArray.length > 0;
      let displayWorks = worksArray;

      if (!isDirector) {
        const actorMovies = await getPersonContent(id, 'movies');
        displayWorks = Array.isArray(actorMovies) ? actorMovies : [];
      }

      return {
        ...details,
        isDirector,
        displayWorks,
      };
    },
    enabled: Boolean(id),
    retry: false,
  });

  useEffect(() => {
    if (isError) {
      navigate('/404', { replace: true });
    }
  }, [isError, navigate]);

  const displayMovies = useMemo((): MovieSummary[] => {
    if (!person?.displayWorks) return [];

    return person.displayWorks
      .filter(
        (movie, index, self) =>
          movie?.id && index === self.findIndex((m) => m.id === movie.id)
      )
      .map((movie) => ({
        id: movie.id,
        title: movie.title,
        backdrop_path: movie.poster_path || '',
      }));
  }, [person]);

  if (isLoading) return <Spinner />;

  const displayName = person?.name || initialName;

  if (!displayName && !isLoading) return null;

  return (
    <>
      <Button
        variant='icon'
        icon={<CaretLeftIcon size={28} />}
        onClick={() => navigate(-1)}
        title='Назад'
        className='back-button'
      />

      <div className='content-wrapper'>
        <header className='movie-header'>
          <h1>{displayName}</h1>
          {person?.name_en && (
            <p className='original-title'>{person.name_en}</p>
          )}
        </header>

        {person && (
          <>
            <section className='main-info-grid'>
              <div className='poster-column'>
                {isImageLoading && (
                  <div className='image-loader-overlay shimmer-wave'></div>
                )}
                <img
                  src={`${import.meta.env.VITE_IMAGE_URL}${person.profile_path}`}
                  alt={person.name}
                  onLoad={() => setIsImageLoading(false)}
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
                      <span className='cast-value'>
                        {person.place_of_birth}
                      </span>
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
          </>
        )}
      </div>

      {displayMovies && displayMovies.length > 0 && (
        <div className='content-wrapper'>
          <h2 className='sub-section-title'>
            {person?.isDirector
              ? 'Фільми зняті режисером'
              : 'Фільми за участю актора'}
          </h2>
          <MovieSection title='' movies={displayMovies} loading={false} />
        </div>
      )}
    </>
  );
}

export default PersonPage;
