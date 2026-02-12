import React from 'react';
import { useState } from 'react';
import Dashboard from '../components/Dashboard';
import PasswordField from '../components/PasswordField';
import { useNavigate } from 'react-router-dom';

function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
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
