import React from 'react'
import { default as ReactModal } from 'react-modal';

const modalStyles = {
    overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 99999,
        backgroundColor: 'rgba(10, 19, 24, 0.8)'
    },
    content: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        margin: '0',
        maxHeight: '100%',
        transform: 'translate(-50%, -50%)',
        border: 'none',
        background: '#fff',
        overflow: 'auto',
        WebkitOverflowScrolling: 'touch',
        borderRadius: '0px',
        outline: 'none',
        padding: '0',
        boxShadow: 'none',
        width: '95vw',
        maxWidth: '842px'
    }
};

const Modal = (props) => {
    const { modalIsOpen, closeModal, width, children } = props;
    return (
        <ReactModal
            isOpen={modalIsOpen}
            onRequestClose={closeModal}
            style={{ ...modalStyles, content: { ...modalStyles.content, width: width || '90%' } }}
            contentLabel="Example Modal"
            ariaHideApp={false}
        >
            {children}
        </ReactModal>
    )
}

export default Modal
