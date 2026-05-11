import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login as loginService } from '../services/authApi.ts';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Button } from '../components/ui/Button.tsx';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { EyeIcon, EyeSlashIcon } from '@phosphor-icons/react';
import Spinner from '../components/ui/Spinner.tsx';
import ForgotPasswordForm from '../components/ForgotPasswordForm.tsx';
import GoogleButton from '../components/GoogleButton.tsx';

interface Inputs {
  email: string;
  password: string;
}

function LoginPage() {
  const { login } = useAuth();

  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isLoading },
  } = useForm<Inputs>();

  const [showForgotForm, setShowForgotForm] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      const res = await loginService(data);
      await login(res.token);
      navigate('/');
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('An unexpected error occurred');
      }
    }
  };

  if (isLoading) {
    return <Spinner />;
  }

  if (showForgotForm) {
    return <ForgotPasswordForm handleBack={() => setShowForgotForm(false)} />;
  }

  return (
    <>
      <form className='auth-box' onSubmit={handleSubmit(onSubmit)}>
        <h2>Вхід</h2>
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

        <div className='forgot-password-link'>
          <span className='link-small' onClick={() => setShowForgotForm(true)}>
            Забули пароль?
          </span>
        </div>

        <Button
          type='submit'
          className='submit-btn'
          variant='primary'
          disabled={isLoading}
        >
          Увійти
        </Button>

        <div className='separator'>або</div>

        <GoogleButton />

        <p className='auth-footer'>
          Немає акаунту?{' '}
          <span className='link' onClick={() => navigate('/register')}>
            Зареєструватись
          </span>
        </p>
      </form>
    </>
  );
}

export default LoginPage;
