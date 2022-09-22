import React, { useState} from 'react'

const AuthContext = React.createContext({
    isLoggedIn: false,
    onLogout: ()=> {},
    onLogin: () => {},
    joinClicked: false,
    setJoinClicked: () => {},
    onJoinClick: () => {},
    joinedPosition: -1
})

export function AuthContextProvider(props){
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [joinClicked, setJoinClicked] = useState(false)
    const [joinedPosition, setJoinedPosition] = useState(-1)

    const logoutHandler = () => {
        setIsLoggedIn(false)
    }

    const loginHandler = () => {
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