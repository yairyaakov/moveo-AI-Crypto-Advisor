const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export async function getDashboard() {
  const res = await fetch(`${API_URL}/api/dashboard`, {
    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
  });
  return res.json();
}
