import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  CaretLeftIcon,
  CheckCircleIcon,
  ClockIcon,
  UserMinusIcon,
  UserPlusIcon,
} from '@phosphor-icons/react';

import UserSearch from '../components/UserSearch';
import { useAuth } from '../context/AuthContext';
import { getUserById } from '../services/usersApi.ts';
import {
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  removeFriend,
  getFriends,
  getIncomingRequests,
} from '../services/friendsApi.ts';
import type { Friend } from '../types/index.ts';
import { Button } from '../components/ui/Button.tsx';
import { Avatar } from '../components/Avatar.tsx';

interface UserData {
  _id: string;
  name: string;
  photo: string;
  description?: string;
}

interface FriendRequest {
  _id: string;
  requester: { _id: string; name: string } | string;
}

const UserPage = () => {
  const { user: currentUser } = useAuth();
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();

  const [userData, setUserData] = useState<UserData | undefined>();
  const [myFriends, setMyFriends] = useState<Friend[]>([]);
  const [incomingRequests, setIncomingRequests] = useState<FriendRequest[]>([]);
  const [sentRequests, setSentRequests] = useState<string[]>([]);

  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isOwnProfile = useMemo(
    () => currentUser?._id === userId,
    [currentUser?._id, userId]
  );

  useEffect(() => {
    const fetchData = async () => {
      if (!userId || isOwnProfile) {
        if (isOwnProfile) setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const [userRes, friendsRes, requestsRes] = await Promise.all([
          getUserById(userId),
          getFriends(),
          getIncomingRequests(),
        ]);

        setUserData(userRes);
        setMyFriends(friendsRes.data?.friends || []);
        setIncomingRequests(requestsRes.data?.requests || []);
      } catch (err) {
        console.error('Data loading error:', err);
        toast.error('Не вдалося завантажити дані користувача');
        navigate(-1);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId, isOwnProfile, navigate]);

  const friendshipStatus = useMemo(() => {
    if (!userData || isOwnProfile || !userId) return 'none';

    if (myFriends.some((f) => f._id === userId)) return 'friends';

    const hasReceivedRequest = incomingRequests.some((req) => {
      const reqId =
        typeof req.requester === 'object' ? req.requester._id : req.requester;
      return reqId === userId;
    });

    if (hasReceivedRequest) return 'requested';
    if (sentRequests.includes(userId)) return 'pending';

    return 'none';
  }, [
    userData,
    isOwnProfile,
    userId,
    myFriends,
    incomingRequests,
    sentRequests,
  ]);

  const handleFriendshipAction = async () => {
    if (!userId || isSubmitting) return;

    setIsSubmitting(true);
    try {
      if (friendshipStatus === 'none') {
        await sendFriendRequest(userId);
        setSentRequests((prev) => [...prev, userId]);
        toast.success('Запит надіслано');
      } else if (friendshipStatus === 'requested') {
        await acceptFriendRequest(userId);
        const friendsUpdate = await getFriends();
        setMyFriends(friendsUpdate.data.friends);
        toast.success('Запит прийнято!');
      } else if (friendshipStatus === 'pending') {
        await rejectFriendRequest(userId);
        setSentRequests((prev) => prev.filter((id) => id !== userId));
        toast.success('Запит скасовано');
      } else if (friendshipStatus === 'friends') {
        if (window.confirm('Видалити користувача з друзів?')) {
          await removeFriend(userId);
          setMyFriends((prev) => prev.filter((f) => f._id !== userId));
          toast.success('Видалено з друзів');
        }
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Сталася помилка';
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <>
        <div className='profile-container'>
          <div className='profile-card'>Завантаження...</div>
        </div>
      </>
    );
  }

  if (!userData && !isOwnProfile) return null;

  return (
    <>
      <Button
        variant='icon'
        icon={<CaretLeftIcon size={28} />}
        onClick={() => navigate(-1)}
        title='Назад'
      />

      <UserSearch />

      <main className='profile-container'>
        <article className='profile-card'>
          <div className='avatar-section'>
            <Avatar
              userName={
                isOwnProfile
                  ? currentUser?.name || 'User'
                  : userData?.name || 'User'
              }
              userPhoto={isOwnProfile ? currentUser?.photo : userData?.photo}
              size='lg'
              className='profile-avatar'
            />
          </div>
          <h2>{isOwnProfile ? currentUser?.name : userData?.name}</h2>r{' '}
          <div className='user-info-actions-row'>
            <div className='profile-info'>
              <div className='info-row'>
                <strong>Ім'я</strong>
                <span>{isOwnProfile ? currentUser?.name : userData?.name}</span>
              </div>
              <div className='info-row bio'>
                <strong>Про мене</strong>
                <span>
                  {userData?.description || 'Користувач ще не додав опис.'}
                </span>
              </div>
            </div>

            <footer className='profile-actions-group friendship-actions-group'>
              {isOwnProfile ? (
                <p className='own-profile-tag'>Це ваш профіль</p>
              ) : (
                <div className='friendship-controls'>
                  {friendshipStatus === 'friends' && (
                    <>
                      <div className='friends-badge'>
                        <CheckCircleIcon size={26} color='#4caf50' />
                        <span>Ви друзі</span>
                      </div>
                      <button
                        onClick={handleFriendshipAction}
                        className='remove-friend-btn'
                        disabled={isSubmitting}
                      >
                        <UserMinusIcon size={20} /> Видалити
                      </button>
                    </>
                  )}

                  {friendshipStatus === 'pending' && (
                    <>
                      <div className='pending-badge'>
                        <ClockIcon size={24} />
                        <span>Запит надіслано</span>
                      </div>
                      <button
                        onClick={handleFriendshipAction}
                        className='cancel-request-btn'
                        disabled={isSubmitting}
                      >
                        Скасувати
                      </button>
                    </>
                  )}

                  {friendshipStatus === 'requested' && (
                    <button
                      onClick={handleFriendshipAction}
                      className='accept-friend-btn'
                      disabled={isSubmitting}
                    >
                      <CheckCircleIcon size={20} weight='bold' />
                      Прийняти запит
                    </button>
                  )}

                  {friendshipStatus === 'none' && (
                    <button
                      onClick={handleFriendshipAction}
                      className='add-friend-btn'
                      disabled={isSubmitting}
                    >
                      <UserPlusIcon size={20} weight='bold' />
                      Додати в друзі
                    </button>
                  )}
                </div>
              )}
            </footer>
          </div>
        </article>
      </main>
    </>
  );
};

export default UserPage;
