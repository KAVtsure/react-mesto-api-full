import { useState, useEffect, useContext } from 'react';
import PopupWithForm from './PopupWithForm.js';
import { CurrentUserContext } from '../contexts/CurrentUserContext.js';

function EditProfilePopup({ isOpen, onClose, onUpdateUser }) {

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const currentUser = useContext(CurrentUserContext);

    // После загрузки текущего пользователя из API
    // его данные будут использованы в управляемых компонентах.
    useEffect(() => {
        setName(currentUser.name);
        setDescription(currentUser.about);
    }, [currentUser, isOpen]);

    function handleChangeName(e) {
        setName(e.target.value);
    }

    function handleChangeDescription(e) {
        setDescription(e.target.value);
    }

    function handleSubmit(e) {
        // Запрещаем браузеру переходить по адресу формы
        e.preventDefault();

        // Передаём значения управляемых компонентов во внешний обработчик
        onUpdateUser({
            name,
            about: description,
        });
    }

    return (
        <PopupWithForm
            name="profile-edit"
            title="Редактировать профиль"
            textButton="Сохранить"
            isOpen={isOpen}
            onClose={onClose}
            onSubmit={handleSubmit}
        >
            <input type="text"
                className="popup__field popup__field_name"
                name="name"
                id="profile_name"
                placeholder="Введите ваше имя"
                required
                minLength="2"
                maxLength="40"
                value={name || ''}
                onChange={handleChangeName} />
            <span className="popup__field-error popup__field-error_visible" id="profile_name-error"></span>
            <input type="text"
                className="popup__field popup__field_description"
                name="about"
                id="profile__description"
                placeholder="Введите ваш род занятий"
                required
                minLength="2"
                maxLength="200"
                value={description || ''}
                onChange={handleChangeDescription} />
            <span className="popup__field-error popup__field-error_visible" id="profile__description-error"></span>
        </PopupWithForm>
    )

}

export default EditProfilePopup;