const BASE_URL = import.meta.env.VITE_API_URL;

interface UpdateMeData {
  name?: string;
  email?: string;
  description?: string;
  photo?: string;
}

interface UpdatePasswordData {
  passwordCurrent: string;
  password: string;
  confirmPassword: string;
}

interface ResetPaswordData {
  password: string;
  confirmPassword: string;
}

export const updateMe = async (data: UpdateMeData | FormData) => {
  const token = localStorage.getItem('token');
  const isFormData = data instanceof FormData;
  const response = await fetch(`${BASE_URL}users/updateMe`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
    },
    body: isFormData ? data : JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || `Update Error: ${response.status}`);
  }

  return await response.json();
};

export const deleteMe = async () => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${BASE_URL}users/deleteMe`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || `Delete Error: ${response.status}`);
  }

  return true;
};

export const deletePhoto = async () => {
  return await updateMe({ photo: 'default.jpg' });
};

export const updateMyPassword = async (data: UpdatePasswordData) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${BASE_URL}users/updateMyPassword`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if(!response.ok) {
    throw new Error(result.message || 'Error while changing password') 
  }

  if(result.token) {
    localStorage.setItem('token', result.token);
  }

  return result;
}

export const resetPassword = async (tokenFromUrl: string, data: ResetPaswordData) => {
  const response = await fetch(`${BASE_URL}users/resetPassword/${tokenFromUrl}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    }, 
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if(!response.ok) {
    throw new Error(result.message || 'Invalid or expired token')
  }

  if(result.token) {
    localStorage.setItem('token', result.token);
  }

  return result;
}

export const forgotPassword = async (email: string) => {
  const response = await fetch(`${BASE_URL}users/forgotPassword`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    }, 
    body: JSON.stringify({email}),
  });

  if(!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to send recovery email');
  }
  return await response.json();
}