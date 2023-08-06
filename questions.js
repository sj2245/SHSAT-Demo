const questionsContainer = getdoc(`.questionsContainer`); 
let question = {
  id: 1,
  question: `who is walter white's friend`,
  choices: [`Heisenburg`, `Jessie Pinkman`, `Joe Biden`, `Rakib Ahmed`],
  answers: [`Jessie Pinkman`],
  tags: [`Breaking Bad`, `Coke`, `Healthy Sugar`, `Chemistry`]
}

questions = [question, {
  id: 2,
  question: `1 + 1`,
  choices: [`2`, `4`, `3`, `Rakib Ahmed`],
  answers: [`2`],
  tags: [`Basic Math`, `Arithmetic`]
}, {
    id: 3,
    question: `2 + 2`,
    choices: [`2`, `4`, `3`, `Rakib Ahmed`],
    answers: [`4`],
    tags: [`Basic Math`, `Arithmetic`]
  }];

if (questions.length > 0) {
  questions.forEach((ques, quesIndex) => {
    let questionElement = document.createElement(`div`);
    questionElement.id = ques.id;
    questionElement.className = `questionElement question`;
    questionElement.innerHTML = ques.question;
    questionsContainer.append(questionElement);
  });
}
