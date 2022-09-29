import React from "react";
import Table from "react-bootstrap/Table"
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";

export default function(props){
    const [clicked, setClicked] = useState(false)
    const [gameList, setGameList] = useState([])

    useEffect(function(){
        const getGames = async function(){
            try {
                const response = await fetch("localhost:3001/games/all")
                const gamelist = await response.json()
                setGameList = gamelist.games
            } catch (error){
                console.error(error)
            }
        }
    }.bind(this), [])

    const navigate = useNavigate()

    const rowClickHandler = function(e){
        navigate(`/game/${1}`)
    }
    

    return (
    <Table hover striped>
        <thead>
            <tr>
                <th>Name</th>
                <th>Stakes</th>
                <th>Population</th>
            </tr>
        </thead>
        <tbody>
            {gameList.map(game => <GameRow name={game.name} stakes={game.stakes} numPlayers={game.numPlayers} clickHandler={rowClickHandler.bind(this)}/>)}
        </tbody>
    </Table>
    )
}

function GameRow(props){
    return (
    <tr onClick={props.clickHandler}>
        <td>{props.name}</td>
        <td>{props.stakes}</td>
        <td>{props.numPlayers}/6</td>
    </tr>
    )
}