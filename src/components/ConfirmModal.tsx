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
          <button className='modal-btn cancel' onClick={onCancel}>
            {cancelText}
          </button>
          <button
            className={`modal-btn confirm ${type === 'danger' ? 'danger-bg' : ''}`}
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;
