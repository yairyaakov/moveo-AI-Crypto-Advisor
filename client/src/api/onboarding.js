const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export async function savePreferences({ assets, investorType, contentTypes }) {
  const res = await fetch(`${API_URL}/api/onboarding`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify({ assets, investorType, contentTypes }),
  });
  return res.json();
}
