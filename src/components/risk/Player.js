import './Player.css'
import {createPortal} from 'react-dom'
import React from 'react'

function Player(props){
    let data = props.data
    //console.log(data);
    let p = (
    <>
        <button className='player' style={props.generatePosition(data.table_position)}>
            <img src={data.profilePicBuffer} alt={data.name}/>
        </button>
    </>
    )
    return (
    //createPortal(
        p//, document.getElementById('root'))
    )
}

export default Player