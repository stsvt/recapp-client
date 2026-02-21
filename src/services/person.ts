import type { PersonDetails } from '../types';

const BASE_URL = import.meta.env.VITE_API_URL;

export const getPersonContent = async (
  id: string,
  type: 'movies' | 'works'
): Promise<PersonDetails | null> => {
  try {
    const response = await fetch(`${BASE_URL}person/${id}/${type}`);
    if (!response.ok) throw new Error('Помилка завантаження');

    const result = await response.json();
    console.log(result);
    return result.data;
  } catch (error) {
    console.error(error);
    return null;
  }
};
