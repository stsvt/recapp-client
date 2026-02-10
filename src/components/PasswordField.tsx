import { useState } from 'react';
import { EyeIcon, EyeSlashIcon } from '@phosphor-icons/react';

interface PasswordFieldProps {
  label: string;
  name: string;
  value: string;
  placeholder?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

function PasswordField({
  label,
  name,
  value,
  placeholder,
  onChange,
}: PasswordFieldProps) {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className='input-group'>
      <label>{label}</label>
      <div className='password-wrapper'>
        <input
          type={showPassword ? 'text' : 'password'}
          name={name}
          placeholder={placeholder || '••••••••'}
          value={value}
          onChange={onChange}
          required
        />
        <button
          type='button'
          className='eye-button'
          onClick={() => setShowPassword(!showPassword)}
          tabIndex={-1}
        >
          {showPassword ? (
            <EyeSlashIcon size={22} weight='regular' />
          ) : (
            <EyeIcon size={22} weight='regular' />
          )}
        </button>
      </div>
    </div>
  );
}

export default PasswordField;
