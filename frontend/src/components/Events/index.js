import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, Link, useHistory } from 'react-router-dom';
import { getAllEvents } from '../../store/events';
import './events.css';


export default function Events() {
    const dispatch = useDispatch();
    const history = useHistory();

    const routeChange = (eventId) => {
        let path = `/events/${eventId}`;
        history.push(path);
    }

    useEffect(() => {
        dispatch(getAllEvents())
    }, [dispatch]);

    const eventsObj = useSelector(state => state.events.Events.allEvents);

    if (!Object.values(eventsObj).length) {
        return null;
    }

    const events = eventsObj.Events



    const hasPreview = (previewImage) => {
        if (!previewImage) {
            return 'No preview image for this event'
        } else {
            return previewImage
        }
    }
    const turnDateToProperTime = (date) => {
        const proper = new Date(date);
        proper.setMinutes(proper.getMinutes() - proper.getTimezoneOffset())
        const properDate = proper.toISOString().substring(0, 16)
        console.log(date)
        // const properDate = date.substring(0, 16);
        const eventDate = properDate.replace('T', ' • ')

        return eventDate
    }


    return (
        <div className='events-page'>
            <div className='show-list'>
                <NavLink to='/events' activeClassName='active-list'>
                    <h1>Events</h1>
                </NavLink>
                <Link to='/groups' className='unactive-list'>
                    <h1>Groups</h1>
                </Link>
            </div>
            <div className='list-description'>Events in SquareUp</div>
            <div>
                {events.map((event) => (
                    <div key={event.id} className='individual-events' onClick={() => routeChange(event.id)}>
                        <div className='event-div-top'>
                            <div className='event-div-left'>
                                <img src={hasPreview(event.previewImage)} alt='event' className='event-image'></img>
                            </div>
                            <div className='event-div-right'>
                                <div className='event-time'>{turnDateToProperTime(event.startDate)}</div>
                                <div className='event-title'>
                                    {event.name}
                                </div>
                                <div className='event-location'>{event.Venue.city}, {event.Venue.state}</div>
                            </div>
                        </div>
                        <div className='event-div-bottom'>
                            {event.description}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
