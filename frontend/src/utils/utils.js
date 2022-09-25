// Открытие модального окна
function openModalWindow(modalWindow) {
    modalWindow.classList.add('popup_opened');
    document.addEventListener('keydown', closeModalWindowEsc);
}

// Закрытие модального окна
function closeModalWindow(modalWindow) {
    modalWindow.classList.remove('popup_opened');
    document.removeEventListener('keydown', closeModalWindowEsc);
}

//Закрытие по Esc
function closeModalWindowEsc(event) {
    if (event.key === 'Escape') {
        const modalWindowOpen = document.querySelector('.popup_opened');
        closeModalWindow(modalWindowOpen);
    }
};

// Закрытие модальных окон по "крестику"
const popups = document.querySelectorAll('.popup');
const popupCloseButtons = document.querySelectorAll('.popup__close-button');
Array.from(popupCloseButtons).forEach(btn => btn.addEventListener('click', () => {
    Array.from(popups).forEach(closeModalWindow);
}
));

//Закрытие по оверлею
Array.from(popups).forEach((modalWindow) => modalWindow.addEventListener('mousedown', (event) => {
    if (event.target.classList.contains('popup_opened')) {
        closeModalWindow(modalWindow);
    }
}))

export { openModalWindow, closeModalWindow };