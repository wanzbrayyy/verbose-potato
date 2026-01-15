import { atom } from 'nanostores';

export const  = atom(null);
export const  = atom(null);

export function setUser(userData) {
  .set(userData);
  if (typeof window !== 'undefined') {
    localStorage.setItem('user', JSON.stringify(userData));
  }
}

export function logout() {
  .set(null);
  if (typeof window !== 'undefined') {
    localStorage.removeItem('user');
    window.location.href = '/auth/login';
  }
}

export function initUser() {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('user');
    if (stored) .set(JSON.parse(stored));
  }
}
