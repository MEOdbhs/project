// Dark/Light mode toggle

document.addEventListener('DOMContentLoaded', function() {

    let toggleButton = document.querySelector('.js-toggle-mode');

    if (toggleButton) {
        toggleButton.addEventListener('click', function() {
            document.body.classList.toggle('light-mode');
        });
    }

});