const BASE_URL = import.meta.env.VITE_API_URL;

interface RegisterUserData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface LoginUserData {
  email: string;
  password: string;
}

export const register = async (userData: RegisterUserData) => {
  const response = await fetch(`${BASE_URL}users/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Registration error');
  }

  const res = await response.json();
  return res;
};

export const login = async (userData: LoginUserData) => {
  const response = await fetch(`${BASE_URL}users/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Login error');
  }

  const res = await response.json();
  return res;
};

export const logout = () => {
  localStorage.removeItem('token');
};
