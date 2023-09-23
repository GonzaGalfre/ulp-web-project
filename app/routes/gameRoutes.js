// app/routes/gameRoutes.js
const express = require('express');
const gameController = require('../controllers/gameController');

const router = express.Router();

router.get('/start', gameController.startGame);
router.get('/question', gameController.getQuestion);
router.get('/question/:id', gameController.getQuestion);
router.post('/game/answer', gameController.checkAnswer);
router.get('/leaderboard', gameController.showLeaderboard);
router.get('/game/results', gameController.showResults);
router.post('/save-results', gameController.saveResults);
router.get('/', gameController.showLandingPage);


module.exports = router;
