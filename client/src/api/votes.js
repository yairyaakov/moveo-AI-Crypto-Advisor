const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export async function submitVote({ section, itemId, value }) {
  const res = await fetch(`${API_URL}/api/votes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify({ section, itemId, value }),
  });
  return res.json();
}
