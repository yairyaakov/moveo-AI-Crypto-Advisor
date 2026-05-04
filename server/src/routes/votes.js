const express = require('express');
const router = express.Router();
const votesController = require('../controllers/votesController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, votesController.submitVote);

module.exports = router;
