import { BellIcon, MagnifyingGlassIcon, UserIcon } from '@phosphor-icons/react';
import { useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import FilterModal from './FilterModal';
import SearchModal from './SearchModal';

function Dashboard() {
  const [showFilters, setShowFilters] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams()
  const showSearch = searchParams.get('search') === 'true';
  const navigate = useNavigate();

  const handleUserClick = () => {
    navigate('../register');
  };

  const openSearch = () => setSearchParams({search: 'true'});
  const closeSearch = () => {
    searchParams.delete('search');
    setSearchParams(searchParams);
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
          <button onClick={openSearch}>
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
      <SearchModal isOpen={showSearch} onClose={closeSearch} />
    </>
  );
}

export default Dashboard;
