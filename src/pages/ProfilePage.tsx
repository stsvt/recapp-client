import { useState, useRef, useEffect, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Dashboard from '../components/Dashboard';
import { CaretLeftIcon, CameraIcon } from '@phosphor-icons/react';
import { updateMe } from '../services/user';

const DICEBEAR_BASE = import.meta.env.VITE_DICEBEAR_URL;

function ProfilePage() {
  const { user, login, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    description: user?.description || '',
  });
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        description: user.description || '',
      });
    }
  }, [user]);


  const handleUpdate = async () => {
    setLoading(true);
    try {
      const res = await updateMe(formData);
      login(res.data.user, localStorage.getItem('token') || '');
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

  const avatarUrl = useMemo(() => {
    if (user?.photo && user.photo !== 'default.jpg') return user.photo;
    const seed = encodeURIComponent(user?.name || 'User');
    return `${DICEBEAR_BASE}?seed=${seed}&chars=1&backgroundColor=e50914`;
  }, [user?.name, user?.photo]);

  if (!user) {
    return <p className='status-text'>Будь ласка, увійдіть в акаунт</p>;
  }

  const handleCancel = () => {
  setIsEditing(false);
  setFormData({
    name: user.name,
    email: user.email,
    description: user.description || '',
  });
};

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
              src={avatarUrl}
              alt={user.name}
              className='profile-avatar'
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  `${DICEBEAR_BASE}?seed=User&chars=1&backgroundColor=e50914`;
              }}
            />
            <button
              className='photo-upload-btn'
              onClick={() => fileInputRef.current?.click()}
              title='Змінити фото'
            >
              <CameraIcon size={20} />
            </button>
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
              <>
                <button
                  onClick={handleUpdate}
                  disabled={loading}
                  className='save-btn'
                >
                  {loading ? 'Збереження...' : 'Зберегти'}
                </button>
                <button
                  onClick={handleCancel}
                  className='cancel-btn'
                >
                  Скасувати
                </button>
              </>
            ) : (
              <>
                <button onClick={() => setIsEditing(true)} className='edit-btn'>
                  Редагувати
                </button>
                <button onClick={logout} className='logout-link-btn'>
                  Вийти з акаунта
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
