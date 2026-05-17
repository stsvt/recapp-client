import {
  CameraIcon,
  CaretLeftIcon,
  LockIcon,
  PencilIcon,
  SignOutIcon,
  TrashIcon,
} from '@phosphor-icons/react';
import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { Avatar } from '../components/Avatar.tsx';
import ConfirmModal from '../components/ConfirmModal';
import MovieSection from '../components/movies/MovieSection.tsx';
import PasswordField from '../components/PasswordField';
import { Button } from '../components/ui/Button.tsx';
import UserSearch from '../components/UserSearch';
import { useAuth } from '../context/AuthContext';
import { getUserActivity } from '../services/activitiesApi.ts';
import { getFriends } from '../services/friendsApi.ts';
import {
  deleteMe,
  deletePhoto,
  updateMe,
  updateMyPassword,
} from '../services/usersApi.ts';
import type { Friend, MovieSummary } from '../types';
import { minutesToStr } from '../utils.ts';

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
  const { user, setUser, friendsUpdateTick, logout } = useAuth();
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

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const res = await updateMe(formData);
      setUser(res.data.user);
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
        setUser(res.data.user);
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
        setUser(updatedUser);
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
    <>
      <Button
        variant='icon'
        icon={<CaretLeftIcon size={28} />}
        onClick={() => navigate(-1)}
        title='Назад'
      />
      <UserSearch />

      <div className='profile-container'>
        <div className='profile-card'>
          <div className='avatar-section'>
            <Avatar
              userName={user.name}
              userPhoto={user.photo}
              size='lg'
              className={`profile-avatar ${isEditing ? 'editing' : ''}`}
              cacheVersion={imgVersion}
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
            <div className='info-row bio'>
              <strong>Час перегляду</strong>
              <span className='description-text'>
                {minutesToStr(user.totalWatchTime || 0)}
              </span>
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
                  <PencilIcon size={18} weight='bold' />
                  Редагувати профіль
                </button>
                <button
                  onClick={handleLogoutAction}
                  className='logout-link-btn'
                >
                  <SignOutIcon size={18} weight='bold' />
                  Вийти з акаунта
                </button>

                <button
                  onClick={handleDeleteAccountAction}
                  className='delete-account-btn'
                >
                  <TrashIcon size={18} weight='bold' />
                  Видалити акаунт
                </button>
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
                <LockIcon size={18} weight='bold' />
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
                  <button type='submit' className='save-btn'>
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
                <Avatar
                  userName={friend.name}
                  userPhoto={friend.photo}
                  size='md'
                  className='friend-avatar'
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
    </>
  );
}

export default ProfilePage;
