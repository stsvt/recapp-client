const API_URL = env.API_URL;

export async function signupService({
  name,
  email,
  password,
  confirmPassword,
}) {
  const res = await fetch(`${API_URL}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password, confirmPassword }),
  });

  const data = await res.json();

  if (data.token) {
    localStorage.setItem('token', data.token);
    if (data.data?.user) {
      localStorage.setItem('user', JSON.stringify(data.data.user));
    }
    return data;
  }
  throw new Error(data.message || 'Registration failed');
}

export async function loginService({ email, password }) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();

  if (data.token) {
    localStorage.setItem('token', data.token);
    if (data.data?.user) {
      localStorage.setItem('user', JSON.stringify(data.data.user));
    }
    return data;
  }
  throw new Error(data.message || 'Login failed');
}
