import { BellIcon, MagnifyingGlassIcon, UserIcon } from '@phosphor-icons/react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FilterModal from './FilterModal';

function Dashboard() {
  const [showFilters, setShowFilters] = useState(false);
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
        <li
          onClick={() => setShowFilters(!showFilters)}
          style={{ cursor: 'pointer' }}
        >
          ФІЛЬМИ
        </li>
        <li>СЕРІАЛИ</li>
        <li>МУЛЬТФІЛЬМИ</li>
        <li>ПІДБІРКИ</li>
        <li>МОЇ СПИСКИ</li>
      </ul>
      <FilterModal isOpen={showFilters} onClose={() => setShowFilters(false)} />
      <div className='icons'>
        <button>
          <MagnifyingGlassIcon className='icon' size={24} />{' '}
        </button>
        <button>
          <BellIcon className='icon' size={24} />{' '}
        </button>
        <button onClick={handleUserClick}>
          <UserIcon className='icon last-icon' size={24} />
        </button>
      </div>
    </div>
  );
}

export default Dashboard;
