const API_URL = import.meta.env.VITE_API_URL || '';
const BASE_URL = API_URL.endsWith('/') ? API_URL : `${API_URL}/`;

if (!API_URL) {
  console.error('VITE_API_URL is not defined! API calls will fail.');
}

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

interface LoginResponse {
  status: string;
  token: string;
  data: {
    user: {
      _id: string;
      name: string;
      email: string;
      photo: string;
      role: string;
      description: string;
      totalWatchTime: number;
    };
  };
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

export const login = async (
  userData: LoginUserData
): Promise<LoginResponse> => {
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

  return await response.json();
};

export const forgotPassword = async (email: string) => {
  const response = await fetch(`${BASE_URL}users/forgotPassword`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to send recovery email');
  }
  return await response.json();
};

export const logout = () => {
  localStorage.removeItem('token');
};
