const LOAD = 'groups/LOAD'



//ACTIONS
export const loadGroups = groups => ({
    type: LOAD,
    groups
})




//THUNKS
const getAllGroups = () => async dispatch => {
    const response = await fetch('/api/groups')

    if (response.ok) {
        const groups = await response.json();
        console.log(groups)
        dispatch(loadGroups(groups))
    }
}


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
            const newState = {...state};
            newState.groups.allGroups = action.groups
            return newState
        default:
            return state;
    }
};


export default groupsReducer;
