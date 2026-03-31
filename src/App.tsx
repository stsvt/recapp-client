import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';
import MainPage from './pages/MainPage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import MoviePage from './pages/MoviePage';
import ProfilePage from './pages/ProfilePage';
import PersonPage from './pages/PersonPage';
import GoogleCallback from './pages/GoogleCallback';
import UserPage from './pages/UserPage';
import FriendRequestsPage from './pages/FriendRequestsPage';

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path='/' element={<MainPage />} />
        <Route path='/register' element={<RegisterPage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/reset-password/:token' element={<ResetPasswordPage />} />
        <Route path='/google/callback' element={<GoogleCallback />} />
        <Route path='/profile' element={<ProfilePage />} />
        <Route path='/movie/:id' element={<MoviePage />} />
        <Route path='/person/:id' element={<PersonPage />} />
        <Route path='/user/:userId' element={<UserPage />} />
        <Route path='/friends/requests' element={<FriendRequestsPage />} />
      </Routes>
      <Toaster
        position='bottom-right'
        toastOptions={{
          style: {
            background: '#181818',
            color: '#fff',
            border: '1px solid var(--color-text-white10)',
            borderRadius: '4px',
            fontSize: '14px',
          },
          success: {
            iconTheme: {
              primary: '#46d369',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#e50914',
              secondary: '#fff',
            },
          },
        }}
      />
    </AuthProvider>
  );
}

export default App;
