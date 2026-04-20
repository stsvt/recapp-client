/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useContext, useEffect } from 'react';
import { io } from 'socket.io-client';
import toast from 'react-hot-toast';
import { fetchMe } from '../services/usersApi.ts';

interface User {
  _id: string;
  name: string;
  email: string;
  photo: string;
  role: string;
  description: string;
  totalWatchTime: number;
}
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (token: string) => void;
  logout: () => void;
  setUser: (user: User | null) => void;
  incomingRequestsCount: number;
  setIncomingRequestsCount: (count: number) => void;
  friendsUpdateTick: number;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [incomingRequestsCount, setIncomingRequestsCount] = useState(0);
  const [friendsUpdateTick, setFriendsUpdateTick] = useState(0);

  useEffect(() => {
    const fetchMeData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const data = await fetchMe();

        setUser(data.data.user);
      } catch (error) {
        console.error('Error fetching user data:', error);
        localStorage.removeItem('token');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMeData();
  }, []);

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

    newSocket.on(
      'friend_request_accepted',
      (data: { friend: { name: string } }) => {
        toast.success(`${data.friend.name} прийняв ваш запит у друзі!`);
        setFriendsUpdateTick((prev) => prev + 1);
      }
    );

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

  const login = async (token: string) => {
    localStorage.setItem('token', token);
    try {
      const data = await fetchMe();
      setUser(data.data.user);
    } catch {
      localStorage.removeItem('token');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setIncomingRequestsCount(0);
    window.location.href = '/';
  };

  return (
    <AuthContext.Provider
      value={{
        isLoading,
        user,
        login,
        logout,
        setUser,
        incomingRequestsCount,
        setIncomingRequestsCount,
        friendsUpdateTick,
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
