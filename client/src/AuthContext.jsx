import { createContext, useContext, useState } from 'react';
const Ctx = createContext();
export const useAuth = () => useContext(Ctx);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('hh_user') || 'null'));
  const login = ({ token, user }) => {
    localStorage.setItem('hh_token', token);
    localStorage.setItem('hh_user', JSON.stringify(user));
    setUser(user);
  };
  const logout = () => { localStorage.removeItem('hh_token'); localStorage.removeItem('hh_user'); setUser(null); };
  return <Ctx.Provider value={{ user, login, logout }}>{children}</Ctx.Provider>;
}
