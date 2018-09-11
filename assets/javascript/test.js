class Game {
  constructor() {
    this.correctAnswers = 0
    this.wrongAnswers = 0
    this.unansweredAnswers = 0
    this.currentQuestionIndex = 0
    this.questions = []
  }

  setQuestions(questions) {
    this.questions = questions
  }
  nextQuestion() {
    this.currentQuestionIndex++
    return questions[this.currentQuestionIndex]
  }
  hasNextQuestion() {
    return questions.length !== this.currentQuestionIndex + 1
  }
  getCurrentQuestion() {
    return this.questions[this.currentQuestionIndex].question
  }

  missQuestion() {
    this.unansweredAnswers++
  }
  getimage() {
    return this.questions[this.currentQuestionIndex].image
  }
  getCurrentAnswer() {
    return this.questions[this.currentQuestionIndex].answer
  }
  getCurrentOptions() {
    return this.questions[this.currentQuestionIndex].options
  }

  chooseOption(answer) {
    if (this.getCurrentAnswer() === answer) {
      this.correctAnswers++
      return true
    } else {
      this.wrongAnswers++
      return false
    }
  }
}
// Define our question
class Question {
  constructor(question, answer, options, image) {
    this.question = question
    this.answer = answer
    this.options = options
    this.image = image
  }
}

// initialize the questions into an an array of questions.
let questions = [
  new Question(
    "People that followed the 'old ways' (norse religion) were called: ",
    "Heathens",
    ["Pagans", "Heathens", "Celts", "Paynims"],
    "./assets/images/heathens.jpg"
  ),
  new Question(
    "What was the name given to the Scandinavians in Russia: ",
    "Rus",
    ["Rus", "Leif", "Saga", "Knorr"],
    "./assets/images/rus.jpg"
  ),
  new Question(
    "What is the original Old Norse name for Norway",
    "Nordvegr",
    ["Ottar", "Skiringsai", "Norsk", "Nordvegr"],
    "./assets/images/nordvegr.jpg"
  ),
  new Question(
    "Who was the first Christian king in Scandinavia",
    "Harald Bluetooth",
    ["Gorm the Old", "Olaf I", "John Balliol", "Harald Bluetooth"],
    "./assets/images/harald.jpg"
  ),
  new Question(
    "Who was the first king to unite all Denmark",
    "Gorm the Old",
    ["Gorm the Old", "Olaf I", "John Balliol", "Harald Bluetooth"],
    "./assets/images/gorm.jpg"
  ),
  new Question(
    "Which norwegian king was converted to Christianity in 994 AD and then set out to christianize the country?",
    "Olaf I",
    ["Gorm the Old", "Olaf I", "John Balliol", "Harald Bluetooth"],
    "./assets/images/olaf.jpg"
  )
]
// initialize a new game

let game = new Game()
let statusMessage = ""
let questionDiv = document.getElementById("questions")
let optionsDiv = document.getElementById("answeroptions")
let timerDiv = document.getElementById("time-left")
let title = document.getElementById("trivia")
let intervalID
game.setQuestions(questions)

document.getElementById("start").addEventListener("click", event => {
  event.target.style.display = "none"
  title.style.display = "none"
  setupQuestion()
})

function goToIntermediateState(correct) {
  if (!game.hasNextQuestion()) {
    endGame()
    return
  }
  if (correct) {
    questionDiv.innerHTML = `That answer was correct, congratulations! <img class='imagee' src=" ${game.getimage()}"> `
  } else {
    questionDiv.innerHTML = `Sorry, the correct answer was: ${game.getCurrentAnswer()} <img class='imagee' src=" ${game.getimage()}">`
  }
  game.nextQuestion()
  optionsDiv.innerHTML = ""
  time = 3
  timerDiv.innerHTML = ""

  const countdown = () => {
    setTimeout(() => {
      time--
      timerDiv.innerHTML = ""

      if (time > 0) {
        setTimeout(countdown, 1000)
      } else {
        setupQuestion()
      }
    })
  }
  setTimeout(countdown, 1000)
}

function endGame() {
  questionDiv.innerHTML = `<div class="gameover"> Game Over!</div> <div>Correct Answers: ${
    game.correctAnswers
  } </div><br> <div>Wrong Answers: ${
    game.wrongAnswers
  }</div><br><div> Unanswered Questions: ${game.unansweredAnswers}</div>`
  optionsDiv.innerHTML = `<button class='buttons'>New Game</button>`
  optionsDiv.children[0].addEventListener("click", () => {
    game = new Game()
    game.setQuestions(questions)
    setupQuestion()
  })
  timerDiv.innerHTML = ""
}

function setupQuestion() {
  let time = 15
  timerDiv.innerHTML = "Time remaining: " + time

  intervalID = setInterval(() => {
    time--
    timerDiv.innerText = "Time remaining: " + time
    if (time <= 0) {
      clearInterval(intervalID)
      game.missQuestion()
      goToIntermediateState()
    }
  }, 1000)

  questionDiv.innerHTML =
    `<div class='question'>` + game.getCurrentQuestion() + `</div>`
  optionsDiv.innerHTML = game
    .getCurrentOptions()
    .map(option => `<button class='buttons'>${option}</button>`)
    .join(" ") //remove commas
  Array.from(optionsDiv.children).map(element => {
    element.addEventListener("click", event => {
      clearInterval(intervalID)
      let correct = game.chooseOption(event.target.innerHTML)
      console.log(`Players choice was ${correct ? "correct" : "incorrect"}`)
      goToIntermediateState(correct)
    })
  })
}
