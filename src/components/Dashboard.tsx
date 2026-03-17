import { BellIcon, MagnifyingGlassIcon, UserIcon } from '@phosphor-icons/react';
import { useState, useMemo, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getIncomingRequests } from '../services/friends';
import FilterModal from './FilterModal';
import SearchModal from './SearchModal';
import Logo from './Logo';

const DICEBEAR_BASE = import.meta.env.VITE_DICEBEAR_URL;
const USERS_IMAGES_BASE = import.meta.env.VITE_USERS_IMAGES_BASE;

function Dashboard() {
  const { user, incomingRequestsCount, setIncomingRequestsCount } = useAuth();
  const [showFilters, setShowFilters] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const showSearch = searchParams.get('search') === 'true';
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRequests = async () => {
      if (user) {
        try {
          const response = await getIncomingRequests();
          if (response.status === 'success') {
            setIncomingRequestsCount(response.results || 0);
          }
        } catch (error) {
          console.error('Failed to fetch friend requests:', error);
        }
      }
    };

    fetchRequests();
  }, [user, setIncomingRequestsCount]);

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
          <button onClick={() => navigate('/friends/requests')}>
            <div className='icon icon-wrapper'>
              <BellIcon size={24} />
              {incomingRequestsCount > 0 && (
                <span className='badge'>{incomingRequestsCount}</span>
              )}
            </div>
          </button>
          <button onClick={handleUserClick} className='user-avatar-btn'>
            {user ? (
              <img
                src={avatarUrl}
                alt={user.name}
                className='dashboard-avatar'
                crossOrigin='anonymous'
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
