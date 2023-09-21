const axios = require('axios');

// Function to fetch all countries from the RestCountries API
const fetchCountries = async () => {
  try {
    const response = await axios.get('https://restcountries.com/v3.1/all');
    return response.data;
  } catch (error) {
    console.error('Error fetching countries:', error);
    return [];
  }
};

// Function to generate a random question
const generateQuestion = (countries) => {
  const randomIndex = Math.floor(Math.random() * countries.length);
  const correctCountry = countries[randomIndex];
  //console.log('Correct country object:', correctCountry);


  // Generate 3 random wrong options
  const wrongOptions = [];
  while (wrongOptions.length < 3) {
    const randomWrongIndex = Math.floor(Math.random() * countries.length);
    const wrongCountry = countries[randomWrongIndex];
    if (wrongCountry.cca3 !== correctCountry.cca3 && !wrongOptions.includes(wrongCountry)) {
      wrongOptions.push(wrongCountry);
    }
  }

  // Decide question type (capital or flag)
  const questionType = Math.random() > 0.5 ? 'capital' : 'flag';

  let question = '';
  let options = [];

  if (questionType === 'capital') {
    question = `What is the capital of ${correctCountry.name.common}?`;
    options = [correctCountry.capital, ...wrongOptions.map(opt => opt.capital)];
  } else {
    question = `Which country does this flag belong to? <img src="${correctCountry.flags.png}" alt="Flag">`;//as
    options = [correctCountry.name.common, ...wrongOptions.map(opt => opt.name.common)];
  }

  // Shuffle options
  options = options.sort(() => Math.random() - 0.5);

  return {
    question,
    options,
    correctAnswer: questionType === 'capital' ? correctCountry.capital : correctCountry.name.common
  };
};

// Example usage
const startGameLogic = async () => {
  const countries = await fetchCountries();
  const questions = [];

  for (let i = 0; i < 10; i++) {
    const question = generateQuestion(countries);
    questions.push(question);
  }
//a
  //console.log(questions);
  return questions;
};

module.exports = {
    startGameLogic,
  };
  