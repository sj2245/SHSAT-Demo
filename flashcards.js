let flashcardsSection = document.querySelector(`.flashcardsSection`);
let questionsFromDatabase = localStorage.getItem(`questions`) ? JSON.parse(localStorage.getItem(`questions`)) : [];

if (questionsFromDatabase.length > 0 && flashcardsSection) {
  console.log(`Questions From Database`, questionsFromDatabase);

  questionsFromDatabase.forEach((ques, quesIndex) => {
    let flashcardElement = document.createElement(`div`);
    flashcardElement.className = `flashcard`;

    let flashcardFront = document.createElement(`div`);
    let flashcardBack = document.createElement(`div`);

    flashcardFront.className = `front cardFace`;
    flashcardBack.className = `back cardFace`;

    let flaschcardFrontQuestion = document.createElement(`div`);
    let flaschcardFrontChoices = document.createElement(`div`);

    flaschcardFrontQuestion.className = `fcQuestion`;
    flaschcardFrontChoices.className = `fcChoices`;

    flaschcardFrontQuestion.innerHTML = ques.question;
    flaschcardFrontChoices.innerHTML = ques.choices.join(`<br><br>`);

    flashcardBack.innerHTML = ques.answer;

    flashcardFront.append(flaschcardFrontQuestion);
    flashcardFront.append(flaschcardFrontChoices);

    flashcardElement.append(flashcardFront);
    flashcardElement.append(flashcardBack);

    flashcardElement.onclick = () => {
      flashcardElement.classList.toggle(`flipped`);
    }

    flashcardsSection.append(flashcardElement);
  })
}