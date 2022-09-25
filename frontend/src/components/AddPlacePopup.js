import { useState, useEffect } from 'react';
import PopupWithForm from './PopupWithForm.js';

function AddPlacePopup({ isOpen, onClose, onAddPlace }) {

    const [name, setName] = useState('');
    const [link, setLink] = useState('');

    useEffect(() => {
        setName('');
        setLink('');
    }, [isOpen])

    function handleSubmit(e) {
        e.preventDefault();
        onAddPlace({
            name,
            link,
        });
    }

    function handleAddName(e) {
        setName(e.target.value);
    }

    function handleAddLink(e) {
        setLink(e.target.value);
    }

    return (
        <PopupWithForm
            name="element-edit"
            title="Новое место"
            textButton="Создать"
            isOpen={isOpen}
            onClose={onClose}
            onSubmit={handleSubmit}
        >
            <input type="text"
                className="popup__field popup__field_place"
                name="place_name"
                id="place_name"
                placeholder="Название"
                required
                minLength="2"
                maxLength="30"
                value={name}
                onChange={handleAddName} />
            <span className="popup__field-error popup__field-error_visible" id="place_name-error"></span>
            <input type="url"
                className="popup__field popup__field_image-link"
                name="image-link"
                id="image-link"
                placeholder="Ссылка на картинку"
                required
                value={link}
                onChange={handleAddLink} />
            <span className="popup__field-error popup__field-error_visible" id="image-link-error"></span>
        </PopupWithForm>
    )

}

export default AddPlacePopup;