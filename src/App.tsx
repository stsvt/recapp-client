import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from 'react-hot-toast';
import { Route, Routes } from 'react-router-dom';
import AuthLayout from './components/ui/AuthLayout.tsx';
import Layout from './components/ui/Layout.tsx';
import PageTransitionBar from './components/ui/PageTransitionBar.tsx';
import { AuthProvider } from './context/AuthContext';
import AdminPage from './pages/AdminPage';
import FriendRequestsPage from './pages/FriendRequestsPage';
import GoogleCallbackPage from './pages/GoogleCallbackPage.tsx';
import LoginPage from './pages/LoginPage';
import MainPage from './pages/MainPage';
import MoviePage from './pages/MoviePage';
import NotFoundPage from './pages/NotFoundPage';
import PersonPage from './pages/PersonPage';
import ProfilePage from './pages/ProfilePage';
import RegisterPage from './pages/RegisterPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import UserPage from './pages/UserPage';

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
            <Route path='/admin' element={<AdminPage />} />
            <Route path='/not-found' element={<NotFoundPage />} />
            <Route path='/friends/requests' element={<FriendRequestsPage />} />
            <Route path='*' element={<NotFoundPage />} />
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
