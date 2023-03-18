import { csrfFetch } from './csrf';

const LOAD = 'groups/LOAD'
const ONE = 'groups/ONE_GROUP'
const ADD_GROUP = 'groups/ADD_GROUP'
// const EDIT = '/groups/:groupId/EDIT'


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

// export const editGroup = editedGroup => ({
//     type: EDIT,
//     group: editedGroup
// })




//THUNKS
export const getAllGroups = () => async dispatch => {
    const response = await fetch('/api/groups')

    if (response.ok) {
        const groups = await response.json();
        dispatch(loadGroups(groups))
    }
};

export const getOneGroup = (id) => async dispatch => {
    const response = await fetch(`/api/groups/${id}`)

    if (response.ok) {
        const group = await response.json();
        dispatch(singleGroup(group))
    }
};

export const createGroup = (newGroup) => async (dispatch) => {

    const response = await csrfFetch(`/api/groups`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newGroup)
    });

    if (response.ok) {
        const group = await response.json();
        dispatch(addOneGroup(group));
        return group;
    }
};

export const updateGroup = (updatedGroup, groupId) => async (dispatch) => {

    // console.log('==============================', updatedGroup, groupId)

    const response = await csrfFetch(`/api/groups/${groupId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedGroup)
    });

    if (response.ok) {
        const group = await response.json();
        dispatch(addOneGroup(group));
        return group;
    }
};


//INITIAL STATE
const initialState = { groups: {
    allGroups: {},
    singleGroup: {}
}}


//REDUCER

const groupsReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOAD:
            const allGroupsState = {...state};
            allGroupsState.groups.allGroups = action.groups
            return allGroupsState
        case ONE:
            const singleGroupState = {...state};
            // console.log('===========', singleGroupState)
            singleGroupState.groups.singleGroup[action.group.id] = {...action.group};
            // console.log(singleGroupState.groups.singleGroup)
            return singleGroupState
        case ADD_GROUP:
            const newGroupState = {...state};
            newGroupState.groups.allGroups[action.group.id] = action.group
            return newGroupState
        // case EDIT:

        default:
            return state;
    }
};


export default groupsReducer;
