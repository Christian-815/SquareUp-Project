import { csrfFetch } from './csrf';

const LOAD = 'events/LOAD'
const ONE = 'events/ONE_EVENT'
const ADD_EVENT = 'events/ADD_EVENT'
// const UPDATE_EVENT = 'event/UPDATE'
const DELETE = 'event/DELETE'



//ACTIONS
export const loadEvents = events => ({
    type: LOAD,
    events: events
})

export const singleEvent = event => ({
    type: ONE,
    event: event
})

export const addOneEvent = newEvent => ({
    type: ADD_EVENT,
    event: newEvent
});

// export const updateOneEvent = event => ({
//     type: UPDATE_EVENT,
//     event: event
// })

export const deleteOneEvent = event => ({
    type: DELETE,
    event: event
});





//THUNKS
export const getAllEvents = () => async dispatch => {
    const response = await csrfFetch('/api/events')

    if (response.ok) {
        const events = await response.json();
        dispatch(loadEvents(events))
    }
};

export const getOneEvent = (id) => async dispatch => {
    const response = await csrfFetch(`/api/events/${id}`)

    if (response.ok) {
        const event = await response.json();
        dispatch(singleEvent(event))
    }
};

export const createEvent = (newEvent) => async (dispatch) => {

    const response = await csrfFetch(`/api/groups/${newEvent.groupId}/events`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newEvent)
    });

    if (response.ok) {
        const event = await response.json();
        dispatch(addOneEvent(event));
        return event;
    }
};

// export const updateEvent = (updatedEvent, EventId) => async (dispatch) => {

//     // console.log('==============================', updatedEvent, EventId)

//     const response = await csrfFetch(`/api/Events/${EventId}`, {
//         method: 'PUT',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(updatedEvent)
//     });

//     if (response.ok) {
//         const Event = await response.json();
//         dispatch(updateOneEvent(Event));
//         return Event;
//     }
// };

export const deleteEvent = (event, eventId) => async (dispatch) => {

    // console.log('===================IN THU====================', event, eventId)

    const response = await csrfFetch(`/api/events/${eventId}`, {
        method: 'DELETE'
    });

    if (response.ok) {
        // const event = await response.json();
        dispatch(deleteOneEvent(event));
        // return event;
    }
};

export const addNewEventImage = (eventImage, eventId) => async dispatch => {
    const response = await csrfFetch(`/api/events/${eventId}/images`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventImage)
    });

    if (response.ok) {
        const response = await csrfFetch(`/api/events/${eventId}`)

        if (response.ok) {
            const event = await response.json();
            dispatch(singleEvent(event))
        }
    }
}


//INITIAL STATE
const initialState = {
    Events: {
        allEvents: {},
        singleEvent: {}
    }
}


//REDUCER

const EventsReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOAD:
            const allEventsState = { ...state };
            allEventsState.Events.allEvents = action.events
            return allEventsState
        case ONE:
            const singleEventState = { ...state };
            // console.log('===========', singleEventState)
            singleEventState.Events.singleEvent[action.event.id] = { ...action.event };
            // console.log(singleEventState.Events.singleEvent)
            return singleEventState
        case ADD_EVENT:
            const newEventState = { ...state };
            newEventState.Events.allEvents[action.event.id] = action.event
            return newEventState
        // case UPDATE_EVENT:
        //     const updatedEventState = { ...state };
        //     // console.log(updatedEventState.Events.allEvents.Events)
        //     updatedEventState.Events.allEvents.Events = updatedEventState.Events.allEvents.Events.filter(Event => Event.id !== action.event.id);
        //     // console.log(updatedEventState.Events.allEvents.Events)
        //     updatedEventState.Events.allEvents.Events.push(action.event);
        //     // console.log(updatedEventState.Events.allEvents.Events)
        //     return updatedEventState
        case DELETE:
            const deletedEventState = { ...state };
            // console.log('------------------In Reducer before delete-------------------', deletedEventState.Events.allEvents.Events)
            // delete deletedEventState.Events.allEvents[action.event.id]
            deletedEventState.Events.allEvents.Events = deletedEventState.Events.allEvents.Events.filter(Event => Event.id !== action.event.id)
            // console.log('-----------------In Reducer after delete--------------------', deletedEventState.Events.allEvents.Events)
            return deletedEventState
        default:
            return state;
    }
};


export default EventsReducer;
