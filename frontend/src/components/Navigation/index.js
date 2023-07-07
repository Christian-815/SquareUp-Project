import React from 'react';
import { useHistory, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import OpenModalButton from '../OpenModalButton';
import LoginFormModal from '../LoginFormModal';
import SignupFormModal from '../SignupFormModal';
import Search from '../Search';
import './Navigation.css';

function Navigation({ isLoaded }) {
    const history = useHistory();
    const sessionUser = useSelector(state => state.session.user);

    let sessionLinks;
    if (sessionUser) {
        sessionLinks = (
            <div className='user-loginSignup'>
                <Link to='/groups/new' className='active'>
                    Start a new Group
                </Link>
                <div className='profile-button'>
                    <ProfileButton user={sessionUser} />
                </div>
            </div>
        );
    } else {
        sessionLinks = (
            <div className='user-loginSignup'>
                <div className='login-signup'>
                    <OpenModalButton
                        buttonText="Log In"
                        modalComponent={<LoginFormModal />}
                    />
                </div>
                <div className='login-signup'>
                    <OpenModalButton
                        buttonText="Sign Up"
                        modalComponent={<SignupFormModal />}
                    />
                </div>
            </div>
        );
    }


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
            <Search />
             { isLoaded && sessionLinks }
        </div>
    );
}

export default Navigation;
