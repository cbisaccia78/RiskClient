import './OpenSeat.css'
import {createPortal} from 'react-dom'
import React, { useContext } from 'react'

function OpenSeat(props){

    const joinWithPosition = function(){
        if(!props.joined){
            props.joinClickHandler()
            props.setJoinedPosition(props.position)
        }
    }
    return (
    //createPortal(
    <button className="open-seat" style={props.generatePosition(props.position)} type="button" onClick={joinWithPosition}>
        Join
    </button>//, document.getElementById('root'))
    )
}

export default OpenSeat