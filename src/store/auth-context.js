import React, { useState} from 'react'
import { useEffect } from 'react'
import { hexStringToInt8Arr } from '../helpers/helpers'

const AuthContext = React.createContext({
    id: 0,
    profilePicBuffer: [],
    isLoggedIn: false, isRegistering: false,
    isLoggingIn: false,  registerError: false, loginError: false,
    setIsRegistering: ()=> {}, setIsLoggingIn: ()=> {},
    onDevLogin: ()=> {},
    onLogin: ()=> {}, onLoginClick : ()=> {},
    onLogoutClick: ()=> {},
    onRegister: ()=> {}, onRegisterClick: ()=> {},
})

export function AuthContextProvider(props){
    const [id, setId] = useState(0)
    const [profilePicBuffer, setProfilePicBuffer] = useState([]) //need a default image here
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
            debugger
            //console.log(result)
            successful = result.success
            setId(successful ? result.user_id : 0)
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
    
    return <AuthContext.Provider value={{
        id: id,
        profilePicBuffer: profilePicBuffer,
        isLoggedIn: isLoggedIn, isRegistering: isRegistering,
        isLoggingIn: isLoggingIn,  registerError: registerError, loginError: loginError,
        setIsRegistering: setIsRegistering, setIsLoggingIn: setIsLoggingIn,
        onDevLogin: devLoginHandler,
        onLogin: loginHandler, onLoginClick : loginClickHandler, 
        onLogoutClick: logoutClickHandler, 
        onRegister: registerHandler, onRegisterClick: registerClickHandler,
    }}>{props.children}</AuthContext.Provider>
}
export default AuthContext