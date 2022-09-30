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
    
    useEffect(function(){
        const cached_login = localStorage.getItem("riskuser") 
        if(cached_login){
            setId(cached_login.id)
            setIsLoggedIn(true)
        }
    }.bind(this), [])

    const logoutHandler = function(){
        setIsLoggedIn(false)
    }

    const loginHandler = function(){
        setIsLoggedIn(true)
    }

    
    return <AuthContext.Provider value={{
        isLoggedIn: isLoggedIn, onLogout: logoutHandler, onLogin: loginHandler, id: id
    }}>{props.children}</AuthContext.Provider>
}
export default AuthContext