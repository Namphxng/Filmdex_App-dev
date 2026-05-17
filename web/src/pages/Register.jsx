import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setErr('');
    setBusy(true);
    try {
      await register(username, email, password);
      navigate('/');
    } catch (ex) {
      setErr(ex.response?.data?.message || 'Registration failed');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h1>Join Filmdex</h1>
        <p className="subtitle">Start tracking what you watch.</p>
        {err && <div className="error">{err}</div>}
        <label>Username</label>
        <input value={username} onChange={(e) => setUsername(e.target.value)} required minLength={3} autoFocus />
        <label>Email</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <label>Password (min 6 chars)</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
        <button className="btn-primary" disabled={busy}>{busy ? 'Creating...' : 'Create Account'}</button>
        <div className="auth-switch">
          Already have an account? <Link to="/login">Login</Link>
        </div>
      </form>
    </div>
  );
}
