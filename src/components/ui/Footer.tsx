import Logo from './Logo.tsx';
import '../../styles/footer.css';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className='footer'>
      <div className='footer-container'>
        <div className='footer-section footer-brand'>
          <div className='footer-logo'>
            <Logo />
          </div>
          <p className='footer-description'>
            Ваш улюблений сервіс для відслідковування та оцінювання фільмів,
            серіалів та мультфільмів.
          </p>
        </div>
      </div>

      <div className='footer-bottom'>
        <p className='footer-copyright'>
          © {currentYear} RecApp. Усі права захищені.
        </p>
        <p className='footer-credits'>Розроблено з ❤️ для кінолюбів</p>
      </div>
    </footer>
  );
}
