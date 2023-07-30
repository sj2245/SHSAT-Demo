let questions = [];
function getdoc(selector) {
  return document.querySelector(selector);
}

function print(item) {
  return console.log(item);
}

let mobilemenutrigger = getdoc(`.mobilemenutrigger`);
let mobilemenu = getdoc(`header nav ul`);

mobilemenutrigger.addEventListener(`click`, function (e) {
  print({mobilemenutrigger, mobilemenu});
  mobilemenu.classList.toggle(`collapsed`);
})

function buttonlink(button, link) {
  button.addEventListener(`click`, function (e) {
    window.location.href = link;
  })
}

let practiceButton = getdoc(`.practiceButton`);
let aboutButton = getdoc(`.aboutButton`);
let updatesButton = getdoc(`.updatesButton`);

if (aboutButton) buttonlink(aboutButton, `./pages/about.html`);
if (updatesButton) buttonlink(updatesButton, `./pages/updates.html`);
if (practiceButton) buttonlink(practiceButton, `./pages/questions.html`);