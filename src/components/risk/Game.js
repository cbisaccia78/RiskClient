import React, { useContext, useReducer, useState, useEffect } from "react";
import { redirect, useLoaderData, useLocation} from "react-router-dom";
import AuthContext from "../../store/auth-context";
import ThemeContext from "../../store/theme-context";
import Table from './Table'
import classes from './Table.module.css'
import { Fragment } from "react";
import JoinForm from "../UI/JoinForm";
import {insertTurn, deleteTurn} from '../../helpers/helpers'
import _ from "lodash"



function Game(props){
    const [local, setLocal] = useState(props.local || false) //use eventually to allow spectators
    
    const [joinClicked, setJoinClicked] = useState(false)
    const [joined, setJoined] = useState(false)
    const [localColor, setLocalColor] = useState(null)
    const [gameState, dispatchState] = useReducer(stateReducer.bind(this), { id: joined ? 0 : useLoaderData(), players: {playerList: [null,null,null,null,null,null,], turn_stack: []}, deck: {}})
    const [joinedPosition, setJoinedPosition] = useState(-1)
    const [sock, setSock] = useState(null)
    const authctx = useContext(AuthContext)
    const themectx = useContext(ThemeContext)
    const location = useLocation();

    useEffect(function(){
        const establishConnection = async function(){
            if(joined){
                let action = {type: "JOIN", user_id: authctx.id, JWT: authctx.JWT, player: { color: localColor,  icon: authctx.profilePicBuffer, table_position: joinedPosition}}
                sock.send(JSON.stringify(action))
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
            _sock.onopen = ()=>{
                const payload = JSON.stringify({type: "GET_INITIAL_STATE", user_id: authctx.id})
                _sock.send(payload)
            }
            _sock.onerror = (e)=>{
                dispatchState({type: "SOCKET_ERROR"})
                console.log(e.message)
            }
            _sock.onclose = (ev) =>{
                dispatchState({type: "SOCKET_CLOSE"})
                _sock.send(JSON.stringify({user_id: authctx.id, table_position: joinedPosition}))
                alert("closed with event: " + ev.reason)
            }

            _sock.onmessage = function(message){
                const payload = JSON.parse(message.data)
                if(payload.type == "INFO/GAMEID"){
                    console.log(payload);
                    authctx.setGameGlobals({...gg, inGame: true, gameId: payload.gameId})
                }else{
                    dispatchState(payload || {type: "NoAct"})
                }
                
            }.bind(this)
            setSock(_sock)

        }
        let gg = authctx.gameGlobals
        if(gg.inGame){//made it back in time, don't cancel game
            clearTimeout(gg.awayFromGameTimer)
        }else{
            establishConnection()
        }
        
    }.bind(this), [])

    
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
        const playerList = _.cloneDeep(prevState.players.playerList)
        const turn_stack = _.cloneDeep(prevState.players.turn_stack)
        playerList[player.table_position-1] = player
        return {...prevState, players: {playerList: playerList, turn_stack: insertTurn(turn_stack, player.table_position)}}
    }

    function removePlayer(prevState, player){
        const playerList = _.cloneDeep(prevState.players.playerList)
        const turn_stack = _.cloneDeep(prevState.players.turn_stack)
        const pos = player.table_position
        playerList[pos-1] = null
        return {...prevState, players: {playerList: playerList, turn_stack: deleteTurn(turn_stack, pos)}}
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
            <JoinForm joinHandler={joinSubmitHandler}  setLocalColor={setLocalColor} closeHandler={formCloseHandler} show={authctx.isLoggedIn && joinClicked}/>
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