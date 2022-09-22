import React, {Fragment} from 'react'
import PlayingCard from './PlayingCard'
import './Hand.css'

function Hand(props){

    let card1 = props.hand.card1
    let card2 = props.hand.card2
    return (
        <Fragment>
            <PlayingCard key='card1' suit={card1.suit} rank={card1.rank} position={props.cardPosition(props.playerPos, 1)}/>
            <PlayingCard key='card2' suit={card2.suit} rank={card2.rank} position={props.cardPosition(props.playerPos, 2)}/>
        </Fragment>
    )
}

export default Hand