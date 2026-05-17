import { WarningCircleIcon } from '@phosphor-icons/react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';

function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        textAlign: 'center',
        padding: '2rem',
      }}
    >
      <WarningCircleIcon
        size={80}
        color='var(--color-text-dark-500)'
        weight='light'
        style={{ marginBottom: '1.5rem' }}
      />
      <h1
        className='section-title'
        style={{ fontSize: '2.5rem', marginBottom: '1rem' }}
      >
        404 Не знайдено
      </h1>
      <p
        className='status-text'
        style={{ marginBottom: '2rem', maxWidth: '400px' }}
      >
        На жаль, ми не змогли знайти те, що ви шукаєте. Можливо, посилання
        застаріле або містить помилку.
      </p>
      <Button variant='primary' onClick={() => navigate('/')}>
        На головну
      </Button>
    </div>
  );
}

export default NotFoundPage;
