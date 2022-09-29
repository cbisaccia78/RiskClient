import React, { useState} from 'react'

const AuthContext = React.createContext({
    id: 0,
    isLoggedIn: false,
    onLogout: ()=> {},
    onLogin: () => {},
})

export function AuthContextProvider(props){
    const [id, setId] = useState(0)
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    

    const logoutHandler = function(){
        setIsLoggedIn(false)
    }

    const loginHandler = function(){
        setIsLoggedIn(true)
    }

    
    return <AuthContext.Provider value={{
        isLoggedIn: isLoggedIn, onLogout: logoutHandler, onLogin: loginHandler
    }}>{props.children}</AuthContext.Provider>
}
export default AuthContext