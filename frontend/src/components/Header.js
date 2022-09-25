import logo from '../images/logo.svg';
import { Route, Link, Switch } from 'react-router-dom';

function Header({ onSignOut, emailAuth }) {
    return (
        <header className="header">
            <img className="header__logo" src={logo} alt="Логотип" />
            <Switch>
                <Route exact path='/'>
                    <div className="header__block">
                        <p className="header__email">{emailAuth}</p>
                        <button className="header__button" onClick={onSignOut}>Выйти</button>
                    </div>
                </Route>
                <Route path="/sign-in">
                    <Link to="sign-up" className="header__link">Регистрация</Link>
                </Route>
                <Route path="/sign-up">
                    <Link to="sign-in" className="header__link">Войти</Link>
                </Route>
            </Switch>
        </header>
    )
}

export default Header;
