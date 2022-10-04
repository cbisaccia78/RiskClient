import './HomeGamesHolder.css'
import React from "react";
import GamesList from './GamesList';
import { Button } from 'react-bootstrap';
import GameForm from '../UI/GameForm';
import { useState } from 'react';


export default function(){
    const [createClicked, setCreateClicked] = useState(false)
    return (
    <div className="HomeGamesHolder">
        <GamesList/>
        {/* create game button will go here */}
        <Button variant="primary" onClick={()=>{setCreateClicked(true)}}>Create Game</Button>
        <GameForm show={createClicked} onClose={()=>{setCreateClicked(false)}}/>
    </div>
    )
}