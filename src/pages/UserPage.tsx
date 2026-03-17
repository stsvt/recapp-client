import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getUserById } from '../services/user';
import {
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  removeFriend,
} from '../services/friends';
import toast from 'react-hot-toast';
import Dashboard from '../components/Dashboard';
import UserSearch from '../components/UserSearch';
import {
  CaretLeftIcon,
  CheckCircleIcon,
  ClockIcon,
  UserMinusIcon,
} from '@phosphor-icons/react';
import { useAuth } from '../context/AuthContext';
import type { Friend } from '../types/index.ts';

const DICEBEAR_BASE = import.meta.env.VITE_DICEBEAR_URL;
const USERS_IMAGES_BASE = import.meta.env.VITE_USERS_IMAGES_BASE;

interface UserData {
  _id: string;
  name: string;
  photo: string;
  description?: string;
  friends: (string | Friend)[];
  friendRequestsSent: (string | Friend)[];
  friendRequestsReceived: (string | Friend)[];
}

function UserPage() {
  const { user: currentUser } = useAuth();
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();

  const [userData, setUserData] = useState<UserData | undefined>();
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      try {
        setLoading(true);
        if (userId) {
          const user = await getUserById(userId);
          console.log('Дані користувача з бази:', user);
          setUserData(user);
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Користувача не знайдено';
        toast.error(msg);
        navigate(-1);
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, [userId, navigate]);

  const isOwnProfile = currentUser?._id === userId;

  const friendshipStatus = useMemo(() => {
    if (!userData || !currentUser || isOwnProfile) return 'none';
    
    const myId = currentUser._id.toString();

    const checkStatus = (list: (string | Friend)[] | undefined): boolean => {
      if (!list || !Array.isArray(list)) return false;
      return list.some((item) => {
        const itemId = (typeof item === 'string' ? item : item._id).toString();
        return itemId === myId;
      });
    };

    if (checkStatus(userData.friends)) return 'friends';
    if (checkStatus(userData.friendRequestsReceived)) return 'pending';
    if (checkStatus(userData.friendRequestsSent)) return 'requested';

    return 'none';
  }, [userData, currentUser, isOwnProfile]);

  const handleAction = async () => {
    if (!userId || !currentUser || isSubmitting || isOwnProfile) return;
    setIsSubmitting(true);

    try {
      const myId = currentUser._id;
      console.log('Поточний статус:', friendshipStatus)

      if (friendshipStatus === 'none') {
        await sendFriendRequest(userId);
        setUserData(prev => prev ? {
          ...prev,
          friendRequestsReceived: [...(prev.friendRequestsReceived || []), myId]
        } : prev);
        toast.success('Запит надіслано');
      } 
      else if (friendshipStatus === 'pending') {
        await rejectFriendRequest(userId);
        setUserData(prev => prev ? {
          ...prev,
          friendRequestsReceived: (prev.friendRequestsReceived || []).filter(id => 
            (typeof id === 'string' ? id : id._id) !== myId
          )
        } : prev);
        toast.success('Запит скасовано');
      } 
      else if (friendshipStatus === 'requested') {
        await acceptFriendRequest(userId);
        setUserData(prev => {
          if (!prev) return prev;
          return {
            ...prev,
            friends: [...(prev.friends || []), myId], 
            friendRequestsSent: (prev.friendRequestsSent || []).filter(item => 
              (typeof item === 'string' ? item : item._id).toString() !== myId
            )
          };
        });
        toast.success('Тепер ви друзі!');
      }
      else if (friendshipStatus === 'friends') {
        if (window.confirm('Видалити з друзів?')) {
          await removeFriend(userId);
          setUserData(prev => prev ? {
            ...prev,
            friends: (prev.friends || []).filter(id => 
              (typeof id === 'string' ? id : id._id) !== myId
            )
          } : prev);
          toast.success('Видалено з друзів');
        }
      }
    } catch {
      toast.error('Помилка дії');
    } finally {
      setIsSubmitting(false);
    }
  };

  const avatarUrl = useMemo(() => {
    if (userData?.photo && userData.photo !== 'default.jpg') {
      return `${USERS_IMAGES_BASE}${userData.photo}`;
    }
    const seed = encodeURIComponent(userData?.name || 'User');
    return `${DICEBEAR_BASE}?seed=${seed}&chars=1&backgroundColor=e50914`;
  }, [userData]);

  if (loading) return (
    <div className='full-screen'>
      <Dashboard />
      <div className='profile-container'><div className='profile-card'>Завантаження...</div></div>
    </div>
  );

  if (!userData) return null;

  return (
    <div className='full-screen'>
      <Dashboard />
      <button className='back-button' onClick={() => navigate(-1)}><CaretLeftIcon size={28} /></button>
      <UserSearch />
      <div className='profile-container'>
        <div className='profile-card'>
          <div className='avatar-section'>
            <img src={avatarUrl} alt={userData.name} className='profile-avatar' crossOrigin='anonymous' />
          </div>
          <h2>{userData.name}</h2>
          <div className='profile-info'>
            <div className='info-row'><strong>Ім'я</strong><span>{userData.name}</span></div>
            <div className='info-row bio'><strong>Про мене</strong><span>{userData.description || 'Немає опису.'}</span></div>
          </div>
          <div className='profile-actions-group'>
            {isOwnProfile ? <p>Це ви</p> : (
              <div className='friendship-controls'>
                {friendshipStatus === 'friends' && (
                  <>
                    <div className='friends-badge'><CheckCircleIcon size={26} color='#4caf50' /><span>Ви друзі</span></div>
                    <button onClick={handleAction} className='remove-friend-btn' disabled={isSubmitting}><UserMinusIcon size={20} />Видалити</button>
                  </>
                )}
                {friendshipStatus === 'pending' && (
                  <>
                    <div className='pending-badge'><ClockIcon size={24} /><span>Очікує</span></div>
                    <button onClick={handleAction} className='cancel-request-btn' disabled={isSubmitting}>Скасувати</button>
                  </>
                )}
                {friendshipStatus === 'requested' && <button onClick={handleAction} className='accept-friend-btn' disabled={isSubmitting}>Прийняти запит</button>}
                {friendshipStatus === 'none' && <button onClick={handleAction} className='add-friend-btn' disabled={isSubmitting}>Додати в друзі</button>}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserPage;