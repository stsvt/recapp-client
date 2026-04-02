import {
  BellIcon,
  MagnifyingGlassIcon,
  UserIcon,
  FunnelIcon,
} from '@phosphor-icons/react';
import { useState, useMemo, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.tsx';
import { getIncomingRequests } from '../../services/friendsApi.ts';
import { Button } from './Button.tsx';
import FilterModal from '../FilterModal.tsx';
import SearchModal from '../SearchModal.tsx';
import Logo from './Logo.tsx';

const DICEBEAR_BASE = import.meta.env.VITE_DICEBEAR_URL;
const USERS_IMAGES_BASE = import.meta.env.VITE_USERS_IMAGES_BASE;

function Header() {
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
      <header className='dashboard'>
        <Logo />
        <nav className='section'>
          <li>
            <Button variant='link' to='/#upcoming' className='nav-link'>
              ФІЛЬМИ
            </Button>
          </li>
          <li>
            <Button variant='link' to='/#nowPlaying' className='nav-link'>
              СЕРІАЛИ
            </Button>
          </li>
          <li>
            <Button variant='link' to='/#topRated' className='nav-link'>
              МУЛЬТФІЛЬМИ
            </Button>
          </li>
          <li>
            <Button variant='link' to='/#topRatedSeries' className='nav-link'>
              ПІДБІРКИ
            </Button>
          </li>
          <li>
            <Button
              variant='link'
              to='/#topRatedAnimations'
              className='nav-link'
            >
              МОЇ СПИСКИ
            </Button>
          </li>
        </nav>
        <div className='icons-wrapper'>
          <div className='icons'>
            <Button
              variant='icon'
              className='icon'
              onClick={openSearch}
              icon={<MagnifyingGlassIcon size={24} />}
              aria-label='Search'
            />
            <Button
              variant='icon'
              onClick={() => navigate('/friends/requests')}
              className='icon notifications-icon'
              icon={<BellIcon size={24} />}
              aria-label='Friend requests'
            >
              {incomingRequestsCount > 0 && (
                <span className='badge'>{incomingRequestsCount}</span>
              )}
            </Button>
            <Button
              variant='icon'
              className='icon'
              onClick={() => setShowFilters(!showFilters)}
              icon={<FunnelIcon size={24} />}
              aria-label='Filter movies'
            />
          </div>
          <Button
            variant='icon'
            onClick={handleUserClick}
            aria-label={user ? 'View profile' : 'Login'}
            icon={
              user ? (
                <img
                  src={avatarUrl}
                  alt={user.name}
                  className='dashboard-avatar'
                  crossOrigin='anonymous'
                />
              ) : (
                <UserIcon className='icon last-icon' size={40} />
              )
            }
          />
        </div>
      </header>
      <FilterModal isOpen={showFilters} onClose={() => setShowFilters(false)} />
      <SearchModal isOpen={showSearch} onClose={closeSearch} />
    </>
  );
}

export default Header;
