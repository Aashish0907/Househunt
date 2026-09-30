import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api.js';

const AMENITIES = ['Parking', 'Gym', 'WiFi', 'Lift', 'AC', 'Garden', 'Security'];
const init = { q: '', city: '', type: '', minRent: '', maxRent: '', bedrooms: '', sort: '', amenity: [] };

export default function Home() {
  const [f, setF] = useState(init);
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  const search = async (filters = f) => {
    setLoading(true); setErr('');
    const p = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => { if (Array.isArray(v) ? v.length : v) p.set(k, Array.isArray(v) ? v.join(',') : v); });
    try { setList(await api(`/properties?${p}`)); } catch (e) { setErr(e.message); }
    setLoading(false);
  };
  useEffect(() => { search(); }, []);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const toggle = (a) => setF({ ...f, amenity: f.amenity.includes(a) ? f.amenity.filter((x) => x !== a) : [...f.amenity, a] });

  return (
    <>
      <section className="hero">
        <h1>Find your perfect rental home</h1>
        <p>Search verified listings by location, price and amenities.</p>
      </section>
      <form className="filters" onSubmit={(e) => { e.preventDefault(); search(); }}>
        <input placeholder="Search title / area" value={f.q} onChange={set('q')} />
        <input placeholder="City" value={f.city} onChange={set('city')} />
        <select value={f.type} onChange={set('type')}>
          <option value="">Any type</option>
          {['Apartment', 'House', 'Villa', 'Studio', 'PG'].map((t) => <option key={t}>{t}</option>)}
        </select>
        <input type="number" placeholder="Min rent" value={f.minRent} onChange={set('minRent')} />
        <input type="number" placeholder="Max rent" value={f.maxRent} onChange={set('maxRent')} />
        <select value={f.bedrooms} onChange={set('bedrooms')}>
          <option value="">Any BHK</option>
          {[1, 2, 3, 4].map((n) => <option key={n} value={n}>{n}+ BHK</option>)}
        </select>
        <select value={f.sort} onChange={set('sort')}>
          <option value="">Newest</option><option value="low">Rent: low to high</option><option value="high">Rent: high to low</option>
        </select>
        <div className="chips">
          {AMENITIES.map((a) => (
            <label key={a} className={f.amenity.includes(a) ? 'chip on' : 'chip'}>
              <input type="checkbox" hidden checked={f.amenity.includes(a)} onChange={() => toggle(a)} />{a}
            </label>
          ))}
        </div>
        <button className="btn">Search</button>
        <button type="button" className="btn ghost" onClick={() => { setF(init); search(init); }}>Reset</button>
      </form>

      {err && <p className="error">{err}</p>}
      {loading ? <p>Loading…</p> : list.length === 0 ? <p className="muted">No properties match your search.</p> : (
        <div className="grid">
          {list.map((p) => (
            <Link to={`/property/${p._id}`} key={p._id} className="card">
              <img src={p.imageUrl || 'https://placehold.co/800x500?text=HouseHunt'} alt={p.title} />
              <div className="card-body">
                <h3>{p.title}</h3>
                <p className="muted">📍 {p.city}{p.address ? `, ${p.address}` : ''}</p>
                <p className="price">₹{p.rent.toLocaleString('en-IN')}<small>/month</small></p>
                <p className="muted">{p.bedrooms} BHK · {p.type}{p.areaSqft ? ` · ${p.areaSqft} sqft` : ''}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
