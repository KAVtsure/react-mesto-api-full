import { useState } from 'react';
import { Link } from 'react-router-dom';

function Register({ onRegister }) {

    const [registerData, setRegisterData] = useState({
        email: '',
        password: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setRegisterData({
            ...registerData,
            [name]: value
        });
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!registerData.email || !registerData.password) {
            return;
        }
        onRegister(registerData);
    }

    return (
        <div className="auth__container">
            <h2 className="auth__title">Регистрация</h2>
            <form className="popup__edit" name='popup__edit-register' onSubmit={handleSubmit} noValidate>
                <input type="email"
                    className="popup__field popup__field_auth"
                    name="email"
                    id="email"
                    placeholder="Email"
                    required
                    minLength="2"
                    maxLength="40"
                    value={registerData.email}
                    onChange={handleChange} />
                <span className="popup__field-error popup__field-error_visible" id="profile_name-error"></span>
                <input type="password"
                    className="popup__field popup__field_auth"
                    name="password"
                    id="password"
                    placeholder="Пароль"
                    required
                    minLength="6"
                    maxLength="20"
                    value={registerData.password}
                    onChange={handleChange} />
                <span className="popup__field-error popup__field-error_visible" id="profile__description-error"></span>
                <button className="popup__submit-button popup__submit-button_auth" type="submit">Зарегистрироваться</button>
                <div className="popup__edit-auth">
                    <p className="popup__edit-prompt">Уже зарегистрированы?</p>
                    <Link to="sign-in" className="popup__edit-link">Войти</Link>
                </div>
            </form>
        </div >
    );
}

export default Register;
