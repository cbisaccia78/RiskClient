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
    const [loginError, setLoginError] = useState(false)
    const [isRegistering, setIsRegistering] = useState(false)
    const [registerError, setRegisterError] = useState(false)

    
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

    const loginHandler = function(userName, password){
        var successful = false
        //validate with server
        setIsLoggedIn(successful)
        setLoginError(successful)
        setIsLoggingIn(false)
    }

    const loginClickHandler = function(){
        setIsLoggingIn(true)
    }

    const registerHandler = function(fullName, userName, password, email, bString){
        //validate with server
        var successful = false
        setIsRegistering(successful)
        setRegisterError(successful)
    }

    const registerClickHandler = function(){
        setIsRegistering(true)
    }
    
    return <AuthContext.Provider value={{
        id: id,
        isLoggedIn: isLoggedIn, isRegistering: isRegistering,
        isLoggingIn: isLoggingIn,  registerError: registerError, loginError: loginError,
        onLogin: loginHandler, onLoginClick : loginClickHandler, 
        onLogoutClick: logoutClickHandler, 
        onRegister: registerHandler, onRegisterClick: registerClickHandler,
    }}>{props.children}</AuthContext.Provider>
}
export default AuthContext