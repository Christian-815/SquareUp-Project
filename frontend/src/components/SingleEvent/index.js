import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory, useParams } from 'react-router-dom';
import { getOneEvent } from '../../store/events';
import DeleteEventModal from '../DeleteEventModal';
import OpenModalButton from '../OpenModalButton';
import './singleEvent.css'




export default function SingleEvent() {
    const dispatch = useDispatch();
    const history = useHistory();
    const { eventId } = useParams();

    // const eventIdInt = parseInt(eventId)

    const sessionUser = useSelector(state => state.session.user);
    // console.log(sessionUser)
    useEffect(() => {
        dispatch(getOneEvent(eventId))
    }, [eventId, dispatch]);


    const eventObj = useSelector(state => state.events.Events.singleEvent[eventId])
    // console.log('----------EVENT OBJECT--------------------------', eventObj)

    if (!eventObj) {
        // console.log('-------------event obj bad---------', eventObj)
        return null;
    }

    // console.log('***************************', eventObj)

    // const handleUpdateClick = () => {
    //     history.push(`/events/${eventId}/edit`)
    // }


    let userLinks;
    if (!sessionUser) {
        userLinks = (
            <></>
        )
    } else if (sessionUser.id === eventObj.Host.id) {
        userLinks = (
            <div className='owner-interact'>
                <button>Update Event</button>
                <button>
                    <OpenModalButton
                        buttonText="Delete"
                        modalComponent={<DeleteEventModal eventId={eventId} />}
                    />
                </button>
            </div>
        )
    } else {
        userLinks = (
            <></>
        )
    }


    const checkForEventPreviewImage = (eventImages) => {
        if (eventImages.length) {
            for (let image of eventImages) {
                if (image.preview) {
                    return (
                        <img src={image.url} alt='event logo' className='event-image'></img>
                    )
                }
            }

            return (
                <img src={eventImages[0].url} alt='event logo' className='event-image'></img>
            )
        }

        return (
            <div className='group-image'>
                No images for this group yet
            </div>
        )
    }

    const checkForGroupPreviewImage = (eventImages) => {
        if (eventImages) {
            return (
                <img src={eventImages.url} alt='event logo' className='event-group-image'></img>
            )
        }

        return (
            <div className='event-image'>
                No images for this event yet
            </div>
        )
    }

    const status = (PrivateOrPublic) => {
        if (!PrivateOrPublic) {
            return 'Public'
        } else {
            return 'Private'
        }
    }

    const handleClick = (groupId) => {
        history.push(`/groups/${groupId}`)
    }



    return (
        <div className='event-page'>
            <div>
                <span className='events-span'>🡠<Link to='/events' className='events-back-link'>Events</Link></span>
                <h1>{eventObj.name}</h1>
                <div className='event-host'>Hosted by {eventObj.Host.firstName} {eventObj.Host.lastName}</div>
            </div>
            <div>
                <div className='event-header'>
                    <div className='event-header-left'>
                        {checkForEventPreviewImage(eventObj.EventImages)}
                    </div>
                    <div className='event-header-right'>
                        <div className='event-group' onClick={() => handleClick(eventObj.Group.id)}>
                            <div className='event-group-left'>
                                {checkForGroupPreviewImage(eventObj.GroupImage)}
                            </div>
                            <div className='event-group-right'>
                                <div>{eventObj.Group.name}</div>
                                <div className='event-lighterShade'>{status(eventObj.Group.private)}</div>
                            </div>
                        </div>

                        <div className='event-info-block'>
                            <div className='event-info'>
                                <div className='event-icons'>
                                    <div>
                                        <i class="fa-regular fa-clock"></i>
                                    </div>
                                    <div className='event-lighterShade'>
                                        <div>START</div>
                                        <div>END</div>
                                    </div>
                                    <div className='event-time'>
                                        <div>{eventObj.startDate}</div>
                                        <div>{eventObj.endDate}</div>
                                    </div>
                                </div>

                                <div className='event-icons'>
                                    <div>
                                        <i class="fa-sharp fa-solid fa-coins"></i>
                                    </div>
                                    <div>
                                        <div className='event-lighterShade'>{eventObj.price}</div>
                                    </div>
                                </div>

                                <div className='event-icons'>
                                    <div>
                                        <i class="fa-solid fa-map-location-dot"></i>
                                    </div>
                                    <div>
                                        <div className='event-lighterShade'>{eventObj.type}</div>
                                    </div>
                                </div>

                                <div className='event-owner'>
                                    <div className='event-interaction'>{userLinks}</div>
                                </div>

                            </div>


                        </div>
                    </div>
                </div>
                <div className='event-description'>
                    <div>
                        <h2>Details</h2>
                    </div>
                    <div>
                        <p>{eventObj.description}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
