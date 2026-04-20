import Logo from './Logo.tsx';
import { Outlet } from 'react-router-dom';

export default function AuthLayout() {
  return (
    <div className='full-screen'>
      <Logo />
      <div className='auth-container'>
        <Outlet />
      </div>
    </div>
  );
}
