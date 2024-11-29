
let currentQuestion = 0;
let score = 0;
let questions = [];
let timer;
let timeLimit = 15;

document.getElementById('startButton').addEventListener('click', startQuiz);
document.getElementById('submitAnswer').addEventListener('click', checkAnswer);
document.getElementById('answerInput').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        checkAnswer();
    }
});

function startQuiz() {
    currentQuestion = 0;
    score = 0;
    questions = generateQuestions();
    document.querySelector('.settings').style.display = 'none';
    showQuestion();
}

function generateQuestions() {
    const difficulty = document.getElementById('difficulty').value;
    const allowNegative = document.getElementById('negative').checked;
    const allowDecimal = document.getElementById('decimal').checked;
    const useMultiplication = document.getElementById('multiplication').checked;
    const useAddition = document.getElementById('addition').checked;
    const useSubtraction = document.getElementById('subtraction').checked;

    if (!useAddition && !useSubtraction && !useMultiplication) {
        alert("Выберите как минимум одно действие!");
        return [];
    }

    const questions = [];
    for (let i = 0; i < 20; i++) {
        questions.push(generateQuestion(difficulty, allowNegative, allowDecimal, useAddition, useSubtraction, useMultiplication));
    }
    return questions;
}

function generateQuestion(difficulty, allowNegative, allowDecimal, useAddition, useSubtraction, useMultiplication) {
    let num1, num2, operator;
    const maxNum = difficulty === 'hard' ? 999 : difficulty === 'medium' ? 99 : 9;
    
    num1 = Math.floor(Math.random() * (maxNum + 1));
    num2 = Math.floor(Math.random() * (maxNum + 1));

    if (allowNegative) {
        if (Math.random() > 0.5) num1 *= -1;
        if (Math.random() > 0.5) num2 *= -1;
    }

    if (allowDecimal && Math.random() > 0.5) {
        num1 = Math.round(num1 * 10) / 10;
        num2 = Math.round(num2 * 10) / 10;
    }

    if (useAddition && (operator === undefined || Math.random() < 0.5)) {
        operator = '+';
    } else if (useSubtraction && (operator === undefined || Math.random() < 0.5)) {
        operator = '-';
    } else if (useMultiplication) {
        operator = '*';
    }

    return { num1, num2, operator, answer: calculateAnswer(num1, num2, operator) };
}

function calculateAnswer(num1, num2, operator) {
    switch (operator) {
        case '+':
            return num1 + num2;
        case '-':
            return num1 - num2;
        case '*':
            return num1 * num2;
    }
}

function showQuestion() {
    if (currentQuestion < questions.length) {
        const questionObj = questions[currentQuestion];
        document.getElementById('question').innerText = `${questionObj.num1} ${questionObj.operator} ${questionObj.num2} = ?`;
        document.getElementById('quiz').style.display = 'block';
        document.getElementById('answerInput').focus();
        document.getElementById('answerInput').value = '';
        startTimer();
    } else {
        showResult();
    }
}

function startTimer() {
    let timeRemaining = timeLimit;
    document.getElementById('timer').innerText = timeRemaining;
    
    timer = setInterval(() => {
        timeRemaining--;
        document.getElementById('timer').innerText = timeRemaining;
        if (timeRemaining <= 0) {
            clearInterval(timer);
            checkAnswer();
        }
    }, 1000);
}

function checkAnswer() {
    clearInterval(timer);
    const userAnswer = parseFloat(document.getElementById('answerInput').value);
    const questionObj = questions[currentQuestion];
    
    if (userAnswer === questionObj.answer) {
        score++;
    }

    currentQuestion++;
    showQuestion();
}

function showResult() {
    document.getElementById('quiz').style.display = 'none';
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = `<h2>Результаты теста</h2&gt;<p>Правильные ответы: ${score} из 20</p>`;
    
    questions.forEach((q, index) => {
        resultDiv.innerHTML += `<p>${index + 1}: ${q.num1} ${q.operator} ${q.num2} = ${q.answer} (Ваш ответ: ${q.answer})</p>`;
    });

    resultDiv.style.display = 'block';
}




