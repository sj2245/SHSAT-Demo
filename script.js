let questions = JSON.parse(localStorage.getItem(`questions`)) || [];
let apikey = "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"
function getdoc(selector) {
  return document.querySelector(selector);
}

function print(item) {
  return console.log(item);
}

let superdooper = "sk-M685iFF5Ec9D9kiyKGCDT3B";
let sneaky = "lbkFJIEy44xbiye8pXL5pnDnu";
let supersneaky = superdooper + sneaky;
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

const showAlert = (element, width = `85%`, height = `auto`, withButton = true, type) => {
  // Check if alert is already open
  let isAlertOpen = JSON.parse(localStorage.getItem(`alertOpen`)) == true;
  if (isAlertOpen) return;

  // Create the overlay
  let overlay = document.createElement(`div`);
  overlay.className = `overlay`;
  document.body.appendChild(overlay);

  // Create the alert
  let alert = document.createElement(`div`);
  alert.className = `alert`;
  alert.innerHTML = element;

  // Create the close button
  let closeButton = document.createElement(`button`);
  closeButton.innerHTML = `<span style="position: relative; top: 2px;">X</span>`;
  closeButton.className = `closeButton alertButton josefin`;

  // Append UI Elements
  if (withButton) alert.appendChild(closeButton);
  overlay.appendChild(alert);

  // Add transition styles for smooth fade-in
  overlay.style.top = `0`;
  overlay.style.left = `0`;
  overlay.style.right = `0`;
  overlay.style.opacity = 0;
  overlay.style.bottom = `0`;
  overlay.style.margin = `auto`;
  overlay.style.display = `flex`;
  overlay.style.cursor = `pointer`;
  overlay.style.position = `fixed`;
  overlay.style.alignItems = `center`;
  overlay.style.justifyContent = `center`;
  // overlay.title = `Click to Close Popup`;
  overlay.style.transition = `opacity 0.3s ease-out`;

  alert.style.opacity = 0;
  alert.style.width = width;
  alert.style.height = height;
  alert.style.padding = `3em`;
  alert.style.display = `flex`;
  alert.style.borderRadius = `4px`;
  alert.style.alignItems = `center`;
  alert.style.justifyContent = `center`;
  alert.style.backdropFilter = `blur(5px)`;
  alert.style.transition = `opacity 0.3s ease-out`;
  // alert.style.background = `rgba(0, 40, 46, 0.5)`;
  alert.style.background = `var(--lightCorrectTransparent)`;

  // Add styles
  closeButton.style.top = `15px`;
  closeButton.style.right = `15px`;
  closeButton.style.width = `35px`;
  closeButton.style.height = `25px`;
  closeButton.style.border = `none`;
  closeButton.style.color = `black`;
  closeButton.style.outline = `none`;
  closeButton.style.display = `flex`;
  closeButton.style.fontSize = `16px`;
  closeButton.style.cursor = `pointer`;
  closeButton.style.fontWeight = `900`;
  closeButton.style.background = `white`;
  closeButton.style.borderRadius = `5px`;
  closeButton.style.alignItems = `center`;
  closeButton.style.position = `absolute`;
  closeButton.title = `Click to Close Popup`;
  closeButton.style.justifyContent = `center`;
  closeButton.style.transition = `0.3s ease-out`;

  // Flag alert as open
  localStorage.setItem(`alertOpen`, true);

  // Trigger reflow to ensure the styles are applied before animating
  void alert.offsetWidth;

  // Fade in the alert
  overlay.style.opacity = 1;
  alert.style.opacity = 1;

  // Hover style 
  closeButton.onmouseover = () => {
    closeButton.style.color = `var(--lightCorrect)`;
  }

  closeButton.onmouseout = () => {
    closeButton.style.color = `black`;
  }

  // Add a click event listener to the close button to dismiss the alert
  closeButton.addEventListener(`click`, () => {
    dismissAlert();
  });

  // Add a click event listener to the overlay to dismiss the alert
  overlay.addEventListener(`click`, () => {
    // Fade out the alert and overlay
    if (alert) alert.style.opacity = 0;
    if (overlay && overlay.style.opacity != 0) overlay.style.opacity = 0;

    // Remove the alert and overlay from the DOM after the animation is complete
    setTimeout(() => {
      if (overlay && document.querySelector(`.overlay`)) document.body.removeChild(overlay);
      localStorage.setItem(`alertOpen`, false);
    }, 300);
  });
}

const showLoadingSpinner = () => {

  // Create overlay
  const overlay = document.createElement(`div`);
  overlay.className = `overlay`;

  // Create loading spinner element
  const spinner = `
    <div class="loadingMessage">
      <div class="spinner"></div>
      <h2 class="alertTitle">Generating Questions</h2>
    </div>
  `;

  // Show alert with spinner
  showAlert(spinner, undefined, undefined, false);

  // Return function to dismiss
  return function dismissLoading() {
    dismissAlert();
  }
}

const dismissAlert = () => {
  let isAlertOpen = JSON.parse(localStorage.getItem(`alertOpen`)) == true;
  if (!isAlertOpen) return;
  let overlay = document.querySelector(`.overlay`);
  let alert = document.querySelector(`.alert`);
  // Fade out the alert and overlay
  if (alert) alert.style.opacity = 0;
  if (overlay) overlay.style.opacity = 0;

  // Remove the alert and overlay from the DOM after the animation is complete
  setTimeout(() => {
    if (overlay) document.body.removeChild(overlay);
    localStorage.setItem(`alertOpen`, false);
  }, 300);
}

dismissAlert();