import { useMemo } from 'react';

const DICEBEAR_BASE = import.meta.env.VITE_DICEBEAR_URL;
const USERS_IMAGES_BASE = import.meta.env.VITE_USERS_IMAGES_BASE;

interface AvatarProps {
  userName: string;
  userPhoto?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  cacheVersion?: string | number;
}

export function Avatar({
  userName,
  userPhoto,
  size = 'md',
  className = '',
  cacheVersion,
}: AvatarProps) {
  const name = userName || 'User';

  const avatarUrl = useMemo(() => {
    if (userPhoto && userPhoto !== 'default.jpg' && userPhoto !== 'undefined') {
      const photoUrl = userPhoto.startsWith('http')
        ? userPhoto
        : `${USERS_IMAGES_BASE}${userPhoto}`;
      return cacheVersion ? `${photoUrl}?v=${cacheVersion}` : photoUrl;
    }

    const seed = encodeURIComponent(name);
    return `${DICEBEAR_BASE}?seed=${seed}&chars=1&backgroundColor=e50914`;
  }, [name, userPhoto, cacheVersion]);

  const handleError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.target as HTMLImageElement;
    if (target.dataset.error) return;

    target.dataset.error = 'true';
    const seed = encodeURIComponent(name);
    target.src = `${DICEBEAR_BASE}?seed=${seed}&chars=1&backgroundColor=e50914`;
  };

  return (
    <img
      src={avatarUrl}
      alt={name}
      className={`avatar avatar-${size} ${className}`}
      onError={handleError}
    />
  );
}
