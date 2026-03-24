const BASE_URL = import.meta.env.VITE_API_URL;

const getHeaders = () => {
  const token = localStorage.getItem('token');
  if (!token) {
    console.error('Token is missing');
  }
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
};

export const sendFriendRequest = async (userId: string) => {
  const response = await fetch(`${BASE_URL}friends/sendRequest/${userId}`, {
    method: 'POST',
    headers: getHeaders(),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Помилка запиту');
  }
  return data;
};

export const acceptFriendRequest = async (userId: string) => {
  const response = await fetch(`${BASE_URL}friends/acceptRequest/${userId}`, {
    method: 'PATCH',
    headers: getHeaders(),
  });
  
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Помилка запиту');
  }
  return data;
};

export const rejectFriendRequest = async (userId: string) => {
  const response = await fetch(`${BASE_URL}friends/rejectRequest/${userId}`, {
    method: 'DELETE',
    headers: getHeaders(),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Помилка запиту');
  }
  return data;
};

export const removeFriend = async (userId: string) => {
  const response = await fetch(`${BASE_URL}friends/removeFriend/${userId}`, {
    method: 'DELETE',
    headers: getHeaders(),
  });

  if (response.status === 204) return { status: 'success' };
  
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Помилка запиту');
  }
  return data;
};

export const getIncomingRequests = async () => {
  const response = await fetch(`${BASE_URL}friends/incomingRequests`, {
    method: 'GET',
    headers: getHeaders(),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Помилка запиту');
  }
  return data;
};

export const getFriends = async () => {
  const response = await fetch(`${BASE_URL}friends`, {
    method: 'GET',
    headers: getHeaders(),
  });
  const data = await response.json();
    
  if (!response.ok) {
    throw new Error(data.message || 'Помилка запиту');
  }
  return data;
};
