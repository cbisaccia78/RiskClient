import classes from './Modal.module.css'
import React, { Fragment } from 'react'
import Card from './Card'

function Modal(props){
    return (
    <Fragment>
        <div className={classes.backdrop}></div>    
        <Card className={classes.modal}>
            <header className={classes.header}>
                <h2>
                    {props.title}
                </h2>
            </header>
            <div className={classes.content}>
                <p>{props.message}</p>
            </div>
            <footer className={classes.actions}>
                <Button>Okay</Button>
            </footer>
        </Card>
    </Fragment> 
        
    )
}

export default Modal