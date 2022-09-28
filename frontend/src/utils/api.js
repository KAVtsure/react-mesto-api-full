class Api {
    constructor({ baseUrl, headers }) {
        this._url = baseUrl;
        this._headers = headers;
        this._urlUser = `${this._url}/users/me`;
        this._urlCards = `${this._url}/cards`;
        this._urlUserAvatar = `${this._url}/users/me/avatar`;
    }

    getInitialCards() {
        return fetch(this._urlCards, {
            credentials: "include",
            headers: this._headers,
            method: 'GET'
        })
            .then(this._checkResponse);
    }

    addCard(cardName, cardLink) {
        return fetch(this._urlCards, {
            credentials: 'include',
            headers: this._headers,
            method: 'POST',
            body: JSON.stringify({
                name: cardName,
                link: cardLink
            })
        })
            .then(this._checkResponse);
    }

    deleteCard(cardId) {
        return fetch(`${this._urlCards}/${cardId}`, {
            credentials: 'include',
            headers: this._headers,
            method: 'DELETE',
        })
            .then(this._checkResponse);
    }

    getUserInfo() {
        return fetch(this._urlUser, {
            credentials: 'include',
            headers: this._headers,
            method: 'GET',
        })
            .then(this._checkResponse);
    }

    saveUserInfo({ name, about }) {
        return fetch(this._urlUser, {
            credentials: 'include',
            headers: this._headers,
            method: 'PATCH',
            body: JSON.stringify({
                name: name,
                about: about
            })
        })
            .then(this._checkResponse);
    }

    likeCard(cardId) {
        return fetch(`${this._urlCards}/${cardId}/likes`, {
            credentials: 'include',
            headers: this._headers,
            method: 'PUT',
        })
            .then(this._checkResponse);
    }

    unlikeCard(cardId) {
        return fetch(`${this._urlCards}/${cardId}/likes`, {
            credentials: "include",
            headers: this._headers,
            method: 'DELETE',
        })
            .then(this._checkResponse);
    }

    changeLikeCardStatus(cardId, isLiked) {
        return fetch(`${this._urlCards}/${cardId}/likes`, {
            credentials: 'include',
            headers: this._headers,
            method: `${isLiked ? 'DELETE' : 'PUT'}`,
        })
            .then(this._checkResponse);
    }

    updateAvatar(link) {
        return fetch(`${this._urlUser}/avatar`, {
            credentials: 'include',
            headers: this._headers,
            method: 'PATCH',
            body: JSON.stringify({
                avatar: link,
            })
        })
            .then(this._checkResponse);
    }

    _checkResponse(res) {
        if (res.ok) {
            return res.json();
        }
        return Promise.reject(`Ошибка: ${res.status}`);
    }
}

const api = new Api({
    baseUrl: 'https://api.kavtsure.mesto.nomorepartiesxyz.ru',
    headers: {
        // authorization: '875f0935-5842-4013-860b-5457ce9f84f3',
        'Content-Type': 'application/json',
    },
});

export default api;