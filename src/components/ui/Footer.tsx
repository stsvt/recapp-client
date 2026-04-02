import {
  GithubLogoIcon,
  TelegramLogoIcon,
  LinkedinLogoIcon,
  InstagramLogoIcon,
} from '@phosphor-icons/react';
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
          <div className='footer-social'>
            <a
              href='https://github.com'
              target='_blank'
              rel='noopener noreferrer'
              aria-label='GitHub'
            >
              <GithubLogoIcon size={24} />
            </a>
            <a
              href='https://instagram.com'
              target='_blank'
              rel='noopener noreferrer'
              aria-label='Instagram'
            >
              <InstagramLogoIcon size={24} />
            </a>
            <a
              href='https://t.me'
              target='_blank'
              rel='noopener noreferrer'
              aria-label='Telegram'
            >
              <TelegramLogoIcon size={24} />
            </a>
            <a
              href='https://linkedin.com'
              target='_blank'
              rel='noopener noreferrer'
              aria-label='LinkedIn'
            >
              <LinkedinLogoIcon size={24} />
            </a>
          </div>
        </div>

        <div className='footer-section'>
          <h4 className='footer-title'>Навігація</h4>
          <ul className='footer-links'>
            <li>
              <a href='/'>Головна</a>
            </li>
            <li>
              <a href='/#upcoming'>Фільми</a>
            </li>
            <li>
              <a href='/#nowPlaying'>Серіали</a>
            </li>
            <li>
              <a href='/#topRated'>Мультфільми</a>
            </li>
          </ul>
        </div>

        <div className='footer-section'>
          <h4 className='footer-title'>Допомога</h4>
          <ul className='footer-links'>
            <li>
              <a href='#'>Часті питання</a>
            </li>
            <li>
              <a href='#'>Контакти</a>
            </li>
            <li>
              <a href='#'>Звіти про помилки</a>
            </li>
            <li>
              <a href='#'>Запити функцій</a>
            </li>
          </ul>
        </div>

        <div className='footer-section'>
          <h4 className='footer-title'>Правила</h4>
          <ul className='footer-links'>
            <li>
              <a href='#'>Політика конфіденційності</a>
            </li>
            <li>
              <a href='#'>Умови використання</a>
            </li>
            <li>
              <a href='#'>Налаштування cookies</a>
            </li>
          </ul>
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
