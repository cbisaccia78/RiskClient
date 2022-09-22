import classes from './Table.module.css'
import React, {useState, useEffect, Fragment} from 'react'
import {tableGeometry, playerPartition, cardPartition} from '../../config'
import OpenSeat from './OpenSeat'
import Player from './Player'
import Hand from './Hand'
import RiskMap from './RiskMap'


function Table(props){
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

    function calculateBB(){
        //this needs to ensure that 16:9 ratio does not break
        let vpW = window.visualViewport.width
        let vpH = window.visualViewport.height
        let ratio = vpW / vpH
        if(ratio < 16/9){ //reduce the height
            vpH = vpW * (9/16) 
        }else{ //reduce the width
            vpW = (16/9) * vpH
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

        set origin of playerCircle to be 7.5 % of ViewportHeight perpendicular distance from ellipse at spot indicated by position
        position will partition the ellipse into 8 equal circumference length to seperate the players.
        
        pseudo:
        define equation for nth arc of partitioned ellipse given arclength = circumference / 8
        set (x_0, y_0) = midpoint of arc
        define equation of line perpendicular to (x_0, y_0) with length of 15% of viewportHeight
        set (x_f, y_f) = midpoint of line
        
        next we must derive top and left values from this x_f, y_f


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
    if(num_players < 8){
        for(var i = 0; i < props.freeSpots.length; i++){
            const position = props.freeSpots[i]
            openSeatButtons.push(<OpenSeat key={`open-${position}`} onClick={props.onJoinClick} onNewPlayer={props.newPlayerHandler} position={position} generatePosition={playerPosition}/>)
        }
    }
    return (
        <RiskMap className={classes.gameTable} style={boundingRect} id="game-table">
            {players.map((player) => {
                    return (<Fragment>
                        <Player key={`player-${player.position}`} data={player} generatePosition={playerPosition}/>
                        <Hand key={`hand-${player.position}`} hand={player.hand} playerPos={player.position} cardPosition={cardPosition}/>
                    </Fragment>)
                    
                })
            }
            {openSeatButtons}
        </RiskMap>
    )
}

export default Table