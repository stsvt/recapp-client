import { useState } from 'react';
import PasswordField from '../components/PasswordField';
import { register } from '../services/auth';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/Logo';

function RegisterPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleGoogleAuth = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}users/auth/google`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match.');
      return;
    }

    try {
      const res = await register(formData);
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

  return (
    <div className='full-screen'>
      <Logo />
      <div className='auth-container'>
        <form className='auth-box' onSubmit={handleSubmit}>
          <h2>Реєстрація</h2>

          <div className='input-group'>
            <label>Ім'я</label>
            <input
              type='text'
              name='name'
              placeholder="Введіть ім'я"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

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
          />

          <PasswordField
            label='Підтвердіть пароль'
            name='confirmPassword'
            value={formData.confirmPassword}
            onChange={handleChange}
          />

          <button type='submit' className='submit-btn'>
            Зареєструватись
          </button>
          <div className='separator'>або</div>

          <button
            type='button'
            className='google-btn'
            onClick={handleGoogleAuth}
          >
            <img
              src='https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg'
              alt='Google'
            />
            Зареєструватись через Google
          </button>

          <p className='auth-footer'>
            Вже маєте акаунт?{' '}
            <span className='link' onClick={() => navigate('/login')}>
              Увійти
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}

export default RegisterPage;
