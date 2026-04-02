import type {
  ReactNode,
  ButtonHTMLAttributes,
  AnchorHTMLAttributes,
} from 'react';
import { Link } from 'react-router-dom';

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'icon'
  | 'danger'
  | 'success'
  | 'link'
  | 'outline';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface BaseButtonProps {
  children?: ReactNode;
  icon?: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  disabled?: boolean;
  className?: string;
  title?: string;
}

interface ButtonProps
  extends BaseButtonProps, ButtonHTMLAttributes<HTMLButtonElement> {
  to?: never;
}

interface LinkButtonProps
  extends BaseButtonProps, AnchorHTMLAttributes<HTMLAnchorElement> {
  to: string;
}

type ButtonOrLinkProps = ButtonProps | LinkButtonProps;

export function Button({
  children,
  icon,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  className = '',
  title,
  to,
  ...rest
}: ButtonOrLinkProps) {
  const baseClasses = 'btn';
  const variantClasses = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    icon: 'btn-icon',
    danger: 'btn-danger',
    success: 'btn-success',
    link: 'btn-link',
    outline: 'btn-outline',
  };
  const sizeClasses = {
    sm: 'btn-sm',
    md: 'btn-md',
    lg: 'btn-lg',
  };

  const computedClassName = [
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    isLoading && 'btn-loading',
    disabled && 'btn-disabled',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const iconContent = isLoading ? (
    <span className='btn-spinner'>⏳</span>
  ) : (
    icon
  );
  const childContent = isLoading ? (
    <span className='btn-spinner'>⏳</span>
  ) : (
    children
  );

  if (to) {
    if (icon && !children) {
      return (
        <Link
          to={to}
          className={computedClassName}
          title={title}
          {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)}
        >
          {iconContent}
        </Link>
      );
    }

    return (
      <a
        href={to}
        className={computedClassName}
        title={title}
        {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {icon && <span className='btn-icon-wrapper'>{icon}</span>}
        {childContent}
      </a>
    );
  }

  // Render as button otherwise
  if (icon && !children) {
    return (
      <button
        className={computedClassName}
        disabled={disabled || isLoading}
        title={title}
        {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}
      >
        {iconContent}
      </button>
    );
  }

  return (
    <button
      className={computedClassName}
      disabled={disabled || isLoading}
      title={title}
      {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {icon && <span className='btn-icon-wrapper'>{icon}</span>}
      {childContent}
    </button>
  );
}
