import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setErr('');
    setBusy(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (ex) {
      setErr(ex.response?.data?.message || 'Login failed');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h1>FILMDEX</h1>
        <p className="subtitle">Your personal movie journal.</p>
        {err && <div className="error">{err}</div>}
        <label>Email</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoFocus />
        <label>Password</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button className="btn-primary" disabled={busy}>{busy ? 'Signing in...' : 'Sign In'}</button>
        <div className="auth-switch">
          New here? <Link to="/register">Create an account</Link>
        </div>
      </form>
    </div>
  );
}
