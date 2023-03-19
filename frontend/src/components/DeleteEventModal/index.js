import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { useModal } from "../../context/Modal";
import { deleteEvent } from "../../store/events";


export default function DeleteEventModal({ eventId }) {
    const { closeModal } = useModal();
    const dispatch = useDispatch();
    const history = useHistory();
    // console.log(parseInt(eventId))


    const eventObj = useSelector(state => state.events.Events.allEvents)

    const event = eventObj.Events.filter(event => event.id === parseInt(eventId))
    console.log('-----------event-----------', event[0].Group.id)

    const handleNoClick = (e) => {
        e.preventDefault();
        closeModal()
    };

    const handleYesClick = (e) => {
        e.preventDefault();
        dispatch(deleteEvent(event, eventId)).then(closeModal)
        history.push(`/groups/${event[0].Group.id}`)
    }


    return (
        <>
            <div className="login-form">
                <div className="login-logo">
                    <i className="fa-solid fa-gamepad"></i>
                </div>
                <h2 className="login-header">Confirm Delete</h2>
                <div>Are you sure you want to remove this event?</div>
                <button className="login-submit-button" type="submit" onClick={handleYesClick}>Yes (Delete event)</button>
                <div className="button-seperator">OR</div>
                <button className="login-submit-button" type='submit' onClick={handleNoClick}>No (Keep event)</button>
            </div>
        </>
    );
}
