import { useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function GoogleCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, login } = useAuth();
  const hasLogged = useRef(false);

  useEffect(() => {
    if (user) {
      navigate('/');
      return;
    }

    if (hasLogged.current) return;

    const token = searchParams.get('token');

    console.log('Token received:', !!token);

    if (token) {
      try {
        hasLogged.current = true;

        login(token);

        navigate('/', { replace: true });
      } catch (error) {
        console.error('Помилка під час входу через Google:', error);
        navigate('/login', { replace: true });
      }
    } else {
      const timeout = setTimeout(
        () => navigate('/login', { replace: true }),
        2000
      );
      return () => clearTimeout(timeout);
    }
  }, [searchParams, login, navigate, user]);

  return (
    <div className='full-screen'>
      <div className='loader-container'>
        <div className='spinner'></div>
        <p className='loader-text'>Авторизація через Google...</p>
      </div>
    </div>
  );
}

export default GoogleCallback;
