import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getUserById } from '../services/user';
import {
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  removeFriend,
  getFriends,
  getIncomingRequests,
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
}

interface FriendRequest {
  _id: string;
  requester: {
    _id: string;
    name: string;
  } | string;
  recipient?: string;
}

function UserPage() {
  const { user: currentUser } = useAuth();
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();

  const [userData, setUserData] = useState<UserData | undefined>();
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [myFriends, setMyFriends] = useState<Friend[]>([]);
  const [incomingRequests, setIncomingRequests] = useState<FriendRequest[]>([]);
  const [sentRequests, setSentRequests] = useState<string[]>([]);

  useEffect(() => {
    const loadData = async () => {
      if (!userId) return;
      try {
        setLoading(true);
        const [userRes, friendsRes, requestsRes] = await Promise.all([
          getUserById(userId),
          getFriends(),
          getIncomingRequests()
        ]);

        setUserData(userRes);
        setMyFriends(friendsRes.data?.friends || []);
        setIncomingRequests(requestsRes.data?.requests || []);
      } catch (err) {
        console.error('Initial load error:', err);
        toast.error('Помилка завантаження даних');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [userId]);

  const isOwnProfile = useMemo(() => currentUser?._id === userId, [currentUser?._id, userId]);

  const friendshipStatus = useMemo(() => {
    if (!userData || !currentUser || isOwnProfile || !userId) return 'none';

    if (myFriends.some(f => f._id === userId)) return 'friends';

    const hasReceived = incomingRequests.some(req => {
    const requesterId = typeof req.requester === 'object' ? req.requester._id : req.requester;
    return requesterId === userId;
  });
    if (hasReceived) return 'requested';

    if (sentRequests.includes(userId)) return 'pending';

    return 'none';
  }, [userData, currentUser, isOwnProfile, myFriends, incomingRequests, sentRequests, userId]);

  const handleAction = async () => {
    if (!userId || isSubmitting) return;
    setIsSubmitting(true);

    try {
      if (friendshipStatus === 'none') {
        await sendFriendRequest(userId);
        setSentRequests(prev => [...prev, userId]);
        toast.success('Запит надіслано');
      } 
      else if (friendshipStatus === 'requested') {
        await acceptFriendRequest(userId);
        toast.success('Запит прийнято!');
        const res = await getFriends();
        setMyFriends(res.data.friends);
      } 
      else if (friendshipStatus === 'pending') {
        await rejectFriendRequest(userId);
        setSentRequests(prev => prev.filter(id => id !== userId));
        toast.success('Запит скасовано');
      }
      else if (friendshipStatus === 'friends') {
        if (window.confirm('Видалити з друзів?')) {
          await removeFriend(userId);
          setMyFriends(prev => prev.filter(f => f._id !== userId));
          toast.success('Видалено з друзів');
        }
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Помилка дії';
      toast.error(errorMessage);
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
      <button className='back-button' onClick={() => navigate(-1)}>
        <CaretLeftIcon size={28} />
      </button>
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
            {isOwnProfile ? <p className='own-profile-tag'>Це ви</p> : (
              <div className='friendship-controls'>
                {friendshipStatus === 'friends' && (
                  <>
                    <div className='friends-badge'><CheckCircleIcon size={26} color='#4caf50' /><span>Ви друзі</span></div>
                    <button onClick={handleAction} className='remove-friend-btn' disabled={isSubmitting}>
                      <UserMinusIcon size={20} />Видалити
                    </button>
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