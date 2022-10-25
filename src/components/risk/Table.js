import classes from './Table.module.css'
import React, {useState, useEffect, Fragment, useContext} from 'react'
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
    const [VPR, setVPR] = useState(calculateVPR())
    const authctx = useContext(AuthContext)

    useEffect(() => {
        const resizeHandler = (event) => {
            setVPR(calculateVPR())
        }
        window.addEventListener('resize', resizeHandler)

        return _ => {
            window.removeEventListener('resize', resizeHandler)
        }
    }, [VPR])

    useEffect(()=>{
        let img = document.createElement("img")
        img.src = riskboard
        img.className = "gameSVG"
        img.id = "gameSVG"
        img.style = "height: 100%; width: 100%;"
        const t = document.getElementById("game-table")
        t.appendChild(img)
      }, [])

    function calculateVPR(){
        //this needs to ensure that 1.4447761194029851 ratio does not break
        /*
        
        if(ratio < 1.4447761194029851){ //reduce the height
            vpH = vpW * (1/1.4447761194029851) 
        }else{ //reduce the width
            vpW = (1.4447761194029851) * vpH
        }
        
        return {
            height: tableGeometry.height*vpH,
            //left: tableGeometry.left*vpW,
            //top: tableGeometry.top*vpH,
            width: tableGeometry.width*vpW
        }*/
        let vpW = window.visualViewport.width
        let vpH = window.visualViewport.height
        let ratio = vpW / vpH
        return ratio
    }
    
    function playerPosition(position){
        /*
        playerCircles defined to be 10% of viewportHeight

        */

        let {scale_top, scale_left} = playerCoordScale(position, VPR)
        
        let smaller = VPR < 1.0 ? '7.5vw' : '7.5vh'
        return {top: scale_top, left: scale_left, width: `${smaller}`, height: `${smaller}`, position: "absolute"}
    }

    function cardPosition(playerPos, cardNum){
        let real_height = 100//wrong
        let real_width = 100//wrong

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
    for(var i = 0; i < 6; i++){
        if(players[i] == null){
            openSeatButtons.push(<OpenSeat key={`open-${i}`} setJoinedPosition={props.setJoinedPosition} joinClickHandler={props.joinClickHandler} position={i+1} generatePosition={playerPosition.bind(this, i+1)}/>)
        }
    }

    return (
        <div className={classes.gameTable} id="game-table" onClick = {determineCountry}>
            {players.filter(val => val != null).map((player) => {
                    return (
                    <Fragment>
                        <Player key={`player-${player.table_position}`} setTimerExpired={props.setTimerExpired} totalTime={props.totalTime} data={player} generatePosition={playerPosition.bind(this, player.table_position)}/>
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