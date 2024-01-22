const questionsContainer = getdoc(`.questionsContainer`); 
const scoreElement = getdoc(`.scoreElement`);

let highScores = JSON.parse(localStorage.getItem(`highscores`)) || [];
console.log(`Highscores`, highScores);

let highScoresList = getdoc(`.highScoresList`);
let highScoresLink = getdoc(`.highScoresLink`);

const showHideScores = (delay) => {
  setTimeout(() => {
    highScoresList.classList.toggle(`hideThisList`);
  }, delay)
}

const toggleScores = () => {
  showHideScores(1);
  showHideScores(2000);
}

if (highScoresLink) {
  highScoresLink.addEventListener(`mouseover`, (mouseOverEvent) => {
    toggleScores();
  })
}

if (highScoresList) {
  highScores.forEach(scor => {
    let scoreElement = document.createElement(`div`);
    scoreElement.className = `scoreElement`;
    scoreElement.innerHTML = `<i class="fas fa-signal" style="color: skyblue"></i> ${scor.name} - ${scor.score}% on ${scor.date}`;

    highScoresList.append(scoreElement);
  })
  toggleScores();
}

let gameStartSession = {
  score: 0,
  answered: 0,
  difficulties: [],
  points: 0,
  questions: questions.length,
};

// let question = {
//   id: 1,
//   question: `who is walter white's friend`,
//   choices: [`Heisenburg`, `Jessie Pinkman`, `Joe Biden`, `Rakib Ahmed`],
//   answers: [`Jessie Pinkman`],
//   tags: [`Breaking Bad`, `Coke`, `Healthy Sugar`, `Chemistry`]
// }

// questions = [question,
//   {
//     id: 2,
//     question: `1 + 1`,
//     choices: [`2`, `4`, `3`, `Rakib Ahmed`],
//     answers: [`2`],
//     tags: [`Basic Math`, `Arithmetic`]
//   }, 
//   {
//     id: 3,
//     question: `2 + 2`,
//     choices: [`2`, `4`, `3`, `Rakib Ahmed`],
//     answers: [`4`],
//     tags: [`Basic Math`, `Arithmetic`]
//   }
// ];

const calculateScoreBasedOnDifficulties = (arrayOfDifficulties) => {

  let scoreMultiplier = 10;

  let scoreToReturnArray = arrayOfDifficulties.map(diff => {

    let points = 0;

    if (diff == `Very Easy`) {
      points = points + 1;
    } else if (diff == `Easy`) {
      points = points + 2;
    } else if (diff == `Simple`) {
      points = points + 3;
    } else if (diff == `Medium`) {
      points = points + 4;
    } else if (diff == `Complicated`) {
      points = points + 5;
    } else if (diff == `Difficult`) {
      points = points + 6;
    } else if (diff == `Tryhard`) {
      points = points + 7;
    }

    return points;
  });

  let scoreToReturn = scoreToReturnArray.reduce((acc, currentVal) => acc + currentVal) * scoreMultiplier;

  return scoreToReturn;
}

const printQuestionsToSite = (questions, questionsContainer) => {
  if (questions.length > 0) {
    console.log(`Question(s)`, questions);
    questionsContainer.innerHTML = ``;
    questions.forEach((questionObject, quesIndex) => {

      // let currentDateTimeStamp = formatDate(new Date());
      // let uniqueIndex = questions.length + 1 + quesIndex;
      // let currentDateTimeStampNoSpaces = formatDate(new Date(), `timezoneNoSpaces`);
      // let uuid = generateUniqueID(questions.map(qs => qs?.uuid || qs?.id));
      // let id = `${uniqueIndex}_Question_${currentDateTimeStampNoSpaces}_${uuid}`;
      // let ID = `${uniqueIndex} Question ${currentDateTimeStamp} ${uuid}`;

      let questionElement = document.createElement(`div`);
      questionElement.id = questionObject.id;
      questionElement.className = `questionElement question ${quesIndex == questions.length - 1 ? `lastQuestion` : ``}`;

      // questionElement.innerHTML = questionObject.question;
      // ^ Currently, we are inserting the question right into the element

      // We need to modify this to include more data in each question
      // Some of the things we need are
      // Text of the Question, and the Answers
      // Let's make the answers buttons, so the user can click on which answer they think is correct
      questionElement.innerHTML = `${quesIndex + 1}. ${questionObject.question}`;

      // Whenever we have items in an array, we want to put them in a container class
      // Let's create the answers container
      let answersContainer = createXML(`
        <div class="answersContainer"></div>
      `);

      // Lets grab each answer
      questionObject.choices.forEach((choice, choiceIdex) => {
        // Here we have access to each choice of each questions
        let answerButton = createXML(`<button class="answerButton">${choice}</button>`);
        answersContainer.append(answerButton);
      })

      // Append is what we use to take our virtual elements that we make in javascript
      // And turn them into real elements that we can print to the screen
      questionElement.append(answersContainer);
      questionsContainer.append(questionElement);
    });

    let gameSession = gameStartSession;

    let answerButtons = document.querySelectorAll(`.answerButton`);
    answerButtons.forEach((ansButton, ansButtonIndex) => {
      // let clickedTimes = 0;
      ansButton.addEventListener(`click`, event => {
        let buttonWeClicked = event.target;
        let questionWeClicked = buttonWeClicked.parentElement.parentElement;
        let questionFromDatabase = questions.find(q => q.id == questionWeClicked.id);
        let answerWeChose = buttonWeClicked.innerHTML;
        let answersContainerOfQuestion = buttonWeClicked.parentElement;
        let correctAnswers = questionFromDatabase.correctAnswers;
        
        gameSession.answered = gameSession.answered + 1;
        gameSession.difficulties.push(questionFromDatabase.difficulty);
        gameSession.points = calculateScoreBasedOnDifficulties(gameSession.difficulties);
        
        console.log(`Question We Answered`, questionFromDatabase);
        console.log(`Game Session`, gameSession);

        if (correctAnswers.includes(answerWeChose)) {
          buttonWeClicked.classList.add(`correct`);
          setTimeout(() => buttonWeClicked.classList.remove(`correct`), 1000);
          // we need to calculate how many points each question is worth
          let pointsEachQuestionIsWorth = 100 / questions.length;
          let currentScore = parseFloat(scoreElement.innerHTML);
          let calculatedScore = (currentScore + pointsEachQuestionIsWorth).toFixed(2);
          let roundedScore = Math.ceil(calculatedScore / 1) * 1;
          let scoreToStore = calculatedScore >= 99.01 ? roundedScore : calculatedScore;

          scoreElement.innerHTML = scoreToStore;
          gameSession.score = scoreToStore;
        } else {
          buttonWeClicked.classList.add(`wrong`);
          setTimeout(() => buttonWeClicked.classList.remove(`wrong`), 1000);
        }

        answersContainerOfQuestion.querySelectorAll(`button`).forEach(childButton => {
          childButton.disabled = true;
          childButton.classList.add(`disabled`);

          if (gameSession.answered == questions.length) {
            console.log(`Last Question Answered`);
            console.log(`Show Game Over Screen`, gameSession);

            showAlert(
              `
                <div class="GameOverScreen">
                  <h2>Game Over,</h2>
                  <br>
                  <br>
                  Your Final Score was ${gameSession.score},
                  After answering ${gameSession.answered} Questions.
                  <br>
                  <br>
                  Would you like to save your score?
                  <br>
                  <br>
                  <form id="saveScoreForm" class="saveScoreForm" method="submit">
                    <input type="text" class="name" name="name" placeholder="Enter Your Name..." />
                    <input type="email" class="email" name="email" placeholder="Enter Your Email..." />
                    <button type="submit">Save Score</button>
                  </form>
                </div>
              `, 
            );
          }
        })

        let saveScoreForm = getdoc(`.saveScoreForm`);
        if (saveScoreForm) {
          saveScoreForm.addEventListener(`submit`, (saveScoreFormSubmitEvent) => {
            saveScoreFormSubmitEvent.preventDefault();

            let { name: nameField, email: emailField } = saveScoreFormSubmitEvent.target;

            let scoreToSave = {
              ...gameSession,
              name: nameField.value,
              date: new Date().toLocaleString(),
              id: `score-${highScores.length + 1}`,
              email: emailField.value.toLowerCase(),
            }

            highScores.push(scoreToSave);
            console.log(`Score Saved`, { scoreToSave, highScores });
            localStorage.setItem(`highscores`, JSON.stringify(highScores));
          })
        }
      })
    })
  } else {
    questionsContainer.innerHTML = `❌ No questions yet!`;
  }
}

const ripArrayFromInput = (questionsInput) => {
  let parsedQuestions;
  if (typeof questionsInput === `string`) {
    try {
      let firstBracket = questionsInput.indexOf(`[`);
      let lastBracket = questionsInput.lastIndexOf(`]`) + 1;
      if (firstBracket >= 0 && lastBracket > firstBracket) {
        questionsInput = questionsInput.slice(firstBracket, lastBracket);
        const parsed = JSON.parse(questionsInput);
        if (Array.isArray(parsed)) {
          parsedQuestions = parsed;
        }
      }
    } catch (error) {
      console.log(`Error parsing string questions`, error);
    }
  } else if (Array.isArray(questionsInput)) {
    parsedQuestions = questionsInput;
  } else if (typeof questionsInput === `object`) {
    if (questionsInput.questions && Array.isArray(questionsInput.questions)) {
      parsedQuestions = questionsInput.questions;
    }
  } else {
    console.log(`Invalid input type`);
  }
  return parsedQuestions;
}

const sendtoOpenAIapi = async (prompt, OpenAIAPIKey) => {
  const dismiss = showLoadingSpinner();
  try {
    const sendtoOpenAIapiResponse = await fetch(`https://api.openai.com/v1/chat/completions`, {
      method: `POST`, 
      headers: {
        'Content-Type': `application/json`,
        Authorization: `Bearer ${OpenAIAPIKey}`
      },
      body: JSON.stringify({
        model: `gpt-3.5-turbo`,
        messages: [{ role: `user`, content: prompt }]
      })
    })

    const successfulDataFromOpenAiAPIResponse = await sendtoOpenAIapiResponse.json();
    let isValidResponse = (successfulDataFromOpenAiAPIResponse.choices != undefined || successfulDataFromOpenAiAPIResponse.choices != null) && successfulDataFromOpenAiAPIResponse.choices.length > 0;

    if (isValidResponse == false) {
      dismiss();
      return;
    };

    const OpenAiAPIResponseMessage = successfulDataFromOpenAiAPIResponse.choices[0].message.content;
    const GeneratedQS = ripArrayFromInput(OpenAiAPIResponseMessage);
    // console.log(`successfulDataFromOpenAiAPIResponse`, successfulDataFromOpenAiAPIResponse);
    // console.log(`OpenAiAPIResponseMessage`, OpenAiAPIResponseMessage);
    console.log(`Generated Questions`, GeneratedQS);
    if (GeneratedQS.length > 0) {
      // We only want to push into our questions database if the generated questions are over 0
      // We dont want to overwrite the previous questions in the database, we just want to add onto the end
      // questions.concat(GeneratedQS);
      GeneratedQS.map((GeneratedQ, GenerateQIndex) => {
        let currentDateTimeStampNoSpaces = formatDate(new Date(), `timezoneNoSpaces`);
        let uuid = generateUniqueID(questions.map(qs => qs?.uuid || qs?.id));
        let id = `${GeneratedQ.id}_Question_${currentDateTimeStampNoSpaces}_${uuid}`;
        GeneratedQ.id = id;
        return GeneratedQ;
      });
      GeneratedQS.forEach(GeneratedQ => questions.push(GeneratedQ));
      localStorage.setItem(`questions`, JSON.stringify(questions));
      printQuestionsToSite(questions, questionsContainer);
      dismiss();
      // window.location.reload();
    };
    return successfulDataFromOpenAiAPIResponse;
  } 
  catch (error) {
    console.log(`sendtoOpenAIapi da error:`, error);
    dismiss();
    return error;
  }
}

const refreshQuiz = (questions = JSON.parse(localStorage.getItem(`questions`)) || []) => {
  printQuestionsToSite(questions, questionsContainer);
}

refreshQuiz();

const qForm = getdoc(`.qForm`);
qForm.addEventListener(`submit`, qformSubmitevent => {
  qformSubmitevent.preventDefault();
  let category = qformSubmitevent.target.category.value;
  let difficulty = qformSubmitevent.target.difficulty.value; 
  let amount = Number(qformSubmitevent.target.amount.value); 
  //send form data to openAIapi
  let openAIAPIQuestionPrompt = `Please generate ${amount} multiple choice questions for the category of ${category} and difficulty of: ${difficulty} level, please return it as a raw json pure array (i want to be able to do JSON.parse(response) later to get the array) of objects that should each match this class Question {
    constructor(id, question, answer, choices, tags, category, difficulty, tip, description, explanation, multipleCorrectAnswers, correctAnswers) {
      this.multipleCorrectAnswers = multipleCorrectAnswers;
      this.correctAnswers = correctAnswers;
      this.explanation = explanation;
      this.description = description;
      this.difficulty = difficulty;
      this.category = category;
      this.question = question;
      this.choices = choices;
      this.answer = answer; 
      this.tags = tags;
      this.tip = tip;
      this.id = id;
    }
  }. Please make each id an integer value that is greater than ${questions.length}. The choices, correctAnswers, and tags should all be arrays of strings with at least one of the correctAnswers being included in the choices array. The answer and correctAnswers can be the same, but correctAnswers is an array that can have multiple strings, while answer is not an array, just the first string value from correctAnswers. Please make sure the category and each tag is no longer than 2 to 3 words, or else please simplify them. multipleCorrectAnswers should be a boolean. The very first character of the response you send back should be [ like the beginning of an array and the very last character of the response should be ] as the end of the array. Do not put the array into an object or have some message before the array, i only want the raw array, please and thank you.
  
  Another thing to note, ensure at least one of the answers are correct.`
  sendtoOpenAIapi(openAIAPIQuestionPrompt, supersneaky);
})
// qForm.addEventListener(`input`, qformInputevent => {
//   qformInputevent.preventDefault();
//   console.log(`forminput`, qformInputevent);
//   console.log(`currentInput`, {[qformInputevent.target.name]: qformInputevent.target.value});
// })