import { useState, useRef, useEffect, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Dashboard from '../components/Dashboard';
import {
  CaretLeftIcon,
  CameraIcon,
  TrashIcon,
  WarningCircleIcon,
} from '@phosphor-icons/react';
import { updateMe, deleteMe, deletePhoto } from '../services/user';

const DICEBEAR_BASE = import.meta.env.VITE_DICEBEAR_URL;
const USERS_IMAGES_BASE = import.meta.env.VITE_USERS_IMAGES_BASE;

function ProfilePage() {
  const { user, login, logout } = useAuth();
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

  const avatarUrl = useMemo(() => {
    if (user?.photo && user.photo !== 'default.jpg') {
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
      alert('Дані успішно оновлено!');
    } catch (error: unknown) {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert('Помилка при оновленні даних');
      }
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
        alert('Фото оновлено!');
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error(error.message);
        }
        alert('Помилка завантаження фото');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDeletePhoto = async () => {
    if (!window.confirm('Ви впевнені, що хочете видалити фото профілю?'))
      return;

    setLoading(true);
    try {
      const res = await deletePhoto();
      console.log('Повна відповідь сервера:', res);
      
      const updatedUser = res.data?.user || res.user || res;
      
      if (updatedUser) {
        login({ ...updatedUser }, localStorage.getItem('token') || '');
        setImgVersion(Date.now());
        setIsEditing(false);
        alert('Фото успішно видалено');
      } else {
        console.error('Сервер не повернув дані користувача:', res);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (error.message.includes('401')) {
          logout();
          return;
        }
        alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (
      !window.confirm(
        'ЦЯ ДІЯ НЕЗВОРОТНЯ! Ви впевнені, що хочете видалити свій профіль?'
      )
    )
      return;

    setLoading(true);
    try {
      await deleteMe();
      logout();
      navigate('/');
      alert('Ваш акаунт успішно видалено');
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error(err.message);
      }
      alert('Помилка видалення акаунту');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      name: user.name,
      email: user.email,
      description: user.description || '',
    });
  };

  if (!user) return null;

  return (
    <div className='full-screen'>
      <Dashboard />
      <button className='back-button' onClick={() => navigate(-1)}>
        <CaretLeftIcon size={28} />
      </button>

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
                    onClick={handleDeletePhoto}
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
                <button onClick={logout} className='logout-link-btn'>
                  Вийти з акаунта
                </button>

                <button
                  onClick={handleDeleteAccount}
                  className='delete-account-btn'
                >
                  <WarningCircleIcon size={16} />
                  Видалити акаунт
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
