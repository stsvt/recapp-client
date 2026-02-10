import { useState, useEffect } from 'react';
import Dashboard from '../components/Dashboard';
import MovieSection from '../components/MovieSection';
import {
  fetchTopRatedMovies,
  fetchUpcomingMovies,
  fetchNowPlayingMovies,
} from '../services/apiMovies';

function Main() {
  const [sections, setSections] = useState({
    upcoming: [],
    nowPlaying: [],
    topRated: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetchUpcomingMovies(),
      fetchNowPlayingMovies(),
      fetchTopRatedMovies(),
    ])
      .then(([upcoming, nowPlaying, topRated]) => {
        setSections({ upcoming, nowPlaying, topRated });
        setLoading(false);
      })
      .catch((err) => console.error('Failed to fetch: ', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className='full-screen'>
      <Dashboard />
      <div className='recomendation-sections'>
        <MovieSection
          title='Незабаром'
          movies={sections.upcoming}
          loading={loading}
        />
        <MovieSection
          title='У прокаті'
          movies={sections.nowPlaying}
          loading={loading}
        />
        <MovieSection
          title='Фільми'
          movies={sections.topRated}
          loading={loading}
        />
        <MovieSection title='Серіали' movies={[]} loading={false} />
        <MovieSection title='Мультфільми' movies={[]} loading={false} />
      </div>
    </div>
  );
}

export default Main;
