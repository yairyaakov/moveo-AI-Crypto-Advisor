// Placeholder — will use Prisma + bcrypt once DB is connected

function signup(req, res) {
  const { name, email, password } = req.body;
  res.status(201).json({ message: 'signup placeholder', user: { name, email } });
}

function login(req, res) {
  const { email } = req.body;
  // Will verify password and return a real JWT once DB is connected
  res.json({ message: 'login placeholder', token: 'placeholder-jwt', user: { email } });
}

function me(req, res) {
  // req.user is set by authMiddleware after decoding the JWT
  res.json({ message: 'me placeholder', user: req.user });
}

module.exports = { signup, login, me };
