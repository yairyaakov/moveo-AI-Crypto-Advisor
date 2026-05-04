const express = require('express');
const router = express.Router();
const onboardingController = require('../controllers/onboardingController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, onboardingController.savePreferences);

module.exports = router;
