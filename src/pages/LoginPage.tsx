import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Dashboard from '../components/Dashboard';
import PasswordField from '../components/PasswordField';
import { login as loginApi } from '../services/auth';
import { useAuth } from '../context/AuthContext';

function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });

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

  return (
    <div className='full-screen'>
      <Dashboard />
      <div className='auth-container'>
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
          <button type='submit' className='submit-btn'>
            Увійти
          </button>

          <p className='auth-footer'>
            Немає акаунту?{' '}
            <span className='link' onClick={() => navigate('/register')}>
              Зареєструватись
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
