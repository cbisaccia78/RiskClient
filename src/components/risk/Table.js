import classes from './Table.module.css'
import React, {useState, useEffect, Fragment} from 'react'
import {tableGeometry, playerPartition, cardPartition} from '../../config'
import riskboard from "../../RiskBoard.svg"
import { isInsidePolygon, playerCoordScale } from "../../helpers/helpers"
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
    //const authctx = useContext(AuthContext)
    let players = props.players
    //console.log(players);
    let num_players = players.filter(player=>player!=null).length
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
        img.style = "height: 100%; width: 100%;"
        const t = document.getElementById("game-table")
        t.appendChild(img)
      }, [])

    function calculateBB(){
        //this needs to ensure that 1.4447761194029851 ratio does not break
        let vpW = window.visualViewport.width
        let vpH = window.visualViewport.height
        let ratio = vpW / vpH
        if(ratio < 1.4447761194029851){ //reduce the height
            vpH = vpW * (1/1.4447761194029851) 
        }else{ //reduce the width
            vpW = (1.4447761194029851) * vpH
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
        let {height, left, top, width} = boundingRect
        
        let {scale_top, scale_left} = playerCoordScale(position, width, height)

        let new_top = top + scale_top //scale_top = position == 1 ? 1+0.1, 2 
        let new_left = left + scale_left//scale_left = position == 1 ? 1 + 0.15 
        
        let square = height < width ? height : width
        return {top: new_top, left: new_left, width: 0.1*square, height: 0.1*square}
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
    //console.log(num_players);

    for(var i = 0; i < 6 - num_players; i++){
        if(players[i] == null){
            openSeatButtons.push(<OpenSeat key={`open-${i}`} setJoinedPosition={props.setJoinedPosition} joinClickHandler={props.joinClickHandler} position={i} generatePosition={playerPosition.bind(this, i)}/>)
        }
    }

    return (
        <div className={classes.gameTable} style={boundingRect} id="game-table" onClick = {determineCountry}>
            {players.filter(val => val != null).map((player) => {
                    return (
                    <Fragment>
                        <Player key={`player-${player.position}`} data={player} generatePosition={playerPosition.bind(this, player.position)}/>
                        {/*<Hand key={`hand-${player.position}`} hand={player.hand} playerPos={player.position} cardPosition={cardPosition}/>*/}
                    </Fragment>)
                })
            }
            {/*!props.joined ? openSeatButtons : <></>*/}
            {openSeatButtons}
        </div>
    )
}

export default Table