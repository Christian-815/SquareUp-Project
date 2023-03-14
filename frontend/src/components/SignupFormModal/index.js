import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import * as sessionActions from "../../store/session";
import './SignupForm.css';

function SignupFormModal() {
    const dispatch = useDispatch();
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errors, setErrors] = useState({});
    const { closeModal } = useModal();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (password === confirmPassword) {
            setErrors({});
            return dispatch(sessionActions.signup({ email, username, firstName, lastName, password }))
                .then(closeModal)
                .catch(async (res) => {
                    const data = await res.json();
                    // console.log(data)
                    if (data && data.error) setErrors(data.error);
                    // console.log(errors)
                });
        }
        return setErrors({
            password: 'Confirm Password field must be the same as the Password field'
        });
    };

    return (
        <>
            <div className="popup-form">
                <div className="popup-logo">
                    <i className="fa-solid fa-gamepad"></i>
                </div>
                <h1 className="popup-header">Sign Up</h1>
                <form onSubmit={handleSubmit}>
                    <label className='input-title'>
                        Email
                        <input
                            type="text"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className='input-box'
                        />
                    </label>
                    <ul className='popup-error email'>
                        {errors.email && (
                            <li key={errors.email}>{errors.email}</li>
                        )}
                    </ul>
                    <label className='input-title'>
                        Username
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            className='input-box'
                        />
                    </label>
                    <ul className='popup-error username'>
                        {errors.username && (
                            <li key={errors.username}>{errors.username}</li>
                        )}
                    </ul>
                    <label className='input-title'>
                        First Name
                        <input
                            type="text"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            required
                            className='input-box'
                        />
                    </label>
                    <label className='input-title'>
                        Last Name
                        <input
                            type="text"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            required
                            className='input-box'
                        />
                    </label>
                    <label className='input-title'>
                        Password
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className='input-box'
                        />
                    </label>
                    <ul className='popup-error password'>
                        {errors.password && (
                            <li key={errors.password}>{errors.password}</li>
                        )}
                    </ul>
                    <label className='input-title'>
                        Confirm Password
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            className='input-box'
                        />
                    </label>
                    <button type="submit" className="popup-submit-button">Sign Up</button>
                </form>
            </div>
        </>
    );
}

export default SignupFormModal;
