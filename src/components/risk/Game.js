import React, { useContext, useReducer, useState, useEffect, useRef } from "react";
import { redirect, useLoaderData, useLocation} from "react-router-dom";
import { pathDToPoly, isInsidePolygon} from "../../helpers/helpers";
import Button from "react-bootstrap/Button";
import AuthContext from "../../store/auth-context";
import ThemeContext from "../../store/theme-context";
import Table from './Table'
import classes from './Table.module.css'
import { Fragment } from "react";
import JoinForm from "../UI/JoinForm";
import {insertTurn, deleteTurn} from '../../helpers/helpers'
import {socketManager} from "../../helpers/SocketManager";
import _ from "lodash"
import { isDOMComponent } from "react-dom/test-utils";



function Game(props){
    //const [local, setLocal] = useState(props.local || false) //use eventually to allow spectators
    
    const [joinClicked, setJoinClicked] = useState(false)
    const [joined, setJoined] = useState(false)
    const [territoryBoundaries, setTerritoryBoundaries] = useState(null)
    const [localColor, setLocalColor] = useState(null)
    const [gameState, dispatchState] = useReducer(stateReducer, { id: joined ? 0 : useLoaderData(), status: "UNINITIALIZED", players: {playerList: [null,null,null,null,null,null,], turn_stack: [], available_colors: ["blue", "red", "orange", "yellow", "green", "black"]}, deck: {}})
    const [joinedPosition, setJoinedPosition] = useState(-1)
    const [timerExpired, setTimerExpired] = useState(false)
    const authctx = useContext(AuthContext)
    const themectx = useContext(ThemeContext)
    const location = useLocation();
    const tableRef = useRef(null)

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
        if(!tableRef){
            return
        }
        const detected = async function(event, handler){
            let mouseX = tableRef.current.offsetLeft + event.clientX, mouseY = tableRef.current.offsetTop + event.clientY
            //debugger
            territoryBoundaries.forEach(function(value, key){
                if(isInsidePolygon(value, mouseX, mouseY)){
                    debugger
                    handler(key)
                }
            })
        }
        const clickDetected = async function(event){
            console.log('click');
            detected(event, clickHandler)
        }

        const moveDetected = async function(event){
            detected(event, moveHandler)
        }

        const clickHandler = async function(key){
            console.log(key)
            let _class = tableRef.current.children['gameSVG'].contentWindow.document.getElementById(key).getAttribute('class')
            tableRef.current.children['gameSVG'].contentWindow.document.getElementById(key).setAttribute('class', _class + " hovered")
        }
        const moveHandler = async function(){

        }
        
        tableRef.current.children['gameSVG'].contentWindow.addEventListener('click', clickDetected)
        //window.addEventListener('mousemove', moveDetected)
        return _ => {
            tableRef.current.children['gameSVG'].contentWindow.removeEventListener('click', clickDetected)
            //window.removeEventListener('mousemove', moveDetected)
        }
    }, [territoryBoundaries])

    useEffect(function(){
        const resizeHandler = function(){
            calculateTerritoryBoundaries()
        }
        window.addEventListener('resize', resizeHandler.bind(this))

        return _ => {
            window.removeEventListener('resize', resizeHandler)
        }
    }.bind(this), [])

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
            bindSocket(_sock);
            socketManager.setSocket(_sock)
        }
        let gg = authctx.gameGlobals
        let sock = socketManager.getSocket()
        if(gg.inGame || sock){
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
        let ts = gameState.players.turn_stack
        let turn = ts.length ? ts[0] : 0
        if(timerExpired && turn == joinedPosition){
            socketManager.send({type: "ACTION", user_id: authctx.id, action: {type: "NOOP"}})
        }
    }, [timerExpired])

    async function calculateTerritoryBoundaries(){
        debugger
        let territories = tableRef.current.children['gameSVG'].contentWindow.document.getElementById('layer4').children
        let idBoundaryMap = new Map()
        for(var i = 0; i < territories.length; i++){
            let territory = territories[i]
            idBoundaryMap.set(territory.id, pathDToPoly(territory.attributes.d.value))
        }
        //console.log(idBoundaryMap)
        setTerritoryBoundaries(idBoundaryMap)
    }
    
    function stateReducer(prevState, action){
        switch(action.type){
            case 'INITIALIZE_GAME':
                //console.log(action.state)
                return {...prevState, ...(action.state)}
            case 'RESTORE':
                return action.state
            case 'PLAYER_CHANGE/ADD':
                console.log('adding player');
                return addPlayer(prevState, action.player)
            case 'PLAYER_CHANGE/REMOVE':
                return removePlayer(prevState, action.player)
            case 'PLAYER_CHANGE/INITIALIZE_ALL':
                const playerList = _.cloneDeep(prevState.players.playerList)
                playerList.filter(player=>player != null).forEach(function(player){
                    const numInfantry = 40 - (prevState.players.turn_stack.length - 2)*5
                    const _player = {...player, army: {INFANTRY: numInfantry, CAVALRY: 0, ARTILLERY: 0}}
                    playerList[player.table_position-1] = _player
                })
                
                return {...prevState, players: {...prevState.players, playerList: playerList}}
            case 'STATUS/SET':
                return {...prevState, status: action.status}
            case 'DECK/SHUFFLE':
                return prevState
            case 'DECK/DEAL':
                return prevState
            case 'ACTION':
                return handleAction(prevState, action.action)
            case 'SOCKET/ERROR':
                return prevState
            case 'SOCKET/CLOSE':
                return prevState
            case 'NOOP':
                return prevState
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
            _sock.send(JSON.stringify({user_id: authctx.id, player: {table_position: joinedPosition, color: localColor}}))
            alert("closed with event: " + ev.reason)
        }

        _sock.onmessage = function(message){
            const payload = JSON.parse(message.data)
            if(payload.type == "INFO/GAMEID"){
                console.log(payload);
                authctx.setGameGlobals({...authctx.gameGlobals, inGame: true, gameId: payload.gameId})
            }else{
                dispatchState(payload || {type: "NOOP"})
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

    function handleAction(prevState, action){
        
        let s = prevState
        //handle action
        console.log(action);
        switch(action.type){
            case 'NOOP':
            case 'TURN_CHANGE':
                let ts = _.cloneDeep(prevState.players.turn_stack)
                let _next = ts.shift()
                ts.push(_next)
                s.players.turn_stack = ts 
                return {...s, players: {...s.players, turn_stack: ts}}
            case 'ATTACK':
                console.log();
                break
            case 'REINFORCE':
                console.log();
                break
            case 'REDEEM_CARDS':
                console.log();
                break
            case 'FORTIFY':
                console.log();
                break
            default:
                console.log('Unknown action: '+ action);
        } 
        return s
        //update turnstack
        
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
        setJoinClicked(true)
        return joined
    }

    const boardClickHandler = function(){

    }

    const formCloseHandler = function(){
        setJoinClicked(false)
    }

    const startGame = function(){
        socketManager.send({type: "START", user_id: authctx.id})
    }

    const noOp = function(){
        socketManager.send({type: "ACTION", user_id: authctx.id, action: {type: "NOOP"}})
    }


    //useEffect(()=>{}, [playerToAct])
    let ts = gameState.players.turn_stack
    let turn = ts.length ? ts[0] : 0
    return (
        <Fragment>
            <div className={classes.gameBackground} id="table-background">
                {gameState.status == "INITIALIZED" && joinedPosition == turn ?
                <Button onClick={noOp.bind(this)}>NOOP</Button>
                  
                 : <></>}
                {gameState.status == "UNINITIALIZED" && joined ? <Button variant="success" onClick={startGame}>Start Game</Button> : <></>}
                <Table key={`table-turn-${turn}`} onBoardClick={boardClickHandler} tableRef={tableRef} calculateTerritoryBoundaries={calculateTerritoryBoundaries} players={gameState.players.playerList} started={gameState.status == "INITIALIZED"} turn={turn} setTimerExpired={setTimerExpired} totalTime={120} joined={joined} joinClickHandler={joinClickHandler} setJoinedPosition={setJoinedPosition}>
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