import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';
import Header from './components/Header.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Home from './pages/Home.jsx';
import Search from './pages/Search.jsx';
import MovieDetail from './pages/MovieDetail.jsx';
import Watchlist from './pages/Watchlist.jsx';
import Journal from './pages/Journal.jsx';
import Profile from './pages/Profile.jsx';

function Protected({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  const { user } = useAuth();
  return (
    <>
      {user && <Header />}
      <Routes>
        <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
        <Route path="/register" element={user ? <Navigate to="/" /> : <Register />} />
        <Route path="/" element={<Protected><Home /></Protected>} />
        <Route path="/search" element={<Protected><Search /></Protected>} />
        <Route path="/movie/:type/:id" element={<Protected><MovieDetail /></Protected>} />
        <Route path="/watchlist" element={<Protected><Watchlist /></Protected>} />
        <Route path="/journal" element={<Protected><Journal /></Protected>} />
        <Route path="/profile" element={<Protected><Profile /></Protected>} />
<Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}
