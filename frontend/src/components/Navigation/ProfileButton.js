import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from 'react-redux';
import * as sessionActions from '../../store/session';

function ProfileButton({ user }) {
    const dispatch = useDispatch();
    const [showMenu, setShowMenu] = useState(false);
    const divRef = useRef();

    const openMenu = () => {
        if (showMenu) return;
        setShowMenu(true);
    };

    useEffect(() => {
        if (!showMenu) return;

        const closeMenu = (e) => {
            if (!divRef.current.contains(e.target)) {
                setShowMenu(false);
            }
        };

        document.addEventListener('click', closeMenu);

        return () => document.removeEventListener("click", closeMenu);
    }, [showMenu]);

    const closeMenu = () => setShowMenu(false);

    const logout = (e) => {
        e.preventDefault();
        dispatch(sessionActions.logout());
        closeMenu();
    };

    const divClassName = "profile-dropdown" + (showMenu ? "" : " hidden");

    return (
        <>
            <button className='userIcon-button' onClick={openMenu}>
                <div className='user-icon'>
                    <i className="fa-solid fa-bars"></i>
                    <i className="fa-solid fa-user-ninja"></i>
                </div>
            </button>
            <div className={divClassName} ref={divRef}>
                <div>{user.username}</div>
                <div>{user.firstName} {user.lastName}</div>
                <div>{user.email}</div>
                <div>
                    <button onClick={logout}>
                        Log Out
                    </button>
                </div>
            </div>
        </>
    );
}

export default ProfileButton;
