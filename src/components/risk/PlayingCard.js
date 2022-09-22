import { createPortal } from 'react-dom'
import React from 'react'
import './PlayingCard.css'
import { cardPics } from '../../images.js'

function PlayingCard(props){
    let hidden = props.hidden
    if(hidden){
        return (
            <img className='playing-card__hidden' src={cardPics[props.hiddenType]} style={props.position}/>
        )
    }
    let srcMap = props.suit[0] + props.rank.string
    return (
        createPortal(
        <img className='playing-card' src={cardPics[srcMap]} style={props.position}>
        </img>, document.getElementById('root'))
    )
}

export default PlayingCard