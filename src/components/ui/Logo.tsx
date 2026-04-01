import { Link } from 'react-router-dom';

function Logo() {
  return (
    <Link to='/' className='logo-link'>
      <ul className='text-logo'>
        <li>RE</li>
        <li>CC</li>
        <li>AP</li>
      </ul>
    </Link>
  );
}

export default Logo;
