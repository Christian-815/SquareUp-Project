import { csrfFetch } from './csrf';

const LOAD = 'groups/LOAD'
const ONE = 'groups/ONE_GROUP'
const ADD_GROUP = 'groups/ADD_GROUP'
const UPDATE_GROUP = 'group/UPDATE'
const DELETE = 'group/DELETE'



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

export const updateOneGroup = group => ({
    type: UPDATE_GROUP,
    group: group
})

export const deleteOneGroup = group => ({
    type: DELETE,
    group: group
});





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

export const createGroup = (newGroup, groupImage) => async (dispatch) => {

    const response = await csrfFetch(`/api/groups`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newGroup)
    });

    if (response.ok) {
        const group = await response.json();

        const { url, preview } = groupImage;
        const formData = new FormData();
        formData.append('preview', preview)
        if (url) formData.append("url", url);

        const imageResponse = await csrfFetch(`/api/groups/${group.id}/images`, {
            method: 'POST',
            headers: { 'Content-Type': 'multipart/form-data' },
            body: formData
        });

        if (imageResponse.ok) {
            dispatch(addOneGroup(group));
            dispatch(getAllGroups())
            return group;
        }
    }
};

export const updateGroup = (updatedGroup, groupId) => async (dispatch) => {

    //

    const response = await csrfFetch(`/api/groups/${groupId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedGroup)
    });

    if (response.ok) {
        const group = await response.json();
        dispatch(updateOneGroup(group));
        return group;
    }
};

export const deleteGroup = (group, groupId) => async (dispatch) => {

    //

    const response = await csrfFetch(`/api/groups/${groupId}`, {
        method: 'DELETE'
    });

    if (response.ok) {
        // const group = await response.json();
        dispatch(deleteOneGroup(group));
        dispatch(getAllGroups())
        // return group;
    }
};


//INITIAL STATE
const initialState = {
    groups: {
        allGroups: {},
        singleGroup: {}
    }
}


//REDUCER

const groupsReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOAD:
            const allGroupsState = { ...state };
            allGroupsState.groups.allGroups = action.groups
            return allGroupsState
        case ONE:
            const singleGroupState = { ...state };
            //
            singleGroupState.groups.singleGroup[action.group.id] = { ...action.group };
            //
            return singleGroupState
        case ADD_GROUP:
            const newGroupState = { ...state };
            newGroupState.groups.allGroups.Groups.push(action.group)
            return newGroupState
        case UPDATE_GROUP:
            const updatedGroupState = { ...state };
            //
            updatedGroupState.groups.allGroups.Groups = updatedGroupState.groups.allGroups.Groups.filter(group => group.id !== action.group.id);
            //
            updatedGroupState.groups.allGroups.Groups.push(action.group);
            //
            return updatedGroupState
        case DELETE:
            const deletedGroupState = { ...state };
            //
            // delete deletedGroupState.groups.allGroups[action.group.id]
            deletedGroupState.groups.allGroups.Groups = deletedGroupState.groups.allGroups.Groups.filter(group => group.id !== action.group.id)
            //
            return deletedGroupState
        default:
            return state;
    }
};


export default groupsReducer;
