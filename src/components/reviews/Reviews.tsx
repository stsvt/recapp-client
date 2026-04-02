import AddReviewForm from './AddReviewForm.tsx';
import type { Review } from '../../types';
import toast from 'react-hot-toast';
import { deleteReview, fetchReviews } from '../../services/reviewsApi.ts';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

interface ReviewsProps {
  movieId: string | undefined;
  userId: string | undefined;
}
export function Reviews({ movieId, userId }: ReviewsProps) {
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null);
  const [isFormVisible, setIsFormVisible] = useState(false);

  const { data: reviews, refetch: refetchReviews } = useQuery<Array<Review>>({
    queryKey: ['reviews', movieId],
    queryFn: () => fetchReviews(movieId!),
    enabled: Boolean(movieId),
  });

  const handleNewReview = (_newReview: Review) => {
    setIsFormVisible(false);
    toast.success('Ваш відгук додано');
    refetchReviews();
  };

  const handleUpdateReview = (_updatedReview: Review) => {
    toast.success('Ваш відгук оновлено');
    refetchReviews();
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (!window.confirm('Ви впевнені, що хочете видалити цей відгук?')) return;

    try {
      await deleteReview(reviewId);
      toast.success('Відгук видалено');
      refetchReviews();
    } catch (error: unknown) {
      const msg =
        error instanceof Error ? error.message : 'Не вдалося видалити відгук';
      toast.error(msg);
    }
  };

  return (
    <div className='content-wrapper'>
      <section className='reviews-section'>
        <div className='reviews-header'>
          {reviews && (
            <h2 className='sub-section-title'>Коментарі ({reviews.length})</h2>
          )}

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
            <AddReviewForm movieId={movieId!} onReviewAdded={handleNewReview} />
          </div>
        )}

        <div className='reviews-list'>
          {!reviews || reviews.length === 0 ? (
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
                      movieId={movieId!}
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
                            {typeof rev.user === 'object' && rev.user !== null
                              ? rev.user.name?.charAt(0).toUpperCase() || 'U'
                              : rev.user?.toString().slice(-1).toUpperCase() ||
                                'U'}
                          </div>
                          <span className='username'>
                            {typeof rev.user === 'object' && rev.user !== null
                              ? rev.user.username ||
                                rev.user.name ||
                                'Користувач'
                              : `Користувач ${rev.user?.toString().slice(-4) || ''}`}
                          </span>
                        </div>
                        <span className='comment-date'>
                          {new Date(rev.createdAt).toLocaleDateString('uk-UA', {
                            day: 'numeric',
                            month: 'long',
                          })}
                        </span>
                      </div>

                      <p className='comment-text'>{rev.review}</p>

                      <div className='comment-footer'>
                        <div className='reactions'>
                          <span>👍 ❤️</span>
                        </div>

                        {userId ===
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
  );
}
