const axios = require('axios');
const fs = require('fs');
const { startGameLogic } = require('../utils/gameLogic');

exports.startGame = async (req, res) => {
  const questions = await startGameLogic();
  req.session.startTime = Date.now();
  req.session.questions = questions;
  req.session.results = [];

  res.redirect('/game/question/1');
};

exports.showResults = (req, res) => {
  const endTime = Date.now();
  const timeTaken = Math.floor((endTime - req.session.startTime) / 1000); 

  if (req.session.results) {
    const correctAnswers = req.session.results.filter(result => result).length;
    res.render('results', { score: correctAnswers, timeTaken });
  } else {
    res.render('results', { score: 0, timeTaken });
  }
};

exports.checkAnswer = (req, res) => {
  const userAnswer = req.body.answer;
  const questionId = req.body.questionId;
  const correctAnswer = req.session.questions[questionId - 1].correctAnswer;

  let isCorrect = false;

  if (Array.isArray(correctAnswer)) {
    isCorrect = correctAnswer.includes(userAnswer);
  } else {
    isCorrect = userAnswer === correctAnswer;
  }
 
  req.session.results = req.session.results || [];
  req.session.results.push(isCorrect);

  if (isCorrect) {
    res.json({ correctAnswer });
  } else {
    res.json({ correctAnswer });
  }

};

exports.showLeaderboard = (req, res) => {
  fs.readFile('app/data/results.json', 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading the file:', err);
      return res.status(500).send('Internal Server Error');
    }

    let results = JSON.parse(data || '[]');

    results.sort((a, b) => b.score - a.score || a.timeTaken - b.timeTaken);

    const top20 = results.slice(0, 20);

    res.render('leaderboard', { leaderboard: top20 });
  });
};


exports.showLandingPage = (req, res) => {
  res.render('landing');
};

exports.getQuestion = (req, res) => {
  const questionId = req.params.id;
  const question = req.session.questions[questionId - 1];

  if (!question) {
    return res.status(404).send('Question not found');
  }

  const questionType = question.question.includes('capital') ? 'capital' : 'flag';
  
  const flagUrl = questionType === 'flag' ? question.flagUrl : null;

  res.render('question', {
    question: question.question,
    options: question.options,
    questionId,
    questionType,  
    flagUrl      
  });
};


exports.saveResults = (req, res) => {
  const { score, timeTaken, playerName } = req.body;  

  fs.readFile('app/data/results.json', 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading the file:', err);
      return res.json({ success: false });
    }

    const results = JSON.parse(data || '[]');

    results.push({ score, timeTaken, playerName });  

    fs.writeFile('app/data/results.json', JSON.stringify(results, null, 2), (err) => {
      if (err) {
        console.error('Error writing file:', err);
      }
    });

    res.json({ success: true });
  });
};




