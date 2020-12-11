import React, { useState, useEffect, useRef } from 'react';
import './style.scss';
import ContactsIcon from '../Icons/ContactsIcon'
import UserHeadsetIcon from '../Icons/UserHeadsetIcon'
import QuestionCircleIcon from '../Icons/QuestionCircleIcon'

const Contact = ({ domElement }) => {
    const [expanded, setExpanded] = useState(false);
    const [salesOpened, setSalesOpened] = useState(false);
    const [guessedZip, setGuessedZip] = useState("");
    const [zip, setZip] = useState("");
    const [dropdownAlignment, setDropdownAlignment] = useState('left')
    const componentRef = useRef(null);
    const supportURL = domElement.getAttribute('data-support-url')

    const handleSalesMenuClick = (event) => {
        setSalesOpened(true);
    }

    const handleZipInputChange = (event) => {
        setZip(event.target.value)
    }

    const renderDropdown = () => (
        <div className={`contact-component__dropdown contact-component__dropdown--${dropdownAlignment}`}>
            <div style={{ 'display': 'none' }}>
                <iframe title="sales-locator" src="https://hub.permobil.com/sales-locator-find-v2"></iframe>
            </div>
            {!!salesOpened ? (
                <div className="contact-component__sales">
                    <p className="contact-component__sales-title">Sales</p>
                    <form className="contact-component__sales-form">
                        <p className="contact-component__sales-form-label">Type Zipcode</p>
                        <div className="contact-component__sales-form-input">
                            <input type="text" value={zip} onChange={handleZipInputChange} />
                        </div>
                    </form>
                    <div className="contact-component__sales-results"></div>
                </div>
            ) : (
                    <ul className="contact-component__dropdown-menu" role="menu">
                        <li>
                            <a href="#" role="menuitem" onClick={handleSalesMenuClick}>
                                <UserHeadsetIcon />
                                <span>Sales</span>
                            </a>
                        </li>
                        {!!supportURL && (
                            <li>
                                <a href="#" role="menuitem">
                                    <QuestionCircleIcon />
                                    <span>Support</span>
                                </a>
                            </li>
                        )}
                    </ul>
                )}
        </div>
    )

    const handleButtonClick = (event) => {
        if (!!expanded) {
            closeDropdown()
        } else {
            openDropdown()
        }
    }

    const closeDropdown = () => {
        setExpanded(false);
        setSalesOpened(false);
    }

    const openDropdown = () => {
        setExpanded(true);
        setSalesOpened(false);
    }

    // Listen to window resize
    useEffect(() => {
        function updatedropdownAlignment() {
            const offsetRight = window.innerWidth - componentRef.current.offsetLeft - componentRef.current.offsetWidth;
            if (offsetRight < 200) {
                if (componentRef.current.offsetLeft < 200) {
                    setDropdownAlignment('center');
                } else {
                    setDropdownAlignment('right');
                }
            } else {
                setDropdownAlignment('left');
            }
        }
        window.addEventListener('resize', updatedropdownAlignment);
        updatedropdownAlignment();
        return () => window.removeEventListener('resize', updatedropdownAlignment);
    }, []);

    // Listen to post messages
    useEffect(() => {
        const handler = event => {
            const data = event.data
            console.log('iframe data', data);
            if (!!data) {
                if (!!data.error && data.error === 'not_in_us') {
                    setGuessedZip("");
                    return;
                }
                if (!!data.type && data.type === 'default_zip' && !!data.zip) {
                    setGuessedZip(data.zip);
                    setZip(data.zip);

                } else {
                    setGuessedZip("");
                }
            }

        }

        window.addEventListener("message", handler)


        return () => window.removeEventListener("message", handler)
    }, [])

    // Handle click outside the component
    useEffect(() => {

        function handleClickOutside(event) {
            if (componentRef.current && !componentRef.current.contains(event.target)) {
                closeDropdown()

            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [componentRef]);

    return (
        <div className="contact-component" ref={componentRef}>
            <button aria-haspopup="true" aria-expanded={expanded} onClick={handleButtonClick} className={`contact-component__button ${expanded ? 'dropdown-opened' : 'dropdown-closed'}`}>
                <ContactsIcon />
                <span>Contact</span>
            </button>
            {!!expanded ? renderDropdown() : null}
        </div>
    )
}

export default Contact;