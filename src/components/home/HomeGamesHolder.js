import './HomeGamesHolder.css'
import React from "react";
import GamesList from './GamesList';
import getGames from '../../static/data/gameData'

export default function(){
    
    
    return (
    <div className="HomeGamesHolder">
        <GamesList gamesList={getGames()}/>
        {/* create game button will go here */}
    </div>
    )
}