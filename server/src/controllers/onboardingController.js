// Placeholder — will save preferences to DB once Prisma is connected

function savePreferences(req, res) {
  const { assets, investorType, contentTypes } = req.body;
  res.json({
    message: 'onboarding placeholder',
    saved: { assets, investorType, contentTypes },
    userId: req.user.id,
  });
}

module.exports = { savePreferences };
