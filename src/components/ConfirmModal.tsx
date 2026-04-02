import { Button } from './ui/Button.tsx';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'info';
}

function ConfirmModal({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = 'Підтвердити',
  cancelText = 'Скасувати',
  type = 'info',
}: ConfirmModalProps) {
  if (!isOpen) return null;
  return (
    <div className='modal-overlay'>
      <div className='modal-box'>
        <h3>{title}</h3>
        <p>{message}</p>
        <div className='modal-actions'>
          <Button
            variant='secondary'
            className='modal-btn cancel'
            onClick={onCancel}
          >
            {cancelText}
          </Button>
          <Button
            variant={type === 'danger' ? 'danger' : 'primary'}
            className={`modal-btn confirm ${type === 'danger' ? 'danger-bg' : ''}`}
            onClick={onConfirm}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;
