import './Root.css'
import React, {useContext, useEffect} from 'react'
import Navbar from './Navbar'
import Footer from './Footer'
import { Outlet } from 'react-router-dom'
import AuthContext from '../../store/auth-context'
import RegisterForm from '../UI/RegisterForm'
import LoginForm from '../UI/LoginForm'
import { useLocation } from 'react-router-dom'

export default function(){
    const authctx = useContext(AuthContext)
    const location = useLocation()
    useEffect(function(){
        const gameTimeout = async function(){
            if(authctx.inGame && location.pathname != '/game/create' && authctx.awayFromGameTimer ){
                let timerVal = setTimeout(function(authctx){
                    authctx.setGameGlobals({awayFromGameTimer: 0, inGame: false, awayTooLong: true})
                }.bind(this, authctx), 45)
                authctx.setGameGlobals({...(authctx.gameGlobals), awayFromGameTimer: timerVal})
            }
            //if(location.pathname != ['/game/create')sock.close("USER/LEFTPAGE")//is this async? 
            //setSock(null) //if so need to make sure this doesnt cause race condition
        }
        gameTimeout()
    }, [location])
    return (
        <div>
            <Navbar />
            <Outlet />
            <RegisterForm/>
            <LoginForm/>
            <Footer />
        </div>
    )
}
