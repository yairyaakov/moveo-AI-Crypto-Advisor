const prisma = require('../config/prisma');

const VALID_SECTIONS = ['news', 'prices', 'aiInsight', 'meme'];

async function submitVote(req, res) {
  const { section, itemId, value } = req.body;

  if (!section || !itemId || value === undefined) {
    return res.status(400).json({ error: 'section, itemId, and value are required' });
  }

  if (!VALID_SECTIONS.includes(section)) {
    return res.status(400).json({ error: `section must be one of: ${VALID_SECTIONS.join(', ')}` });
  }

  if (value !== 1 && value !== -1) {
    return res.status(400).json({ error: 'value must be 1 (thumbs up) or -1 (thumbs down)' });
  }

  const userId = req.user.id;

  const vote = await prisma.vote.upsert({
    where: { userId_section_itemId: { userId, section, itemId } },
    update: { value },
    create: { userId, section, itemId, value },
  });

  res.json({ vote });
}

module.exports = { submitVote };
