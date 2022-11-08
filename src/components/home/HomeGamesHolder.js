import './HomeGamesHolder.css'
import React from "react";
import GamesList from './GamesList';
import { Button } from 'react-bootstrap';
//import GameForm from '../UI/GameForm';
import { useState, useContext, useEffect} from 'react';
import {Navigate} from 'react-router-dom'
import AuthContext from '../../store/auth-context';
import Alert from 'react-bootstrap/Alert'

export default function(){
    const [createClicked, setCreateClicked] = useState(false)
    const [rejoinClicked, setRejoinClicked] = useState(false)
    const authctx = useContext(AuthContext)

    return ( 
        createClicked && authctx.isLoggedIn ? 
            <Navigate replace to="/game/create"/> 
        :
            <div className="HomeGamesHolder">
                {
                    authctx.gameGlobals.gameId ? 
                        rejoinClicked ? 
                            <Navigate replace to={`/game/${authctx.gameGlobals.gameId}`}/>
                        :
                            <>
                                <Alert variant="danger">
                                    CURRENTLY IN GAME
                                </Alert> 
                                <Button variant="danger" onClick={function(){setRejoinClicked(true)}.bind(this)}>Return to Game</Button>
                            </>
                    :
                        <>
                            <GamesList/>
                            <Button variant="primary" onClick={()=>{setCreateClicked(true)}}>Create Game</Button>
                            {createClicked && !(authctx.isLoggedIn) ? 
                                <Alert variant="danger">
                                    Must be logged in to create game
                                </Alert> : <></>
                            }
                        </>
                    
                }
                
                {/*<GameForm show={createClicked} onClose={()=>{setCreateClicked(false)}}/>*/}
            </div>
    )
}