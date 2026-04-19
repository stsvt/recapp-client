import { useQuery } from '@tanstack/react-query';
import MovieSection from '../components/movies/MovieSection.tsx';
import {
  fetchTopRatedMovies,
  fetchUpcomingMovies,
  fetchNowPlayingMovies,
  fetchTopRatedSeries,
  fetchTopRatedAnimations,
  fetchRecommendations,
} from '../services/moviesApi.ts';
import { useAuth } from '../context/AuthContext.tsx';

function MainPage() {
  const { user } = useAuth();

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

  const { data: recommendations, isLoading: isRecommendationsLoading } =
    useQuery({
      queryKey: ['recommendations'],
      queryFn: fetchRecommendations,
      enabled: !!user,
      // staleTime: 1000 * 60 * 60, // 1 hour
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
        {user && recommendations && recommendations.length > 0 && (
          <MovieSection
            id='recommendations'
            title='Рекомендації для вас'
            movies={recommendations}
            loading={isRecommendationsLoading}
          />
        )}
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
