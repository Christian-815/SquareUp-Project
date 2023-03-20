import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { useModal } from "../../context/Modal";
import { deleteGroup } from "../../store/groups";


export default function DeleteGroupModal({ groupId }) {
    const { closeModal } = useModal();
    const dispatch = useDispatch();
    const history = useHistory();



    const groupObj = useSelector(state => state.groups.groups.allGroups)

    const group = groupObj.Groups.filter(group => group.id === parseInt(groupId))


    const handleNoClick = (e) => {
        e.preventDefault();
        closeModal()
    };

    const handleYesClick = (e) => {
        e.preventDefault();
        dispatch(deleteGroup(group, groupId)).then(closeModal)
        history.push('/groups')
    }


    return (
        <>
            <div className="login-form">
                <div className="login-logo">
                    <i className="fa-solid fa-gamepad"></i>
                </div>
                <h2 className="login-header">Confirm Delete</h2>
                <div>Are you sure you want to remove this group?</div>
                <button className="login-submit-button" type="submit" onClick={handleYesClick}>Yes (Delete group)</button>
                <div className="button-seperator">OR</div>
                <button className="login-submit-button" type='submit' onClick={handleNoClick}>No (Keep group)</button>
            </div>
        </>
    );
}
