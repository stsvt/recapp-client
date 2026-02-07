import genres from '../../data/genres.json';

async function fetchMovies() {
  const genresString = genres.map((genre) => genre.id).join(',');

  const response = await fetch(
    `${import.meta.env.VITE_API_URL}movies?with-genres=${genresString}`
  );
  if (!response.ok) {
    throw new Error('Failed to fetch movies');
  }

  console.log(await response.json());
  return await response.json();
}

export { fetchMovies };
