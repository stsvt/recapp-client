import { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { CaretLeftIcon } from '@phosphor-icons/react';
import { getPersonContent } from '../services/person';
import type { PersonDetails, BaseWork, MovieSummary } from '../types';
import MovieSection from '../components/MovieSection';
import Dashboard from '../components/Dashboard';
import Spinner from '../components/Spinner';

function PersonPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const initialName = location.state?.name || '';
  const [person, setPerson] = useState<Partial<PersonDetails> | null>(
    initialName ? { name: initialName } : null
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      window.scrollTo(0, 0);
      setLoading(true);

      const worksData = await getPersonContent(id, 'works');
      
      if (worksData && Array.isArray(worksData) && worksData.length > 0) {
        setPerson(prev => ({ ...prev, works: worksData, isDirector: true }));
      } else {
        const moviesData = await getPersonContent(id, 'movies');
        if (moviesData && Array.isArray(moviesData)) {
          setPerson(prev => ({ ...prev, movies: moviesData, isDirector: false }));
        }
      }
      setLoading(false);
    };
    fetchData();
  }, [id]);

  const displayMovies = useMemo((): MovieSummary[] => {
    const rawMovies: BaseWork[] = person?.works || person?.movies || [];

    return rawMovies
      .filter(
        (movie, index, self) =>
          index === self.findIndex((m) => m.id === movie.id)
      )
      .map((movie) => ({
        id: movie.id,
        title: movie.title,
        backdrop_path: movie.poster_path || '',
      }));
  }, [person]);

  if (loading) return <Spinner />;

  return (
    <div className='full-screen'>
      <Dashboard />
      <div className='movie-page-content'>
        <button className='back-button' onClick={() => navigate(-1)}>
          <CaretLeftIcon size={28} />
        </button>

        <div className='content-wrapper'>
          <header className='movie-header'>
            <h1>{person?.name || 'Інформація про особу'}</h1>
          </header>

          {displayMovies.length > 0 ? (
            <section className='similar-movies-full-width'>
              <div className='similar-title-container'>
                <h2 className='section-title'>
                  {person?.works
                    ? 'Фільми зняті режисером'
                    : 'Акторські роботи'}
                </h2>
              </div>
              <MovieSection movies={displayMovies} loading={false} title='' />
            </section>
          ) : (
            <div style={{ textAlign: 'center', marginTop: '50px' }}>
              Робіт не знайдено
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PersonPage;
