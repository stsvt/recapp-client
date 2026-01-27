import { BellIcon, MagnifyingGlassIcon, UserIcon } from '@phosphor-icons/react';

function Dashboard() {
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
        <UserIcon className='icon last-icon' size={32} />
      </div>
    </div>
  );
}

export default Dashboard;
