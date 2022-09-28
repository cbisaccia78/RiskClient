import React, { useState} from 'react'

const AuthContext = React.createContext({
    id: 0,
    isLoggedIn: false,
    onLogout: ()=> {},
    onLogin: () => {},
    joinClicked: false,
    setJoinClicked: () => {},
    onJoinClick: () => {},
    joinedPosition: -1
})

export function AuthContextProvider(props){
    const [id, setId] = useState(0)
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [joinClicked, setJoinClicked] = useState(false)
    const [joinedPosition, setJoinedPosition] = useState(-1)

    const logoutHandler = function(){
        setIsLoggedIn(false)
    }

    const loginHandler = function(){
        setIsLoggedIn(true)
    }

    const joinHandler = (position) =>{
        setJoinClicked(true)
        setJoinedPosition(position)
    }
    return <AuthContext.Provider value={{
        isLoggedIn: isLoggedIn, onLogout: logoutHandler, onLogin: loginHandler, 
        joinClicked: joinClicked, setJoinClicked: setJoinClicked, onJoinClick: joinHandler,
        joinedPosition: joinedPosition
    }}>{props.children}</AuthContext.Provider>
}
export default AuthContext