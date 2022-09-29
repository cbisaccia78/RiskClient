import classes from './Table.module.css'
import React, {useState, useEffect, Fragment} from 'react'
import {tableGeometry, playerPartition, cardPartition} from '../../config'
import riskboard from "../../RiskBoard.svg"
import { isInsidePolygon } from "../../helpers/helpers"
import OpenSeat from './OpenSeat'
import Player from './Player'
import Hand from './Hand'
import AuthContext from '../../store/auth-context'

const determineCountry = (evt) => {
  /*const { mouseX, mouseY } = evt.getXY // need to find actual method
    for each country
        if isInsidePolygon(country, mouseX, mouseY)
            return country.name
    return "none"  
  
  */
    return null;
}

function Table(props){
    const authctx = useContext(AuthContext)
    let players = props.players
    let num_players = players.length
    const [boundingRect, setBoundingRect] = useState(calculateBB())

    useEffect(() => {
        const resizeHandler = (event) => {
            let bb = calculateBB()
            setBoundingRect(bb)
        }
        window.addEventListener('resize', resizeHandler)

        return _ => {
            window.removeEventListener('resize', resizeHandler)
        }
    })

    useEffect(()=>{
        let img = document.createElement("img")
        img.src = riskboard
        img.className = "gameSVG"
        const t = document.getElementById("game-table")
        t.appendChild(img)
      }, [])

    function calculateBB(){
        //this needs to ensure that 1.444549393267134 ratio does not break
        let vpW = window.visualViewport.width
        let vpH = window.visualViewport.height
        let ratio = vpW / vpH
        if(ratio < 1.444549393267134){ //reduce the height
            vpH = vpW * (1/1.444549393267134) 
        }else{ //reduce the width
            vpW = (1.444549393267134) * vpH
        }
        return {
            height: tableGeometry.height*vpH,
            left: tableGeometry.left*vpW,
            top: tableGeometry.top*vpH,
            width: tableGeometry.width*vpW
        }
    }
    
    function playerPosition(position){
        /*
        playerCircles defined to be 10% of viewportHeight

        */
        let real_height = boundingRect.height / 0.7
        let real_width = boundingRect.width / 0.7

        let scale = playerPartition[position]
        let scale_x = scale[0]
        let scale_y = scale[1]

        
        let new_top = real_height*scale_y
        let new_left = real_width*scale_x
        
        
        return {top: new_top, left: new_left}
    }

    function cardPosition(playerPos, cardNum){
        let real_height = boundingRect.height / 0.7
        let real_width = boundingRect.width / 0.7

        let hand = cardPartition[playerPos]
        let scale = hand[cardNum-1]

        let scale_x = scale[0]
        let scale_y = scale[1]
        let rotation = scale[2]
        
        let new_top = real_height*scale_y  
        let new_left = real_width*scale_x
        
        
        return {top: new_top, left: new_left, transform: `rotate(${rotation}deg)`}
    }

    var openSeatButtons = []
    if(num_players < 6){
        for(var i = 0; i < num_players; i++){
            if(players[i] == null){
                openSeatButtons.push(<OpenSeat key={`open-${i}`} onClick={authctx.joinHandler} onNewPlayer={props.newPlayerHandler} position={position} generatePosition={playerPosition}/>)
            }
        }
    }
    return (
        <div className={classes.gameTable} style={boundingRect} id="game-table" onClick = {determineCountry}>
            {players.filter(val => val != null).map((player) => {
                    return (
                    <Fragment>
                        <Player key={`player-${player.position}`} data={player} generatePosition={playerPosition}/>
                        <Hand key={`hand-${player.position}`} hand={player.hand} playerPos={player.position} cardPosition={cardPosition}/>
                    </Fragment>)
                })
            }
            {openSeatButtons}
        </div>
    )
}

export default Table