// Placeholder — will persist vote to DB once Prisma is connected

function submitVote(req, res) {
  const { section, itemId, value } = req.body;
  res.json({
    message: 'vote placeholder',
    recorded: { section, itemId, value, userId: req.user.id },
  });
}

module.exports = { submitVote };
