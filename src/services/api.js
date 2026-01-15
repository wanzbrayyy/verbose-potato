export const API_URL = 'https://warkop-tc25.vercel.app/api';

const _getAuthHeaders = () => {
    if (typeof window === 'undefined') return {};
    const token = localStorage.getItem('token');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
};

const _handleResponse = async (res) => {
    if (res.status === 401) {
        if (typeof window !== 'undefined') {
            localStorage.clear();
            window.location.href = '/auth/login';
        }
        return { success: false, error: 'Sesi habis, silakan login ulang.' };
    }
    return res.json();
};

export const api = {
  async register(nama, email, password) {
    const res = await fetch(`${API_URL}/register`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ nama, email, password }) });
    return _handleResponse(res);
  },

  async login(email, password) {
    const res = await fetch(`${API_URL}/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) });
    return _handleResponse(res);
  },

  async scan(imageBlob) {
    const formData = new FormData();
    formData.append('image', imageBlob, 'capture.jpg');
    const res = await fetch(`${API_URL}/scan`, { 
        method: 'POST', 
        headers: { ..._getAuthHeaders() },
        body: formData 
    });
    return _handleResponse(res);
  },

  async getDashboard() {
    const res = await fetch(`${API_URL}/dashboard`, {
        headers: { ..._getAuthHeaders() }
    });
    return _handleResponse(res);
  },

  async addExpense(description, amount) {
    const res = await fetch(`${API_URL}/expense`, { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json', ..._getAuthHeaders() }, 
        body: JSON.stringify({ description, amount }) 
    });
    return _handleResponse(res);
  }
};
