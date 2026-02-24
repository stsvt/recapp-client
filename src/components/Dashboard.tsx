import { BellIcon, MagnifyingGlassIcon, UserIcon } from '@phosphor-icons/react';
import { useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import FilterModal from './FilterModal';
import SearchModal from './SearchModal';
import Logo from './Logo';

const DICEBEAR_BASE = import.meta.env.VITE_DICEBEAR_URL;
const USERS_IMAGES_BASE = import.meta.env.VITE_USERS_IMAGES_BASE;

function Dashboard() {
  const { user } = useAuth();
  const [showFilters, setShowFilters] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const showSearch = searchParams.get('search') === 'true';
  const navigate = useNavigate();

  const handleUserClick = () => {
    if (user) {
      navigate('/profile');
    } else {
      navigate('/login');
    }
  };

  const openSearch = () => setSearchParams({ search: 'true' });
  const closeSearch = () => {
    searchParams.delete('search');
    setSearchParams(searchParams);
  };

  const avatarUrl = useMemo(() => {
    if (user?.photo && user.photo !== 'default.jpg') {
      return `${USERS_IMAGES_BASE}${user.photo}`;
    }
    const seed = encodeURIComponent(user?.name || 'User');
    return `${DICEBEAR_BASE}?seed=${seed}&chars=1&backgroundColor=e50914`;
  }, [user]);

  return (
    <>
      <div className='dashboard'>
        <Logo />
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
          <button onClick={handleUserClick} className="user-avatar-btn">
            {user ? (
              <img 
                src={avatarUrl} 
                alt={user.name} 
                className="dashboard-avatar"
                crossOrigin="anonymous" 
              />
            ) : (
              <UserIcon className='icon last-icon' size={24} />
            )}
          </button>
        </div>
      </div>
      <FilterModal isOpen={showFilters} onClose={() => setShowFilters(false)} />
      <SearchModal isOpen={showSearch} onClose={closeSearch} />
    </>
  );
}

export default Dashboard;
