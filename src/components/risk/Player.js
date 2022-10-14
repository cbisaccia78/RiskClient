import './Player.css'
import {createPortal} from 'react-dom'
import React from 'react'

function Player(props){
    let data = props.data
    //console.log(data);
    let p = (
    <>
        <button className='player' style={{...props.generatePosition(), position: "absolute", backgroundImage: 'url('+data.icon+')'}}>
            {/*<img src={data.icon} alt={data.name} style={{position: "relative", width: "inherit", height: "inherit", borderRadius: "50%", border: "5px solid rgb(0, 0, 0)" }}/>*/}
        </button>
        <h1>{data.name}</h1>
    </>
    )
    return (
    //createPortal(
        p//, document.getElementById('root'))
    )
}

export default Player