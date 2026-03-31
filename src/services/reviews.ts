import type { ReviewData } from '../types';
const BASE_URL = import.meta.env.VITE_API_URL;

export const createReview = async (movieId: string, data: ReviewData) => {
  const response = await fetch(`${BASE_URL}reviews/${movieId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to create review');
  }
  return response.json();
};

export const fetchReviews = async (movieId: string) => {
  const response = await fetch(`${BASE_URL}reviews/${movieId}`);
  if (!response.ok) return null;
  return response.json();
};

export const updateReview = async (reviewId: string, data: ReviewData) => {
  const response = await fetch(`${BASE_URL}reviews/${reviewId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to update review');
  }
  return response.json();
};

export const deleteReview = async (reviewId: string) => {
  const response = await fetch(`${BASE_URL}reviews/${reviewId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });

  if (!response.ok) throw new Error('Не вдалося видалити відгук');
  return true;
};
