import { useState } from 'react';
import { register as registerService } from '../services/authApi.ts';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Button } from '../components/ui/Button.tsx';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { EyeIcon, EyeSlashIcon } from '@phosphor-icons/react';
import GoogleButton from '../components/GoogleButton.tsx';

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

interface Inputs {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

function RegisterPage() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    getValues,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<Inputs>();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      await registerService(data);
      toast.success('Реєстрація успішна! Увійдіть у свій акаунт.');
      navigate('/login');
    } catch (error: unknown) {
      const apiError = error as ApiError;
      let errorMessage = 'Виникла неочікувана помилка';

      if (apiError.response?.data?.message) {
        errorMessage = apiError.response.data.message;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      if (errorMessage.includes('E11000') || errorMessage.includes('duplicate key')) {
        errorMessage = 'Користувач з такою поштою вже зареєстрований';
      }

      setError('root', { type: 'manual', message: errorMessage });
    }
  };

  return (
    <>
      <form className='auth-box' onSubmit={handleSubmit(onSubmit)}>
        <h2>Реєстрація</h2>

        <div className='input-group'>
          <label htmlFor='name'>Ім'я</label>
          <input
            type='text'
            placeholder="Введіть ім'я"
            {...register('name', { required: "Це поле є обов'язковим" })}
          />
          {errors && <span className='error-span'>{errors.name?.message}</span>}
        </div>

        <div className='input-group'>
          <label htmlFor='email'>Email</label>
          <input
            type='email'
            id='email'
            placeholder='example@gmail.com'
            {...register('email', {
              required: "Це поле є обов'язковим",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Недійсна адреса електронної пошти',
              },
            })}
          />
          {errors && (
            <span className='error-span'>{errors.email?.message}</span>
          )}
        </div>

        <div className='input-group'>
          <label htmlFor='password'>Пароль</label>
          <div className='password-wrapper'>
            <input
              id='password'
              type={showPassword ? 'text' : 'password'}
              placeholder='••••••••'
              {...register('password', {
                required: "Це поле є обов'язковим",
              })}
            />
            <button
              type='button'
              className='eye-button'
              onClick={() => setShowPassword(!showPassword)}
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeSlashIcon size={22} weight='regular' />
              ) : (
                <EyeIcon size={22} weight='regular' />
              )}
            </button>
          </div>
          {errors && (
            <span className='error-span'>{errors.password?.message}</span>
          )}
        </div>

        <div className='input-group'>
          <label htmlFor='confirmPassword'>Підтвердіть пароль</label>
          <div className='password-wrapper'>
            <input
              id='confirmPassword'
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder='••••••••'
              {...register('confirmPassword', {
                required: "Це поле є обов'язковим",
                validate: (value: string) => {
                  const { password } = getValues();
                  return password === value || 'Паролі не збігаються';
                },
              })}
            />
            <button
              type='button'
              className='eye-button'
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              tabIndex={-1}
            >
              {showConfirmPassword ? (
                <EyeSlashIcon size={22} weight='regular' />
              ) : (
                <EyeIcon size={22} weight='regular' />
              )}
            </button>
          </div>
          {errors && (
            <span className='error-span'>
              {errors.confirmPassword?.message}
            </span>
          )}
        </div>

        {errors.root && (
          <div className='error-span' style={{ textAlign: 'center', marginBottom: '10px', display: 'block' }}>
            {errors.root.message}
          </div>
        )}

        <Button
          type='submit'
          className='submit-btn'
          variant='primary'
          disabled={isSubmitting}
        >
          {!isSubmitting ? 'Зареєструватись' : 'Реєстрація...'}
        </Button>

        <div className='separator'> або </div>

        <GoogleButton />

        <p className='auth-footer'>
          Вже маєте акаунт?{' '}
          <span className='link' onClick={() => navigate('/login')}>
            Увійти
          </span>
        </p>
      </form>
    </>
  );
}

export default RegisterPage;
