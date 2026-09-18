// Quiz questions
const questions = [
    {
        question: "What is the capital of France?",
        options: ["Berlin", "Madrid", "Paris", "Rome"],
        correctAnswer: 2
    },
    {
        question: "What is the chemical symbol for water?",
        options: ["O2", "H2O", "CO2", "NaCl"],
        correctAnswer: 1
    },
    {
        question: "In which year did World War II end?",
        options: ["1943", "1944", "1945", "1946"],
        correctAnswer: 2
    },
    {
        question: "Which is the largest ocean on Earth?",
        options: ["Atlantic Ocean", "Indian Ocean", "Arctic Ocean", "Pacific Ocean"],
        correctAnswer: 3
    },
    {
        question: "What planet is known as the Red Planet?",
        options: ["Venus", "Mars", "Jupiter", "Saturn"],
        correctAnswer: 1
    },
    {
        question: "Who is known as the father of computers?",
        options: ["Alan Turing", "Charles Babbage", "Bill Gates", "Steve Jobs"],
        correctAnswer: 1
    },
    {
        question: "What is the national animal of India?",
        options: ["Lion", "Tiger", "Elephant", "Leopard"],
        correctAnswer: 1
    },
    {
        question: "How many continents are there on Earth?",
        options: ["5", "6", "7", "8"],
        correctAnswer: 2
    },
    {
        question: "What is the speed of light approximately?",
        options: ["300,000 km/s", "150,000 km/s", "500,000 km/s", "100,000 km/s"],
        correctAnswer: 0
    },
    {
        question: "Which country has the largest population?",
        options: ["United States", "India", "China", "Indonesia"],
        correctAnswer: 2
    }
];

// Quiz state
let currentQuestions = [];
let currentQuestionIndex = 0;
let score = 0;
let correctAnswers = 0;
let incorrectAnswers = 0;
let answerSelected = false;

// DOM Elements
const welcomeScreen = document.getElementById('welcomeScreen');
const quizScreen = document.getElementById('quizScreen');
const resultScreen = document.getElementById('resultScreen');
const questionCounter = document.getElementById('questionCounter');
const scoreDisplay = document.getElementById('score');
const progress = document.getElementById('progress');
const questionText = document.getElementById('question');
const optionsContainer = document.getElementById('options');
const nextBtn = document.getElementById('nextBtn');

// Shuffle array
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// Start quiz
function startQuiz() {
    currentQuestions = shuffleArray(questions);
    currentQuestionIndex = 0;
    score = 0;
    correctAnswers = 0;
    incorrectAnswers = 0;

    welcomeScreen.classList.remove('active');
    quizScreen.classList.add('active');

    displayQuestion();
}

// Display current question
function displayQuestion() {
    if (currentQuestionIndex >= currentQuestions.length) {
        showResults();
        return;
    }

    const question = currentQuestions[currentQuestionIndex];
    answerSelected = false;

    // Update counter
    questionCounter.textContent = `Question ${currentQuestionIndex + 1} of ${currentQuestions.length}`;

    // Update score
    scoreDisplay.textContent = `Score: ${score}`;

    // Update progress
    const progressPercent = (currentQuestionIndex / currentQuestions.length) * 100;
    progress.style.width = `${progressPercent}%`;

    // Set question
    questionText.textContent = question.question;

    // Create options
    optionsContainer.innerHTML = '';
    question.options.forEach((option, index) => {
        const optionBtn = document.createElement('button');
        optionBtn.className = 'option-btn';
        optionBtn.textContent = option;
        optionBtn.onclick = () => selectAnswer(index);
        optionsContainer.appendChild(optionBtn);
    });

    // Reset next button
    nextBtn.textContent = currentQuestionIndex === currentQuestions.length - 1 ? 'FINISH' : 'NEXT';
}

// Select answer
function selectAnswer(selectedIndex) {
    if (answerSelected) return;

    answerSelected = true;
    const question = currentQuestions[currentQuestionIndex];
    const options = optionsContainer.querySelectorAll('.option-btn');

    // Disable all options
    options.forEach(opt => opt.disabled = true);

    // Check if correct
    if (selectedIndex === question.correctAnswer) {
        score += 10;
        correctAnswers++;
        options[selectedIndex].classList.add('correct');
        showToast('Correct!', 'success');
    } else {
        incorrectAnswers++;
        options[selectedIndex].classList.add('incorrect');
        options[question.correctAnswer].classList.add('correct');
        showToast('Incorrect!', 'error');
    }

    // Update score
    scoreDisplay.textContent = `Score: ${score}`;
}

// Handle next button
function handleNext() {
    if (!answerSelected) {
        showToast('Please select an answer', 'warning');
        return;
    }

    currentQuestionIndex++;
    displayQuestion();
}

// Show results
function showResults() {
    quizScreen.classList.remove('active');
    resultScreen.classList.add('active');

    const totalQuestions = currentQuestions.length;
    const percentage = Math.round((correctAnswers / totalQuestions) * 100);

    document.getElementById('totalQuestions').textContent = `Total Questions: ${totalQuestions}`;
    document.getElementById('correctAnswers').textContent = `Correct Answers: ${correctAnswers}`;
    document.getElementById('incorrectAnswers').textContent = `Incorrect Answers: ${incorrectAnswers}`;
    document.getElementById('scorePercentage').textContent = `Score: ${percentage}%`;
}

// Restart quiz
function restartQuiz() {
    resultScreen.classList.remove('active');
    startQuiz();
}

// Exit quiz
function exitQuiz() {
    resultScreen.classList.remove('active');
    welcomeScreen.classList.add('active');
}

// Show toast message
function showToast(message, type) {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        bottom: 30px;
        left: 50%;
        transform: translateX(-50%);
        padding: 12px 24px;
        border-radius: 8px;
        color: white;
        font-weight: bold;
        z-index: 1000;
        animation: fadeInOut 2s forwards;
    `;

    if (type === 'success') toast.style.background = '#4CAF50';
    else if (type === 'error') toast.style.background = '#f44336';
    else toast.style.background = '#ff9800';

    document.body.appendChild(toast);

    setTimeout(() => toast.remove(), 2000);
}

// Add toast animation
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInOut {
        0% { opacity: 0; transform: translate(-50%, 20px); }
        15% { opacity: 1; transform: translate(-50%, 0); }
        85% { opacity: 1; transform: translate(-50%, 0); }
        100% { opacity: 0; transform: translate(-50%, -20px); }
    }
`;
document.head.appendChild(style);
