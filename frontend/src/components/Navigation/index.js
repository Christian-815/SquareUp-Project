import React from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import OpenModalButton from '../OpenModalButton';
import LoginFormModal from '../LoginFormModal';
import SignupFormModal from '../SignupFormModal';
import './Navigation.css';
import GroupFormModal from '../Groups/NewGroupModal';

function Navigation({ isLoaded }) {
    const sessionUser = useSelector(state => state.session.user);

    let sessionLinks;
    if (sessionUser) {
        sessionLinks = (
            <div className='user-loginSignup'>
                <div>
                    <div>
                        <OpenModalButton
                            buttonText="Start a new group"
                            modalComponent={<GroupFormModal />}
                        />
                    </div>
                </div>
                <div className='profile-button'>
                    <ProfileButton user={sessionUser} />
                </div>
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
