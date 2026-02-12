import { BellIcon, MagnifyingGlassIcon, UserIcon } from '@phosphor-icons/react';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import FilterModal from './FilterModal';
import SearchModal from './SearchModal';

function Dashboard() {
  const [showFilters, setShowFilters] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const navigate = useNavigate();

  const handleUserClick = () => {
    navigate('../register');
  };

  return (
    <>
      <div className='dashboard'>
        <Link to='/' className='logo-link'>
          <ul className='text-logo'>
            <li>RE</li>
            <li>CC</li>
            <li>AP</li>
          </ul>
        </Link>
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
        <div className='icons'>
          <button onClick={() => setShowSearch(true)}>
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
      <FilterModal isOpen={showFilters} onClose={() => setShowFilters(false)} />
      <SearchModal isOpen={showSearch} onClose={() => setShowSearch(false)} />
    </>
  );
}

export default Dashboard;
