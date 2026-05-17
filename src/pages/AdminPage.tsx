import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import {
  fetchContentBasedRecommendations,
  fetchUserBasedRecommendations,
  fetchHybridRecommendations,
} from '../services/moviesApi';
import MovieCard from '../components/movies/MovieCard';
import SkeletonCard from '../components/SkeletonCard';
import type { MovieSummary } from '../types';

function AdminPage() {
  const { user } = useAuth();

  const { data: contentBasedRecs, isLoading: isContentLoading } = useQuery({
    queryKey: ['recommendations-content', user?._id],
    queryFn: fetchContentBasedRecommendations,
    enabled: !!user?._id,
  });

  const { data: userBasedRecs, isLoading: isUserBasedLoading } = useQuery({
    queryKey: ['recommendations-user', user?._id],
    queryFn: () => fetchUserBasedRecommendations(user!._id),
    enabled: !!user?._id,
  });

  const { data: hybridRecs, isLoading: isHybridLoading } = useQuery({
    queryKey: ['recommendations-hybrid', user?._id],
    queryFn: fetchHybridRecommendations,
    enabled: !!user?._id,
  });

  const renderGrid = (
    title: string,
    movies: MovieSummary[] | undefined,
    isLoading: boolean
  ) => {
    return (
      <div style={{ marginBottom: '3rem' }}>
        <h2 className='section-title' style={{ marginBottom: '1rem' }}>
          {title}
        </h2>
        {isLoading ? (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(5, 1fr)',
              gap: '2.5rem',
            }}
          >
            {[...Array(5)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : movies && movies.length > 0 ? (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(5, 1fr)',
              gap: '2.5rem',
            }}
          >
            {movies.map((movie, index) => (
              <MovieCard
                key={movie.tmdbId || movie.id || `movie-${index}`}
                movie={movie}
              />
            ))}
          </div>
        ) : (
          <p className='status-text'>Фільмів не знайдено</p>
        )}
      </div>
    );
  };

  if (!user || user.role !== 'admin') {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h2 className='section-title'>Доступ заборонено</h2>
        <p className='status-text'>Ця сторінка доступна лише адміністраторам.</p>
      </div>
    );
  }

  return (
    <div>
      {renderGrid('Гібридні рекомендації (Hybrid)', hybridRecs, isHybridLoading)}
      {renderGrid('Контентна фільтрація (Content-based)', contentBasedRecs, isContentLoading)}
      {renderGrid('Колаборативна фільтрація (User-based)', userBasedRecs, isUserBasedLoading)}
    </div>
  );
}

export default AdminPage;
