function PopupWithForm({ name, title, children, textButton, isOpen, onClose, onSubmit }) {

  return (
    <div className={`popup popup_${name} ${isOpen && 'popup_opened'}`}>
      <div className="popup__container">
        <button className="popup__close-button" type="button" aria-label="закрыть окно" onClick={onClose}></button>
        <h2 className="popup__title">{title}</h2>
        <form className="popup__edit" name={`${name}_form`} onSubmit={onSubmit} noValidate>
          {children}
          <button className="popup__submit-button" type="submit" aria-label={textButton}>{textButton}</button>
        </form>
      </div>
    </div>
  )
}

export default PopupWithForm;
