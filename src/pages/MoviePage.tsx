import { useEffect, useState } from 'react';
import { fetchMovieDetails } from '../services/apiMovies';
import { useNavigate, useParams } from 'react-router-dom';
import MovieSection from '../components/MovieSection';
import Dashboard from '../components/Dashboard';
import MovieStatusButton from '../components/MovieStatusButton';
import Spinner from '../components/Spinner';
import type { Movie, CrewMember, Genre, Review } from '../types/index';
import {
  HeartIcon,
  BookmarkSimpleIcon,
  CaretLeftIcon,
} from '@phosphor-icons/react';
import { getMovieStatus, toggleActivityMovie } from '../services/activity';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import AddReviewForm from '../components/AddReviewForm';
import { deleteReview, fetchReviews } from '../services/reviews';
import { Button } from '../components/Button.tsx';

function MoviePage() {
  const { user } = useAuth();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [isWatched, setIsWatched] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null);
  const [isFormVisible, setIsFormVisible] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const [movieData, statusData, reviewsData] = await Promise.all([
          fetchMovieDetails(id),
          getMovieStatus(id),
          fetchReviews(id),
        ]);

        if (movieData) setMovie(movieData);

        if (statusData) {
          setIsLiked(statusData.liked);
          setIsWatched(statusData.watched);
        }

        if (reviewsData?.data?.reviews) {
          setReviews(reviewsData.data.reviews);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id]);

  if (loading) return <Spinner />;

  if (!movie) return null;

  const directorData = movie.credits?.crew?.find(
    (p: CrewMember) => p.job === 'Director'
  );
  const directorName = directorData?.name || 'Невідомо';

  const handleToggleActivity = async (type: 'liked' | 'watched') => {
    if (!user) {
      toast.error(
        'Будь ласка, увійдіть в акаунт, щоб додавати фільми до списків',
        {
          icon: '🔒',
          duration: 4000,
        }
      );
      return;
    }

    try {
      await toggleActivityMovie(id!, type);
      if (type === 'liked') setIsLiked(!isLiked);
      if (type === 'watched') setIsWatched(!isWatched);
      toast.success('Список оновлено');
    } catch (error: unknown) {
      const msg =
        error instanceof Error ? error.message : 'Не вдалося оновити статус';
      toast.error(msg);
    }
  };

  const handleNewReview = (newReview: Review) => {
    setReviews((prev) => [newReview, ...prev]);
    setIsFormVisible(false);
    toast.success('Ваш відгук додано');
  };

  const handleUpdateReview = (updatedReview: Review) => {
    setReviews((prev) =>
      prev.map((rev) => (rev._id === updatedReview._id ? updatedReview : rev))
    );
    toast.success('Ваш відгук оновлено');
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (!window.confirm('Ви впевнені, що хочете видалити цей відгук?')) return;

    try {
      await deleteReview(reviewId);
      setReviews((prev) => prev.filter((rev) => rev._id !== reviewId));
      toast.success('Відгук видалено');
    } catch (error: unknown) {
      const msg =
        error instanceof Error ? error.message : 'Не вдалося видалити відгук';
      toast.error(msg);
    }
  };

  return (
    <div className='full-screen'>
      <Dashboard />
      <div className='movie-page-content'>
        <div className='content-wrapper'>
          <header className='movie-header'>
            <div className='movie-title-row'>
              <Button
                variant='icon'
                icon={<CaretLeftIcon size={28} />}
                onClick={() => navigate(-1)}
                title='Назад'
              />
              <div>
                <h1>{movie.title}</h1>
                <p className='original-title'>{movie.original_title}</p>
              </div>
            </div>
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
                {movie.runtime > 0 && (
                  <>
                    <span className='dot'>•</span>
                    <span>
                      {Math.floor(movie.runtime / 60)} год {movie.runtime % 60}{' '}
                      хв
                    </span>
                  </>
                )}
                {movie.vote_average > 0.0 && (
                  <>
                    <span className='dot'>•</span>
                    <span className='imdb-tag'>
                      IMDb {movie.vote_average.toFixed(1) || '0.0'}/10
                    </span>
                  </>
                )}
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
                  <button
                    className='actor-link-btn'
                    onClick={() =>
                      navigate(`/person/${directorData?.id}`, {
                        state: { name: directorName },
                      })
                    }
                  >
                    <span className='cast-value'>{directorName}</span>
                  </button>
                </p>
                <p className='cast-row'>
                  <strong className='cast-label'>У ролях</strong>
                  <span className='cast-value'>
                    {movie.credits?.cast
                      ?.slice(0, 10)
                      .map((actor, index, array) => (
                        <span key={`${actor.id}-${index}`}>
                          <button
                            className='actor-link-btn'
                            onClick={() =>
                              navigate(`/person/${actor.id}`, {
                                state: { name: actor.name },
                              })
                            }
                          >
                            {actor.name}
                          </button>
                          {index < array.length - 1 ? ', ' : ''}
                        </span>
                      )) || 'Дані відсутні'}
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
              isActive={isLiked}
              onClick={() => handleToggleActivity('liked')}
              Icon={HeartIcon}
            />
            <MovieStatusButton
              label='Переглянуто'
              isActive={isWatched}
              onClick={() => handleToggleActivity('watched')}
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
              key={`recommendations-${movie.id}`}
              title=''
              movies={movie.recommendations.results}
              loading={false}
            />
          </section>
        )}

        <div className='content-wrapper'>
          <section className='reviews-section' style={{ marginTop: '40px' }}>
            <div
              className='reviews-header'
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '20px',
                marginBottom: '30px',
              }}
            >
              <h2 className='section-title'>Коментарі ({reviews.length})</h2>

              {!editingReviewId && (
                <button
                  className='add-comment-btn'
                  onClick={() => setIsFormVisible(!isFormVisible)}
                >
                  {isFormVisible ? 'Скасувати' : 'Додати коментар ✎'}
                </button>
              )}
            </div>

            {isFormVisible && !editingReviewId && (
              <div className='form-wrapper-animation'>
                <AddReviewForm movieId={id!} onReviewAdded={handleNewReview} />
              </div>
            )}

            <div className='reviews-list'>
              {reviews.length === 0 ? (
                <p
                  style={{
                    color: '#888',
                    textAlign: 'center',
                    padding: '40px',
                  }}
                >
                  Поки що немає жодного відгуку. Будьте першим!
                </p>
              ) : (
                [...reviews]
                  .sort(
                    (a, b) =>
                      new Date(b.createdAt).getTime() -
                      new Date(a.createdAt).getTime()
                  )
                  .map((rev) => (
                    <div key={rev._id} className='comment-card'>
                      {editingReviewId === rev._id ? (
                        <AddReviewForm
                          movieId={id!}
                          initialData={rev}
                          onReviewAdded={(updated) => {
                            handleUpdateReview(updated);
                            setEditingReviewId(null);
                          }}
                          onCancel={() => setEditingReviewId(null)}
                        />
                      ) : (
                        <>
                          <div className='comment-header'>
                            <div className='user-info'>
                              <div className='avatar'>
                                {typeof rev.user === 'object' &&
                                rev.user !== null
                                  ? rev.user.name?.charAt(0).toUpperCase() ||
                                    'U'
                                  : rev.user
                                      ?.toString()
                                      .slice(-1)
                                      .toUpperCase() || 'U'}
                              </div>
                              <span className='username'>
                                {typeof rev.user === 'object' &&
                                rev.user !== null
                                  ? rev.user.username ||
                                    rev.user.name ||
                                    'Користувач'
                                  : `Користувач ${rev.user?.toString().slice(-4) || ''}`}
                              </span>
                            </div>
                            <span className='comment-date'>
                              {new Date(rev.createdAt).toLocaleDateString(
                                'uk-UA',
                                {
                                  day: 'numeric',
                                  month: 'long',
                                }
                              )}
                            </span>
                          </div>

                          <p className='comment-text'>{rev.review}</p>

                          <div className='comment-footer'>
                            <div className='reactions'>
                              <span>👍</span> <span>❤️</span>
                            </div>

                            {user?._id ===
                              (typeof rev.user === 'object'
                                ? rev.user?._id
                                : rev.user) && (
                              <div className='admin-actions'>
                                <button
                                  onClick={() => setEditingReviewId(rev._id)}
                                  className='edit-btn'
                                >
                                  Редагувати
                                </button>
                                <button
                                  onClick={() => handleDeleteReview(rev._id)}
                                  className='delete-btn'
                                >
                                  Видалити
                                </button>
                              </div>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  ))
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default MoviePage;
