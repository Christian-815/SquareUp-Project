import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';

function Navigation({ isLoaded }) {
    const sessionUser = useSelector(state => state.session.user);
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
            {isLoaded && (
                <div className='profile-button'>
                    <ProfileButton user={sessionUser} />
                </div>
            )}
        </div>
        // <ul>
        //     <li>
        //         <NavLink exact to="/">SquareUp</NavLink>
        //     </li>
        //     {isLoaded && (
        //         <li>
        //             <ProfileButton user={sessionUser} />
        //         </li>
        //     )}
        // </ul>
    );
}

export default Navigation;
