let numQuestions, difficulty

const questionsLeft = document.getElementById('questionNumber')
const quizAnswers = document.querySelector('#quiz-data')
const quizBox = document.querySelector('.quiz-box')
const startQuizBtn = document.getElementById('start-quiz-btn')
const submit = document.getElementById('question-btn')
const question = document.getElementById('question')
const summary = document.getElementById('summary')
const firstStep = document.querySelector('.first-step')
const secondStep = document.querySelector('.second-step')
const thirdStep = document.querySelector('.third-step')
const progressBar = document.getElementById('progress')
const resetBtn = document.getElementById('reset-btn')
const score = document.getElementById('score')
let correctAnswersScore = 0
let wrongAnswers = []
let currentQuestion = 0

startQuizBtn.addEventListener('click', ()=>{
    numQuestions = document.getElementById('number-of-questions').value
    difficulty = document.getElementById('level').value
    firstStep.classList.add('hide')
    secondStep.classList.remove('hide')
    startQuiz ()
})

function startQuiz () {

    fetch(`https://the-trivia-api.com/api/questions?limit=${numQuestions}&region=GB&difficulty=${difficulty}`)
    .then((response) => response.json())
    .then((data) => {

        console.log(data)

        function loadQuestion(questions) {
            
            submit.value = `Question ${currentQuestion + 1}`
            questionsLeft.innerHTML = `Question ${currentQuestion + 1} of ${data.length}`
            question.textContent = questions[currentQuestion].question
            const questionAnswers = questions[currentQuestion].incorrectAnswers
            const correctAnswers = questions[currentQuestion].correctAnswer
            let answers = [correctAnswers, ...questionAnswers].sort()

            answers.forEach(answer => {
                const input = document.createElement('input')
                const label = document.createElement('lable')
                label.textContent = answer
                input.type = 'radio'
                input.name = 'answer'
                input.value = answer
                quizAnswers.appendChild(input)
                quizAnswers.appendChild(label)
            })

                progressBar.style.width = `${(currentQuestion / questions.length) * 100}%`
        }

        function checkAnswer() {
            const selected = document.querySelectorAll('form#quiz-data input[type="radio"')
            let selectedValue = ""

            selected.forEach((radioButton) => {
                if (radioButton.checked) {
                    selectedValue = radioButton.value
                    if (selectedValue == data[currentQuestion].correctAnswer) {
                        correctAnswersScore++
                    } else {
                        wrongAnswers.push(`Question ${currentQuestion + 1} ${question.textContent} You selected ${selectedValue} correct answer is ${data[currentQuestion].correctAnswer}`)
                    }
                } 
            })
        }

        submit.addEventListener('click', (e) => {
            e.preventDefault()
            checkAnswer()
            quizAnswers.innerHTML = ""
            currentQuestion++
            if (currentQuestion < data.length) {
                loadQuestion(data)
            } else {
                firstStep.classList.add('hide')
                secondStep.classList.add('hide')
                thirdStep.classList.remove('hide')
                wrongAnswers.forEach(item =>{
                    const ul = document.createElement('ul')
                    const li = document.createElement('li')
                    li.textContent = item
                    summary.appendChild(li)
                })

                score.textContent = `You got ${correctAnswersScore} out of ${data.length}`

            }
        })

        resetBtn.addEventListener('click', resetQuiz)

        function resetQuiz () {
            numQuestions = undefined
            difficulty = undefined
            currentQuestion = 0
            correctAnswersScore = 0
            wrongAnswers = []
            question.innerHTML = ""
            quizAnswers.innerHTML = ""
            summary.innerHTML = ""
            progressBar.style.width = "0%";
            score.textContent = ""
            secondStep.classList.add('hide')
            thirdStep.classList.add('hide')
            firstStep.classList.remove('hide')
        }

        loadQuestion(data)

    })

    .catch(error => console.log("Error"))

}