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

// let quizData = [
//     {
//         question: 'What is 4 x 8',
//         choices: [41,3,32,64],
//         correct: 32
//     },
//     {
//         question: 'How much is 3 X 7',
//         choices: [41,3,21,64],
//         correct: 21
//     },
//     {
//         question: 'What is 2 x 12',
//         choices: [19,25,32,24],
//         correct: 24
//     },
//     {
//         question: 'How much is 7 X 7',
//         choices: [49,3,1,64],
//         correct: 21
//     }

// ]


// function loadQuestion (questions){

//     if(currentQuestion >= quizData.length){
//         alert('quiz finished your score is ' + correctAnswersScore)
//     }

//     const h3 = document.createElement('h3')
//     h3.textContent = questions[currentQuestion].question
//     quizAnswers.appendChild(h3)

//     questions[currentQuestion].choices.forEach(answer => {
//         const input = document.createElement('input')
//         const label = document.createElement('lable')
//         label.textContent = answer
//         input.type = 'radio'
//         input.name = 'answer'
//         input.value = answer

//     quizAnswers.appendChild(input)
//     quizAnswers.appendChild(label)

//     })

// }

// function checkAnswer (){
//     const selected = document.querySelectorAll('#quiz-data input[type="radio"')
//     let selectedValue = ""

//     selected.forEach((radioButton)=>{
//         if(radioButton.checked){
//             selectedValue = radioButton.value

//             if(selectedValue == quizData[currentQuestion].correct){
//                 correctAnswersScore ++
//             }
//         }
//     })
// }

// submit.addEventListener('click', (e)=>{
//     e.preventDefault()
//     checkAnswer ()
//     quizAnswers.innerHTML = ''
//     currentQuestion ++
//     loadQuestion(quizData)
// })

// loadQuestion(quizData)