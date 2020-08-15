export const initialState = {
    network: navigator.onLine,
    requests: []
}

export const actionTypes = {
    SET_NETWORK: "SET_NETWORK",
    REQUESTS_UPDATED: "REQUESTS_UPDATED"
}

const reducer = (state, action) => {
    console.log(action);


    switch (action.type) {
        case actionTypes.SET_NETWORK:
            return {
                ...state,
                network: action.network
            }
        case actionTypes.REQUESTS_UPDATED:
            return {
                ...state,
                requests: action.requests
            }
        default:
            return state;
    }
}

export default reducer;