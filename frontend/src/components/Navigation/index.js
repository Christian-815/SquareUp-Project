import React from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import OpenModalButton from '../OpenModalButton';
import LoginFormModal from '../LoginFormModal';
import SignupFormModal from '../SignupFormModal';
import './Navigation.css';

function Navigation({ isLoaded }) {
    const sessionUser = useSelector(state => state.session.user);

    let sessionLinks;
    if (sessionUser) {
        sessionLinks = (
            <div className='profile-button'>
                <ProfileButton user={sessionUser} />
            </div>
        );
    } else {
        sessionLinks = (
            <div className='user-loginSignup'>
                <div>
                    <OpenModalButton
                        buttonText="Log In"
                        modalComponent={<LoginFormModal />}
                    />
                </div>
                <div>
                    <OpenModalButton
                        buttonText="Sign Up"
                        modalComponent={<SignupFormModal />}
                    />
                </div>
            </div>
        );
    }

    const history = useHistory();

    const handleClick = () => {
        history.push('/')
    }

    return (
        <div className='logo'>
            <h1 className='homepage-logo' onClick={handleClick}>
                <div>
                    <i className="fa-solid fa-gamepad"></i>
                    SquareUp
                </div>
            </h1>
             { isLoaded && sessionLinks }
        </div>
    );
}

export default Navigation;
