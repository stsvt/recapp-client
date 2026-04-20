import { type SubmitHandler, useForm } from 'react-hook-form';
import { forgotPassword as forgotPasswordService } from '../services/authApi.ts';
import { Button } from './ui/Button.tsx';
import Spinner from './ui/Spinner.tsx';

interface Inputs {
  email: string;
}

interface ForgotPasswordFormProps {
  handleBack: () => void;
}

export default function ForgotPasswordForm({
  handleBack,
}: ForgotPasswordFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isLoading },
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      await forgotPasswordService(data.email);
      alert('Лист для відновлення надіслано на вашу пошту!');
      handleBack();
    } catch (error: unknown) {
      alert(
        error instanceof Error ? error.message : 'Помилка при відправці листа'
      );
    }
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <>
      <form className='auth-box' onSubmit={handleSubmit(onSubmit)}>
        <h2>Відновлення пароля</h2>
        <p className='auth-subtitle'>
          Введіть ваш email, щоб отримати посилання для скидання пароля
        </p>
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

        <Button
          type='submit'
          className='submit-btn'
          variant='primary'
          disabled={isLoading}
        >
          {isLoading ? 'Надсилання...' : 'Надіслати інструкції'}
        </Button>

        <p className='auth-footer'>
          <span className='link-small' onClick={handleBack}>
            Повернутися до входу
          </span>
        </p>
      </form>
    </>
  );
}
