import React, { useState, useEffect } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import "./LoginForm.css";

function LoginFormModal() {
    const dispatch = useDispatch();
    const [credential, setCredential] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({});
    const { closeModal } = useModal();
    // const [disabled, setDisabled] = useState(true)

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrors({});
        return dispatch(sessionActions.login({ credential, password }))
            .then(closeModal)
            .catch(
                async (res) => {
                    const data = await res.json();
                    //
                    if (data && data.message) setErrors({
                        message: data.message
                    });
                    //
                }
            );
    };

    // useEffect(() => {
    //     if (credential.length >= 4 && password.length >= 6) {
    //         setDisabled(false)
    //     } else {
    //         setDisabled(true)
    //     }
    // }, [credential, password])

    const handleClick = () => {
        setCredential('Demo-lition');
        setPassword('password')
    }



    return (
        <>
            <div className="login-form">
                <div className="login-logo">
                    <i className="fa-solid fa-gamepad"></i>
                </div>
                <h2 className="login-header">Log In</h2>
                <form onSubmit={handleSubmit} >
                    <ul className="login-error">
                        {errors.message}
                    </ul>
                    <label className="username-input-title">
                        Username or Email
                        <input
                            type="text"
                            value={credential}
                            onChange={(e) => setCredential(e.target.value)}
                            required
                            className="input-box"
                        />
                    </label>
                    <label className="userpassword-input-title">
                        Password
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="input-box"
                        />
                    </label>
                    <button className="login-submit-button" type="submit" >Log In</button>
                    <div className="button-seperator">OR</div>
                    <button className="login-submit-button" type='submit' onClick={handleClick}>Demo Login</button>
                </form>
            </div>
        </>
    );
};

export default LoginFormModal;
