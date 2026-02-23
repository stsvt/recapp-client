import { Routes, Route } from 'react-router-dom';
import MainPage from './pages/MainPage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import MoviePage from './pages/MoviePage';
import { AuthProvider } from './context/AuthContext';
import ProfilePage from './pages/ProfilePage';
import PersonPage from './pages/PersonPage';

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path='/' element={<MainPage />} />
        <Route path='/register' element={<RegisterPage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/profile' element={<ProfilePage />} />
        <Route path='/movie/:id' element={<MoviePage />} />
        <Route path='/person/:id' element={<PersonPage />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
