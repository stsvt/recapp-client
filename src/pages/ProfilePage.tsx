import { useState, useRef, useEffect, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Dashboard from '../components/Dashboard';
import PasswordField from '../components/PasswordField';
import ConfirmModal from '../components/ConfirmModal';
import {
  CaretLeftIcon,
  CameraIcon,
  TrashIcon,
  WarningCircleIcon,
} from '@phosphor-icons/react';
import {
  updateMe,
  deleteMe,
  deletePhoto,
  updateMyPassword,
} from '../services/user';
import toast from 'react-hot-toast';
import type { MovieSummary } from '../types';
import { getUserActivity } from '../services/activity';
import { getFriends } from '../services/friends';
import MovieSection from '../components/MovieSection';
import UserSearch from '../components/UserSearch';
import type { Friend } from '../types/index.ts';
import { Button } from '../components/Button.tsx';

const DICEBEAR_BASE = import.meta.env.VITE_DICEBEAR_URL;
const USERS_IMAGES_BASE = import.meta.env.VITE_USERS_IMAGES_BASE;

interface ActivityItem {
  movie: MovieSummary;
  activityType: 'liked' | 'watched';
}

interface ActivityResponse {
  data?: {
    movies: ActivityItem[];
  };
}

interface MovieActivity extends MovieSummary {
  activityType: 'liked' | 'watched';
}

function ProfilePage() {
  const { user, login, friendsUpdateTick, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    description: user?.description || '',
  });
  const [loading, setLoading] = useState(false);
  const [imgVersion, setImgVersion] = useState(Date.now());
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    passwordCurrent: '',
    password: '',
    confirmPassword: '',
  });
  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    type: 'danger' | 'info';
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
    type: 'info',
  });
  const [activity, setActivity] = useState<{
    liked: MovieSummary[];
    watched: MovieSummary[];
  }>({ liked: [], watched: [] });
  const [friends, setFriends] = useState<Friend[]>([]);

  useEffect(() => {
    if (!user) {
      navigate('/');
    }
  }, [user, navigate]);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        description: user.description || '',
      });
    }
  }, [user]);

  useEffect(() => {
    const loadActivity = async () => {
      try {
        setLoading(true);
        const res: ActivityResponse = await getUserActivity();
        const allMovies: MovieActivity[] = (res.data?.movies || []).map(
          (item) => ({
            ...item.movie,
            tmdbId: item.movie.tmdbId,
            activityType: item.activityType,
          })
        );

        setActivity({
          liked: allMovies.filter((m) => m.activityType === 'liked'),
          watched: allMovies.filter((m) => m.activityType === 'watched'),
        });
      } catch (error) {
        console.error('Error loading lists', error);
      } finally {
        setLoading(false);
      }
    };
    loadActivity();
  }, []);

  useEffect(() => {
    const loadFriends = async () => {
      if (!user?._id) return;
      try {
        const res = await getFriends();
        if (res.status === 'success' && res.data?.friends) {
          setFriends(res.data.friends);
        }
      } catch {
        toast.error('Помилка завантаження друзів');
      }
    };
    loadFriends();
  }, [user?._id, friendsUpdateTick]);

  const avatarUrl = useMemo(() => {
    if (user?.photo && user.photo !== `${USERS_IMAGES_BASE}default.jpg`) {
      return `${USERS_IMAGES_BASE}${user.photo}?v=${imgVersion}`;
    }
    const seed = encodeURIComponent(user?.name || 'User');
    return `${DICEBEAR_BASE}?seed=${seed}&chars=1&backgroundColor=e50914`;
  }, [user?.name, user?.photo, imgVersion]);

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const res = await updateMe(formData);
      login({ ...res.data.user }, localStorage.getItem('token') || '');
      setImgVersion(Date.now());
      setIsEditing(false);
      toast.success('Дані успішно оновлено!');
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Помилка оновлення';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const fileData = new FormData();
      fileData.append('photo', e.target.files[0]);

      setLoading(true);
      try {
        const res = await updateMe(fileData);
        login(res.data.user, localStorage.getItem('token') || '');
        setImgVersion(Date.now());
        if (fileInputRef.current) fileInputRef.current.value = '';
        toast.success('Фото профілю оновлено!');
      } catch (err: unknown) {
        const msg =
          err instanceof Error ? err.message : 'Помилка завантаження фото';
        toast.error(msg);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDeletePhoto = async () => {
    setLoading(true);
    try {
      const res = await deletePhoto();
      const updatedUser = res.data?.user || res.user || res;

      if (updatedUser) {
        login({ ...updatedUser }, localStorage.getItem('token') || '');
        setImgVersion(Date.now());
        setIsEditing(false);
        toast.success('Фото успішно видалено');
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (error.message.includes('401')) {
          logout();
          return;
        }
        toast.error(error.message);
      }
    } finally {
      setLoading(false);
      setModalConfig((prev) => ({ ...prev, isOpen: false }));
    }
  };

  const handleDeleteAccount = async () => {
    setLoading(true);
    try {
      await deleteMe();
      logout();
      navigate('/');
      toast.success('Ваш акаунт успішно видалено');
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error(err.message);
      }
      toast.error('Помилка видалення акаунту');
    } finally {
      setLoading(false);
      setModalConfig((prev) => ({ ...prev, isOpen: false }));
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      description: user?.description || '',
    });
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordData.password !== passwordData.confirmPassword) {
      return toast.error('Нові паролі не збігаються');
    }

    setLoading(true);
    try {
      await updateMyPassword(passwordData);
      toast.success('Пароль успішно змінено');
      setIsChangingPassword(false);
      setPasswordData({
        passwordCurrent: '',
        password: '',
        confirmPassword: '',
      });
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : 'Помилка при зміні паролю';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (
    title: string,
    message: string,
    onConfirm: () => void,
    type: 'danger' | 'info' = 'info'
  ) => {
    setModalConfig({ isOpen: true, title, message, onConfirm, type });
  };

  const handleDeletePhotoAction = () => {
    openModal(
      'Видалити фото?',
      'Ви впевнені, що хочете видалити фото профілю?',
      handleDeletePhoto,
      'danger'
    );
  };

  const handleLogoutAction = () => {
    openModal('Вихід', 'Ви впевнені, що хочете вийти з акаунту?', () => {
      logout();
      setModalConfig((prev) => ({ ...prev, isOpen: false }));
    });
  };

  const handleDeleteAccountAction = () => {
    openModal(
      'Видалити акаунт?',
      'Ця дія є незворотною. Всі ваші дані будуть втрачені назавжди.',
      handleDeleteAccount,
      'danger'
    );
  };

  if (!user) return null;

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
            <img
              key={imgVersion}
              src={avatarUrl}
              alt={user.name}
              className={`profile-avatar ${isEditing ? 'editing' : ''}`}
              crossOrigin='anonymous'
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                const fallbackSeed = encodeURIComponent(user?.name || 'User');
                target.src = `${DICEBEAR_BASE}?seed=${fallbackSeed}&chars=1&backgroundColor=e50914`;
              }}
            />
            {isEditing && (
              <div className='avatar-edit-overlay'>
                <button
                  className='avatar-action-btn upload'
                  onClick={() => fileInputRef.current?.click()}
                  title='Змінити фото'
                >
                  <CameraIcon size={22} />
                </button>

                {user.photo && user.photo !== 'default.jpg' && (
                  <button
                    className='avatar-action-btn delete'
                    onClick={handleDeletePhotoAction}
                    title='Видалити фото'
                  >
                    <TrashIcon size={20} />
                  </button>
                )}
              </div>
            )}

            <input
              type='file'
              ref={fileInputRef}
              hidden
              accept='image/*'
              onChange={handlePhotoUpload}
            />
          </div>

          <h2>{isEditing ? 'Редагування' : 'Мій профіль'}</h2>

          <div className='profile-info'>
            <div className='info-row'>
              <strong>Ім'я</strong>
              {isEditing ? (
                <input
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className='edit-input'
                />
              ) : (
                <span>{user.name}</span>
              )}
            </div>

            <div className='info-row'>
              <strong>Email</strong>
              {isEditing ? (
                <input
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className='edit-input'
                />
              ) : (
                <span>{user.email}</span>
              )}
            </div>

            <div className='info-row bio'>
              <strong>Про мене</strong>
              {isEditing ? (
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className='edit-textarea'
                  placeholder='Розкажіть про себе...'
                />
              ) : (
                <span className='description-text'>
                  {user.description || 'Опис відсутній'}
                </span>
              )}
            </div>
          </div>

          <div className='profile-actions-group'>
            {isEditing ? (
              <div className='edit-actions-row'>
                <button
                  onClick={handleUpdate}
                  disabled={loading}
                  className='save-btn'
                >
                  {loading ? 'Збереження...' : 'Зберегти'}
                </button>
                <button onClick={handleCancel} className='cancel-btn'>
                  Скасувати
                </button>
              </div>
            ) : (
              <>
                <button onClick={() => setIsEditing(true)} className='edit-btn'>
                  Редагувати профіль
                </button>
                <button
                  onClick={handleLogoutAction}
                  className='logout-link-btn'
                >
                  Вийти з акаунта
                </button>

                <Button
                  className='delete-account-btn'
                  variant='secondary'
                  size='sm'
                  onClick={handleDeleteAccountAction}
                  icon={<WarningCircleIcon size={16} />}
                >
                  Видалити акаунт
                </Button>
              </>
            )}

            <ConfirmModal
              isOpen={modalConfig.isOpen}
              title={modalConfig.title}
              message={modalConfig.message}
              onConfirm={modalConfig.onConfirm}
              onCancel={() =>
                setModalConfig((prev) => ({ ...prev, isOpen: false }))
              }
              type={modalConfig.type}
              confirmText='Підтвердити'
              cancelText='Скасувати'
            />

            {!isEditing && !isChangingPassword && (
              <button
                onClick={() => setIsChangingPassword(true)}
                className='change-password-btn'
              >
                Змінити пароль
              </button>
            )}

            {isChangingPassword && (
              <form
                onSubmit={handlePasswordUpdate}
                className='password-change-form'
              >
                <h3>Зміна пароля</h3>
                <PasswordField
                  label='Поточний пароль'
                  name='passwordCurrent'
                  value={passwordData.passwordCurrent}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      passwordCurrent: e.target.value,
                    })
                  }
                  placeholder='Введіть старий пароль'
                />

                <PasswordField
                  label='Новий пароль'
                  name='password'
                  value={passwordData.password}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      password: e.target.value,
                    })
                  }
                  placeholder='Мінімум 8 символів'
                />

                <PasswordField
                  label='Підтвердіть новий пароль'
                  name='confirmPassword'
                  value={passwordData.confirmPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      confirmPassword: e.target.value,
                    })
                  }
                  placeholder='Повторіть пароль'
                />

                <div className='edit-actions-row'>
                  <button type='submit' className='save-btn' disabled={loading}>
                    {loading ? 'Оновлення...' : 'Оновити пароль'}
                  </button>
                  <button
                    type='button'
                    className='cancel-btn'
                    onClick={() => setIsChangingPassword(false)}
                  >
                    Скасувати
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>

      <div className='friends-section'>
        <h3>Друзі ({friends.length})</h3>
        <div className='friends-list-horizontal'>
          {friends.length > 0 ? (
            friends.map((friend) => (
              <div
                key={friend._id}
                className='friend-item'
                onClick={() => navigate(`/user/${friend._id}`)}
              >
                <img
                  src={
                    friend.photo !== 'default.jpg'
                      ? `${USERS_IMAGES_BASE}${friend.photo}`
                      : `${DICEBEAR_BASE}?seed=${friend.name}`
                  }
                  alt={friend.name}
                  crossOrigin='anonymous'
                />
                <span>{friend.name}</span>
              </div>
            ))
          ) : (
            <p className='empty-text'>У вас поки немає друзів</p>
          )}
        </div>
      </div>

      <div className='profile-content-list'>
        <div className='profile-lists-wrapper'>
          {activity.liked.length > 0 ? (
            <MovieSection
              key='liked-section'
              title='Хочу переглянути'
              movies={activity.liked}
              loading={loading}
            />
          ) : null}

          {activity.watched.length > 0 ? (
            <MovieSection
              key='watched-section'
              title='Переглянуто'
              movies={activity.watched}
              loading={loading}
            />
          ) : null}

          {!loading &&
            activity.liked.length === 0 &&
            activity.watched.length === 0 && (
              <div className='empty-activity'>
                <p>Тут з'являться ваші фільми, коли ви додасте їх до списків</p>
              </div>
            )}
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
