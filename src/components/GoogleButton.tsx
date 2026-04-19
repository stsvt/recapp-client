import { Button } from './ui/Button.tsx';

function GoogleButton() {
  const handleGoogleAuth = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}users/auth/google`;
  };

  return (
    <Button
      className='google-btn'
      onClick={handleGoogleAuth}
      variant='secondary'
      size='md'
    >
      <img
        src='https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg'
        alt='Google'
      />
      Увійти через Google
    </Button>
  );
}

export default GoogleButton;
