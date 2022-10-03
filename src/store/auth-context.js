import React, { useState} from 'react'
import { useEffect } from 'react'

const AuthContext = React.createContext({
    id: 0,
    isLoggedIn: false,
    onLogout: ()=> {},
    onLogin: () => {},
})

export function AuthContextProvider(props){
    const [id, setId] = useState(0)
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [isLoggingIn, setIsLoggingIn] = useState(false)
    const [isRegistering, setIsRegistering] = useState(false)
    
    useEffect(function(){
        const cached_login = localStorage.getItem("riskuser") 
        if(cached_login){
            setId(cached_login.id)
            setIsLoggedIn(true)
        }
    }.bind(this), [])

    const logoutClickHandler = function(){
        //if in game, leave game, 
        setIsLoggedIn(false)
    }

    const loginHandler = function(){
        //validate with server
        setIsLoggedIn(false)
    }

    const loginClickHandler = function(){
        setIsLoggingIn(true)
    }

    const registerHandler = function(){
        //validate with server
        setIsRegistering(false)
    }

    const registerClickHandler = function(){
        setIsRegistering(true)
    }
    
    return <AuthContext.Provider value={{
        isLoggedIn: isLoggedIn, isRegistering: isRegistering,
        isLoggingIn: isLoggingIn,  id: id,
        onLogin: loginHandler, onLoginClick : loginClickHandler, 
        onLogoutClick: logoutClickHandler, 
        onRegister: registerHandler, onRegisterClick: registerClickHandler,
    }}>{props.children}</AuthContext.Provider>
}
export default AuthContext