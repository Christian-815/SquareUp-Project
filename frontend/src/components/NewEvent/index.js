import React, { useState } from "react";
import { useHistory, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { addNewEventImage, createEvent } from "../../store/events";
import './NewEvent.css'

export default function EventForm() {
    const dispatch = useDispatch();
    const history = useHistory();
    const { groupid } = useParams();

    const groupsObj = useSelector(state => state.groups.groups.allGroups.Groups)
    //
    const group = groupsObj.filter(group => group.id === parseInt(groupid))
    //

    const today = new Date();
    today.setMinutes(today.getMinutes() - today.getTimezoneOffset())
    const todayDate = today.toISOString().substring(0, 16)

    const datePast = new Date()
    datePast.setMinutes(datePast.getMinutes() - datePast.getTimezoneOffset() + 60)
    const pastDate = datePast.toISOString().substring(0, 16)


    const [errors, setErrors] = useState({});
    const [imageError, setImageError] = useState({});
    const [venueId, setVenueId] = useState(1);
    const [groupId, setGroupId] = useState(groupid);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [type, setType] = useState('');
    const [capacity, setCapacity] = useState(100);
    const [price, setPrice] = useState();
    const [startDate, setStartDate] = useState(todayDate);
    const [endDate, setEndDate] = useState(pastDate);
    const [eventImage, setEventImage] = useState();


    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});

        const payload = {
            venueId,
            groupId,
            name,
            description,
            type,
            capacity,
            price,
            startDate,
            endDate
        }

        let newEvent = await dispatch(createEvent(payload)).catch(
            async (res) => {
                const data = await res.json();

                if (data && data.errors) setErrors(data.errors);
            }
        );



        if (!eventImage) {
            setEventImage('image.png')
        }


        if (newEvent) {
            const imagePayload = {
                url: eventImage,
                preview: true
            }

            dispatch(addNewEventImage(imagePayload, newEvent.id))

            history.push(`/events/${newEvent.id}`)
        }
    };

    const timeErrors = {};
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start.getTime() < today.getTime()) {
        timeErrors.startDate = "Start date must be in the future"
    };

    if (start.getTime() > end.getTime()) {
        timeErrors.endDate = "End date is less than start date"
    };

    const checkEventImage = () => {
        const imageTypes = ['png', 'jpg', 'jpeg']
        const imageUrlFormatCorrect = eventImage.split('.')

        if (!imageTypes.includes(imageUrlFormatCorrect[imageUrlFormatCorrect.length - 1])) {
            setImageError({
                imgError: 'Image URL must end in .png, .jpg, or .jpeg'
            })
        } else {
            setImageError({})
        }
    }

    return (
        <div className="new-event-page">
            <div>
                <div className="new-event-header">
                    <h3>Create an Event for {group[0].name}</h3>
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
                                <option value=''>(select one)</option>
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
                        </div>

                        <div>
                            <input
                                type='datetime-local'
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                            />
                        </div>
                        <ul className='event-popup-error'>
                            {timeErrors.startDate && (
                                <li key={timeErrors.startDate}>{timeErrors.startDate}</li>
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
                                onChange={(e) => setEndDate(e.target.value)}
                            />
                        </div>

                        <ul className='event-popup-error'>
                            {timeErrors.endDate && (
                                <li key={timeErrors.endDate}>{timeErrors.endDate}</li>
                            )}
                        </ul>

                    </section>

                    <section className='new-event-section'>
                        <div>
                            <div>
                                Please add in image url for your event below:
                            </div>
                            <div>
                                If you don't have an image at the moment, leave input blank and we will provide a default image for you.
                            </div>
                        </div>

                        <div>
                            <input
                                type='text'
                                placeholder="Image URL"
                                value={eventImage}
                                onChange={(e) => setEventImage(e.target.value)}
                                onBlur={() => checkEventImage(eventImage)}
                            />
                        </div>

                        {/* {checkImageError(() => checkEventImage(eventImage))} */}

                        <ul className='event-popup-error'>
                            {imageError.imgError && (
                                <li key={imageError.imgError}>{imageError.imgError}</li>
                            )}
                        </ul>

                    </section>

                    <section className='new-event-section'>
                        <div>
                            Please describe your event:
                        </div>

                        <div>
                            <input
                                type='text'
                                placeholder="Please write at least 30 characters"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                size={35}
                            />
                        </div>

                        <ul className='event-popup-error'>
                            {errors.description && (
                                <li key={errors.description}>{errors.description}</li>
                            )}
                        </ul>

                    </section>


                    <section>
                        <button type="submit" className='join-squareUp'>Create Event</button>
                    </section>

                </form>
            </div>
        </div>
    );
};
