export async function savePreferences({ assets, investorType, contentTypes }) {
  const res = await fetch('/api/onboarding', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify({ assets, investorType, contentTypes }),
  });
  return res.json();
}
