import classes from './JoinForm.module.css'
import modalClasses from './Modal.module.css'
import Button from './Button'
import Card from './Card'
import AuthContext from '../../store/auth-context'
import { Fragment, useContext } from 'react';
import React, { useState, useRef } from "react";
import { createPortal } from "react-dom"

function JoinForm(props){
    const [joinSubmit, setJoinSubmit] = useState(false)
    const usernameInputRef = useRef('')
    const authctx = useContext(AuthContext)

    function joinSubmitHandler(event){
        event.preventDefault()
        props.onJoinSubmit()
        props.onNewPlayer({name: usernameInputRef.current.value, chips: 10000}, authctx.joinedPosition)
        setJoinSubmit(true)
    }

    return (
    createPortal(
    <Fragment>
        <div className={modalClasses.backdrop}></div>    
        <Card className={classes.input}>
            <form>
                <h3>
                    props.title
                </h3>
                <label>
                    Username
                </label>
                <input type="text" ref={usernameInputRef}>
                </input>
                <Button type="submit" onClick={props.joinSubmitHandler}>Join</Button>
            </form>
        </Card>       
    </Fragment>, document.getElementById('root'))
    )
}

export default JoinForm