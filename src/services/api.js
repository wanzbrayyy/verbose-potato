export const API_URL = 'https://warkop-tc25.vercel.app/api';

export const api = {
  async register(nama, email, password) {
    const res = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nama, email, password }),
    });
    return res.json();
  },

  async login(email, password) {
    const res = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return res.json();
  },

  async scan(imageBlob) {
    const formData = new FormData();
    formData.append('image', imageBlob, 'capture.jpg');

    const res = await fetch(`${API_URL}/scan`, {
      method: 'POST',
      body: formData,
    });
    return res.json();
  }
};
