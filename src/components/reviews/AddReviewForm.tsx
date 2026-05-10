import { useState } from 'react';
import { createReview, updateReview } from '../../services/reviewsApi.ts';
import { useAuth } from '../../context/AuthContext.tsx';
import type { Review } from '../../types';
import { StarRating } from '../ui/StarRating.tsx';
import { Button } from '../ui/Button.tsx';

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
  const [rating, setRating] = useState(initialData?.rating || 0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { user } = useAuth();

  const isEditing = !!initialData;

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

  if (!user) {
    return <p>Будь ласка, увійдіть в акаунт, щоб залишити коментар</p>;
  }

  return (
    <div className={`add-review-container ${isEditing ? 'edit-mode' : ''}`}>
      <h3>{isEditing ? 'Редагувати відгук' : 'Ваш відгук'}</h3>
      <form onSubmit={handleSubmit}>
        <div
          style={{
            marginBottom: '14px',
            display: 'flex',
            gap: '16px',
            alignItems: 'center',
            justifySelf: 'start',
          }}
        >
          <StarRating defaultRating={rating} onSetRating={setRating} />
          <span
            style={{ fontSize: 16, fontWeight: 'bold' }}
          >{`${rating}/10`}</span>
        </div>
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
          <Button
            type='submit'
            disabled={isSubmitting}
            variant='secondary'
            style={{ backgroundColor: '#fff' }}
          >
            {isSubmitting ? 'Збереження...' : isEditing ? 'Оновити' : 'Додати'}
          </Button>
          {isEditing && (
            <Button
              type='button'
              onClick={onCancel}
              variant='secondary'
              className='cancel-btn'
            >
              Скасувати
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};
export default AddReviewForm;
