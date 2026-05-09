import genres from '../../data/genres.json';

const BASE_URL = import.meta.env.VITE_API_URL;

export async function fetchMovies() {
  const genresString = genres.map((genre) => genre.id).join(',');

  const response = await fetch(`${BASE_URL}tmdb?with-genres=${genresString}`);
  if (!response.ok) {
    throw new Error('Failed to fetch movies');
  }
  const result = await response.json();
  return result;
}

const getMoviesData = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch movies data. Status: ${response.status}`);
  }
  const result = await response.json();
  const data = result?.data;
  if (!data) return [];

  const dynamicKey = Object.keys(data).find(
    (key) => data[key] && data[key].results
  );

  return dynamicKey ? data[dynamicKey].results : [];
};

export const fetchMovieDetails = async (id: string) => {
  const response = await fetch(`${BASE_URL}tmdb/${id}`);

  if (!response.ok) {
    throw new Error(
      `Failed to fetch movie details. Status: ${response.status}`
    );
  }

  const result = await response.json();
  return result?.data?.movie || null;
};

export const fetchTopRatedMovies = () =>
  getMoviesData(`${BASE_URL}tmdb/topRated`);

export const fetchUpcomingMovies = () =>
  getMoviesData(`${BASE_URL}tmdb/upcoming`);

export const fetchNowPlayingMovies = () =>
  getMoviesData(`${BASE_URL}tmdb/nowPlaying`);

export const fetchTopRatedSeries = () =>
  getMoviesData(`${BASE_URL}tmdb/topRatedSeries`);

export const fetchTopRatedAnimations = () =>
  getMoviesData(`${BASE_URL}tmdb/topRatedAnimations`);

export const fetchSimilarMovies = (movieId: string) =>
  getMoviesData(`${BASE_URL}collaborative-filtering/similar/${movieId}`);

export const searchMovies = async (query: string, page: number = 1) => {
  try {
    const response = await fetch(
      `${BASE_URL}tmdb/search?query=${encodeURIComponent(query)}&page=${page}`
    );

    const result = await response.json();
    return result?.data?.movies?.results || [];
  } catch (error) {
    console.error('Search error:', error);
    return [];
  }
};
