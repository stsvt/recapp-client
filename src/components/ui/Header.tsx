import { BellIcon, MagnifyingGlassIcon, UserIcon } from '@phosphor-icons/react';
import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.tsx';
import { getIncomingRequests } from '../../services/friendsApi.ts';
import { Button } from './Button.tsx';
import SearchModal from '../SearchModal.tsx';
import Logo from './Logo.tsx';
import { Avatar } from '../Avatar.tsx';

function Header() {
  const { user, incomingRequestsCount, setIncomingRequestsCount } = useAuth();
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

  return (
    <>
      <header className='dashboard'>
        <Logo />
        <nav className='section'>
          <li>
            <Button variant='link' to='/#topRated' className='nav-link'>
              ФІЛЬМИ
            </Button>
          </li>
          <li>
            <Button variant='link' to='/#topRatedSeries' className='nav-link'>
              СЕРІАЛИ
            </Button>
          </li>
          <li>
            <Button
              variant='link'
              to='/#topRatedAnimations'
              className='nav-link'
            >
              МУЛЬТФІЛЬМИ
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
          </div>
          <Button
            variant='icon'
            onClick={handleUserClick}
            aria-label={user ? 'View profile' : 'Login'}
            icon={
              user ? (
                <Avatar
                  userName={user.name}
                  userPhoto={user.photo}
                  size='sm'
                  className='dashboard-avatar'
                />
              ) : (
                <UserIcon className='icon last-icon' size={40} />
              )
            }
          />
        </div>
      </header>
      <SearchModal isOpen={showSearch} onClose={closeSearch} />
    </>
  );
}

export default Header;
