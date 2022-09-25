import { useState, useEffect } from 'react';
import { Route, Switch, Redirect, useHistory } from 'react-router-dom';
import Header from './Header.js';
import Main from './Main.js';
import Footer from './Footer.js';
import PopupWithForm from './PopupWithForm.js';
import ImagePopup from './ImagePopup.js';
import api from '../utils/api.js';
import { CurrentUserContext } from '../contexts/CurrentUserContext.js';
import EditProfilePopup from './EditProfilePopup.js';
import EditAvatarPopup from './EditAvatarPopup.js';
import AddPlacePopup from './AddPlacePopup.js';
import ProtectedRoute from './ProtectedRoute.js';
import Register from './Register.js';
import Login from './Login.js';
import { authorize, register, checkToken } from '../utils/auth.js';
import InfoTooltip from './InfoTooltip.js';

function App() {

  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState({});
  const [isImagePopupOpen, setIsImagePopupOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState({ name: '', about: '' });
  const [cards, setCards] = useState([]);

  const [loggedIn, setLoggedIn] = useState(false);
  const history = useHistory();
  const [emailAuth, setEmailAuth] = useState('');
  const [isInfoTooltip, setIsInfoTooltip] = useState({ isOpen: false, success: false });
  const isOpen = isEditAvatarPopupOpen || isEditProfilePopupOpen || isAddPlacePopupOpen || selectedCard;

  function tokenCheck() {
    const jwt = localStorage.getItem('jwt');
    if (!jwt) {
      return;
    }
    checkToken(jwt)
      .then((res) => {
        setEmailAuth(res.data.email);
        setLoggedIn(true);
        history.push('/')
      })
      .catch((err) => {
        handleInfoTooltipResult(false)
        console.log(err)
      });
  }

  useEffect(() => {
    api.getUserInfo()
      .then((res) => {
        setCurrentUser(res)
      })
      .catch((err) => {
        console.log(err);
      })
  }, [])

  useEffect(() => {
    api.getInitialCards()
      .then((res) => {
        setCards(res)
      })
      .catch((err) => {
        console.log(err);
      })
  }, [])

  useEffect(() => {
    tokenCheck();
  }, [])

  useEffect(() => {
    if (loggedIn) {
      history.push('/');
    }
  }, [loggedIn, history])

  useEffect(() => {
    function closeByEscape(evt) {
      if (evt.key === 'Escape') {
        closeAllPopups();
      }
    }
    if (isOpen) {
      document.addEventListener('keydown', closeByEscape);
      return () => {
        document.removeEventListener('keydown', closeByEscape);
      }
    }
  }, [isOpen])

  const onLogin = ({ email, password }) => {
    setEmailAuth(email);
    authorize({ email, password })
      .then((data) => {
        if (data.token) {
          localStorage.setItem('jwt', data.token);
          setLoggedIn(true);
          history.push('/');
        }
      })
      .catch((err) => {
        handleInfoTooltipResult(false)
        console.log(err)
      });
  }

  const onRegister = (data) => {
    register(data)
      .then((data) => {
        handleInfoTooltipResult(true);
        history.push('/')
      })
      .catch((err) => {
        handleInfoTooltipResult(false)
        console.log(err)
      });
  }

  const onLogout = () => {
    setLoggedIn(false);
    localStorage.removeItem('jwt');
    history.push('/sign-in');
    // setEmailAuth('');
  }

  function handleInfoTooltipResult(res) {
    setIsInfoTooltip({ ...isInfoTooltip, isOpen: true, success: res })
  }

  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true)
  }

  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true)
  }

  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true)
  }

  function closeAllPopups() {
    setIsEditAvatarPopupOpen(false)
    setIsEditProfilePopupOpen(false)
    setIsAddPlacePopupOpen(false)
    setIsImagePopupOpen(false)
    setSelectedCard({})
    setIsInfoTooltip(false)
  }

  function handleCardClick(card) {
    setSelectedCard(card)
    setIsImagePopupOpen(true)
  }

  function handleUpdateUser(name, about) {
    api.saveUserInfo(name, about)
      .then((res) => {
        setCurrentUser(res);
        closeAllPopups()
      })
      .catch((err) => {
        console.log(err);
      })
  }

  function handleUpdateAvatar(newLink) {
    api.updateAvatar(newLink)
      .then((res) => {
        setCurrentUser(res);
        closeAllPopups()
      })
      .catch((err) => {
        console.log(err);
      })
  }

  function handleCardLike(card) {
    // Снова проверяем, есть ли уже лайк на этой карточке
    const isLiked = card.likes.some(i => i._id === currentUser._id);

    // Отправляем запрос в API и получаем обновлённые данные карточки
    api.changeLikeCardStatus(card._id, !isLiked)
      .then((newCard) => {
        setCards((state) => state.map((c) => c._id === card._id ? newCard : c));
      })
      .catch((err) => {
        console.log(err);
      })
  }

  function handleCardDelete(card) {
    api.deleteCard(card._id)
      .then(() => {
        setCards((state) => state.filter((c) => c._id !== card._id));
      })
      .catch((err) => {
        console.log(err);
      })
  }

  function handleAddPlaceSubmit({ name, link }) {
    api.addCard(name, link)
      .then((res) => {
        setCards([res, ...cards]);
        closeAllPopups()
      })
      .catch((err) => {
        console.log(err);
      })
  }

  return (

    <CurrentUserContext.Provider value={currentUser} >
      <div className="base">
        <Header emailAuth={emailAuth} onSignOut={onLogout} />
        <Switch>
          <ProtectedRoute
            exact path="/"
            loggedIn={loggedIn}
            onLogout={onLogout}
            component={Main}
            onEditProfile={handleEditProfileClick}
            onAddPlace={handleAddPlaceClick}
            onEditAvatar={handleEditAvatarClick}
            onCardClick={handleCardClick}
            cards={cards}
            onCardLike={handleCardLike}
            onCardDelete={handleCardDelete}

          />
          <Route path="/sign-in">
            <Login onLogin={onLogin} />
          </Route>
          <Route path="/sign-up">
            <Register onRegister={onRegister} />
          </Route>
          <Route>
            {loggedIn ? <Redirect to="/" /> : <Redirect to="/sign-in" />}
          </Route>
        </Switch>
        <Footer />

        <InfoTooltip
          onClose={closeAllPopups}
          res={isInfoTooltip}
          isOpen={handleInfoTooltipResult}
        />

        <EditProfilePopup
          isOpen={isEditProfilePopupOpen}
          onClose={closeAllPopups}
          onUpdateUser={handleUpdateUser}
        />

        <AddPlacePopup
          isOpen={isAddPlacePopupOpen}
          onClose={closeAllPopups}
          onAddPlace={handleAddPlaceSubmit}
        />

        <EditAvatarPopup
          isOpen={isEditAvatarPopupOpen}
          onClose={closeAllPopups}
          onUpdateAvatar={handleUpdateAvatar}
        />

        <PopupWithForm
          name="confirmation"
          title="Вы уверены?"
          textButton="Да"
          onClose={closeAllPopups}
        >
        </PopupWithForm>

        <ImagePopup
          onClose={closeAllPopups}
          card={selectedCard}
          isOpen={isImagePopupOpen}
        />
      </div>
    </CurrentUserContext.Provider>

  );
}

export default App;
