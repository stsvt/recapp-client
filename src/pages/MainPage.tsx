import { useQuery } from '@tanstack/react-query';
import MovieSection from '../components/movies/MovieSection.tsx';
import { useAuth } from '../context/AuthContext.tsx';
import {
  fetchGuestRecommendations,
  fetchHybridRecommendations,
  fetchNowPlayingMovies,
  fetchTopRatedAnimations,
  fetchTopRatedMovies,
  fetchTopRatedSeries,
  fetchUpcomingMovies,
} from '../services/moviesApi.ts';

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

  // const { data: contentBasedRecs, isLoading: isContentLoading } = useQuery({
  //   queryKey: ['recommendations-content'],
  //   queryFn: fetchContentBasedRecommendations,
  //   enabled: !!user,
  //   // staleTime: 1000 * 60 * 60, // 1 hour
  // });

  // const { data: userBasedRecs, isLoading: isUserBasedLoading } = useQuery({
  //   queryKey: ['recommendations-user', user?._id],
  //   queryFn: () => fetchUserBasedRecommendations(user!._id),
  //   enabled: !!user?._id,
  // });

  const { data: hybridRecs, isLoading: isHybridLoading } = useQuery({
    queryKey: ['recommendations-hybrid', user?._id],
    queryFn: fetchHybridRecommendations,
    enabled: !!user?._id,
  });

  const { data: guestRecs, isLoading: isGuestRecsLoading } = useQuery({
    queryKey: ['recommendations-guest'],
    queryFn: fetchGuestRecommendations,
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
        {user && hybridRecs && hybridRecs.length > 0 && (
          <MovieSection
            id='hybrid-recs'
            title='Ваш ідеальний вибір'
            movies={hybridRecs}
            loading={isHybridLoading}
          />
        )}

        {!user && (
          <MovieSection
            id='guest-recs'
            title='Ваш може сподобатись'
            movies={guestRecs}
            loading={isGuestRecsLoading}
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
