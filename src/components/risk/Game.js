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



function Game(props){

    const [gameState, dispatchState] = useReducer(stateReducer, { playerList: [], freeSpotsList: [], deck: null, positionTurn: 0 })

    const [players, setPlayers] = useState([])
    const websocket = useLoaderData();
    const authctx = useContext(AuthContext)
    const themectx = useContext(ThemeContext)
    /*
    useEffect(()=>{
        const fetchPlayers = async () => {
          const new_players = []
          try{
            const response = await fetch(`http://localhost:3001`)
            const responseData = await response.json()
            for (const key in responseData){
                new_players.push(responseData[key])
            }
          } catch (err){
            console.log("failed to fetch")
          }
          
          setPlayers(new_players)
        }
        fetchPlayers()
    }, [])
    */
    
    function stateReducer(prevState, action){
        switch(action.type){
            case 'new_player':
                return addNewPlayer(prevState, action.player, action.new_position)
            case 'turn_switch':
                return
            default:
                throw new Error()
        }
    }

    async function generateInitialState(_players){ //this needs to come from the server
        websocket.send(JSON.stringify({action: "getInitialState"}))
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

    function addNewPlayer(prevState, player, new_position){
        let freeSpots = prevState.freeSpotsList
        let playerList = prevState.playerList
        const freeSpotPos = freeSpots.indexOf(new_position)
        player.position = new_position
        playerList.push(player)
        freeSpots.splice(freeSpotPos, 1)
        return { ...prevState, playerList: playerList, freeSpotsList: freeSpots}
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
        const sock = new WebSocket("ws://localhost:3001/gamesession")
        sock.onopen = ()=>{
            const payload = JSON.stringify({type: "Greetings!"})
            sock.send(payload)
        }
        sock.onerror = (e)=>{
            console.log(e.message)
        }
        sock.onclose = ()=>{
        }
        sock.onmessage = function(message){
            const payload = message.data
            this.dispatchState(payload ? JSON.parse(payload) : {action: "NoAct"})//this should be in the context of <Game>
        }
        return sock
    } catch (error){
        throw redirect("/")
    }

}