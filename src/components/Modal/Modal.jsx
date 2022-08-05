import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
import css from '../Modal/Modal.module.css';

const modalRoot = document.querySelector('#modal-root')

const Modal = ({onClose, largeImgUrl, tag}) => {
    useEffect(() => {
        const handleKeyDown = evt => {
            if (evt.code === 'Escape') {
                console.log(evt)
                onClose()
            }
        }
        window.addEventListener('keydown', handleKeyDown);

        return () => window.removeEventListener('keydown', handleKeyDown);

    }, [onClose])

    const handleClick = evt => {
        if (evt.currentTarget === evt.target) { onClose() }
  }
    
    return createPortal(
        <div className={css.overlay} onClick={handleClick}>
            <div className={css.modal}>
                <img src={largeImgUrl} alt={tag} />
            </div>
        </div>,
        modalRoot,
    )    
}

Modal.propsTypes = {
    largeImgUrl: PropTypes.string.isRequired,
    tag: PropTypes.string.isRequired,
    onClose: PropTypes.func.isRequired,
}

export default Modal;

