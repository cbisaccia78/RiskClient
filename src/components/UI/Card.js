import {createPortal} from 'react-dom'
import React from 'react'
import classes from './Card.module.css'

function Card(props){
    return createPortal(<div className={`${classes.card} ${props.className}`}>{props.children}</div>, document.getElementById('root'))
}

export default Card