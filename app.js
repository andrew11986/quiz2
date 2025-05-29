// European countries and capitals data
const countriesCapitals = [
  {"country": "Австрія", "capital": "Відень"},
  {"country": "Албанія", "capital": "Тирана"},
  {"country": "Андорра", "capital": "Андорра-ла-Велья"},
  {"country": "Бельгія", "capital": "Брюссель"},
  {"country": "Білорусь", "capital": "Мінськ"},
  {"country": "Болгарія", "capital": "Софія"},
  {"country": "Боснія і Герцеговина", "capital": "Сараєво"},
  {"country": "Ватикан", "capital": "Ватикан"},
  {"country": "Велика Британія", "capital": "Лондон"},
  {"country": "Греція", "capital": "Афіни"},
  {"country": "Данія", "capital": "Копенгаген"},
  {"country": "Естонія", "capital": "Таллінн"},
  {"country": "Ірландія", "capital": "Дублін"},
  {"country": "Ісландія", "capital": "Рейк'явік"},
  {"country": "Іспанія", "capital": "Мадрид"},
  {"country": "Італія", "capital": "Рим"},
  {"country": "Латвія", "capital": "Рига"},
  {"country": "Литва", "capital": "Вільнюс"},
  {"country": "Ліхтенштейн", "capital": "Вадуц"},
  {"country": "Люксембург", "capital": "Люксембург"},
  {"country": "Мальта", "capital": "Валлетта"},
  {"country": "Молдова", "capital": "Кишинів"},
  {"country": "Монако", "capital": "Монако"},
  {"country": "Нідерланди", "capital": "Амстердам"},
  {"country": "Німеччина", "capital": "Берлін"},
  {"country": "Норвегія", "capital": "Осло"},
  {"country": "Північна Македонія", "capital": "Скоп'є"},
  {"country": "Польща", "capital": "Варшава"},
  {"country": "Португалія", "capital": "Лісабон"},
  {"country": "Румунія", "capital": "Бухарест"},
  {"country": "Сан-Марино", "capital": "Сан-Марино"},
  {"country": "Сербія", "capital": "Белград"},
  {"country": "Словаччина", "capital": "Братислава"},
  {"country": "Словенія", "capital": "Любляна"},
  {"country": "Угорщина", "capital": "Будапешт"},
  {"country": "Україна", "capital": "Київ"},
  {"country": "Фінляндія", "capital": "Гельсінкі"},
  {"country": "Франція", "capital": "Париж"},
  {"country": "Хорватія", "capital": "Загреб"},
  {"country": "Чехія", "capital": "Прага"},
  {"country": "Чорногорія", "capital": "Подгориця"},
  {"country": "Швейцарія", "capital": "Берн"},
  {"country": "Швеція", "capital": "Стокгольм"}
];

// Game state
let currentQuestionIndex = 0;
let totalQuestions = 20;
let currentMoney = 0;
let usedQuestions = [];
let currentCorrectAnswer = 0;
let gameActive = false;

// DOM elements
const startScreen = document.getElementById('start-screen');
const gameScreen = document.getElementById('game-screen');
const resultScreen = document.getElementById('result-screen');
const startBtn = document.getElementById('start-btn');
const restartBtn = document.getElementById('restart-btn');
const progressEl = document.getElementById('progress');
const moneyEl = document.getElementById('money');
const questionText = document.getElementById('question-text');
const answerBtns = document.querySelectorAll('.answer-btn');
const answerFeedback = document.getElementById('answer-feedback');
const feedbackIcon = document.getElementById('feedback-icon');
const feedbackText = document.getElementById('feedback-text');
const resultIcon = document.getElementById('result-icon');
const resultTitle = document.getElementById('result-title');
const resultMessage = document.getElementById('result-message');
const resultMoney = document.getElementById('result-money');

// Utility functions
function shuffleArray(array) {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

function getRandomElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function formatMoney(amount) {
  return amount.toLocaleString('uk-UA') + ' грн';
}

// Question generation
function generateQuestion() {
  const availableQuestions = countriesCapitals.filter((_, index) => !usedQuestions.includes(index));
  
  if (availableQuestions.length < 3) {
    // Reset if we're running out of questions
    usedQuestions = [];
  }
  
  const questionType = Math.random() < 0.5 ? 'countryToCapital' : 'capitalToCountry';
  const correctItem = getRandomElement(availableQuestions);
  const correctIndex = countriesCapitals.indexOf(correctItem);
  
  usedQuestions.push(correctIndex);
  
  let question, correctAnswer, wrongAnswers;
  
  if (questionType === 'countryToCapital') {
    question = `Яка столиця ${correctItem.country}?`;
    correctAnswer = correctItem.capital;
    
    // Get wrong answers (other capitals)
    const otherCapitals = countriesCapitals
      .filter(item => item.capital !== correctAnswer)
      .map(item => item.capital);
    wrongAnswers = shuffleArray(otherCapitals).slice(0, 2);
  } else {
    question = `Столицею якої країни є ${correctItem.capital}?`;
    correctAnswer = correctItem.country;
    
    // Get wrong answers (other countries)
    const otherCountries = countriesCapitals
      .filter(item => item.country !== correctAnswer)
      .map(item => item.country);
    wrongAnswers = shuffleArray(otherCountries).slice(0, 2);
  }
  
  // Combine and shuffle answers
  const allAnswers = shuffleArray([correctAnswer, ...wrongAnswers]);
  const correctAnswerIndex = allAnswers.indexOf(correctAnswer);
  
  return {
    question,
    answers: allAnswers,
    correctIndex: correctAnswerIndex
  };
}

// Game flow functions
function startGame() {
  currentQuestionIndex = 0;
  currentMoney = 0;
  usedQuestions = [];
  gameActive = true;
  
  updateProgress();
  updateMoney();
  showScreen('game');
  nextQuestion();
}

function nextQuestion() {
  if (currentQuestionIndex >= totalQuestions) {
    endGame(true);
    return;
  }
  
  const questionData = generateQuestion();
  currentCorrectAnswer = questionData.correctIndex;
  
  questionText.textContent = questionData.question;
  
  answerBtns.forEach((btn, index) => {
    btn.textContent = questionData.answers[index];
    btn.className = 'answer-btn';
    btn.disabled = false;
  });
  
  updateProgress();
}

function selectAnswer(selectedIndex) {
  if (!gameActive) return;
  
  gameActive = false;
  const isCorrect = selectedIndex === currentCorrectAnswer;
  
  // Disable all buttons
  answerBtns.forEach(btn => btn.disabled = true);
  
  // Add visual feedback to buttons
  answerBtns.forEach((btn, index) => {
    if (index === currentCorrectAnswer) {
      btn.classList.add('correct');
    } else if (index === selectedIndex && !isCorrect) {
      btn.classList.add('incorrect');
    }
  });
  
  // Show feedback popup
  showAnswerFeedback(isCorrect);
  
  if (isCorrect) {
    currentMoney += 1000;
    updateMoney();
    currentQuestionIndex++;
    
    setTimeout(() => {
      gameActive = true;
      nextQuestion();
    }, 1500);
  } else {
    setTimeout(() => {
      endGame(false);
    }, 2000);
  }
}

function showAnswerFeedback(isCorrect) {
  answerFeedback.className = 'answer-feedback show ' + (isCorrect ? 'correct' : 'incorrect');
  feedbackIcon.textContent = isCorrect ? '✅' : '❌';
  feedbackText.textContent = isCorrect ? 'Правильно!' : 'Неправильно!';
  
  setTimeout(() => {
    answerFeedback.classList.remove('show');
  }, 1200);
}

function endGame(isWin) {
  gameActive = false;
  
  resultScreen.className = 'screen active ' + (isWin ? 'result-win' : 'result-lose');
  
  if (isWin) {
    resultIcon.textContent = '🏆';
    resultTitle.textContent = 'Перемога!';
    resultMessage.textContent = 'Вітаємо! Ви правильно відповіли на всі питання!';
    resultMoney.textContent = '💰 Ваш виграш: ' + formatMoney(currentMoney);
  } else {
    resultIcon.textContent = '😔';
    resultTitle.textContent = 'Ви програли!';
    resultMessage.textContent = 'Нічого страшного! Спробуйте ще раз і покращіть свій результат.';
    resultMoney.textContent = '💸 Ваш виграш: 0 грн';
  }
  
  showScreen('result');
}

function restartGame() {
  currentQuestionIndex = 0;
  currentMoney = 0;
  usedQuestions = [];
  gameActive = false;
  
  updateProgress();
  updateMoney();
  showScreen('start');
}

function showScreen(screenName) {
  const screens = [startScreen, gameScreen, resultScreen];
  screens.forEach(screen => screen.classList.remove('active'));
  
  setTimeout(() => {
    switch (screenName) {
      case 'start':
        startScreen.classList.add('active');
        break;
      case 'game':
        gameScreen.classList.add('active');
        break;
      case 'result':
        resultScreen.classList.add('active');
        break;
    }
  }, 150);
}

function updateProgress() {
  progressEl.textContent = gameActive ? `Питання ${currentQuestionIndex + 1} з ${totalQuestions}` : 'Натисніть "Почати гру"';
}

function updateMoney() {
  moneyEl.textContent = '💰 ' + formatMoney(currentMoney);
  
  // Add animation effect
  const moneyContainer = moneyEl.parentElement;
  moneyContainer.classList.add('updated');
  setTimeout(() => {
    moneyContainer.classList.remove('updated');
  }, 500);
}

// Event listeners
startBtn.addEventListener('click', startGame);
restartBtn.addEventListener('click', restartGame);

answerBtns.forEach((btn, index) => {
  btn.addEventListener('click', () => selectAnswer(index));
});

// Keyboard support
document.addEventListener('keydown', (e) => {
  if (!gameActive) return;
  
  if (e.key >= '1' && e.key <= '3') {
    const index = parseInt(e.key) - 1;
    selectAnswer(index);
  }
});

// Initialize
updateProgress();
updateMoney();