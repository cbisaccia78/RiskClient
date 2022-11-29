import React, { useContext, useReducer, useState, useEffect, useRef } from "react";
import { redirect, useLoaderData, useLocation} from "react-router-dom";
import { pathDToPoly, isInsidePolygon, debounce, TerritoryCardMap} from "../../helpers/helpers";
import Button from "react-bootstrap/Button";
import AuthContext from "../../store/auth-context";
import ThemeContext from "../../store/theme-context";
import Table from './Table'
import classes from './Table.module.css'
import { Fragment } from "react";
import JoinForm from "../UI/JoinForm";
import {insertTurn, deleteTurn} from '../../helpers/helpers'
import {socketManager} from "../../helpers/SocketManager";
import { DEVELOPMENT } from "../../config";
import _, { extendWith } from "lodash"



function Game(props){
    //const [local, setLocal] = useState(props.local || false) //use eventually to allow spectators
    
    const [joinClicked, setJoinClicked] = useState(false)
    const [joined, setJoined] = useState(false)
    const [territoryBoundaries, setTerritoryBoundaries] = useState(null)
    const [localColor, setLocalColor] = useState(null)
    const [queuedAction, setQueuedAction] = useState({type: "NONE"})
    const [conquerWindow, setConquerWindow] = useState({type: "NONE"})
    const [localActionHistory, setLocalActionHistory] = useState([])
    const [gameState, dispatchState] = useReducer(stateReducer, { id: joined ? 0 : useLoaderData(), status: "UNINITIALIZED", queuedAction: {}, players: {playerList: [null,null,null,null,null,null,], turn_stack: [], 
        available_colors: ["blue", "red", "orange", "yellow", "green", "black"],  
        available_territories: ['eastern_australia', 'indonesia', 'new_guinea', 'alaska', 'ontario', 'northwest_territory', 'venezuela', 'madagascar', 'north_africa', 'greenland', 'iceland', 'great_britain', 'scandinavia', 'japan', 'yakursk', 'kamchatka', 'siberia', 'ural', 'afghanistan', 'middle_east', 'india', 'siam', 'china', 'mongolia', 'irkutsk', 'ukraine', 'southern_europe', 'western_europe', 'northern_europe', 'egypt', 'east_africa', 'congo', 'south_africa', 'brazil', 'argentina', 'eastern_united_states', 'western_united_states', 'quebec', 'central_america', 'peru', 'western_australia', 'alberta'],
        available_secrets: ["capture Europe, Australia and one other continent","capture Europe, South America and one other continent","capture North America and Africa","capture Asia and South America","capture North America and Australia","capture 24 territories","destroy all armies of a named opponent or, in the case of being the named player oneself, to capture 24 territories","capture 18 territories and occupy each with two troops"]},
        available_territory_cards: ['eastern_australia', 'indonesia', 'new_guinea', 'alaska', 'ontario', 'northwest_territory', 'venezuela', 'madagascar', 'north_africa', 'greenland', 'iceland', 'great_britain', 'scandinavia', 'japan', 'yakursk', 'kamchatka', 'siberia', 'ural', 'afghanistan', 'middle_east', 'india', 'siam', 'china', 'mongolia', 'irkutsk', 'ukraine', 'southern_europe', 'western_europe', 'northern_europe', 'egypt', 'east_africa', 'congo', 'south_africa', 'brazil', 'argentina', 'eastern_united_states', 'western_united_states', 'quebec', 'central_america', 'peru', 'western_australia', 'alberta', 'wildcard1', 'wildcard2'],
        deck: {}})
    const [lastClicked, setLastClicked] = useState("")
    const [lastHovered, setLastHovered] = useState("")
    const [joinedPosition, setJoinedPosition] = useState(-1)
    const [timerExpired, setTimerExpired] = useState(false)
    const authctx = useContext(AuthContext)
    const themectx = useContext(ThemeContext)
    const location = useLocation();
    const tableRef = useRef(null)
    
    useEffect(function(){
        const establishConnection = async function(){
            if(joined){
                let action = {type: "JOIN", user_id: authctx.id, player: { color: localColor,  icon: authctx.profilePicBuffer, table_position: joinedPosition, territories: {}}}
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
            let bb = tableRef.current.getBoundingClientRect()
            let mouseX = event.clientX, mouseY = event.clientY //which coordinate system should this be?
            territoryBoundaries.forEach(function(value, key){
                if(isInsidePolygon(value, mouseX, mouseY)){
                    handler(key)
                }
            })
        }
        const clickDetected = function(event){
            //console.log('click at' + event.clientX + "," + event.clientY);
            detected(event, clickDownHandler)
        }

        const boundClickDown = clickDetected.bind(this)

        const moveDetected = function(event){
            detected(event, moveHandler)
        }

        const clickDownHandler = function(key){
            console.log(key)
            //let _style = tableRef.current.children['gameSVG'].contentWindow.document.getElementById(key).getAttribute('style')
            tableRef.current.children['gameSVG'].contentWindow.document.getElementById(key).style.fill = 'black'
            tableRef.current.children['gameSVG'].contentWindow.document.getElementById(key).style.fillOpacity = 0.4
            setLastClicked(key)
        }

        const clickUpHandler = function(user_id){
            if(lastClicked){
                tableRef.current.children['gameSVG'].contentWindow.document.getElementById(lastClicked).style.fill = 'none'
                tableRef.current.children['gameSVG'].contentWindow.document.getElementById(lastClicked).style.fillOpacity = 1.0
                if(gameState.players.turn_stack && joinedPosition == gameState.players.turn_stack[0] && gameState.status != "UNINITIALIZED"){
                    switch(gameState.status){
                        case "INITIAL_ARMY_PLACEMENT":
                            if(gameState.players.available_territories.includes(lastClicked)){
                                socketManager.send({user_id: user_id, type: 'ACTION', action: {type: 'PLAYER_CHANGE/SELECT_TERRITORY', territory: lastClicked}})
                            }else{
                                if(gameState.players.playerList[gameState.players.turn_stack[0]-1].territories[lastClicked] != undefined){
                                    socketManager.send({user_id: user_id, type: 'ACTION', action: {type: 'PLAYER_CHANGE/PLACE_ARMIES', territory: lastClicked, count: 1}})
                                }
                            }
                            break
                        case "POST_SETUP":
                            switch(queuedAction.type){
                                case "NONE":
                                    if(!(localActionHistory.includes("PLACE_ARMIES"))){ //this only detects one instance of placing armies. need it to detect when all instances are finished
                                        setQueuedAction({type: "PLACE_ARMIES"})
                                    }else{
                                        setQueuedAction({type: "ATTACK", fromTerritory: lastClicked})
                                    }
                                    break
                                case "PLACE_ARMIES":
                                    debugger
                                    if(gameState.players.playerList[gameState.players.turn_stack[0] - 1].army){
                                        socketManager.send({user_id: user_id, type: 'ACTION', action: {type: 'PLAYER_CHANGE/PLACE_ARMIES', territory: lastClicked, count: 1}})
                                    }else{
                                        let lAH = _.cloneDeep(localActionHistory)
                                        lAH.push("PLACE_ARMIES")
                                        setLocalActionHistory(lAH)
                                        setQueuedAction({type: "NONE"})
                                    }
                                    break
                                case "ATTACK":
                                    let enemy;                                    
                                    gameState.players.playerList.forEach(player=>{
                                        if(player && player.territories[lastClicked] != undefined){
                                            enemy = {table_position: player.table_position}
                                        }
                                    })
                                    if(!enemy){
                                        console.log("Error, enemy null");
                                        return
                                    }
                                    socketManager.send(
                                        {
                                            user_id: user_id, type: 'ACTION', 
                                            server_action: true,
                                            action: {
                                                type: 'PLAYER_CHANGE/ATTACK', 
                                                fromTerritory: queuedAction.fromTerritory,
                                                toTerritory: lastClicked,
                                                enemy: enemy
                                            }
                                        }
                                    )
                                    let lAH = _.cloneDeep(localActionHistory)
                                    lAH.push("ATTACK")
                                    setLocalActionHistory(lAH)
                                    setQueuedAction({type: "NONE"})
                                    break
                                default:
                                    break
                            }
                            break
                        default:
                            break
                    }
                }
            }else{

            }
            
            setLastClicked("")
        }

        const boundClickUp = clickUpHandler.bind(this, authctx.id)
        
        const moveHandler = function(key){
            if(lastHovered && key != lastHovered){
                tableRef.current.children['gameSVG'].contentWindow.document.getElementById(lastHovered).style.fill = 'none'
                tableRef.current.children['gameSVG'].contentWindow.document.getElementById(lastHovered).style.fillOpacity = 1.0
            }
            console.log(key)
            //let _style = tableRef.current.children['gameSVG'].contentWindow.document.getElementById(key).getAttribute('style')
            tableRef.current.children['gameSVG'].contentWindow.document.getElementById(key).style.fill = 'black'
            tableRef.current.children['gameSVG'].contentWindow.document.getElementById(key).style.fillOpacity = 0.4
            setLastHovered(key)
        }
        
        tableRef.current.children['gameSVG'].contentWindow.addEventListener('mousedown', boundClickDown)
        tableRef.current.children['gameSVG'].contentWindow.addEventListener('mouseup', boundClickUp)
        
        //tableRef.current.children['gameSVG'].contentWindow.addEventListener('mousemove', moveDetected)
        return _ => {
            if(tableRef.current){
                tableRef.current.children['gameSVG'].contentWindow.removeEventListener('mousedown', boundClickDown)
                tableRef.current.children['gameSVG'].contentWindow.removeEventListener('mouseup', boundClickUp)
            }
            
            //tableRef.current.children['gameSVG'].contentWindow.removeEventListener('mousemove', moveDetected)
        }
    }, [territoryBoundaries, lastClicked, lastHovered])

    useEffect(function(){
        if(conquerWindow.type == "NONE"){
            return
        }
        console.log(conquerWindow);
    }, [conquerWindow])

    useEffect(function(){
        const resizeHandler = function(){
            calculateTerritoryBoundaries()
        }
        const boundResize = resizeHandler.bind(this)
        window.addEventListener('resize', boundResize)

        return _ => {
            window.removeEventListener('resize', boundResize)
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
            socketManager.send({type: "ACTION", user_id: authctx.id, action: {type: "TURN_CHANGE"}})
        }
    }, [timerExpired])

    async function calculateTerritoryBoundaries(){
        //debugger
        let _game = tableRef.current.children['gameSVG']
        let bb = _game.getBoundingClientRect()
        let territories = _game.contentWindow.document.getElementById('layer4').children
        let idBoundaryMap = new Map()
        for(var i = 0; i < territories.length; i++){
            let territory = territories[i]
            idBoundaryMap.set(territory.id, pathDToPoly(territory.attributes.d.value, 1150/bb.width, 800/bb.height))
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
                const available_secrets = _.cloneDeep(prevState.players.available_secrets)
                playerList.filter(player=>player != null).forEach(function(player){
                    const numInfantry = 40 - (prevState.players.turn_stack.length - 2)*5
                    const secretIndex = Math.floor(Math.random()*available_secrets.length)
                    const _player = {...player, army: numInfantry, territories: {}, secretMission: available_secrets.splice(secretIndex, 1), territory_cards: new Set()}
                    playerList[player.table_position-1] = _player
                })
                return {...prevState, players: {...prevState.players, playerList: playerList, available_secrets: available_secrets}}
            case 'STATUS/SET':
                return {...prevState, status: action.status}
            case 'DECK/SHUFFLE':
                return prevState
            case 'UI/CONQUER_TERRITORY':{
                setConquerWindow({...action})
            }
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
        return {...prevState, players: {...prevState.players, playerList: playerList, turn_stack: insertTurn(turn_stack, player.table_position), available_colors: available_colors}}
    }

    function removePlayer(prevState, player){
        const playerList = _.cloneDeep(prevState.players.playerList)
        const turn_stack = _.cloneDeep(prevState.players.turn_stack)
        const available_colors = _.cloneDeep(prevState.players.available_colors)
        const pos = player.table_position
        playerList[pos-1] = null
        available_colors.push(player.color)
        return {...prevState, players: {...prevState.players, playerList: playerList, turn_stack: deleteTurn(turn_stack, pos), available_colors: available_colors}}
    }

    function handleAction(prevState, action){
        
        let s = prevState
        let ret = {...s}
        let player, _player
        //handle action
        console.log(action);
        switch(action.type){
            case 'NOOP':
            case 'TURN_CHANGE':
                let ts = _.cloneDeep(s.players.turn_stack)
                let _next = ts.shift()
                ts.push(_next)
                ret.players.turn_stack = ts 
                return ret
            case 'PLAYER_CHANGE/DRAFT_TROOPS':{
                console.log("DRAFTING");
                _player = s.players.playerList[s.players.turn_stack[0]-1]
                player = {..._player, army: _player.army + action.count}
                let playerList = _.cloneDeep(s.players.playerList)
                playerList[player.table_position-1] = player
                ret.players.playerList = playerList
                return ret }
            case 'PLAYER_CHANGE/FORTIFY':{
                return ret }
            case 'PLAYER_CHANGE/REDEEM':
                _player = s.players.playerList[s.players.turn_stack[0]-1]
                let diff = new Set(action.territory_cards)
                let territory_cards = new Set([..._player.territory_cards].filter(card=>!diff.has(card)))
                player = {..._player, army: _player.army + action.count, territory_cards: territory_cards}
                let playerList = _.cloneDeep(s.players.playerList)
                playerList[player.table_position-1] = player
                ret.players.playerList = playerList
                return ret
            case 'PLAYER_CHANGE/ATTACK':{
                let playerList = _.cloneDeep(s.players.playerList)
                _player = playerList[s.players.turn_stack[0]-1]
                let territories = _.cloneDeep(_player.territories)

                //debugger
                let _enemy = playerList[action.enemy.table_position-1]
                let enemyTerritories = _.cloneDeep(_enemy.territories)

                
                territories[action.fromTerritory] =  action.fromCount
                player = {..._player, territories: territories}
                playerList[player.table_position-1] = player
    
                
                enemyTerritories[action.toTerritory] = action.toCount
                let enemy = {..._enemy, territories: enemyTerritories}
                playerList[action.enemy.table_position-1] = enemy
                ret.players.playerList = playerList
                return ret}
            case 'PLAYER_CHANGE/PLACE_ARMIES': {

                _player = s.players.playerList[s.players.turn_stack[0]-1]
                
                let prev = _player.territories[action.territory]
                console.log('prev', prev);
                _player.territories[action.territory] =  prev ? prev + action.count : action.count

                player = {..._player, army: _player.army - action.count, territories: {..._player.territories}}
                
                let playerList = _.cloneDeep(s.players.playerList)
                
                playerList[player.table_position-1] = player
                ret.players.playerList = playerList
                return ret }
            case 'PLAYER_CHANGE/ELIMINATED':
                console.log();
                break
            case 'PLAYER_CHANGE/ELIMINATOR':
                break
            case 'PLAYER_CHANGE/SELECT_TERRITORY': {
                if(!(s.players.available_territories.includes(action.territory))){
                    return ret
                }
                let available_territories = _.cloneDeep(s.players.available_territories)
                available_territories.splice(available_territories.indexOf(action.territory), 1)
                ret.players.available_territories = available_territories

                _player = s.players.playerList[s.players.turn_stack[0]-1]
                
                let prev = _player.territories[action.territory]
                console.log('prev', prev);
                _player.territories[action.territory] = prev ? prev + 1 : 1

                player = {..._player, army: _player.army - 1, territories: {..._player.territories}}
                
                let playerList = _.cloneDeep(s.players.playerList)
                
                playerList[player.table_position-1] = player
                ret.players.playerList = playerList
                return ret }
            case 'PLAYER_CHANGE/CONQUER_TERRITORY':{
                _player = s.players.playerList[s.players.turn_stack[0]-1]
                let available_territory_cards = _.cloneDeep(s.players.available_territory_cards)
                let territory_cards = _.cloneDeep(_player.territory_cards)
                let randIndex = Math.floor(Math.random()*available_territory_cards.length)
                let randCard = available_territory_cards.splice(randIndex, 1)
                territory_cards.push(randCard)
                let territories = _.cloneDeep(_player.territories)

                let prevFrom = territories[action.fromTerritory]
                let prevTo = territories[action.toTerritory]
                territories[action.fromTerritory] =  prevFrom - action.count
                territories[action.toTerritory] =  prevTo + action.count
                player = {..._player, territories: territories, territory_cards: territory_cards}
                playerList[player.table_position-1] = player
                
                let _enemy = playerList[action.enemy.table_position-1]
                let enemyTerritories = _.cloneDeep(_enemy.territories)
                
                delete enemyTerritories[action.toTerritory]
                let enemy = {..._enemy, territories: enemyTerritories}
                playerList[action.enemy.table_position-1] = enemy
                
                ret.players.playerList = playerList
                ret.players.available_territory_cards = available_territory_cards

                
                return ret }
            
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


    const formCloseHandler = function(){
        setJoinClicked(false)
    }

    const startGame = function(){
        socketManager.send({type: "START", user_id: authctx.id})
    }

    const turnChange = function(){
        socketManager.send({type: "ACTION", user_id: authctx.id, action: {type: "TURN_CHANGE"}})
    }

    const redeemAction = function(){
        let player = gameState.players.playerList[gameState.players.turn_stack[0]-1]
        let m = new Map()
        m.set(0,[])
        m.set(1,[])
        m.set(2,[])
        m.set(3,[])
        for(var key of player.territories.keys()){
            let group = TerritoryCardMap[key]
            let old = m.get(group)
            old.push(key)
            m.set(group, old)
            let new0 = m.get(0), new1=m.get(1), new2=m.get(2), new3=m.get(3)
            if(old.length + 1 == 3){
                socketManager.send({type: "ACTION", user_id: authctx.id, action: {type: "PLAYER_CHANGE/REDEEM", territory_cards: old}})
                return true
            }else if(new0 && new1 && new2){
                socketManager.send({
                    type: "ACTION", user_id: authctx.id, 
                    action: {type: "PLAYER_CHANGE/REDEEM", 
                    territory_cards: [new0[0], new1[0], new2[0]]}
                })
                return true
            }else if(new0 && new1 && new3){
                socketManager.send({
                    type: "ACTION", user_id: authctx.id, 
                    action: {type: "PLAYER_CHANGE/REDEEM", 
                    territory_cards: [new0[0], new1[0], new3[0]]}
                })
                return true
            }else if(new0 && new2 && new3){
                socketManager.send({
                    type: "ACTION", user_id: authctx.id, 
                    action: {type: "PLAYER_CHANGE/REDEEM", 
                    territory_cards: [new0[0], new2[0], new3[0]]}
                })
                return true
            }
            else if(new1 && new2 && new3){
                socketManager.send({
                    type: "ACTION", user_id: authctx.id, 
                    action: {type: "PLAYER_CHANGE/REDEEM", 
                    territory_cards: [new1[0], new2[0], new3[0]]}
                })
                return true
            }
        }
        return false
    }


    //useEffect(()=>{}, [playerToAct])
    let ts = gameState.players.turn_stack
    let turn = ts.length ? ts[0] : 0
    return (
        <Fragment>
            <div className={classes.gameBackground} id="table-background">
                {gameState.status == "POST_SETUP" && joinedPosition == turn ?
                <Button onClick={turnChange.bind(this)}>END TURN</Button>
                  
                : <></>}
                {gameState.status == "UNINITIALIZED" && joined ? <Button variant="success" onClick={startGame}>Start Game</Button> : <></>}
                <Table tableRef={tableRef} calculateTerritoryBoundaries={calculateTerritoryBoundaries} players={gameState.players.playerList} started={gameState.status != "UNINITIALIZED"} turn={turn} setTimerExpired={setTimerExpired} totalTime={120} joined={joined} joinClickHandler={joinClickHandler} setJoinedPosition={setJoinedPosition} status={gameState.status} redeemAction={redeemAction}>
                </Table>
            </div>
            <JoinForm joinHandler={joinSubmitHandler} available_colors={gameState.players.available_colors} setLocalColor={setLocalColor} closeHandler={formCloseHandler} show={authctx.isLoggedIn && joinClicked}/>
            {/*territoryBoundaries ? <Territory polygon={territoryBoundaries.values().next().value}/> : <></>*/}
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