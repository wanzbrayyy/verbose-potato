import { atom } from 'nanostores';

export const userStore = atom(null);
export const scanResult = atom(null);
export const dashboardData = atom({
  totalRevenue: 0,
  totalExpenses: 0,
  netIncome: 0,
  transactionCount: 0,
});

export function setUser(userData) {
  userStore.set(userData);
  if (typeof window !== 'undefined') localStorage.setItem('user', JSON.stringify(userData));
}

export function setScanResult(data) {
  scanResult.set(data);
  if (typeof window !== 'undefined') sessionStorage.setItem('scanResult', JSON.stringify(data));
}

export function logout() {
  userStore.set(null);
  scanResult.set(null);
  if (typeof window !== 'undefined') {
    localStorage.removeItem('user');
    sessionStorage.removeItem('scanResult');
    window.location.href = '/auth/login';
  }
}

export function initStores() {
  if (typeof window !== 'undefined') {
    const storedUser = localStorage.getItem('user');
    if (storedUser) userStore.set(JSON.parse(storedUser));

    const storedScan = sessionStorage.getItem('scanResult');
    if (storedScan) scanResult.set(JSON.parse(storedScan));
  }
}
