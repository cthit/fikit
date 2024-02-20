
let closeButtons = document.getElementsByClassName('closeButton');


for (const button of closeButtons) {
  button.addEventListener('click', () => {
    button.parentNode.classList.toggle('hidden');
  });
};


function createRandomSuffix(){
  let uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
  return uniqueSuffix;
}