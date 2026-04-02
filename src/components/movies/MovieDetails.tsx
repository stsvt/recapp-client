import { CaretLeftIcon } from '@phosphor-icons/react';
import type { CrewMember, Genre, Movie } from '../../types';
import { Button } from '../ui/Button.tsx';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export function MovieDetails({ movie }: { movie: Movie }) {
  const navigate = useNavigate();

  const [isImageLoading, setIsImageLoading] = useState(true);

  const directorData = movie.credits?.crew?.find(
    (p: CrewMember) => p.job === 'Director'
  );
  const directorName = directorData?.name || 'Невідомо';

  return (
    <>
      <header className='movie-header'>
        <div className='movie-title-row'>
          <Button
            variant='icon'
            icon={<CaretLeftIcon size={28} />}
            onClick={() => navigate(-1)}
            title='Назад'
          />
          <div>
            <h1>{movie.title}</h1>
            <p className='original-title'>{movie.original_title}</p>
          </div>
        </div>
      </header>

      <section className='main-info-grid'>
        <div
          className='poster-column'
          style={{
            position: 'relative',
            width: '240px',
            minHeight: '360px',
            backgroundColor: '#1a1a1a',
            borderRadius: '4px',
            overflow: 'hidden',
          }}
        >
          {isImageLoading && (
            <div className='image-loader-overlay shimmer-wave'></div>
          )}
          <img
            src={`${import.meta.env.VITE_IMAGE_URL}${movie.poster_path || movie.backdrop_path}`}
            alt={movie.title}
            onLoad={() => setIsImageLoading(false)}
            style={{
              display: isImageLoading ? 'none' : 'block',
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        </div>

        <div className='details-column'>
          <div className='stats-row'>
            <span>
              {movie.release_date
                ? new Date(movie.release_date).getFullYear()
                : '—'}
            </span>
            {movie.runtime > 0 && (
              <>
                <span className='dot'>•</span>
                <span>
                  {Math.floor(movie.runtime / 60)} год {movie.runtime % 60} хв
                </span>
              </>
            )}
            {movie.vote_average > 0.0 && (
              <>
                <span className='dot'>•</span>
                <span className='imdb-tag'>
                  IMDb {movie.vote_average.toFixed(1) || '0.0'}/10
                </span>
              </>
            )}
          </div>

          <div className='genres-row'>
            {movie.genres?.map((g: Genre) => (
              <span key={g.id} className='genre-pill'>
                {g.name}
              </span>
            ))}
          </div>

          <div className='cast-info'>
            <p className='cast-row'>
              <strong className='cast-label'>Режисер</strong>
              <button
                className='actor-link-btn'
                onClick={() =>
                  navigate(`/person/${directorData?.id}`, {
                    state: { name: directorName },
                  })
                }
              >
                <span className='cast-value'>{directorName}</span>
              </button>
            </p>
            <p className='cast-row'>
              <strong className='cast-label'>У ролях</strong>
              <span className='cast-value'>
                {movie.credits?.cast
                  ?.slice(0, 10)
                  .map((actor, index, array) => (
                    <span key={`${actor.id}-${index}`}>
                      <button
                        className='actor-link-btn'
                        onClick={() =>
                          navigate(`/person/${actor.id}`, {
                            state: { name: actor.name },
                          })
                        }
                      >
                        {actor.name}
                      </button>
                      {index < array.length - 1 ? ', ' : ''}
                    </span>
                  )) || 'Дані відсутні'}
              </span>
            </p>
          </div>
        </div>
      </section>

      <article className='description-section'>
        <p>{movie.overview}</p>
      </article>
    </>
  );
}
