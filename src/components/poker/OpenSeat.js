import './OpenSeat.css'
import {createPortal} from 'react-dom'
import AuthContext from '../../store/auth-context'
import React, { useContext } from 'react'

function OpenSeat(props){
    const authctx = useContext(AuthContext)
    function clicked(event){
        event.preventDefault()
        authctx.onJoinClick(props.position)
    }
    return (
    createPortal(
    <button className="open-seat" style={props.generatePosition(props.position)} type="button" onClick={clicked}>
        Join
    </button>, document.getElementById('root'))
    )
}

export default OpenSeat