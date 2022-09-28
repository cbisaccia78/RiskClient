import React, { useContext, useReducer, useState, useEffect } from "react";
import { redirect, useLoaderData} from "react-router-dom";
import AuthContext from "../../store/auth-context";
import ThemeContext from "../../store/theme-context";
import Table from './Table'
import classes from './Table.module.css'
import { Fragment } from "react";
import JoinForm from "../UI/JoinForm";
import { randInt, range } from '../../helpers/helpers'
import { Deck } from '../../helpers/Deck'
import _ from "lodash"



function Game(props){

    const [gameState, dispatchState] = useReducer(stateReducer, { playerList: [], freeSpotsList: [], deck: null, positionTurn: 0 })

    //const [players, setPlayers] = useState([])
    const authctx = useContext(AuthContext)
    const themectx = useContext(ThemeContext)
    /*
    useEffect(function(){
        const new_players = []
        const sock = new WebSocket("ws://localhost:3001/gamesession/1/1")// hardcoded gameid and userid, need to get dynamically
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
            this.dispatchState(payload ? JSON.parse(payload) : {type: "NoAct"})//this should be in the context of <Game>
        }.bind(this)

        return sock
    }.bind(this), [])
    */
    
    function stateReducer(prevState, action){
        switch(action.type){
            case 'INITIALIZE_GAME':
                return generateInitialState(action.data.playerList)
            case 'PLAYER_CHANGE/ADD':
                return addNewPlayer(prevState, action.player)
            case 'PLAYER_CHANGE/REMOVE':
                return
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

    function generateInitialState(_players){ //this needs to come from the server
        var playerList = []
        var freeSpots = range(0,8)
        _players.forEach((player) => {
            const freeSpotPos = randInt(0, freeSpots.length)
            const position = freeSpots[freeSpotPos]
            player.position = position
            playerList.push(player)
            freeSpots.splice(freeSpotPos, 1)
        })
        const deck = new Deck()
        deck.shuffle()
        return { playerList: playerList, freeSpotsList: freeSpots, deck: deck, positionTurn: 0 }
    }

    function addNewPlayer(prevState, player){
        let players = _.cloneDeep(prevState.players.playerList)
        let turn_stack = _.cloneDeep(prevState.players.turn_stack)
        players.splice(player.table_position, 0, player)
        return { ...prevState, players: players}
    }

    function handleNewPlayer(player, position){
        dispatchState({type: "new_player", player: player, new_position: position})
    }

    function onJoinSubmit(){
        authctx.setJoinClicked(false)
    }

    //useEffect(()=>{}, [playerToAct])

    return (
        <Fragment>
            <div className={classes.gameBackground} id="table-background">
                <Table players={gameState.playerList} freeSpots={gameState.freeSpotsList}>
                </Table>
            </div>
            {authctx.joinClicked ? <JoinForm onNewPlayer={handleNewPlayer} onJoinSubmit={onJoinSubmit}/> : <></>}
        </Fragment>
    )
}

export default Game

export async function loader({ params }){
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