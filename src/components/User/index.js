import React, { useState, useEffect, useRef } from 'react';
import './style.scss';
import Modal from '../Modal'
import EditProfileIcon from '../Icons/EditProfileIcon'
import PreferencesIcon from '../Icons/PreferencesIcon'
import LogoutIcon from '../Icons/LogoutIcon'

const User = ({ preferencesURL }) => {
    const componentRef = useRef(null);
    const [user, setUser] = useState(null)
    const [expanded, setExpanded] = useState(false)
    const [modalOpened, setModalOpened] = useState(false);
    const [dropdownAlignment, setDropdownAlignment] = useState('left')
    const [booya, setBooya] = useState(null);


    const handleBooyaEvents = () => {

        booya.on(booya.events.IDENTIFY_FAILED, function (e) {
            console.log('auth failed');
            setUser(null);
        });

        booya.on(booya.events.IDENTIFY_SUCCESS, function (e) {
            console.log('auth success');
            setUser(e.user);
            setModalOpened(false);
        });

        booya.on(booya.events.PROFILE_UPDATE_SUCCESS, function (e) {
            console.log('profile submitted');
            setTimeout(() => {
                setModalOpened(false);
            }, 1000);
        });

    }

    const handleSignUpClick = (e) => {
        //setModalOpened(false);
        if (!!booya) {
            //setModalOpened(true);
            setTimeout(() => {
                booya.widgets.renderAuthWidgets({
                    modal: {isOpen: true},
                    section: booya.widgets.sections.SIGNUP,
                    //target: '#booya-wrapper',
                    //signIn: false,
                    //signUp: true
                })
            }, 100);
        }
    }

    const handleLogInClick = (e) => {
        //setModalOpened(false);
        if (!!booya) {
            //setModalOpened(true);
            setTimeout(() => {
                booya.widgets.renderAuthWidgets({
                    modal: {isOpen: true},
                    //target: '#booya-wrapper',
                    //signUp: false,
                    //signIn: true
                })
            }, 100);
        }
    }

    const handleUserButtonClick = (e) => {
        setExpanded(!expanded)
    }

    const handleLogoutClick = (e) => {
        e.preventDefault();
        if (!!booya) {
            booya.logOut();
        }
    }

    const handleEditProfileClick = (e) => {
        e.preventDefault();
        if (!!booya) {
            setModalOpened(true);
            setTimeout(() => {
                booya.widgets.renderProfileForm('<h3>Edit Profile</h3>', null, null, { target: '#booya-wrapper' })
            }, 100);
        }

    }

    const renderDropdown = () => (
        <div className={`user-component__dropdown user-component__dropdown--${dropdownAlignment}`}>
            <ul>
                <li><a href="#edit-profile" onClick={handleEditProfileClick}><EditProfileIcon /><span>Edit Profile</span></a></li>
                {!!preferencesURL && (
                    <li><a href={preferencesURL}><PreferencesIcon /><span>Preferences</span></a></li>
                )}
                <li><a href="#logout" onClick={handleLogoutClick}><LogoutIcon /><span>Logout</span></a></li>
            </ul>
        </div >
    )

    const renderUserButton = () => (
        <React.Fragment>
            <button
                className={`user-component__user-button ${!!expanded ? 'user-component__user-button--opened' : ''}`}
                aria-haspopup="true"
                aria-expanded={expanded}
                tabIndex="0"
                onClick={handleUserButtonClick}
            >
                {!!user.avatar && (
                    <span
                        className="user-component__user-button-avatar"
                        style={{ backgroundImage: `url(${user.avatar})` }}
                    />
                )}
                <span className="user-component__user-button-name">{user.first_name}</span>
            </button>
            {!!expanded ? renderDropdown() : null}
        </React.Fragment>
    )

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

    // Wait for booya ready event and get instance
    useEffect(() => {
        if (typeof window !== 'undefined' && !!window && !!window.booya) {
            window.booya.ready(function () {
                setBooya(window.booya);
            });
        }
    }, []);

    // Listen for booya events
    useEffect(() => {
        if (booya) {
            handleBooyaEvents();
        }
    }, [booya]);

    // Handle click outside the component
    useEffect(() => {
        function handleClickOutside(event) {
            if (componentRef.current && !componentRef.current.contains(event.target)) {
                setExpanded(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [componentRef]);

    return (
        <div className="user-component" id="contact-component" ref={componentRef}>
            {!!user && !!user.id ? renderUserButton() : (
                <React.Fragment>
                    {/* <button className="user-component__auth-button" onClick={handleSignUpClick}>Sign up</button> */}
                    <button className="user-component__auth-button" onClick={handleLogInClick}>Sign In</button>
                </React.Fragment>
            )}
            <Modal
                modalIsOpen={!!modalOpened}
                closeModal={() => {
                    setModalOpened(false)
                }}
                width="auto"
            >
                <div className="user-component__modal">
                    <div id="booya-wrapper"></div>
                </div>
            </Modal>
        </div>
    );
}

export default User;
