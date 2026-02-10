import genres from '../../data/genres.json';

const BASE_URL = import.meta.env.VITE_API_URL;

export async function fetchMovies() {
  const genresString = genres.map((genre) => genre.id).join(',');

  const response = await fetch(
    `${BASE_URL}tmdb?with-genres=${genresString}`
  );
  if (!response.ok) {
    throw new Error('Failed to fetch movies');
  }
  const result = await response.json();
  return result;
}

const getMoviesData = async (url : string) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch movies data. Status: ${response.status}`);
  }
  const result = await response.json();
  return result?.data?.movies?.results || [];
}

export const fetchTopRatedMovies = () => getMoviesData(`${BASE_URL}tmdb/top-rated`);

export const fetchUpcomingMovies = () => getMoviesData(`${BASE_URL}tmdb/upcoming`);

export const fetchNowPlayingMovies = () => getMoviesData(`${BASE_URL}tmdb/now_playing`);