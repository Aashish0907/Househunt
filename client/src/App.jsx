import { Link, Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext.jsx';
import Home from './pages/Home.jsx';
import PropertyDetail from './pages/PropertyDetail.jsx';
import Auth from './pages/Auth.jsx';
import Dashboard from './pages/Dashboard.jsx';

export default function App() {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  return (
    <>
      <header className="nav">
        <Link to="/" className="logo">🏠 HouseHunt</Link>
        <nav>
          <Link to="/">Browse</Link>
          {user ? (
            <>
              <Link to="/dashboard">Dashboard</Link>
              <span className="muted">Hi, {user.name.split(' ')[0]} ({user.role})</span>
              <button className="btn ghost" onClick={() => { logout(); nav('/'); }}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register" className="btn">Sign up</Link>
            </>
          )}
        </nav>
      </header>
      <main className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/property/:id" element={<PropertyDetail />} />
          <Route path="/login" element={<Auth mode="login" />} />
          <Route path="/register" element={<Auth mode="register" />} />
          <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" />} />
        </Routes>
      </main>
      <footer className="footer">© HouseHunt — Rent smarter.</footer>
    </>
  );
}
