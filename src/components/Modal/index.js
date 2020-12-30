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
        backgroundColor: 'rgba(255, 255, 255, 0.8)'
    },
    content: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        margin: '0',
        transform: 'translate(-50%, -50%)',
        border: 'none',
        background: '#fff',
        overflow: 'auto',
        WebkitOverflowScrolling: 'touch',
        borderRadius: '4px',
        outline: 'none',
        padding: '0',
        boxShadow: '0 1px 2px rgba(0,0,0,.07), 0 2px 4px rgba(0,0,0,.07), 0 4px 8px rgba(0,0,0,.07), 0 8px 16px rgba(0,0,0,.07), 0 16px 32px rgba(0,0,0,.07), 0 32px 64px rgba(0,0,0,.07)',
        width: '90%',
        maxWidth: '700px'
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
