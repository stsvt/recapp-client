import { Outlet } from 'react-router-dom';
import Header from './Header.tsx';
import Footer from './Footer.tsx';

export default function Layout() {
  return (
    <div className='full-screen'>
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
}
