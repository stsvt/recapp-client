import { useEffect } from 'react';
import { CheckCircleIcon, XCircleIcon, XIcon } from '@phosphor-icons/react';

interface ToastProps {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
}

function Toast({ message, type, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`toast-container ${type}`}>
      <div className='toast-icon'>
        {type === 'success' ? (
          <CheckCircleIcon size={24} weight='fill' />
        ) : (
          <XCircleIcon size={24} weight='fill' />
        )}
      </div>
      <p className='toast-message'>{message}</p>
      <button className='toast-close' onClick={onClose}>
        <XIcon size={18} />
      </button>
    </div>
  );
}

export default Toast;
