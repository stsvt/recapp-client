const BASE_URL = import.meta.env.VITE_API_URL;

const getHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${localStorage.getItem('token')}`,
});

export const toggleActivityMovie = async (
  tmdbId: string | number,
  activityType: 'liked' | 'watched'
) => {
  const response = await fetch(`${BASE_URL}activity`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ tmdbId, activityType }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message);
  }

  return await response.json();
};

export const getUserActivity = async () => {
  const response = await fetch(`${BASE_URL}activity`, {
    headers: getHeaders(),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message);
  }
  return await response.json();
};

export const getMovieStatus = async (tmdbId: string) => {
  const response = await fetch(`${BASE_URL}activity/status/${tmdbId}`, {
    headers: getHeaders(),
  });

  if (!response.ok) return { liked: false, watched: false };
  const result = await response.json();
  return result.data;
};
