import classes from './Button.module.css'
import React from 'react'

function Button(props){
    return (
    <button className={`${classes.button} ${props.className}`} type={props.type || 'button'} onClick={props.onClick}>{props.children}</button>
    )
}

export default Button

