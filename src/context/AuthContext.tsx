/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useContext, useEffect } from 'react';
import { io } from 'socket.io-client';
import toast from 'react-hot-toast';

interface User {
  _id: string;
  name: string;
  email: string;
  photo: string;
  role: string;
  description: string;
}
interface AuthContextType {
  user: User | null;
  login: (userData: User, token: string) => void;
  logout: () => void;
  incomingRequestsCount: number;
  setIncomingRequestsCount: (count: number) => void;
  friendsUpdateTick: number;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        return JSON.parse(savedUser);
      } catch {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        return null;
      }
    }
    return null;
  });

  const [incomingRequestsCount, setIncomingRequestsCount] = useState(0);
  const [friendsUpdateTick, setFriendsUpdateTick] = useState(0);

  useEffect(() => {
    if (!user) return;

    const newSocket = io('http://localhost:3000', {
      auth: { token: localStorage.getItem('token') },
    });

    newSocket.on('new_friend_request', (data: { senderName: string }) => {
      setIncomingRequestsCount((prev) => prev + 1);
      toast(`Новий запит у друзі від ${data.senderName}`, {
        position: 'top-right',
        duration: 5000,
      });
    });

    newSocket.on('friend_request_accepted', (data: { userName: string }) => {
      toast.success(`${data.userName} прийняв ваш запит у друзі!`);
      setFriendsUpdateTick(prev => prev + 1);
    });

    return () => {
      newSocket.close();
    };
  }, [user]);

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'token') {
        window.location.reload();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const login = (userData: User, token: string) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setIncomingRequestsCount(0);
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        incomingRequestsCount,
        setIncomingRequestsCount,
        friendsUpdateTick
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
