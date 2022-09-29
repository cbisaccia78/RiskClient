import './HomeGamesHolder.css'
import React from "react";
import GamesList from './GamesList';
import { Button } from 'react-bootstrap';


export default function(){
    
    return (
    <div className="HomeGamesHolder">
        <GamesList/>
        {/* create game button will go here */}
        <Button />
    </div>
    )
}