import React, {createContext, useReducer} from 'react'

const initState = {
    user: null
}


if(localStorage.getItem('userData')){
    const userData = JSON.parse(localStorage.getItem('userData'));
    initState.user = userData;
}

const AuthContext = createContext({
    user: null,
    login: (userData) => {},
    logout: () => {}
})

function authReducer(state, action){
    switch(action.type){
        case 'LOGIN':
            return{
                ...state,
                user: action.payload
            }
        case 'LOGOUT':
            return{
                ...state,
                user: null
            }
        default: 
        return state
    }
}

function AuthProvider(props){
    const [state, dispatch] = useReducer(authReducer, initState);

    const login = (userData) => {
        localStorage.setItem('userData', JSON.stringify(userData))
        dispatch({
            type: 'LOGIN',
            payload: userData
        })
    }

    const logout = () => {
        localStorage.removeItem('userData');
        dispatch({type: 'LOGOUT'})
    }
    return(
        <AuthContext.Provider
            value={{user: state.user, login, logout}}
            {...props}
        />
    )
}

export {AuthContext, AuthProvider}