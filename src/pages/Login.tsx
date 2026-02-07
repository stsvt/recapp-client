import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Dashboard from '../components/Dashboard';

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleSubmit = (e) => {
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
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
            />
          </div>
          <div className='input-group'>
            <label>Пароль</label>
            <input
              type='password'
              placeholder='*******'
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              required
            />
          </div>
          <button type='submit' className='submit-btn'>
            Увійти
          </button>

          <p className='auth-footer'>
            Немає акаунту? <span className='link' onClick={() => navigate('/register')}>Зареєструватись</span>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;
