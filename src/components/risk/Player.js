import './Player.css'
import React from 'react'
import {Button} from 'react-bootstrap'

function Player(props){
    let data = props.data
    
    //console.log(data);
    let pos = props.generatePosition()
    let armyTop = Number.parseInt(pos.top.slice(0,2))-6

    let p = (
    <>
        <button  className={`player ${props.extraClasses}`} style={{...pos, position: "absolute", backgroundImage: 'url('+data.icon+')', border: "5px solid rgb(0, 0, 0)"}}>
            {/*<img src={data.icon} alt={data.name} style={{position: "relative", width: "inherit", height: "inherit", borderRadius: "50%", border: "5px solid rgb(0, 0, 0)" }}/>*/}
        </button>
        {props.started ? <Button style={{left: pos.left, top: `${armyTop}vh`, position: "absolute"}} backgroundColor={props.data.color} color='black' count={props.data.army}>{props.data.army}</Button> : <></>}
        <h1>{data.name}</h1>
    </>
    )
    return (
    //createPortal(
        p//, document.getElementById('root'))
    )
}

export default Player