const axios = require('axios');
const fs = require('fs');
const { startGameLogic } = require('../utils/gameLogic');

exports.startGame = async (req, res) => {
  const questions = await startGameLogic();
  req.session.startTime = Date.now();
  req.session.questions = questions;
 // console.log('Questions in session:', questions);

  res.redirect('/game/question/1');
};

exports.showResults = (req, res) => {
  const endTime = Date.now();
  const timeTaken = Math.floor((endTime - req.session.startTime) / 1000); // en segundos

  // Comprobar si req.session.results existe
  if (req.session.results) {
    const correctAnswers = req.session.results.filter(result => result).length;
    res.render('results', { score: correctAnswers, timeTaken });
  } else {
    // Manejar el caso en que req.session.results es undefined
    res.render('results', { score: 0, timeTaken });
  }
};

exports.checkAnswer = (req, res) => {
  const userAnswer = req.body.answer;
  const questionId = req.body.questionId;
  const correctAnswer = req.session.questions[questionId - 1].correctAnswer;

  // Comprobar si la respuesta es correcta

  let isCorrect = false;

  if (Array.isArray(correctAnswer)) {
    isCorrect = correctAnswer.includes(userAnswer);
  } else {
    isCorrect = userAnswer === correctAnswer;
  }

  console.log("user answer:", userAnswer);
  console.log("correct answer: ", correctAnswer);
  // Guardar el resultado en la sesión
  req.session.results = req.session.results || [];
  req.session.results.push(isCorrect);

  // Devolver una respuesta JSON
  if (isCorrect) {
    res.json({ message: 'Respuesta correcta' });
  } else {
    res.json({ message: `Incorrecto, la verdadera respuesta era ${correctAnswer}` });
  }
};

exports.showLeaderboard = (req, res) => {
  // Leer los resultados existentes del archivo JSON
  fs.readFile('app/data/results.json', 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading the file:', err);
      return res.status(500).send('Internal Server Error');
    }

    let results = JSON.parse(data || '[]');

    // Ordenar los resultados por puntuación y tiempo
    results.sort((a, b) => b.score - a.score || a.timeTaken - b.timeTaken);

    // Tomar los primeros 20 resultados
    const top20 = results.slice(0, 20);

    // Renderizar la vista de la tabla de puntuaciones más altas
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

  // Determinar el tipo de pregunta (capital o bandera)
  const questionType = question.question.includes('capital') ? 'capital' : 'flag';
  
  // Obtener la URL de la bandera si es necesario
  const flagUrl = questionType === 'flag' ? question.flagUrl : null;

  res.render('question', {
    question: question.question,
    options: question.options,
    questionId,
    questionType,  // Pasar el tipo de pregunta
    flagUrl      // Pasar la URL de la bander
  });
};


exports.saveResults = (req, res) => {
  const { score, timeTaken, playerName } = req.body;  // Incluir playerName

  // Leer los resultados existentes del archivo JSON
  fs.readFile('app/data/results.json', 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading the file:', err);
      return res.json({ success: false });
    }

    const results = JSON.parse(data || '[]');

    // Añadir nuevo resultado
    results.push({ score, timeTaken, playerName });  // Incluir playerName

    // Escribir los resultados actualizados de nuevo en el archivo JSON
    fs.writeFile('app/data/results.json', JSON.stringify(results, null, 2), (err) => {
      if (err) {
        console.error('Error writing file:', err);
      }
    });

    res.json({ success: true });
  });
};




