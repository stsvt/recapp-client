import type { PersonDetails, PersonData, BaseWork, ActorMovie } from '../types';

const BASE_URL = import.meta.env.VITE_API_URL;

export const getPersonContent = async (
  id: string,
  type: 'movies' | 'works'
): Promise<BaseWork[] | ActorMovie[]> => {
  try {
    const response = await fetch(`${BASE_URL}person/${id}/${type}`);
    if (!response.ok) throw new Error('Помилка завантаження');

    const result = await response.json();
    const content = result.data as PersonData;
    const dataArray = content[type];

    return Array.isArray(dataArray) ? dataArray : [];
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const getPersonDetails = async (
  id: string
): Promise<PersonDetails | null> => {
  try {
    const response = await fetch(`${BASE_URL}person/${id}`);
    const result = await response.json();
    console.log(result.data);
    return result.data.person;
  } catch (error) {
    console.error('Error fetching person details:', error);
    return null;
  }
};
