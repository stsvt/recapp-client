import genres from '../../data/genres.json';

async function fetchMovies() {
  const genresString = genres.map((genre) => genre.id).join(',');

  const response = await fetch(
    `${import.meta.env.VITE_API_URL}tmdb?with-genres=${genresString}`
  );
  if (!response.ok) {
    throw new Error('Failed to fetch movies');
  }

  console.log(await response.json());
  return await response.json();
}

async function fetchTopRatedMovies() {
  const response = await fetch(`${import.meta.env.VITE_API_URL}tmdb/top-rated`);

  if (!response.ok) {
    throw new Error('Failed to fetch top rated movies');
  }

  const res = await response.json();
  return res.data?.movies?.results || [];
}

async function fetchUpcomingMovies() {
  const response = await fetch(`${import.meta.env.VITE_API_URL}tmdb/upcoming`);

  if (!response.ok) {
    throw new Error('Failed to fetch upcoming movies');
  }

  const res = await response.json();
  return res.data?.movies?.results || [];
}

async function fetchNowPlayingMovies() {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}tmdb/now_playing`
  );

  if (!response.ok) {
    throw new Error('Failed to fetch now playing movies');
  }

  const res = await response.json();
  return res.data?.movies?.results || [];
}

export { fetchMovies, fetchTopRatedMovies, fetchUpcomingMovies, fetchNowPlayingMovies };
