import { useQuery } from '@tanstack/react-query';
import MovieSection from '../components/movies/MovieSection.tsx';
import {
  fetchTopRatedMovies,
  fetchUpcomingMovies,
  fetchNowPlayingMovies,
  fetchTopRatedSeries,
  fetchTopRatedAnimations,
} from '../services/moviesApi.ts';

function MainPage() {
  const { data: sections, isLoading } = useQuery({
    queryKey: ['mainPageSections'],
    queryFn: async () => {
      const [
        upcoming,
        nowPlaying,
        topRated,
        topRatedSeries,
        topRatedAnimations,
      ] = await Promise.all([
        fetchUpcomingMovies(),
        fetchNowPlayingMovies(),
        fetchTopRatedMovies(),
        fetchTopRatedSeries(),
        fetchTopRatedAnimations(),
      ]);

      return {
        upcoming,
        nowPlaying,
        topRated,
        topRatedSeries,
        topRatedAnimations,
      };
    },
    staleTime: 1000 * 60 * 60 * 24 * 7, // 7 днів
  });

  const safeSections = sections || {
    upcoming: [],
    nowPlaying: [],
    topRated: [],
    topRatedSeries: [],
    topRatedAnimations: [],
  };

  return (
    <>
      <div className='recommendation-sections'>
        <MovieSection
          id='upcoming'
          title='Незабаром'
          movies={safeSections.upcoming}
          loading={isLoading}
        />

        <MovieSection
          id='nowPlaying'
          title='У прокаті'
          movies={safeSections.nowPlaying}
          loading={isLoading}
        />
        <MovieSection
          id='topRated'
          title='Фільми'
          movies={safeSections.topRated}
          loading={isLoading}
        />

        <MovieSection
          id='topRatedSeries'
          title='Серіали'
          movies={safeSections.topRatedSeries}
          loading={isLoading}
        />

        <MovieSection
          id='topRatedAnimations'
          title='Мультфільми'
          movies={safeSections.topRatedAnimations}
          loading={isLoading}
        />
      </div>
    </>
  );
}

export default MainPage;
