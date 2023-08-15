let questions = [];
let apikey = "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"
function getdoc(selector) {
  return document.querySelector(selector);
}

function print(item) {
  return console.log(item);
}

let mobilemenutrigger = getdoc(`.mobilemenutrigger`);
let mobilemenu = getdoc(`header nav ul`);
let item = "sk-L61snTDvf6AVgnBYtwR8T3qlbkFJyBd6QCIcPWeUVjFC6REL"
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


let togglebooty = getdoc(`.togglebooty`);
if (localStorage.getItem(`darkmode`) == `true`) {
  document.body.classList.toggle(`dark`);
  togglebooty.innerHTML = `<i title="Light Mode" class="fas fa-sun"></i>`;
}
let code = "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"
if (togglebooty) {
  togglebooty.addEventListener(`click`, e => {
    document.body.classList.toggle(`dark`);
    if (document.body.classList.contains(`dark`)){
      togglebooty.innerHTML = `<i title="Light Mode" class="fas fa-sun"></i>`;
      localStorage.setItem(`darkmode`, true);
    }
    else{
      togglebooty.innerHTML = `<i title="Dark Mode"   class="fas fa-moon"></i>`;
      localStorage.setItem(`darkmode`, false);
    }
  })

  let apikeysecret = "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"; 
}