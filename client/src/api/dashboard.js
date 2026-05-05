export async function getDashboard() {
  const res = await fetch('/api/dashboard', {
    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
  });
  return res.json();
}
