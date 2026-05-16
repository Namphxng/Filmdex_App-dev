import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  function handleLogout() { logout(); navigate('/login'); }
  return (
    <div className="header">
      <div className="logo">FILMDEX</div>
      <nav>
        <NavLink to="/" end>Home</NavLink>
        <NavLink to="/search">Search</NavLink>
        <NavLink to="/watchlist">Watchlist</NavLink>
        <NavLink to="/journal">Journal</NavLink>
<NavLink to="/profile">Profile</NavLink>
      </nav>
      <span className="user">{user?.username}</span>
      <button className="logout" onClick={handleLogout}>Logout</button>
    </div>
  );
}
