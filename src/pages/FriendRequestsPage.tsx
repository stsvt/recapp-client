import { CaretLeftIcon, CheckIcon, XIcon } from '@phosphor-icons/react';
import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { Avatar } from '../components/Avatar.tsx';
import { Button } from '../components/ui/Button.tsx';
import { useAuth } from '../context/AuthContext';
import {
  acceptFriendRequest,
  getIncomingRequests,
  rejectFriendRequest,
} from '../services/friendsApi.ts';
import '../styles/friend-requests.css';
interface RequestItem {
  _id: string;
  requester: {
    _id: string;
    name: string;
    photo: string;
    email: string;
  };
}

function FriendRequestsPage() {
  const [requests, setRequests] = useState<RequestItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { setIncomingRequestsCount } = useAuth();
  const navigate = useNavigate();

  const loadRequests = useCallback(async () => {
    try {
      const res = await getIncomingRequests();
      if (res.status === 'success') {
        setRequests(res.data.requests);
        setIncomingRequestsCount(res.results || 0);
      }
    } catch {
      toast.error('Не вдалося завантажити запити');
    } finally {
      setLoading(false);
    }
  }, [setIncomingRequestsCount]);

  useEffect(() => {
    loadRequests();
  }, [loadRequests]);

  const handleAction = async (userId: string, action: 'accept' | 'reject') => {
    try {
      if (action === 'accept') {
        await acceptFriendRequest(userId);
        toast.success('Запит прийнято');
      } else {
        await rejectFriendRequest(userId);
        toast.success('Запит відхилено');
      }
      setRequests((prev) => {
        const updatedList = prev.filter((req) => req.requester._id !== userId);
        setIncomingRequestsCount(updatedList.length);
        return updatedList;
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Помилка операції';
      toast.error(msg);
    }
  };

  return (
    <>
      <Button
        variant='icon'
        icon={<CaretLeftIcon size={28} />}
        onClick={() => navigate(-1)}
        title='Назад'
      />

      <div className='requests-container'>
        <div className='requests-card'>
          <div className='card-header'>
            <h2>Запити у друзі</h2>
            <span className='request-badge'>{requests.length}</span>
          </div>

          {loading ? (
            <div className='loading-spinner'>Завантаження...</div>
          ) : requests.length === 0 ? (
            <div className='empty-state'>
              <p>Поки що немає нових запитів.</p>
            </div>
          ) : (
            <div className='requests-grid'>
              {requests.map((req) => (
                <div key={req._id} className='request-item-modern'>
                  <div className='user-info-main'>
                    <Avatar
                      userName={req.requester.name}
                      userPhoto={req.requester.photo}
                      size='md'
                      className='request-avatar'
                    />
                    <div className='user-text'>
                      <span className='user-name'>{req.requester.name}</span>
                      <span className='user-email'>{req.requester.email}</span>
                    </div>
                  </div>

                  <div className='action-buttons'>
                    <button
                      className='btn-accept'
                      onClick={() => handleAction(req.requester._id, 'accept')}
                      title='Прийняти'
                    >
                      <CheckIcon size={22} weight='bold' />
                    </button>
                    <button
                      className='btn-reject'
                      onClick={() => handleAction(req.requester._id, 'reject')}
                      title='Відхилити'
                    >
                      <XIcon size={22} weight='bold' />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default FriendRequestsPage;
