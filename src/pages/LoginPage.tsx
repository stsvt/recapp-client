import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PasswordField from '../components/PasswordField';
import { login as loginApi } from '../services/auth';
import { useAuth } from '../context/AuthContext';
import { forgotPassword } from '../services/user';
import Logo from '../components/Logo';
import { Button } from '../components/Button.tsx';

function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showForgotForm, setShowForgotForm] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await loginApi(formData);
      login(res.data.user, res.token);
      console.log('Success', res);
      navigate('/');
    } catch (error: unknown) {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert('An unexpected error occurred');
      }
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await forgotPassword(forgotEmail);
      alert('Лист для відновлення надіслано на вашу пошту!');
      setShowForgotForm(false);
      setForgotEmail('');
    } catch (error: unknown) {
      alert(
        error instanceof Error ? error.message : 'Помилка при відправці листа'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}users/auth/google`;
  };

  return (
    <div className='full-screen'>
      <Logo />
      <div className='auth-container'>
        {!showForgotForm ? (
          <form className='auth-box' onSubmit={handleSubmit}>
            <h2>Вхід</h2>
            <div className='input-group'>
              <label>Email</label>
              <input
                type='email'
                name='email'
                placeholder='example@gmail.com'
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <PasswordField
              label='Пароль'
              name='password'
              value={formData.password}
              onChange={handleChange}
              placeholder='••••••••'
            />

            <div className='forgot-password-link'>
              <span
                className='link-small'
                onClick={() => setShowForgotForm(true)}
              >
                Забули пароль?
              </span>
            </div>

            <Button type='submit' className='submit-btn' variant='primary'>
              Увійти
            </Button>
            <div className='separator'>або</div>
            <Button
              className='google-btn'
              onClick={handleGoogleAuth}
              variant='secondary'
              size='md'
            >
              <img
                src='https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg'
                alt='Google'
              />
              Увійти через Google
            </Button>

            <p className='auth-footer'>
              Немає акаунту?{' '}
              <span className='link' onClick={() => navigate('/register')}>
                Зареєструватись
              </span>
            </p>
          </form>
        ) : (
          <form className='auth-box' onSubmit={handleForgotPassword}>
            <h2>Відновлення пароля</h2>
            <p className='auth-subtitle'>
              Введіть ваш email, щоб отримати посилання для скидання пароля
            </p>
            <div className='input-group'>
              <label>Email</label>
              <input
                type='email'
                placeholder='example@gmail.com'
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                required
              />
            </div>

            <button type='submit' className='submit-btn' disabled={loading}>
              {loading ? 'Надсилання...' : 'Надіслати інструкції'}
            </button>

            <p className='auth-footer'>
              <span className='link' onClick={() => setShowForgotForm(false)}>
                Повернутися до входу
              </span>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}

export default LoginPage;
