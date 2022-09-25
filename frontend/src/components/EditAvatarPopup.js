import { useRef, useEffect } from 'react';
import PopupWithForm from './PopupWithForm.js';

function EditAvatarPopup({ isOpen, onClose, onUpdateAvatar }) {

    const avatarRef = useRef();

    useEffect(() => {
        avatarRef.current.value = ''
    }, [isOpen]);

    function handleSubmit(e) {
        e.preventDefault();
        onUpdateAvatar(avatarRef.current.value);
    }

    return (
        <PopupWithForm
            name="avatar-edit"
            title="Обновить аватар"
            textButton="Создать"
            isOpen={isOpen}
            onClose={onClose}
            onSubmit={handleSubmit}
        >
            <input type="url"
                className="popup__field popup__field_avatar-link"
                name="avatar-link"
                id="avatar-link"
                placeholder="Ссылка на картинку"
                ref={avatarRef}
                required />
            <span className="popup__field-error popup__field-error_visible" id="avatar-link-error"></span>
        </PopupWithForm>
    )
}

export default EditAvatarPopup;