import React, { useState, useEffect, useRef } from 'react';
import HubspotForm from 'react-hubspot-form'
import './style.scss';
import ContactsIcon from '../Icons/ContactsIcon'
import UserHeadsetIcon from '../Icons/UserHeadsetIcon'
import QuestionCircleIcon from '../Icons/QuestionCircleIcon'
import LocationIcon from '../Icons/LocationIcon'
import Modal from '../Modal'
import LoadingIcon from '../Icons/LoadingIcon';
import CloseIcon from '../Icons/CloseIcon'
import ArrowRightIcon from '../Icons/ArrowRightIcon'
import PhoneIcon from '../Icons/PhoneIcon'

const Contact = ({ supportURL, ticketSubmissionURL, salesContactFormId, salesContactPortalId, headerHeight, showTel }) => {
    const [expanded, setExpanded] = useState(false);
    const [zipError, setZipError] = useState(null)
    const [searching, setSearching] = useState(false)
    const [salesRep, setSalesRep] = useState([]);
    const [zip, setZip] = useState("");
    const [selectedRep, setSelectedRep] = useState(null)
    const [showModalForm, setShowModalForm] = useState(false)
    const [showIframe, setShowIframe] = useState(false)
    const [dropdownAlignment, setDropdownAlignment] = useState('left')
    const [extraEmailPairs, setExtraEmailPairs] = useState([])
    const componentRef = useRef(null);

    const menuItems = [
        {
            url: `tel:${showTel.replace(/ /g, '').replace(/-/g, "").trim()}`,
            label: showTel
        }
    ]


    const handleZipInputChange = (event) => {
        if (!!event.target.value && event.target.value.length >= 5) {
            setSearching(true)
        } else {
            setSearching(false)
        }
        setZipError(null)
        setZip(event.target.value)
    }
    const handleContactSalesButtonClick = (event, rep) => {
        event.preventDefault();
        closeDropdown();
        if (!!rep) {
            setSelectedRep(rep)
        }
    }

    // Handle main button click
    const handleButtonClick = (event) => {
        if (!!expanded) {
            closeDropdown()
        } else {
            openDropdown()
        }
    }

    const getExtraEmailPairs = () => {
        fetch(
            'https://api.hubapi.com/cms/v3/hubdb/tables/2678791/rows?portalId=1624307&properties=reps'
        ).then(response => response.json()).then(data => {
            fetch(
                'https://api.hubapi.com/cms/v3/hubdb/tables/2657473/rows?portalId=1624307&properties=email'
            ).then(response => response.json()).then(metadata => {
                const extraEmailPairs = [...data.results.map(result=>{
                    return result && result.values && result.values.reps && result.values.reps.map(rep=>{
                        const meta = metadata.results.find(res=>res.id === rep.id)
                        return meta && meta.values && meta.values.email || ''
                    })
                })]
                setExtraEmailPairs(extraEmailPairs);
            })
        })
    }

    React.useEffect(()=>{
        getExtraEmailPairs();
    }, [])

    const onContactRepFormReady = () => {
        const form = document.querySelector('#sales-modal__form form');
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                reps: [{
                    name: selectedRep && selectedRep.name || '', 
                    email: selectedRep && selectedRep.details && selectedRep.details.email || ''
                }] 
            })
        };
        fetch(
            'https://us-central1-inboundlabs-test.cloudfunctions.net/permobil-sales-locator',
            requestOptions
        ).then(response => response.json()).then(data => {
            const sales_rep_email = (data && data.reps && data.reps[0] && data.reps[0].email) || selectedRep && selectedRep.details && selectedRep.details.email || '';
            const defaultValues = [
                {
                    name: 'sales_rep_name',
                    value: (data && data.reps && data.reps[0] && data.reps[0].name) || selectedRep && selectedRep.name || ''
                },
                {
                    name: 'sales_rep_email',
                    value: (data && data.reps && data.reps[0] && data.reps[0].email) || selectedRep && selectedRep.details && selectedRep.details.email || ''
                },
                {
                    name: 'sales_locator_extra_email',
                    value: sales_rep_email
                },
                {
                    name: 'entered_zip',
                    value: zip || ''
                },
                {
                    name: 'sales_rep_owner_id',
                    value: (data && data.reps && data.reps[0] && data.reps[0].ownerId) || selectedRep && selectedRep.ownerId || '30630617'
                },
                {
                    name: 'sales_locator_form_mode',
                    value: ''
                }
            ]

            for(let i = 0; i < defaultValues.length; i++){
                let el = form.querySelector(`[name=${defaultValues[i].name}]`)
                if(el){
                    el.value = defaultValues[i].value
                    el.dispatchEvent(new Event('change'));
                }
            }

            if (sales_rep_email) {
                for (let i = 0; i < extraEmailPairs.length; i++) {
                    let pair = extraEmailPairs[i].map(email => email.toLowerCase() );
                    let index = pair.indexOf(sales_rep_email.toLowerCase());
                    if (index < 0) {
                        continue;
                    }
                    pair.splice(index, 1);
                    let el = form.querySelector(`[name=sales_locator_extra_email]`)
                    if(el){
                        el.value = pair[0] || ''
                        el.dispatchEvent(new Event('change'));
                    }
                    el = form.querySelector(`[name=sales_locator_extra_email_2]`)
                    if(el){
                        el.value = pair[1] || ''
                        el.dispatchEvent(new Event('change'));
                    }
                    el = form.querySelector(`[name=sales_locator_extra_email_3]`)
                    if(el){
                        el.value = pair[2] || ''
                        el.dispatchEvent(new Event('change'));
                    }
                }
            }
        });
    }

    const handleModalCloseButtonKeyPress = (e) => {
        if (e.charCode === 13) {
            e.preventDefault();
            setSelectedRep(null);
            setShowModalForm(false)
        }
    }

    const handleModalCloseButtonClick = (e) => {
        e.preventDefault();
        setSelectedRep(null);
        setShowModalForm(false)
    }

    const closeDropdown = () => {
        setExpanded(false);
        //setSalesOpened(false);
    }

    const openDropdown = () => {
        setExpanded(true);
        //setSalesOpened(false);
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
                <button className="contact-component__sales-result-details-button" onClick={(event) => { handleContactSalesButtonClick(event, result) }}>Contact</button>
            </div>
        </div>
    )

    const renderSalesNavigator = () => (
        <div className={`contact-component__sales ${!!salesRep && salesRep.length > 0 && !searching && !!zip ? 'contact-component__sales--with-results' : ''}`}>
            {!!zip && zip.length === 5 && (
                <div style={{ 'display': 'none' }}>
                    <iframe title="sales-locator" src={`https://hub.permobil.com/sales-locator-find-v2?zip=${zip}`}></iframe>
                </div>
            )}
            <p className="contact-component__sales-title"><UserHeadsetIcon /> <span>Sales</span></p>
            {!searching && (!salesRep || salesRep.length < 1) && (
                <div className="contact-component__sales-form">
                    <label className="contact-component__sales-form-label" htmlFor="zipcode">Find a sales specialist near you</label>
                    <div className="contact-component__sales-form-input">
                        <LocationIcon />
                        <input
                            type="text"
                            required
                            value={zip}
                            onChange={handleZipInputChange}
                            id="zipcode"
                            name="zipcode"
                            maxLength="5"
                            onKeyPress={e => {
                                if (e.charCode === 13) {
                                    e.preventDefault();
                                }
                            }}
                            placeholder="Enter zip code"
                        />
                    </div>
                    {!!zipError && (
                        <p className="contact-component__sales-form-input-error">{zipError}</p>
                    )}
                </div>
            )}
            {!!searching && !!zip && zip.length === 5 && (
                <div className="contact-component__sales-results">
                    <p className="contact-component__sales-searching">Searching in zip code <strong>{zip}...</strong></p>
                    <div className="contact-component__sales-loading"><LoadingIcon /></div>
                </div>
            )}
            <div className={`contact-component__sales-results-wrapper contact-component__sales-results-wrapper--length-${salesRep.length > 3 ? '3' : salesRep.length}`}>
                {!!salesRep && salesRep.length > 0 && !searching && !!zip && (
                    <div className="contact-component__sales-results">
                        <p className="contact-component__sales-results-title">Specialists found in <strong>{zip}</strong><br />(<span className="contact-component__sales-results-change" onClick={(e) => {
                            e.preventDefault();
                            setSalesRep([])
                            setZip("")
                        }}>change zip code</span>)</p>
                        {salesRep.slice(0, 3).map(renderResult)}
                    </div>
                )}
            </div>
        </div>
    );

    const renderSupportLink = () => !!supportURL ? (
        <div className="contact-component__dropdown-support">
            <a href={supportURL} className="contact-component__dropdown-support-link">
                <QuestionCircleIcon />
                <span>Support</span>
            </a>
        </div>
    ) : null

    const renderMenu = () => !!menuItems && menuItems.length > 0 ? (
        <ul className="contact-component__dropdown-menu">
            {menuItems.map(menuItem => (
                <li key={menuItem.url}>
                    <a href={menuItem.url}>
                        <PhoneIcon />
                        <span>{menuItem.label}</span>
                    </a>
                </li>
            ))}
        </ul>
    ) : null

    const renderDropdown = () => (
        <div className={`contact-component__dropdown contact-component__dropdown--${dropdownAlignment}`}>
            {renderSalesNavigator()}
            {renderSupportLink()}
            {!!showTel ? renderMenu() : null}
        </div>
    )

    const renderModalCloseButton = () => (
        <div className="sales-modal__close">
            <span
                tabIndex="0"
                onClick={handleModalCloseButtonClick}
                onKeyPress={handleModalCloseButtonKeyPress}
            ><CloseIcon /></span>
        </div>
    )

    const renderSalesRepModal = () => !!selectedRep ? (
        <div className="sales-modal">
            <div className="sales-modal__container">

                <div className="sales-modal__image" style={{ backgroundImage: `url(${selectedRep.sales_image})` }}></div>

                <div className="sales-modal__content">

                    {renderModalCloseButton()}

                    {!!showModalForm && !!selectedRep.name ? null : <h2 className="sales-modal__title">How can we help you?</h2>}

                    {!showModalForm && (
                        <div className="sales-modal__buttons">
                            {!!ticketSubmissionURL && (
                                <a href={ticketSubmissionURL} className="sales-modal__button"><span>I need help with a product I purchased</span><ArrowRightIcon /></a>
                            )}
                            {!!salesContactFormId && !!salesContactPortalId && (
                                <button className="sales-modal__button" onClick={() => {
                                    setShowModalForm(true)
                                }}><span>I'd like to buy a new product</span><ArrowRightIcon /></button>
                            )}
                        </div>
                    )}

                    {!!salesContactFormId && !!salesContactPortalId && !!showModalForm && (
                        <div style={{ display: !!salesContactFormId && !!salesContactPortalId && !!showModalForm ? 'block' : 'none' }}>
                            <div className="sales-modal__form" id="sales-modal__form">
                                <HubspotForm
                                    portalId={salesContactPortalId}
                                    formId={salesContactFormId}
                                    inlineMessage="Thanks for submitting the form"
                                    onSubmit={() => {
                                        //console.log('Submit!');
                                    }}
                                    onReady={onContactRepFormReady}
                                    loading={<div>
                                        <h2 className="sales-modal__title">Loading form...</h2>
                                        <div style={{ textAlign: 'center' }}><LoadingIcon /></div>
                                    </div>}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    ) : null;

    const renderDefaultZipIframe = () => (
        <div style={{ 'display': 'none' }}>
            <iframe title="sales-locator" src="https://hub.permobil.com/sales-locator-find-v2"></iframe>
        </div>
    )

    const renderContactButton = () => (
        <button
            aria-haspopup="true"
            aria-expanded={expanded}
            tabIndex="0"
            onClick={handleButtonClick}
            className={`contact-component__button ${expanded ? 'dropdown-opened' : 'dropdown-closed'}`}
        >
            <ContactsIcon />
            <span>Contact</span>
        </button>
    )

    // Set locally saved sales rep
    useEffect(() => {
        let savedReps = localStorage.getItem('savedReps');
        if (!!savedReps) setSalesRep(JSON.parse(savedReps));
    }, [])

    // Set locally saved zipcode
    useEffect(() => {
        const savedZip = localStorage.getItem('savedZip');
        if (!!savedZip) {
            setZip(savedZip);
        }
    }, [])

    // Listen to window resize
    useEffect(() => {
        if (typeof window !== 'undefined') {
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
        }
    }, []);

    // Listen to post messages
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const handler = event => {
                const data = event.data
                if (!!data) {
                    if (!!data.error && data.error === 'not_in_us') {
                        return;
                    }
                    if (!!data.error && (data.error === 'invalid_zip' || data.error === 'Invalid zip code')) {
                        setZipError('Invalid zip code, please try again');
                        setSalesRep([]);
                        setSearching(false)
                        return;
                    }
                    if (!!data.error && data.error === 'unknown_failure') {
                        setZipError('Unknown failure, please try again');
                        setSalesRep([]);
                        setSearching(false)
                        return;
                    }


                    if (!!data.type && data.type === 'default_zip' && !!data.zip) {
                        const savedZip = localStorage.getItem('savedZip');
                        if (!savedZip) {
                            setZip(data.zip);
                            setSearching(true)
                            localStorage.setItem('savedZip', data.zip)
                        }
                    }

                    if (!!data.type && data.type === 'zip_search_result_processed' && !!data.result && !!data.result.reps && data.result.reps.length > 0) {
                        const result = data.result.reps.map(rep => ({
                            ...rep,
                            key: rep.key,
                            name: rep.name,
                            jobtitle: rep.details.jobtitle,
                            sales_image: rep.details.sales_image,
                        }))
                        setSalesRep(result);
                        setZipError(null);
                        setSearching(false)
                        localStorage.setItem('savedZip', data.zip);
                        localStorage.setItem('savedReps', JSON.stringify(result));
                        return;
                    }
                }
            }
            window.addEventListener("message", handler)
            return () => window.removeEventListener("message", handler)
        }
    }, [])

    // Handle click outside the component
    useEffect(() => {
        if (typeof window !== 'undefined') {
            function handleClickOutside(event) {
                if (componentRef.current && !componentRef.current.contains(event.target)) {
                    closeDropdown()
                }
            }
            document.addEventListener("mousedown", handleClickOutside);
            return () => {
                document.removeEventListener("mousedown", handleClickOutside);
            };
        }
    }, [componentRef]);

    return (
        <div className="contact-component" id="contact-component" ref={componentRef} style={{ '--header-height': !!headerHeight ? headerHeight + 'px' : '60px' }}>
            <link rel="stylesheet" href="https://hub.permobil.com/hubfs/permobil-navigator-components/permobil-navigator-components.umd.css" />

            {renderContactButton()}

            {!!showIframe && renderDefaultZipIframe()}

            {!!expanded ? renderDropdown() : null}

            <Modal
                modalIsOpen={!!selectedRep}
                closeModal={() => {
                    setSelectedRep(null);
                    setShowModalForm(false)
                }}
            >
                {renderSalesRepModal()}
            </Modal>

        </div>
    )
}

export default Contact;
