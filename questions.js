const questionsContainer = getdoc(`.questionsContainer`); 
const scoreElement = getdoc(`.scoreElement`); 
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
      questionElement.className = `questionElement question`;

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

    let answerButtons = document.querySelectorAll(`.answerButton`);
    answerButtons.forEach((ansButton, ansButtonIndex) => {
      let clicktimes = 0;
      ansButton.addEventListener(`click`, event => {
        console.log(`A button has been clicked! ${clicktimes}`)
        
        let buttonWeClicked = event.target;
        let questionWeClicked = buttonWeClicked.parentElement.parentElement;
        let questionFromDatabase = questions.find(q => q.id == questionWeClicked.id);
        let answerWeChose = buttonWeClicked.innerHTML;
        let correctAnswers = questionFromDatabase.correctAnswers

        if (correctAnswers.includes(answerWeChose)) {
          
          buttonWeClicked.classList.add(`correct`);
          setTimeout(() => buttonWeClicked.classList.remove(`correct`), 1000);
          console.log(`${answerWeChose} is correct!`);
          // we need to calculate how many points each question is worth
          let pointsEachQuestionIsWorth = 100 / questions.length;
          let currentScore = parseFloat(scoreElement.innerHTML);
          if(clicktimes == 0){
            scoreElement.innerHTML = (currentScore + pointsEachQuestionIsWorth).toFixed(2);
          }
          clicktimes++;
        } else {
          buttonWeClicked.classList.add(`wrong`);
          setTimeout(() => buttonWeClicked.classList.remove(`wrong`), 1000);
          console.log(`${answerWeChose} is wrong!`);
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

printQuestionsToSite(questions, questionsContainer);

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
  }. Please make each id an integer value that is greater than ${questions.length}. The choices, correctAnswers, and tags should all be arrays of strings with at least one of the correctAnswers being included in the choices array. The answer and correctAnswers can be the same, but correctAnswers is an array that can have multiple strings, while answer is not an array, just the first string value from correctAnswers. Please make sure the category and each tag is no longer than 2 to 3 words, or else please simplify them. multipleCorrectAnswers should be a boolean. The very first character of the response you send back should be [ like the beginning of an array and the very last character of the response should be ] as the end of the array. Do not put the array into an object or have some message before the array, i only want the raw array, please and thank you.`
  sendtoOpenAIapi(openAIAPIQuestionPrompt, supersneaky);
})
// qForm.addEventListener(`input`, qformInputevent => {
//   qformInputevent.preventDefault();
//   console.log(`forminput`, qformInputevent);
//   console.log(`currentInput`, {[qformInputevent.target.name]: qformInputevent.target.value});
// })