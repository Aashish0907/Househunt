import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../api.js';
import { useAuth } from '../AuthContext.jsx';

export default function PropertyDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [p, setP] = useState(null);
  const [form, setForm] = useState({ message: '', moveInDate: '' });
  const [msg, setMsg] = useState({ text: '', ok: true });

  useEffect(() => { api(`/properties/${id}`).then(setP).catch((e) => setMsg({ text: e.message, ok: false })); }, [id]);

  const submit = async (e) => {
    e.preventDefault();
    try {
      await api('/bookings', { method: 'POST', body: { propertyId: id, ...form } });
      setMsg({ text: 'Request sent! The owner will contact you.', ok: true });
    } catch (er) { setMsg({ text: er.message, ok: false }); }
  };

  if (!p) return <p>{msg.text || 'Loading…'}</p>;
  return (
    <div className="detail">
      <img className="hero-img" src={p.imageUrl || 'https://placehold.co/1000x500?text=HouseHunt'} alt={p.title} />
      <div className="detail-grid">
        <div>
          <h1>{p.title}</h1>
          <p className="muted">📍 {p.city}{p.address ? `, ${p.address}` : ''}</p>
          <p className="price big">₹{p.rent.toLocaleString('en-IN')}<small>/month</small></p>
          <p>Deposit: ₹{(p.deposit || 0).toLocaleString('en-IN')} · {p.bedrooms} BHK · {p.type}{p.areaSqft ? ` · ${p.areaSqft} sqft` : ''}</p>
          <p>{p.description}</p>
          <div className="chips">{p.amenities.map((a) => <span className="chip on" key={a}>{a}</span>)}</div>
          {p.tourUrl && <p><a className="btn" href={p.tourUrl} target="_blank" rel="noreferrer">▶ Virtual tour</a></p>}
        </div>
        <aside className="panel">
          <h3>Owner</h3>
          <p>{p.owner?.name}<br />{user ? <>📞 {p.owner?.phone}<br />✉️ {p.owner?.email}</> : <Link to="/login">Login to see contact</Link>}</p>
          {user?.role === 'renter' && (
            <form onSubmit={submit}>
              <h3>Request this home</h3>
              <label>Move-in date<input type="date" required value={form.moveInDate} onChange={(e) => setForm({ ...form, moveInDate: e.target.value })} /></label>
              <label>Message<textarea rows="3" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} /></label>
              <button className="btn">Send request</button>
            </form>
          )}
          {user?.role === 'owner' && <p className="muted">Login as a renter to send requests.</p>}
          {msg.text && <p className={msg.ok ? 'ok' : 'error'}>{msg.text}</p>}
        </aside>
      </div>
    </div>
  );
}
