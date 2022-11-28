import classes from './Table.module.css'
import React, {useState, useEffect, useContext} from 'react'
import {tableGeometry, playerPartition, cardPartition} from '../../config'
import riskboard from "../../RiskBoard.svg"
import { playerCoordScale, debounce, delay} from "../../helpers/helpers"
import OpenSeat from './OpenSeat'
import Player from './Player'
import ArmyCount from './ArmyCount'
import AuthContext from '../../store/auth-context'
import Timer from '../UI/Timer'
import TerritoryCards from './TerritoryCards'

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
        const boundResize = debounce(resizeHandler.bind(this))
        window.addEventListener('resize', boundResize)

        return _ => {
            window.removeEventListener('resize', boundResize)
        }
    }, [VPR])

    useEffect(()=>{
        let obj = document.createElement("object")
        obj.data = riskboard
        obj.type = "image/svg+xml"
        obj.className = "gameSVG"
        obj.id = "gameSVG"
        obj.style = "height: 100%; width: 100%; position: absolute; top: 0%;"
        const t = document.getElementById("game-table")
        t.appendChild(obj)
        /*
        setTimeout(function(){
            const holder = props.tableRef.current.children['gameSVG']
            const bb = holder.getBoundingClientRect(), width = bb.width, height = bb.height
            holder.contentWindow.document.getElementById('svg2').setAttribute('viewBox', `0 0 ${width} ${height}`)
        }.bind(this), 100)
        */
        setTimeout(tableEffect.bind(this), 500)
      }, [])

    function tableEffect(){
        props.calculateTerritoryBoundaries.call(this)
    }

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
            openSeatButtons.push(<OpenSeat key={`open-${i}`} joined={props.joined} setJoinedPosition={props.setJoinedPosition} joinClickHandler={props.joinClickHandler} position={i+1} generatePosition={playerPosition.bind(this, i+1)}/>)
        }
    }


    return (
        <div ref={props.tableRef} className={classes.gameTable} id="game-table">
            {players.filter(val => val != null).map((player) => {
                    let modified = props.turn == player.table_position && props.started
                    return (
                    <>
                        
                        <Player key={`player-${player.table_position}`} started={props.started} extraClasses={modified ? "covered" : ""} setTimerExpired={props.setTimerExpired} totalTime={props.totalTime} data={player} generatePosition={playerPosition.bind(this, player.table_position)}/>
                        {modified ? <Timer key={`timer-${props.turn}`} position={player.table_position} generatePosition={playerPosition.bind(this, player.table_position)} totalTime={120} setTimerExpired={props.setTimerExpired}/> : <></>}
                        {modified && props.status=="POST_SETUP" ? <TerritoryCards territory_cards={player.territory_cards} redeemAction={props.redeemAction}/> : <></>}
                        {props.started ? (Object.keys(player.territories).length ? Object.entries(player.territories) : []).map(function(territory){return <ArmyCount board={props.tableRef} color={player.color} count={territory[1]} territory={territory[0]}/>}) : <></>}
                        {/*<Hand key={`hand-${player.position}`} hand={player.hand} playerPos={player.position} cardPosition={cardPosition}/>*/}
                    </>)
                })
            }
            {/*!props.joined ? openSeatButtons : <></>*/}
            {openSeatButtons}
        </div>
    )
}

export default Table