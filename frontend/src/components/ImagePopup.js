function ImagePopup({ card, onClose, isOpen }) {

  return (
    <div className={`popup popup_image ${isOpen && 'popup_opened'}`}>
      <div className="popup__image-container">
        <button className="popup__close-button" type="button" aria-label="закрыть окно" onClick={onClose}></button>
        <img className="popup__image-zoom" src={card.link} alt={card.name} />
        <h2 className="popup__image-title">{card.name}</h2>
      </div>
    </div>
  )
}

export default ImagePopup;