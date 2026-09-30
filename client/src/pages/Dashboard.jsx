import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api.js';
import { useAuth } from '../AuthContext.jsx';

const blank = { title: '', description: '', city: '', address: '', type: 'Apartment', rent: '', deposit: '', bedrooms: 1, areaSqft: '', amenities: '', imageUrl: '', tourUrl: '' };

export default function Dashboard() {
  const { user } = useAuth();
  return user.role === 'owner' ? <Owner /> : <Renter />;
}

function Renter() {
  const [list, setList] = useState([]);
  useEffect(() => { api('/bookings/mine').then(setList); }, []);
  return (
    <>
      <h2>My rental requests</h2>
      {list.length === 0 && <p className="muted">No requests yet. <Link to="/">Browse homes</Link></p>}
      {list.map((b) => (
        <div className="row" key={b._id}>
          <div><b>{b.property?.title}</b> — {b.property?.city}<br /><span className="muted">Owner: {b.owner?.name} · {b.owner?.phone}</span></div>
          <span className={`badge ${b.status}`}>{b.status}</span>
        </div>
      ))}
    </>
  );
}

function Owner() {
  const [props, setProps] = useState([]);
  const [reqs, setReqs] = useState([]);
  const [f, setF] = useState(blank);
  const [err, setErr] = useState('');
  const load = () => { api('/properties/mine/list').then(setProps); api('/bookings/received').then(setReqs); };
  useEffect(load, []);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const add = async (e) => {
    e.preventDefault(); setErr('');
    try {
      await api('/properties', { method: 'POST', body: { ...f, rent: +f.rent, deposit: +f.deposit || 0, bedrooms: +f.bedrooms, areaSqft: +f.areaSqft || undefined } });
      setF(blank); load();
    } catch (er) { setErr(er.message); }
  };
  const del = async (id) => { if (confirm('Delete this listing?')) { await api(`/properties/${id}`, { method: 'DELETE' }); load(); } };
  const decide = async (id, status) => { await api(`/bookings/${id}`, { method: 'PATCH', body: { status } }); load(); };

  return (
    <>
      <h2>Requests received</h2>
      {reqs.length === 0 && <p className="muted">No requests yet.</p>}
      {reqs.map((b) => (
        <div className="row" key={b._id}>
          <div>
            <b>{b.property?.title}</b><br />
            {b.renter?.name} · {b.renter?.phone} · {b.renter?.email}<br />
            <span className="muted">Move-in: {b.moveInDate ? new Date(b.moveInDate).toLocaleDateString() : '—'} · "{b.message}"</span>
          </div>
          {b.status === 'pending' ? (
            <div><button className="btn" onClick={() => decide(b._id, 'approved')}>Approve</button> <button className="btn ghost" onClick={() => decide(b._id, 'rejected')}>Reject</button></div>
          ) : <span className={`badge ${b.status}`}>{b.status}</span>}
        </div>
      ))}

      <h2>My listings</h2>
      {props.map((p) => (
        <div className="row" key={p._id}>
          <div><Link to={`/property/${p._id}`}><b>{p.title}</b></Link> — {p.city} · ₹{p.rent.toLocaleString('en-IN')} · {p.available ? 'Available' : 'Rented'}</div>
          <button className="btn ghost" onClick={() => del(p._id)}>Delete</button>
        </div>
      ))}

      <h2>Add a property</h2>
      <form className="panel form-grid" onSubmit={add}>
        <label>Title<input required value={f.title} onChange={set('title')} /></label>
        <label>City<input required value={f.city} onChange={set('city')} /></label>
        <label>Address / area<input value={f.address} onChange={set('address')} /></label>
        <label>Type<select value={f.type} onChange={set('type')}>{['Apartment', 'House', 'Villa', 'Studio', 'PG'].map((t) => <option key={t}>{t}</option>)}</select></label>
        <label>Monthly rent (₹)<input type="number" required value={f.rent} onChange={set('rent')} /></label>
        <label>Deposit (₹)<input type="number" value={f.deposit} onChange={set('deposit')} /></label>
        <label>Bedrooms<input type="number" min="1" value={f.bedrooms} onChange={set('bedrooms')} /></label>
        <label>Area (sqft)<input type="number" value={f.areaSqft} onChange={set('areaSqft')} /></label>
        <label>Amenities (comma separated)<input placeholder="Parking, Gym, WiFi" value={f.amenities} onChange={set('amenities')} /></label>
        <label>Image URL<input value={f.imageUrl} onChange={set('imageUrl')} /></label>
        <label>Virtual tour URL<input value={f.tourUrl} onChange={set('tourUrl')} /></label>
        <label className="full">Description<textarea rows="3" value={f.description} onChange={set('description')} /></label>
        {err && <p className="error full">{err}</p>}
        <button className="btn full">Publish listing</button>
      </form>
    </>
  );
}
