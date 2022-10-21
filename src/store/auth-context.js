import React, { useState} from 'react'
import { useEffect } from 'react'
import { socketManager } from '../helpers/SocketManager'
//import { hexStringToInt8Arr } from '../helpers/helpers'

const AuthContext = React.createContext({
    id: 0,
    profilePicBuffer: [],
    gameGlobals: {inGame: false, gameId: 0, awayTooLong: false, awayFromGameTimer: 0, cachedState: null},
    isLoggedIn: false, isRegistering: false,
    isLoggingIn: false,  registerError: false, loginError: false,
    setIsRegistering: ()=> {}, setIsLoggingIn: ()=> {},
    onDevLogin: ()=> {}, setGameGlobals: ()=>{},
    onLogin: ()=> {}, onLoginClick : ()=> {},
    onLogoutClick: ()=> {},
    onRegister: ()=> {}, onRegisterClick: ()=> {},
})

export function AuthContextProvider(props){
    const [id, setId] = useState(0)
    const [JWT, setJWT] = useState(null)
    const [profilePicBuffer, setProfilePicBuffer] = useState([]) //need a default image here
    const [gameGlobals, setGameGlobals] = useState({inGame: false, gameId: 0, awayTooLong: false, awayFromGameTimer: 0, cachedState: null})
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [isLoggingIn, setIsLoggingIn] = useState(false)
    const [loginError, setLoginError] = useState(false)
    const [isRegistering, setIsRegistering] = useState(false)
    const [registerError, setRegisterError] = useState(false)

    
    useEffect(function(){
        const cached_session = localStorage.getItem("risksession") 
        if(cached_session){
            setId(cached_session.user_id)
            setGameGlobals({...cached_session.gameGlobals})
            setIsLoggedIn(true)
        }
    }.bind(this), [])

    useEffect(function(){
        socketManager.setJWT(JWT)
    }, [JWT])

    const logoutClickHandler = function(){
        //if in game, leave game, 
        setIsLoggedIn(false)
    }

    const loginHandler = async function(userName, password){
        var successful = false
        //validate with server
        try{
            const res = await fetch("http://localhost:3001/login", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: userName, 
                    password: password
                })
            })//should be https eventually
            const result = await res.json();
            //console.log(result)
            successful = result.success
            setId(successful ? result.user_id : 0)
            setJWT(result.JWT || null)
            setProfilePicBuffer(result.imageBinary) //need to add default 

        } catch (error){
            console.error(error)
        }
        setIsLoggedIn(successful)
        setLoginError(!successful)
        setIsLoggingIn(!successful)
        console.log(successful);
    }

    const devLoginHandler = async function(){
        var successful = false
        //validate with server
        try{
            const res = await fetch("http://localhost:3001/login", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: 't', 
                    password: 't'
                })
            })//should be https eventually
            const result = await res.json();
            //console.log(result)
            successful = result.success
            setId(successful ? result.user_id : 0)
            setJWT(result.JWT || null)
            //setProfilePicBuffer(result.imageBinary ? hexStringToInt8Arr(result.imageBinary).buffer : "default") //need to add default 
            setProfilePicBuffer(result.imageBinary) //need to add default 
            console.log(profilePicBuffer);
            
        } catch (error){
            console.error(error)
        }
        setIsLoggedIn(successful)
        setLoginError(!successful)
        console.log(successful);
        
    }

    const loginClickHandler = function(){
        setIsLoggingIn(true)
    }

    const registerHandler = async function(fullName, userName, password, email, hexString){
        //validate with server
        var successful = false
        console.log(hexString)
        try{
            const res = await fetch("http://localhost:3001/register", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: fullName,
                    username: userName, 
                    password: password,
                    email: email,
                    imageB: hexString
                })
            })//should be https eventually
            const result = res.json()
            successful = result.success
        } catch (error){
            console.error(error)
        }
        setIsRegistering(!successful)
        setRegisterError(successful)
    }

    const registerClickHandler = function(){
        setIsRegistering(true)
    }

    function createSocket(gid, ws_protos){
        debugger
        const _sock = new WebSocket(`ws://localhost:3001/gamesession/${gid}/${id}`, ws_protos)// hardcoded gameid and userid, need to get dynamically
        setGameGlobals({...gameGlobals, sock: _sock})
    }
    
    return <AuthContext.Provider value={{
        id: id, JWT: JWT,
        gameGlobals: gameGlobals,
        profilePicBuffer: profilePicBuffer,
        isLoggedIn: isLoggedIn, isRegistering: isRegistering,
        isLoggingIn: isLoggingIn,  registerError: registerError, loginError: loginError,
        setIsRegistering: setIsRegistering, setIsLoggingIn: setIsLoggingIn,
        setGameGlobals: setGameGlobals, createSocket: createSocket,
        onDevLogin: devLoginHandler,
        onLogin: loginHandler, onLoginClick : loginClickHandler, 
        onLogoutClick: logoutClickHandler, 
        onRegister: registerHandler, onRegisterClick: registerClickHandler,
    }}>{props.children}</AuthContext.Provider>
}
export default AuthContext