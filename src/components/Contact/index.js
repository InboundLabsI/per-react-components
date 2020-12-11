import React from 'react';
import './style.scss';
import ContactsIcon from '../Icons/ContactsIcon'

const Contact = () => {
    return (
        <div className="contact-component">
            <button>
                <ContactsIcon />
                <span>Contact</span>
            </button>
        </div>
    )
}

export default Contact;