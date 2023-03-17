import { csrfFetch } from './csrf';

const LOAD = 'groups/LOAD'
const ONE = 'groups/ONE_GROUP'
const ADD_GROUP = 'groups/ADD_GROUP'


//ACTIONS
export const loadGroups = groups => ({
    type: LOAD,
    groups
})

export const singleGroup = group => ({
    type: ONE,
    group: group
})

export const addOneGroup = newGroup => ({
    type: ADD_GROUP,
    group: newGroup
});




//THUNKS
export const getAllGroups = () => async dispatch => {
    const response = await fetch('/api/groups')

    if (response.ok) {
        const groups = await response.json();
        // console.log('-----------Groups Thunk---------', groups)
        dispatch(loadGroups(groups))
    }
};

export const getOneGroup = (id) => async dispatch => {
    const response = await fetch(`/api/groups/${id}`)

    if (response.ok) {
        const group = await response.json();
        // console.log('-----------One Group Thunk---------', group)
        dispatch(singleGroup(group))
    }
};

export const createGroup = (newGroup) => async (dispatch) => {
    // console.log('-----------Create Group Thunk---------', JSON.stringify(newGroup))

    const response = await csrfFetch(`/api/groups`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newGroup)
    });

    // console.log('-----------Create Group Thunk after fetch---------')

    if (response.ok) {
        const group = await response.json();
        // console.log('-----------Create Group Thunk---------', group)
        dispatch(addOneGroup(group));
        return group;
    }
};


//INITIAL STATE
const initialState = { groups: {
    allGroups: {},
    singleGroup: {},
    Venues: {}
} }


//REDUCER

const groupsReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOAD:
            const allGroupsState = {...state};
            allGroupsState.groups.allGroups = action.groups
            return allGroupsState
        case ONE:
            const singleGroupState = {...state};
            singleGroupState.groups.singleGroup = action.group;
            return singleGroupState
        case ADD_GROUP:
            const newGroupState = {...state};
            newGroupState.groups.allGroups[action.group.id] = action.group
            return newGroupState
        default:
            return state;
    }
};


export default groupsReducer;
