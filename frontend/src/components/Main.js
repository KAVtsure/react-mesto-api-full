import { useContext } from 'react';
import Card from './Card.js';
import { CurrentUserContext } from '../contexts/CurrentUserContext.js';

function Main({ onEditProfile, onAddPlace, onEditAvatar, onCardClick, cards, onCardLike, onCardDelete }) {

    const currentUser = useContext(CurrentUserContext);

    return (
        <main className="content">
            <section className="profile">
                <img className="profile__avatar" style={{ backgroundImage: `url(${currentUser.avatar})` }} alt=""/>
                <button onClick={onEditAvatar} className="profile__avatar-button" type="button" aria-label="Редактировать аватар"></button>
                <div className="profile__info">
                    <h1 className="profile__name">{currentUser.name}</h1>
                    <p className="profile__description">{currentUser.about}</p>
                    <button onClick={onEditProfile} className="profile__edit-button" type="button" aria-label="Редактировать профиль"></button>
                </div>
                <button onClick={onAddPlace} className="profile__add-button" type="button" aria-label="кнопка добавить"></button>
            </section>
            <section className="elements">
                <ul className="elements__list">
                    {cards.map((card) => {
                        return (
                            <Card
                                card={card}
                                key={card._id}
                                onCardClick={onCardClick}
                                onCardLike={onCardLike}
                                onCardDelete={onCardDelete}
                            />
                        )
                    }
                    )}
                </ul>
            </section>
        </main>
    )
}

export default Main;

