import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import MainPage from './pages/MainPage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import MoviePage from './pages/MoviePage';
import ProfilePage from './pages/ProfilePage';
import PersonPage from './pages/PersonPage';
import GoogleCallback from './pages/GoogleCallback';

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
      </Routes>
    </AuthProvider>
  );
}

export default App;
