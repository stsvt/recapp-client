import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import PasswordField from '../components/PasswordField';
import { resetPassword } from '../services/usersApi.ts';
import { useAuth } from '../context/AuthContext';

function ResetPasswordPage() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error('Паролі не збігаються!');
      return;
    }

    setLoading(true);
    try {
      const res = await resetPassword(token!, formData);
      login(res.token);

      toast.success('Пароль успішно змінено! Ви увійшли в систему.');
      navigate('/');
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error(err.message);
      }
      toast.error('Посилання недійсне або термін дії закінчився');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className='auth-container'>
        <form className='auth-box' onSubmit={handleSubmit}>
          <h2>Новий пароль</h2>
          <p className='auth-subtitle'>Введіть ваш новий надійний пароль</p>

          <PasswordField
            label='Новий пароль'
            name='password'
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            placeholder='Мінімум 8 символів'
          />

          <PasswordField
            label='Підтвердження'
            name='confirmPassword'
            value={formData.confirmPassword}
            onChange={(e) =>
              setFormData({ ...formData, confirmPassword: e.target.value })
            }
            placeholder='Повторіть пароль'
          />

          <button type='submit' className='submit-btn' disabled={loading}>
            {loading ? 'Збереження...' : 'Змінити пароль'}
          </button>
        </form>
      </div>
    </>
  );
}

export default ResetPasswordPage;
