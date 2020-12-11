import React, { useState, useEffect, useRef } from 'react';
import './style.scss';
import ContactsIcon from '../Icons/ContactsIcon'
import UserHeadsetIcon from '../Icons/UserHeadsetIcon'
import QuestionCircleIcon from '../Icons/QuestionCircleIcon'
import LocationIcon from '../Icons/LocationIcon'

const dummyData = [
    {
        key: "melissabourque",
        name: "Melissa Bourque",
        jobtitle: "Territory Sales Manager, Full-line",
        sales_image: "https://f.hubspotusercontent00.net/hubfs/1624307/Melissa-Final-2.jpg"
    },
    {
        key: "catherinesweeneythompson",
        name: "Catherine.Sweeney-Thompson",
        jobtitle: "Clinical Education Manager",
        sales_image: "https://f.hubspotusercontent00.net/hubfs/1624307/Catherine%20Swiney-Thompson%20Final.png"
    }
]

const Contact = ({ domElement }) => {
    const [expanded, setExpanded] = useState(false);
    const [location, setLocation] = useState(null);
    const [zipError, setZipError] = useState(null)
    const [searching, setSearching] = useState(false)
    const [salesOpened, setSalesOpened] = useState(false);
    const [guessedZip, setGuessedZip] = useState("");
    const [salesRep, setSalesRep] = useState(window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1" ? dummyData : []);
    const [zip, setZip] = useState("");
    const [dropdownAlignment, setDropdownAlignment] = useState('left')
    const componentRef = useRef(null);
    const supportURL = domElement.getAttribute('data-support-url')

    const handleSalesMenuClick = (event) => {
        setSalesOpened(true);
    }

    const handleZipInputChange = (event) => {
        if (!!event.target.value) {
            setSearching(true)
        } else {
            setSearching(false)
        }
        setZipError(null)
        setZip(event.target.value)
    }

    const renderResult = (result) => (
        <div className="contact-component__sales-result" key={result.key}>
            <div className="contact-component__sales-result-image" style={{ backgroundImage: !!result.sales_image ? `url(${result.sales_image})` : 'none' }}></div>
            <div className="contact-component__sales-result-details">
                {!!result.name && (
                    <p className="contact-component__sales-result-details-name">{result.name}</p>
                )}
                {!!result.jobtitle && (
                    <p className="contact-component__sales-result-details-jobtitle">{result.jobtitle}</p>
                )}
                <button className="contact-component__sales-result-details-button">Contact</button>
            </div>
        </div>
    )

    const renderSalesNavigator = () => (
        <div className="contact-component__sales">
            {!!zip && (
                <div style={{ 'display': 'none' }}>
                    <iframe title="sales-locator" src={`https://hub.permobil.com/sales-locator-find-v2?zip=${zip}`}></iframe>
                </div>
            )}
            <p className="contact-component__sales-title">Sales</p>
            <form className="contact-component__sales-form">
                <label className="contact-component__sales-form-label" htmlFor="zipcode">Type Zipcode</label>
                <div className="contact-component__sales-form-input">
                    {!!zipError && (
                        <p class="contact-component__sales-form-input-error">{zipError}</p>
                    )}
                    <LocationIcon />
                    <input
                        type="text"
                        required
                        value={zip}
                        onChange={handleZipInputChange}
                        id="zipcode"
                        name="zipcode"
                        maxlength="5"
                    />
                </div>
            </form>
            {!!searching && (
                <div className="contact-component__sales-results">
                    <p className="contact-component__sales-searching">Locating the nearest sales specialist for you...</p>
                </div>
            )}
            {!!salesRep && salesRep.length > 0 && !searching && !!zip && (
                <div className="contact-component__sales-results">
                    <p className="contact-component__sales-results-title">Specialists{!!location ? ` in "${location}"` : ''}</p>
                    {salesRep.slice(0, 3).map(renderResult)}
                </div>
            )}
        </div>
    );

    const renderMenu = () => (
        <ul className="contact-component__dropdown-menu" role="menu">
            <li>
                <a href="#" role="menuitem" onClick={handleSalesMenuClick}>
                    <UserHeadsetIcon />
                    <span>Sales</span>
                </a>
            </li>
            {!!supportURL && (
                <li>
                    <a href={supportURL} role="menuitem">
                        <QuestionCircleIcon />
                        <span>Support</span>
                    </a>
                </li>
            )}
        </ul>
    )

    const renderDropdown = () => (
        <div className={`contact-component__dropdown contact-component__dropdown--${dropdownAlignment}`}>
            {!!salesOpened ? renderSalesNavigator() : (
                renderMenu()
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
                if (componentRef.current.offsetLeft < 150) {
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
            console.log('message data', data);
            if (!!data) {
                if (!!data.error && data.error === 'not_in_us') {
                    setGuessedZip("");
                    return;
                }
                if (!!data.error && (data.error === 'invalid_zip' || data.error === 'Invalid zip code')) {
                    setZipError('Invalid Zipcode');
                    setSalesRep([]);
                    setSearching(false)
                    return;
                }
                if (!!data.error && data.error === 'unknown_failure') {
                    setZipError('Unknown failure');
                    setSalesRep([]);
                    setSearching(false)
                    return;
                }


                if (!!data.type && data.type === 'default_zip' && !!data.zip) {
                    setGuessedZip(data.zip);
                    setZip(data.zip);
                    setSearching(true)
                    return;
                }

                if (!!data.type && data.type === 'zip_search_result_processed' && !!data.result && !!data.result.reps && data.result.reps.length > 0) {
                    const result = data.result.reps.map(rep => ({
                        key: rep.key,
                        name: rep.name,
                        jobtitle: rep.details.jobtitle,
                        sales_image: rep.details.sales_image
                    }))
                    setSalesRep(result);
                    setZipError(null);
                    setSearching(false)
                    return;
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
            <button
                aria-haspopup="true"
                aria-expanded={expanded}
                onClick={handleButtonClick}
                className={`contact-component__button ${expanded ? 'dropdown-opened' : 'dropdown-closed'}`}
            >
                <ContactsIcon />
                <span>Contact</span>
            </button>
            <div style={{ 'display': 'none' }}>
                <iframe title="sales-locator" src="https://hub.permobil.com/sales-locator-find-v2"></iframe>
            </div>
            {!!expanded ? renderDropdown() : null}
        </div>
    )
}

export default Contact;