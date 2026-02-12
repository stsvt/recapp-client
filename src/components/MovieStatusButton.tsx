import React from 'react';
import type { IconProps } from '@phosphor-icons/react';

interface MovieStatusButtonProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
  Icon: React.ElementType<IconProps>;
  activeColor?: string;
  className?: string;
}

function MovieStatusButton({
  label,
  isActive,
  onClick,
  Icon,
  activeColor = '#e50914',
  className = '',
}: MovieStatusButtonProps) {
  return (
    <button
      className={`check-btn ${isActive ? 'active' : ''} ${className}`}
      onClick={onClick}
    >
      <div className='icon-wrapper'>
        <Icon
          size={30}
          weight={isActive ? 'fill' : 'regular'}
          color={isActive ? activeColor : '#fff'}
        />
      </div>
      <span className='label'>{label}</span>
    </button>
  );
}

export default MovieStatusButton;
