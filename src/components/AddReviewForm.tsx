import { useState } from 'react';
import { createReview, updateReview } from '../services/reviews';
import type { Review } from '../types';

interface AddReviewFormProps {
  movieId: string;
  onReviewAdded?: (newReview: Review) => void;
  initialData?: Review;
  onCancel?: () => void;
}

const AddReviewForm: React.FC<AddReviewFormProps> = ({
  movieId,
  onReviewAdded,
  initialData,
  onCancel,
}) => {
  const [text, setText] = useState(initialData?.review || '');
  const [rating, setRating] = useState(initialData?.rating || 10);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEditing = !!initialData;

  const token = localStorage.getItem('token');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    setIsSubmitting(true);
    setError(null);

    try {
      let result;
      if (isEditing) {
        result = await updateReview(initialData!._id, { review: text, rating });
      } else {
        result = await createReview(movieId, { review: text, rating });
      }

      if (result.status === 'success') {
        if (!isEditing) {
          setText('');
          setRating(10);
        }
        if (onReviewAdded) onReviewAdded(result.data.review);
      }
    } catch {
      setError(isEditing ? 'Failed to update' : 'Failed to add');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!token) {
    return <p>Будь ласка, увійдіть в акаунт, щоб залишити коментар</p>;
  }

  return (
    <div className={`add-review-container ${isEditing ? 'edit-mode' : ''}`}>
      <h3>{isEditing ? 'Редагувати відгук' : 'Ваш відгук'}</h3>
      <form onSubmit={handleSubmit}>
        <input
          type='number'
          min='1'
          max='10'
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
        />
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          required
          rows={isEditing ? 2 : 4}
        />

        {error && (
          <p style={{ color: '#ff4d4d', fontSize: '14px', marginTop: '8px' }}>
            {error}
          </p>
        )}

        <div className='form-actions'>
          <button type='submit' disabled={isSubmitting}>
            {isSubmitting ? 'Збереження...' : isEditing ? 'Оновити' : 'Додати'}
          </button>
          {isEditing && (
            <button type='button' onClick={onCancel} className='cancel-btn'>
              Скасувати
            </button>
          )}
        </div>
      </form>
    </div>
  );
};
export default AddReviewForm;
