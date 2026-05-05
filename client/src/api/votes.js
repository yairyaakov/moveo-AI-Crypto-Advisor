export async function submitVote({ section, itemId, value }) {
  const res = await fetch('/api/votes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify({ section, itemId, value }),
  });
  return res.json();
}
