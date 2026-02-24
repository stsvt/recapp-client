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
    const userData = searchParams.get('user');

    console.log('Token received:', !!token);
    console.log('User data received:', userData);

    if (token && userData) {
      try {
        hasLogged.current = true;

        const decodedUser = decodeURIComponent(userData);
        const parsedData = JSON.parse(decodedUser);
        const userObject = parsedData.user || parsedData;

        login(userObject, token);

        navigate('/', { replace: true });
      } catch (error) {
        console.error('Помилка парсингу даних користувача:', error);
        navigate('/login', { replace: true });
      }
    } else {
      const timeout = setTimeout(() => navigate('/login', { replace: true }), 2000);
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
