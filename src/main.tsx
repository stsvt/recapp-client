import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './styles/base.css';
import './styles/button.css';
import './styles/dashboard.css';
import './styles/reviews.css';
import './styles/auth.css';
import './styles/movies.css';
import './styles/movie-page.css';
import './styles/search.css';
import './styles/profile.css';
import './styles/friends.css';
import './styles/modal.css';
import './styles/avatar.css';
import App from './App.tsx';

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
