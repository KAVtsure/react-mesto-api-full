import { useState } from 'react';

function Login({ onLogin }) {

    const [loginData, setLoginData] = useState({
        email: '',
        password: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setLoginData({
            ...loginData,
            [name]: value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!loginData.email || !loginData.password) {
            return;
        }
        onLogin(loginData);
    }

    return (
        <div className="auth__container">
            <h2 className="auth__title">Вход</h2>
            <form className="popup__edit" name='popup__edit-register' onSubmit={handleSubmit} noValidate>
                <input type="email"
                    className="popup__field popup__field_auth"
                    name="email"
                    id="email"
                    placeholder="Email"
                    required
                    minLength="2"
                    maxLength="40"
                    value={loginData.email}
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
                    value={loginData.password}
                    onChange={handleChange} />
                <span className="popup__field-error popup__field-error_visible" id="profile__description-error"></span>
                <button className="popup__submit-button popup__submit-button_auth" type="submit">Войти</button>
            </form>
        </div >
    );
}

export default Login;
