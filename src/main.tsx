import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import './styles/auth.css';
import './styles/base.css';
import './styles/button.css';
import './styles/dashboard.css';
import './styles/friends.css';
import './styles/modal.css';
import './styles/movie-page.css';
import './styles/movies.css';
import './styles/profile.css';
import './styles/reviews.css';
import './styles/search.css';

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
