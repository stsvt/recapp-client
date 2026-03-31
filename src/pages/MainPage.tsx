import { useState, useEffect } from 'react';
import Dashboard from '../components/Dashboard';
import MovieSection from '../components/MovieSection';
import {
  fetchTopRatedMovies,
  fetchUpcomingMovies,
  fetchNowPlayingMovies,
  fetchTopRatedSeries,
  fetchTopRatedAnimations,
} from '../services/apiMovies';

function MainPage() {
  const [sections, setSections] = useState({
    upcoming: [],
    nowPlaying: [],
    topRated: [],
    topRatedSeries: [],
    topRatedAnimations: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetchUpcomingMovies(),
      fetchNowPlayingMovies(),
      fetchTopRatedMovies(),
      fetchTopRatedSeries(),
      fetchTopRatedAnimations(),
    ])
      .then(
        ([
          upcoming,
          nowPlaying,
          topRated,
          topRatedSeries,
          topRatedAnimations,
        ]) => {
          setSections({
            upcoming,
            nowPlaying,
            topRated,
            topRatedSeries,
            topRatedAnimations,
          });
          setLoading(false);
        }
      )
      .catch((err) => console.error('Failed to fetch: ', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className='full-screen'>
      <Dashboard />
      <div className='recommendation-sections'>
        <MovieSection
          id='upcoming'
          title='Незабаром'
          movies={sections.upcoming}
          loading={loading}
        />

        <MovieSection
          id='nowPlaying'
          title='У прокаті'
          movies={sections.nowPlaying}
          loading={loading}
        />
        <MovieSection
          id='topRated'
          title='Фільми'
          movies={sections.topRated}
          loading={loading}
        />

        <MovieSection
          id='topRatedSeries'
          title='Серіали'
          movies={sections.topRatedSeries}
          loading={loading}
        />

        <MovieSection
          id='topRatedAnimations'
          title='Мультфільми'
          movies={sections.topRatedAnimations}
          loading={loading}
        />
      </div>
    </div>
  );
}

export default MainPage;
