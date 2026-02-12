import { Routes, Route } from 'react-router-dom';
import Main from './pages/Main';
import Register from './pages/Register';
import Login from './pages/Login';
import Movie from './pages/Movie';

function App() {
  return (
    <Routes>
      <Route path='/' element={<Main />} />
      <Route path='/register' element={<Register />} />
      <Route path='/login' element={<Login />} />
      <Route path='/movie/:id' element={<Movie />} />
    </Routes>
  );
}

export default App;
