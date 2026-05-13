import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { searchUsers } from '../services/usersApi.ts';
import {
  MagnifyingGlassIcon,
  UserMinusIcon,
  CircleNotchIcon,
} from '@phosphor-icons/react';
import { useDebounce } from '../hooks/useDebounce';
import { useAuth } from '../context/AuthContext';
import { Avatar } from './Avatar.tsx';

interface SearchResult {
  _id: string;
  name: string;
  photo: string;
}

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
                <Avatar
                  userName={user.name}
                  userPhoto={user.photo}
                  size='sm'
                  className='us-avatar'
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
