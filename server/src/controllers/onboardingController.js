const prisma = require('../config/prisma');

async function savePreferences(req, res) {
  const { assets, investorType, contentTypes } = req.body;

  if (!assets || !investorType || !contentTypes) {
    return res.status(400).json({ error: 'assets, investorType, and contentTypes are required' });
  }

  if (!Array.isArray(assets) || !Array.isArray(contentTypes)) {
    return res.status(400).json({ error: 'assets and contentTypes must be arrays' });
  }

  const userId = req.user.id;

  const preference = await prisma.preference.upsert({
    where: { userId },
    update: {
      assets: JSON.stringify(assets),
      investorType,
      contentTypes: JSON.stringify(contentTypes),
    },
    create: {
      userId,
      assets: JSON.stringify(assets),
      investorType,
      contentTypes: JSON.stringify(contentTypes),
    },
  });

  await prisma.user.update({
    where: { id: userId },
    data: { hasCompletedOnboarding: true },
  });

  res.json({
    preference: {
      ...preference,
      assets: JSON.parse(preference.assets),
      contentTypes: JSON.parse(preference.contentTypes),
    },
    hasCompletedOnboarding: true,
  });
}

module.exports = { savePreferences };
