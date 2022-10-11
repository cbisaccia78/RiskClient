import React, { useContext, useReducer, useState, useEffect } from "react";
import { redirect, useLoaderData, useLocation} from "react-router-dom";
import AuthContext from "../../store/auth-context";
import ThemeContext from "../../store/theme-context";
import Table from './Table'
import classes from './Table.module.css'
import { Fragment } from "react";
import JoinForm from "../UI/JoinForm";
import { randInt, range } from '../../helpers/helpers'
import _ from "lodash"



function Game(props){
    const [local, setLocal] = useState(props.local || false) //use eventually to allow spectators
    
    const [joinClicked, setJoinClicked] = useState(false)
    const [joined, setJoined] = useState(false)
    const [gameState, dispatchState] = useReducer(stateReducer, { id: joined ? 0 : useLoaderData(), players: {playerList: [null,null,null,null,null,null,], turn_stack: []}, deck: {}})
    const [joinedPosition, setJoinedPosition] = useState(-1)
    const [sock, setSock] = useState(null)
    const authctx = useContext(AuthContext)
    const themectx = useContext(ThemeContext)
    const location = useLocation();

    useEffect(function(){
        const establishConnection = async function(){
            if(joined || !local){
                var ws_protos = [];
                if(joined){
                    ws_protos = local ? ["CREATE"] : ["JOIN"]
                }
                const _sock = new WebSocket(`ws://localhost:3001/gamesession/${gameState.id}/${authctx.id}`, ws_protos)// hardcoded gameid and userid, need to get dynamically
                _sock.onopen = ()=>{
                    const payload = JSON.stringify({type: "GET_INITIAL_STATE"})
                    _sock.send(payload)
                }
                _sock.onerror = (e)=>{
                    dispatchState({type: "SOCKET_ERROR"})
                    console.log(e.message)
                }
                _sock.onclose = (ev) =>{
                    dispatchState({type: "SOCKET_CLOSE"})
                    _sock.send(JSON.stringify({user_id: authctx.user_id, table_position: joinedPosition}))
                    alert("closed with event: " + ev.reason)
                }

                _sock.onmessage = function(message){
                    const payload = message.data
                    dispatchState(payload ? JSON.parse(payload) : {type: "NoAct"})
                }.bind(this)

                setSock(_sock)
            }
        }
        establishConnection()
    }.bind(this), [joined])

    useEffect(function(){
        console.log(location)
        //if(location.pathname != ['/game/create')sock.close("USER/LEFTPAGE")//is this async? 
        //setSock(null) //if so need to make sure this doesnt cause race condition
    }, [location])

    
    function stateReducer(prevState, action){
        switch(action.type){
            case 'INITIALIZE_GAME':
                //console.log(action.state)
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
            case 'SOCKET/ERROR':
                return
            case 'SOCKET/CLOSE':
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


    const joinSubmitHandler = function(){
        setJoinClicked(false)
        setJoined(true)
    }

    const joinClickHandler = function(){
        console.log('clicked');
        setJoinClicked(true)
    }

    const formCloseHandler = function(){
        setJoinClicked(false)
    }


    //useEffect(()=>{}, [playerToAct])

    return (
        <Fragment>
            <div className={classes.gameBackground} id="table-background">
                <Table players={gameState.players.playerList} joined={joined} joinClickHandler={joinClickHandler} setJoinedPosition={setJoinedPosition}>
                </Table>
            </div>
            <JoinForm joinHandler={joinSubmitHandler} closeHandler={formCloseHandler} show={authctx.isLoggedIn && joinClicked}/>
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
        return gameId
    } catch (error){
        throw redirect("/")
    }

}