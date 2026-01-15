import { atom } from 'nanostores';

export const userStore = atom(null);
export const scanResult = atom(null);

export function setUser(userData) {
  userStore.set(userData);
  if (typeof window !== 'undefined') {
    localStorage.setItem('user', JSON.stringify(userData));
  }
}

export function logout() {
  userStore.set(null);
  if (typeof window !== 'undefined') {
    localStorage.removeItem('user');
    window.location.href = '/auth/login';
  }
}

export function initUser() {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('user');
    if (stored) userStore.set(JSON.parse(stored));
  }
}
