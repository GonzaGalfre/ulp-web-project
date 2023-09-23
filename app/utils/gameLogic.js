const axios = require('axios');


const fetchCountries = async () => {
  try {
    const response = await axios.get('https://restcountries.com/v3.1/all');
    return response.data;
  } catch (error) {
    console.error('Error fetching countries:', error);
    return [];
  }
};

const generateQuestion = (countries) => {
  let randomIndex = Math.floor(Math.random() * countries.length);
  let correctCountry = countries[randomIndex];

  // Skip Macau
  while (correctCountry.name === 'Macau') {
    randomIndex = Math.floor(Math.random() * countries.length);
    correctCountry = countries[randomIndex];
  }
  const wrongOptions = [];
  while (wrongOptions.length < 3) {
    const randomWrongIndex = Math.floor(Math.random() * countries.length);
    const wrongCountry = countries[randomWrongIndex];
    if (wrongCountry.cca3 !== correctCountry.cca3 && !wrongOptions.includes(wrongCountry)) {
      wrongOptions.push(wrongCountry);
    }
  }

  const questionType = Math.random() > 0.5 ? 'capital' : 'flag';

  let question = '';
  let options = [];

  if (questionType === 'capital') {
    question = `¿Cuál es la capital de ${correctCountry.name.common}?`;
    options = [correctCountry.capital, ...wrongOptions.map(opt => opt.capital)];
  } else {
    question = `¿De qué país es esta bandera? <br><br> <img src="${correctCountry.flags.png}">`;//as
    options = [correctCountry.name.common, ...wrongOptions.map(opt => opt.name.common)];
  }

  options = options.sort(() => Math.random() - 0.5);

  return {
    question,
    options,
    correctAnswer: questionType === 'capital' ? correctCountry.capital : correctCountry.name.common
  };
};

const startGameLogic = async () => {
  const countries = await fetchCountries();
  const questions = [];

  for (let i = 0; i < 10; i++) {
    const question = generateQuestion(countries);
    questions.push(question);
  }
  return questions;
};

module.exports = {
    startGameLogic,
  };
  