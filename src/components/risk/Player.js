import './Player.css'
import {createPortal} from 'react-dom'
import React from 'react'

function Player(props){
    let data = props.data
    return (
    createPortal(
    <button className='player' style={props.generatePosition(data.position)}>
        {data.image ? <img src={data.image} /> : data.name}
    </button>, document.getElementById('root'))
    )
}

export default Player