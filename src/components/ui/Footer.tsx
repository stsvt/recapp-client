import Logo from './Logo.tsx';
import '../../styles/footer.css';

export default function Footer() {
  return (
    <footer className='footer'>
        <div className='footer-logo'>
            <Logo />
          </div>
        
        <p className='footer-credits'>Розроблено з ❤️ для кінолюбів</p>
    </footer>
  );
}
