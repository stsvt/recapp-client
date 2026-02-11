import genresData from '../../data/genres.json';

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function FilterModal({ isOpen, onClose }: FilterModalProps) {
  if (!isOpen) return null;

  const filters = {
    genres: genresData,
    studios: ['Netflix', 'Warner Bros.', 'Disney', 'Universal', 'Sony (Columbia)', 'Paramount', '20th Century', 'Marvel', 'Lucasfilm', 'Pixar', 'A24' ],
    years: [
      'До 1930',
      '1931 - 1959',
      '1960 - 1989',
      '1990 - 2014',
      '2015 - 2021',
      '2022 - дотепер',
    ],
    duration: ['до 30 хв', '30 - 60 хв', 'понад 60 хв'],
    rating: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  };

  return (
    <div className='filter-overlay'>
      <div className='filter-container'>
        <div className='filter-grid'>
          <div className='filter-column'>
            <h3>Жанри</h3>
            <div className='genres-list'>
              {filters.genres.map((genre) => (
                <label key={genre.id}>
                  <input type='checkbox' value={genre.id} />
                  {genre.name}
                </label>
              ))}
            </div>
          </div>
          <div className='filter-column'>
            <h3>Студії</h3>
            {filters.studios.map((item) => (
              <label key={item}>
                <input type='checkbox' />
                {item}
              </label>
            ))}
          </div>

          <div className='filter-column'>
            <h3>Роки виробництва</h3>
            {filters.years.map((item) => (
              <label key={item}>
                <input type='checkbox' />
                {item}
              </label>
            ))}

            <h3 className='mt-20'>Хронометраж</h3>
            {filters.duration.map((item) => (
              <label key={item}>
                <input type='checkbox' />
                {item}
              </label>
            ))}
          </div>

          <div className='filter-column'>
            <h3>Рейтинг Imdb</h3>
            <div className='rating-scroll'>
              {filters.rating.map((item) => (
                <label key={item}>
                  <input type='checkbox' />
                  {item}
                </label>
              ))}
            </div>
          </div>
        </div>
        <button className='apply-btn' onClick={onClose}>
          Застосувати фільтри
        </button>
      </div>
    </div>
  );
}

export default FilterModal;
