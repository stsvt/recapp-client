import { BellIcon, MagnifyingGlassIcon, UserIcon } from '@phosphor-icons/react';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const navigate = useNavigate();

  const handleUserClick = () => {
    navigate('../register');
  };

  return (
    <div className='dashboard'>
      <ul className='text-logo'>
        <li>RE</li>
        <li>CC</li>
        <li>AP</li>
      </ul>
      <ul className='section'>
        <li>ФІЛЬМИ</li>
        <li>СЕРІАЛИ</li>
        <li>МУЛЬТФІЛЬМИ</li>
        <li>ПІДБІРКИ</li>
        <li>МОЇ СПИСКИ</li>
      </ul>
      <div className='icons'>
        <MagnifyingGlassIcon className='icon' size={32} />
        <BellIcon className='icon' size={32} />
        <UserIcon
          className='icon last-icon'
          size={32}
          onClick={handleUserClick}
        />
      </div>
    </div>
  );
}

export default Dashboard;
