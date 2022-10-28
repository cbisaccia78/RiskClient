import './Player.css'
import React from 'react'

function Player(props){
    let data = props.data
    
    //console.log(data);
    let pos = props.generatePosition()
    let p = (
    <>
        <button  className={`player ${props.extraClasses}`} style={{...pos, position: "absolute", backgroundImage: 'url('+data.icon+')', border: "5px solid rgb(0, 0, 0)"}}>
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