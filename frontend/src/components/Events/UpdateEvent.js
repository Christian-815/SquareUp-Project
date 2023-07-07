import React, { useState } from "react";
import { useHistory, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { updateEvent } from "../../store/events";
// import './NewEvent.css'

export default function UpdateEvent({ events }) {
    const dispatch = useDispatch();
    const history = useHistory();
    const { eventId } = useParams();

    const groupsObj = useSelector(state => state.groups.groups.allGroups.Groups)
    //
    const currentEvent = events.Events.filter(event => event.id === parseInt(eventId))[0]
    console.log(currentEvent)

    const group = groupsObj.filter(group => group.id === parseInt(currentEvent.groupId))
    //

    const today = new Date();
    today.setMinutes(today.getMinutes() - today.getTimezoneOffset() + 60)
    const todayDate = today.toISOString().substring(0, 16)

    const datePast = new Date()
    datePast.setMinutes(datePast.getMinutes() - datePast.getTimezoneOffset() + 60)
    const pastDate = datePast.toISOString().substring(0, 16)
    // console.log(todayDate, '----', pastDate)


    const [errors, setErrors] = useState({});
    const [imageError, setImageError] = useState({});
    const [timeError, setTimeError] = useState({});
    const [venueId, setVenueId] = useState(1);
    const [groupId, setGroupId] = useState(group.id);
    const [name, setName] = useState(currentEvent.name);
    const [description, setDescription] = useState(currentEvent.description);
    const [type, setType] = useState(currentEvent.type);
    const [capacity, setCapacity] = useState(100);
    const [price, setPrice] = useState(currentEvent.price);
    const [startDate, setStartDate] = useState(currentEvent.startDate);
    const [endDate, setEndDate] = useState(currentEvent.endDate);
    const [eventImage, setEventImage] = useState(null);


    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});

        const payload = {
            venueId,
            groupId: parseInt(groupId),
            name,
            description,
            type,
            capacity,
            price,
            startDate,
            endDate
        }
        // if (!eventImage) {
        //     return setImageError({ imgError: 'Image must be uploaded.' })
        // } else {
        //     setImageError({})
        // }
        if (!startDate) {
            return setTimeError({ startDate: "Please choose a start date and time." })
        } else if (!endDate) {
            return setTimeError({ endDate: "Please choose a end date and time." })
        } else if (start.getTime() < today.getTime()) {
            return setTimeError({ startDate: "Start date must be in the future" })
        } else if (start.getTime() >= end.getTime()) {
            return setTimeError({ endDate: "End date is before or the same as thestart date" })
        } else {
            setTimeError({})
        }


        // const imagePayload = {
        //     url: eventImage,
        //     preview: true
        // }

        let updatedEvent = await dispatch(updateEvent(payload, eventId)).catch(
            async (res) => {
                const data = await res.json();

                if (data && data.errors) setErrors(data.errors);
            }
        );

        if (updatedEvent) {
            history.push(`/events/${updatedEvent.id}`)
        }

    };

    const start = new Date(startDate);
    const end = new Date(endDate);

    // const updateFile = (e) => {
    //     const file = e.target.files[0];
    //     if (file) setEventImage(file);
    // };

    return (
        <div className="new-event-page">
            <div>
                <div className="new-event-header">
                    <h3>Update {currentEvent.name} Event</h3>
                </div>
                <form onSubmit={handleSubmit} className='new-event-form'>

                    <section className='new-event-section'>
                        <div>
                            <div>
                                What is the name of your event?
                            </div>
                        </div>

                        <div>
                            <input
                                type='text'
                                placeholder="Event Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>

                        <ul className='event-popup-error'>
                            {errors.name && (
                                <li key={errors.name}>{errors.name}</li>
                            )}
                        </ul>

                    </section>

                    <section className='new-event-section'>

                        <div>Is this an in person or online group?</div>
                        <div>
                            <select onChange={(e) => setType(e.target.value)}>
                                <option value=''>{type}</option>
                                <option value='Online'>Online</option>
                                <option value='In person'>In person</option>
                            </select>

                            <ul className='event-popup-error'>
                                {errors.type && (
                                    <li key={errors.type}>{errors.type}</li>
                                )}
                            </ul>
                        </div>

                        <span>What is the price for your event?</span>
                        <div>
                            <input
                                type='text'
                                placeholder="$0.00"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                            />
                        </div>

                        <ul className='event-popup-error'>
                            {errors.price && (
                                <li key={errors.price}>{errors.price}</li>
                            )}
                        </ul>

                    </section>

                    <section className='new-event-section'>

                        <div>
                            <div>
                                When does your event start?
                            </div>
                            <div>
                                (event must start at least 1 hour from current local time)
                            </div>
                        </div>

                        <div>
                            <input
                                type='datetime-local'
                                value={startDate}
                                min={todayDate}
                                onChange={(e) => setStartDate(e.target.value)}
                            />
                        </div>
                        <ul className='event-popup-error'>
                            {timeError.startDate && (
                                <li key={timeError.startDate}>{timeError.startDate}</li>
                            )}
                        </ul>

                        <div>
                            <div>
                                When does your event end?
                            </div>
                        </div>

                        <div>
                            <input
                                type='datetime-local'
                                value={endDate}
                                min={pastDate}
                                onChange={(e) => setEndDate(e.target.value)}
                            />
                        </div>

                        <ul className='event-popup-error'>
                            {timeError.endDate && (
                                <li key={timeError.endDate}>{timeError.endDate}</li>
                            )}
                        </ul>

                    </section>

                    {/* <section className='new-event-section'>
                        <div>
                            <div>
                                Please upload an image for your event below:
                            </div>
                        </div>

                        <div>
                            <input
                                type='file'
                                accept="image/png, image/jpeg, image/jpg"
                                onChange={updateFile}
                            />
                        </div>

                        <ul className='event-popup-error'>
                            {imageError.imgError && (
                                <li key={imageError.imgError}>{imageError.imgError}</li>
                            )}
                        </ul>

                    </section> */}

                    <section className='new-event-section'>
                        <div>
                            Please describe your event:
                        </div>

                        <div>
                            <textarea
                                type='textbox'
                                placeholder="Please write at least 30 characters"
                                rows={7}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="new-event-description"
                            />
                        </div>

                        <ul className='event-popup-error'>
                            {errors.description && (
                                <li key={errors.description}>{errors.description}</li>
                            )}
                        </ul>

                    </section>


                    <section>
                        <button type="submit" className='join-squareUp'>Update Event</button>
                    </section>

                </form>
            </div>
        </div>
    );
};
