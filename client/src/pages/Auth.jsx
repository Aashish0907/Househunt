import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../api.js';
import { useAuth } from '../AuthContext.jsx';

export default function Auth({ mode }) {
  const isReg = mode === 'register';
  const [f, setF] = useState({ name: '', email: '', phone: '', password: '', role: 'renter' });
  const [err, setErr] = useState('');
  const { login } = useAuth();
  const nav = useNavigate();
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    try { login(await api(`/auth/${mode}`, { method: 'POST', body: f })); nav('/dashboard'); }
    catch (er) { setErr(er.message); }
  };
  return (
    <form className="panel auth" onSubmit={submit}>
      <h2>{isReg ? 'Create account' : 'Welcome back'}</h2>
      {isReg && <>
        <label>Name<input required value={f.name} onChange={set('name')} /></label>
        <label>Phone<input value={f.phone} onChange={set('phone')} /></label>
        <label>I am a<select value={f.role} onChange={set('role')}><option value="renter">Renter (looking for a home)</option><option value="owner">Owner / Agent (listing homes)</option></select></label>
      </>}
      <label>Email<input type="email" required value={f.email} onChange={set('email')} /></label>
      <label>Password<input type="password" required minLength={6} value={f.password} onChange={set('password')} /></label>
      {err && <p className="error">{err}</p>}
      <button className="btn">{isReg ? 'Sign up' : 'Login'}</button>
      <p className="muted">{isReg ? <>Have an account? <Link to="/login">Login</Link></> : <>New here? <Link to="/register">Sign up</Link></>}</p>
    </form>
  );
}
