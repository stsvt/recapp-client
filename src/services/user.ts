const BASE_URL = import.meta.env.VITE_API_URL;

interface UpdateMeData {
  name?: string;
  email?: string;
  description?: string;
  photo?: string;
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
    throw new Error(errorData.message || 'Update failed');
  }

  return await response.json();
};
