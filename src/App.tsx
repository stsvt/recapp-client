import { Routes, Route } from 'react-router-dom';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from 'react-hot-toast';
import PageTransitionBar from './components/ui/PageTransitionBar.tsx';
import { AuthProvider } from './context/AuthContext';
import MainPage from './pages/MainPage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import MoviePage from './pages/MoviePage';
import ProfilePage from './pages/ProfilePage';
import PersonPage from './pages/PersonPage';
import GoogleCallbackPage from './pages/GoogleCallbackPage.tsx';
import UserPage from './pages/UserPage';
import FriendRequestsPage from './pages/FriendRequestsPage';
import Layout from './components/ui/Layout.tsx';
import AuthLayout from './components/ui/AuthLayout.tsx';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 5 * 60 * 1000 },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <PageTransitionBar />
      <AuthProvider>
        <Routes>
          <Route path='/google/callback' element={<GoogleCallbackPage />} />
          <Route element={<AuthLayout />}>
            <Route path='/register' element={<RegisterPage />} />
            <Route path='/login' element={<LoginPage />} />
          </Route>
          <Route element={<Layout />}>
            <Route path='/' element={<MainPage />} />
            <Route
              path='/reset-password/:token'
              element={<ResetPasswordPage />}
            />
            <Route path='/profile' element={<ProfilePage />} />
            <Route path='/movie/:id' element={<MoviePage />} />
            <Route path='/person/:id' element={<PersonPage />} />
            <Route path='/user/:userId' element={<UserPage />} />
            <Route path='/friends/requests' element={<FriendRequestsPage />} />
          </Route>
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
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
