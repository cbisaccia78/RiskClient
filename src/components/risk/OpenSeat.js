import './OpenSeat.css'
import {createPortal} from 'react-dom'
import React, { useContext } from 'react'

function OpenSeat(props){
    return (
    createPortal(
    <button className="open-seat" style={props.generatePosition(props.position)} type="button" onClick={props.joinClickHandler}>
        Join
    </button>, document.getElementById('root'))
    )
}

export default OpenSeat