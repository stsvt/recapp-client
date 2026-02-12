import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Dashboard from '../components/Dashboard';
import PasswordField from '../components/PasswordField';

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Вхід користувача:', formData);
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
              placeholder='example@gmail.com'
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <PasswordField
            label="Пароль"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••"
          />
          <button type='submit' className='submit-btn'>
            Увійти
          </button>

          <p className='auth-footer'>
            Немає акаунту?{' '}<span className='link' onClick={() => navigate('/register')}>Зареєструватись</span>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;
