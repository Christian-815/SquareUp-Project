import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory, useParams } from 'react-router-dom';
import { getOneGroup } from '../../store/groups';
import DeleteGroupModal from '../DeleteGroupModal';
import OpenModalButton from '../OpenModalButton';
import './singleGroup.css'




export default function SingleGroup() {
    const dispatch = useDispatch();
    const history = useHistory()
    const { groupId } = useParams();

    // const groupIdInt = parseInt(groupId)

    const sessionUser = useSelector(state => state.session.user);
    //
    useEffect(() => {
        dispatch(getOneGroup(groupId))
    }, [groupId, dispatch]);


    const groupObj = useSelector(state => state.groups.groups.singleGroup[groupId])
    //

    if (!groupObj) {
        //
        return null;
    }

    //

    const handleUpdateClick = () => {
        history.push(`/groups/${groupId}/edit`)
    }

    const handleEventClick = () => {
        history.push(`/groups/${groupId}/events/new`)
    }

    let userLinks;
    if (!sessionUser) {
        userLinks = (
            <div>
            </div>
        )
    } else if (sessionUser.id === groupObj.organizerId) {
        userLinks = (
            <div className='group-button-div'>
                <button className='group-buttons' onClick={handleEventClick}>
                    Create Event
                </button>
                <button className='group-buttons' onClick={handleUpdateClick}>Update</button>
                <button className='group-buttons'>
                    <OpenModalButton
                        buttonText="Delete"
                        modalComponent={<DeleteGroupModal groupId={groupId} />}
                    />
                </button>
            </div>
        )
    } else {
        userLinks = (
            <div>
                <button className='join-button' onClick={() => alert('Feature coming soon!')}>Join this group</button>
            </div>
        )
    }


    const checkForPreviewImage = (groupImages) => {
        if (groupImages.length) {
            for (let image of groupImages) {
                if (image.preview) {
                    return (
                        <img src={image.url} alt='group logo' className='group-image'></img>
                    )
                }
            }

            return (
                <img src={groupImages[0].url} alt='group logo' className='group-image'></img>
            )
        }

        return (
            <div className='group-image'>
                No images for this group yet
            </div>
        )
    }

    const groupStatus = (groupPrivateOrPublic) => {
        if (!groupPrivateOrPublic) {
            return 'Public'
        } else {
            return 'Private'
        }
    }

    const today = new Date();
    today.setMinutes(today.getMinutes() - today.getTimezoneOffset())
    //

    const turnDateToProperTime = (date) => {
        const properDate = date.substring(0, 16);
        const eventDate = properDate.replace('T', ' • ')

        return eventDate
    }

    let eventsList;
    if (!groupObj.Events.length) {
        eventsList = (
            <div>
                <h2 className='description-header'>No Upcoming Events</h2>
            </div>
        )
    } else {
        const upcomingEvents = [];
        const pastEvents = [];

        groupObj.Events.forEach(event => {
            const eventStartDate = new Date(event.startDate)
            if (eventStartDate.getTime() <= today.getTime()) {
                pastEvents.push(event)
            } else {
                upcomingEvents.push(event)
            }
        });

        if (pastEvents.length && upcomingEvents.length) {
            eventsList = (
                <div>
                    <h2 className='description-header'>Upcoming Events ({upcomingEvents.length})</h2>
                    <section className='events-section'>
                        {upcomingEvents.map(event => (
                            <div className='indiv-group-event' onClick={() => history.push(`/events/${event.id}`)}>
                                <div className='indiv-event-display'>
                                    <div className='indiv-event-display-left'>
                                        {checkForPreviewImage(event.EventImages)}
                                    </div>
                                    <div className='indiv-event-display-right'>
                                        <div className='event-time'>{turnDateToProperTime(event.startDate)}</div>
                                        <div className='event-title'>{event.name}</div>
                                        <div className='event-location'>{groupObj.city}, {groupObj.state}</div>
                                    </div>
                                </div>

                                <div className='indiv-event-description'>{event.description}</div>
                            </div>
                        ))}
                    </section>

                    <h2>Past Events ({pastEvents.length})</h2>
                    <section className='events-section'>
                        {pastEvents.map(event => (
                            <div className='indiv-group-event' onClick={() => history.push(`/events/${event.id}`)}>
                                <div className='indiv-event-display'>
                                    <div className='indiv-event-display-left'>
                                        {checkForPreviewImage(event.EventImages)}
                                    </div>
                                    <div className='indiv-event-display-right'>
                                        <div className='event-time'>{turnDateToProperTime(event.startDate)}</div>
                                        <div className='event-title'>{event.name}</div>
                                        <div className='event-location'>{groupObj.city}, {groupObj.state}</div>
                                    </div>
                                </div>

                                <div className='indiv-event-description'>{event.description}</div>
                            </div>
                        ))}
                    </section>
                </div>
            )
        } else if (!pastEvents.length && upcomingEvents.length) {
            eventsList = (
                <div>
                    <h2 className='description-header'>Upcoming Events ({upcomingEvents.length})</h2>
                    <section className='events-section'>
                        {upcomingEvents.map(event => (
                            <div className='indiv-group-event' onClick={() => history.push(`/events/${event.id}`)}>
                                <div className='indiv-event-display'>
                                    <div className='indiv-event-display-left'>
                                        {checkForPreviewImage(event.EventImages)}
                                    </div>
                                    <div className='indiv-event-display-right'>
                                        <div className='event-time'>{turnDateToProperTime(event.startDate)}</div>
                                        <div className='event-title'>{event.name}</div>
                                        <div className='event-location'>{groupObj.city}, {groupObj.state}</div>
                                    </div>
                                </div>

                                <div className='indiv-event-description'>{event.description}</div>
                            </div>
                        ))}
                    </section>
                </div>
            )
        } else {
            eventsList = (
                <div>
                    <h2 className='description-header'>Past Events ({pastEvents.length})</h2>
                    <section className='events-section'>
                        {pastEvents.map(event => (
                            <div className='indiv-group-event' onClick={() => history.push(`/events/${event.id}`)}>
                                <div className='indiv-event-display'>
                                    <div className='indiv-event-display-left'>
                                        {checkForPreviewImage(event.EventImages)}
                                    </div>
                                    <div className='indiv-event-display-right'>
                                        <div className='event-time'>{turnDateToProperTime(event.startDate)}</div>
                                        <div className='event-title'>{event.name}</div>
                                        <div className='event-location'>{groupObj.city}, {groupObj.state}</div>
                                    </div>
                                </div>

                                <div className='indiv-event-description'>{event.description}</div>
                            </div>
                        ))}
                    </section>
                </div>
            )
        }
    }


    return (
        <div className='group-page'>
            <span className='groups-span'>🡠<Link to='/groups' className='groups-back-link'>Groups</Link></span>
            <div className='group-header'>
                <div className='group-header-left'>
                    {checkForPreviewImage(groupObj.GroupImages)}
                </div>
                <div className='group-header-right'>
                    <div>
                        <h1 className='group-name'>{groupObj.name}</h1>
                        <div>{groupObj.city}, {groupObj.state}</div>
                        <div>
                            Number of events ({groupObj.numEvents})  •  {groupStatus(groupObj.private)}
                        </div>
                        <div>Organized by {groupObj.Organizer.firstName} {groupObj.Organizer.lastName}</div>
                    </div>
                    <div>
                        <div className='group-interaction'>{userLinks}</div>
                    </div>
                </div>
            </div>
            <div className='group-description'>
                <div className='group-description-parts'>
                    <h2 className='description-header'>Organizer</h2>
                    <div className='desciption-subber-organizer'>{groupObj.Organizer.firstName} {groupObj.Organizer.lastName}</div>
                </div>
                <div className='group-description-parts'>
                    <h3 className='description-header'>What we're about</h3>
                    <p className='desciption-subber'>{groupObj.about}</p>
                </div>
                <div>
                    {eventsList}
                </div>
            </div>
        </div>
    )
}
