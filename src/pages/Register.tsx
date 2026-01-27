import { useState } from 'react';
import Dashboard from '../components/Dashboard';
import { useNavigate } from 'react-router-dom';

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Дані для реєстрації:', formData);
  };

  return (
    <div className='full-screen'>
      <Dashboard />
      <div className='auth-container'>
        <form className='auth-box' onSubmit={handleSubmit}>
          <h2>Реєстрація</h2>

          <div className='input-group'>
            <label>Ім'я</label>
            <input
              type='text'
              name='username'
              placeholder="Введіть ім'я"
              value={formData.username}
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

          <div className='input-group'>
            <label>Пароль</label>
            <input
              type='password'
              name='password'
              placeholder='*******'
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className='input-group'>
            <label>Підтвердіть пароль</label>
            <input
              type='password'
              name='confirmPassword'
              placeholder='*******'
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          <button type='submit' className='submit-btn'>
            Зареєструватись
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

export default Register;
