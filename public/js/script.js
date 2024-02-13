
let closeButtons = document.getElementsByClassName('closeButton');


for (const button of closeButtons) {
  button.addEventListener('click', () => {
    button.parentNode.classList.toggle('hidden');
  });
};

