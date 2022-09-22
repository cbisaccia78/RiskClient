import React from "react";
import Table from "react-bootstrap/Table"
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function(props){
    const [clicked, setClicked] = useState(false)

    const navigate = useNavigate()

    const rowClickHandler = function(e){
        navigate("/game")
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
            {props.gamesList.map(game => <GameRow name={game.name} stakes={game.stakes} numPlayers={game.numPlayers} clickHandler={rowClickHandler.bind(this)}/>)}
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