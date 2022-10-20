import React, { useContext, useReducer, useState, useEffect } from "react";
import { redirect, useLoaderData, useLocation} from "react-router-dom";
import AuthContext from "../../store/auth-context";
import ThemeContext from "../../store/theme-context";
import Table from './Table'
import Timer from "../home/Timer";
import classes from './Table.module.css'
import { Fragment } from "react";
import JoinForm from "../UI/JoinForm";
import {insertTurn, deleteTurn} from '../../helpers/helpers'
import {socketManager} from "../../helpers/SocketManager";
import _ from "lodash"



function Game(props){
    //const [local, setLocal] = useState(props.local || false) //use eventually to allow spectators
    
    const [joinClicked, setJoinClicked] = useState(false)
    const [joined, setJoined] = useState(false)
    const [localColor, setLocalColor] = useState(null)
    const [gameState, dispatchState] = useReducer(stateReducer, { id: joined ? 0 : useLoaderData(), status: "UNINITIALIZED", players: {playerList: [null,null,null,null,null,null,], turn_stack: [], available_colors: ["blue", "red", "orange", "yellow", "green", "black"]}, deck: {}})
    const [joinedPosition, setJoinedPosition] = useState(-1)
    const [timerExpired, setTimerExpired] = useState(false)
    const authctx = useContext(AuthContext)
    const themectx = useContext(ThemeContext)
    const location = useLocation();

    useEffect(function(){
        const establishConnection = async function(){
            if(joined){
                let action = {type: "JOIN", user_id: authctx.id, player: { color: localColor,  icon: authctx.profilePicBuffer, table_position: joinedPosition}}
                socketManager.send(action)
            }
        }
        establishConnection()
        
    }.bind(this), [joined])

    useEffect(function(){
        const establishConnection = async function(){
            
            var gid = location.pathname.split("/")[2]
            if(Number.isInteger(Number(gid))){
                gid = Number(gid)
            }else{
                gid = 0
            }
            if(!authctx.isLoggedIn && gid == 0){
                return
            }

            //now, either unauthenticated and remote, authenticated and local / remote
            var ws_protos = [];
            if(gid == 0){
                ws_protos.push("CREATE")
            }else{
                ws_protos.push("SPECTATE")
            }
            if(authctx.id > 0) ws_protos.push(authctx.JWT)
            const _sock = new WebSocket(`ws://localhost:3001/gamesession/${gid}/${authctx.id}`, ws_protos)// hardcoded gameid and userid, need to get dynamically
            debugger
            bindSocket(_sock);
            socketManager.setSocket(_sock)
        }
        let gg = authctx.gameGlobals
        let sock = socketManager.getSocket()
        if(gg.inGame || sock){
            debugger
            clearTimeout(gg.awayFromGameTimer)//made it back in time, don't cancel game
            bindSocket(sock)
            socketManager.setSocket(sock)
            restoreState()
        }else{
            establishConnection()
        }
        //return () => {debugger}
        /*
        return function cleanUp(){
            var unfinished = true // need to determine actual value for this boolean
            if(unfinished)authctx.setGameGlobals({...authctx.gameGlobals, cachedState: gameState})
        }
        */
        
    }.bind(this), [])

    useEffect(function(){
        if(timerExpired){
            socketManager.send({type: "ACTION", user_id: authctx.id, action: {type: "NOOP"}})
        }
    }, timerExpired)

    
    function stateReducer(prevState, action){
        switch(action.type){
            case 'INITIALIZE_GAME':
                //console.log(action.state)
                return {...prevState, ...(action.state)}
            case 'RESTORE':
                return action.state
            case 'PLAYER_CHANGE/ADD':
                return addPlayer(prevState, action.player)
            case 'PLAYER_CHANGE/REMOVE':
                return removePlayer(prevState, action.player)
            case 'STATUS/SET':
                return {...prevState, status: action.status}
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
    
    function bindSocket(_sock){
        _sock.onopen = function(){
            const payload = JSON.stringify({type: "GET_INITIAL_STATE", user_id: authctx.id})
            _sock.send(payload)
        }
        _sock.onerror = function(e){
            dispatchState({type: "SOCKET_ERROR"})
            console.log(e.message)
        }
        _sock.onclose = function(ev){
            dispatchState({type: "SOCKET_CLOSE"})
            _sock.send(JSON.stringify({user_id: authctx.id, table_position: joinedPosition}))
            alert("closed with event: " + ev.reason)
        }

        _sock.onmessage = function(message){
            const payload = JSON.parse(message.data)
            if(payload.type == "INFO/GAMEID"){
                console.log(payload);
                authctx.setGameGlobals({...authctx.gameGlobals, inGame: true, gameId: payload.gameId})
            }else{
                dispatchState(payload || {type: "NoAct"})
            }
            
        }
    }

    function addPlayer(prevState, player){
        const playerList = _.cloneDeep(prevState.players.playerList)
        const turn_stack = _.cloneDeep(prevState.players.turn_stack)
        const available_colors = _.cloneDeep(prevState.players.available_colors)
        playerList[player.table_position-1] = player
        available_colors.splice(available_colors.indexOf(player.color), 1)
        return {...prevState, players: {playerList: playerList, turn_stack: insertTurn(turn_stack, player.table_position), available_colors: available_colors}}
    }

    function removePlayer(prevState, player){
        const playerList = _.cloneDeep(prevState.players.playerList)
        const turn_stack = _.cloneDeep(prevState.players.turn_stack)
        const available_colors = _.cloneDeep(prevState.players.available_colors)
        const pos = player.table_position
        playerList[pos-1] = null
        available_colors.push(player.color)
        return {...prevState, players: {playerList: playerList, turn_stack: deleteTurn(turn_stack, pos), available_colors: available_colors}}
    }

    function restoreCachedState(){
        let state = authctx.gameGlobals.cachedState
        dispatchState({type: "RESTORE", state: state})
        authctx.setGameGlobals({...state, cachedState : null})
    }

    async function restoreState(){
        socketManager.send({type: "GET_INITIAL_STATE", user_id: authctx.id})
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
                {gameState.status == "INITIALIZED" && joinedPosition == gameState.players.turn_stack[0] ? <Timer setTimerExpired={setTimerExpired} totalTime={120}/> : <></>}
                <Table players={gameState.players.playerList} joined={joined} joinClickHandler={joinClickHandler} setJoinedPosition={setJoinedPosition}>
                </Table>
            </div>
            <JoinForm joinHandler={joinSubmitHandler} available_colors={gameState.players.available_colors} setLocalColor={setLocalColor} closeHandler={formCloseHandler} show={authctx.isLoggedIn && joinClicked}/>
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
        
        return gameId ? gameId : 0
    } catch (error){
        throw redirect("/")
    }

}