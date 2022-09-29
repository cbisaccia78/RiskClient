import React, { useContext, useReducer, useState, useEffect } from "react";
import { redirect, useLoaderData} from "react-router-dom";
import AuthContext from "../../store/auth-context";
import ThemeContext from "../../store/theme-context";
import Table from './Table'
import classes from './Table.module.css'
import { Fragment } from "react";
import JoinForm from "../UI/JoinForm";
import { randInt, range } from '../../helpers/helpers'
import _ from "lodash"



function Game(props){
    const [gameState, dispatchState] = useReducer(stateReducer, { id: useLoaderData(), players: {playerList: [null,null,null,null,null,null,], turn_stack: []}, deck: {}})
    const authctx = useContext(AuthContext)
    const themectx = useContext(ThemeContext)
    

    useEffect(function(){
        const establishConnection = async function(){
            const sock = new WebSocket(`ws://localhost:3001/gamesession/${gameState.id}/${authctx.id}`)// hardcoded gameid and userid, need to get dynamically
            sock.onopen = ()=>{
                const payload = JSON.stringify({type: "GET_INITIAL_STATE"})
                sock.send(payload)
            }
            sock.onerror = (e)=>{
                console.log(e.message)
            }
            sock.onclose = ()=>{
                alert("closed")
            }

            sock.onmessage = function(message){
                const payload = message.data
                dispatchState(payload ? JSON.parse(payload) : {type: "NoAct"})
            }.bind(this)
        }
        establishConnection()
    }.bind(this), [])

    
    function stateReducer(prevState, action){
        switch(action.type){
            case 'INITIALIZE_GAME':
                return {...prevState, ...(action.state)}
            case 'PLAYER_CHANGE/ADD':
                return addPlayer(prevState, action.player)
            case 'PLAYER_CHANGE/REMOVE':
                return removePlayer(prevState, action.player)
            case 'DECK/SHUFFLE':
                return
            case 'DECK/DEAL':
                return
            case 'TURN_SWITCH':
                return
            default:
                return prevState
        }
    }

    function addPlayer(prevState, player){
        let players = _.cloneDeep(prevState.players.playerList)
        let turn_stack = _.cloneDeep(prevState.players.turn_stack)
        players.splice(player.table_position, 0, player)
        return { ...prevState, players: players}
    }

    function removePlayer(prevState, player){

    }

    function onJoinSubmit(){
        authctx.setJoinClicked(false)
    }

    //useEffect(()=>{}, [playerToAct])

    return (
        <Fragment>
            <div className={classes.gameBackground} id="table-background">
                <Table players={gameState.players.playerList}>
                </Table>
            </div>
            {authctx.joinClicked ? <JoinForm onJoinSubmit={onJoinSubmit}/> : <></>}
        </Fragment>
    )
}

export default Game

export function loader({ params }){
    const gameId = params.id
    //create webworker which manages a
        // websocket() interface with websocket server
    try {
        //const worker = new Worker("gameWorker.js")
        //worker.postMessage(gameId)
        //worker.onmessage = function(message){
            
        //}
        //return worker
        
    } catch (error){
        throw redirect("/")
    }

}