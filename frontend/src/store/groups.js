const LOAD = 'groups/LOAD'
const ONE = 'groups/ONE_GROUP'


//ACTIONS
export const loadGroups = groups => ({
    type: LOAD,
    groups
})

export const singleGroup = group => ({
    type: ONE,
    group: group
})




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
        console.log('-----------One Group Thunk---------', group)
        dispatch(singleGroup(group))
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
        default:
            return state;
    }
};


export default groupsReducer;
