import React from "react";
import Table from "react-bootstrap/Table"
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";
import { useContext } from "react";
import AuthContext from "../../store/auth-context";
import ThemeContext from "../../store/theme-context";

export default function(props){
    const authctx = useContext(AuthContext)
    const themectx = useContext(ThemeContext)
    const [gameList, setGameList] = useState([])

    useEffect(function(){
        const getGames = async function(){
            try {
                const response = await fetch("http://localhost:3001/games/active")
                const parsed = await response.json()
                console.log(parsed)
                setGameList(parsed)
            } catch (error){
                console.error(error)
            }
        }
        getGames()
    }.bind(this), [])
    console.log(gameList)
    return (
    <Table hover striped>
        <thead>
            <tr>
                <th>Name</th>
                <th>Population</th>
            </tr>
        </thead>
        <tbody>
            {gameList.map(game => <GameRow key={game.game_id} id={game.game_id} name={game.name || `game-${game.game_id}`} numPlayers={game.num_players}/>)}
        </tbody>
    </Table>
    )
}

function GameRow(props){
    const navigate = useNavigate()
    return (
    <tr onClick={()=>{navigate(`/game/${props.id}`)}}>
        <td>{props.name}</td>
        <td>{props.numPlayers}/6</td>
    </tr>
    )
}