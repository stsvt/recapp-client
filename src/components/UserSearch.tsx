import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { searchUsers } from '../services/user';
import {
  MagnifyingGlassIcon,
  UserMinusIcon,
  CircleNotchIcon,
} from '@phosphor-icons/react';
import { useDebounce } from '../hooks/useDebounce';
import { useAuth } from '../context/AuthContext';

interface SearchResult {
  _id: string;
  name: string;
  photo: string;
}

const USERS_IMAGES_BASE = import.meta.env.VITE_USERS_IMAGES_BASE;
const DICEBEAR_BASE = import.meta.env.VITE_DICEBEAR_URL;

function UserSearch() {
  const { user: currentUser } = useAuth();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const debouncedQuery = useDebounce(query, 500);
  const navigate = useNavigate();
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      if (debouncedQuery.trim().length < 2) {
        setResults([]);
        return;
      }

      try {
        setIsSearching(true);
        const users = await searchUsers(debouncedQuery);

        if (Array.isArray(users)) {
          const filteredUsers = users.filter((u) => u._id !== currentUser?._id);
          setResults(filteredUsers);
        } else {
          setResults([]);
        }
        setIsOpen(true);
      } catch (err) {
        console.error('Search error', err);
        setResults([]);
      } finally {
        setIsSearching(false);
      }
    };

    fetchUsers();
  }, [debouncedQuery, currentUser?._id]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectUser = (id: string) => {
    setQuery('');
    setIsOpen(false);
    navigate(`/user/${id}`);
  };

  const getAvatarUrl = (user: SearchResult) => {
    if (user.photo && user.photo !== `${USERS_IMAGES_BASE}default.jpg`) {
      return `${USERS_IMAGES_BASE}${user.photo}`;
    }
    const seed = encodeURIComponent(user.name || 'User');
    return `${DICEBEAR_BASE}?seed=${seed}&chars=1&backgroundColor=e50914`;
  };

  return (
    <div className='us-wrapper' ref={searchRef}>
      <div className='us-input-field'>
        {isSearching ? (
          <CircleNotchIcon size={20} className='us-icon us-spinner' />
        ) : (
          <MagnifyingGlassIcon size={20} className='us-icon' />
        )}
        <input
          type='text'
          placeholder='Пошук друзів...'
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.length > 1 && setIsOpen(true)}
        />
      </div>

      {isOpen && query.trim().length >= 2 && (
        <div className='us-dropdown'>
          {results.length > 0 ? (
            results.map((user) => (
              <div
                key={user._id}
                className='us-result-item'
                onClick={() => handleSelectUser(user._id)}
              >
                <img
                  src={getAvatarUrl(user)}
                  alt={user.name}
                  className='us-avatar'
                  crossOrigin='anonymous'
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    const seed = encodeURIComponent(user.name || 'User');
                    target.src = `${DICEBEAR_BASE}?seed=${seed}&chars=1&backgroundColor=e50914`;
                  }}
                />
                <div className='us-info'>
                  <span className='us-name'>{user.name}</span>
                  <span className='us-subtext'>Переглянути профіль</span>
                </div>
              </div>
            ))
          ) : !isSearching ? (
            <div className='us-no-results'>
              <UserMinusIcon size={24} weight='light' />
              <span>Користувачів не знайдено</span>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}

export default UserSearch;
