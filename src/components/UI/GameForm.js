import React from "react";
import Modal from 'react-bootstrap/modal'
import Button from 'react-bootstrap/button'
import Form from 'react-bootstrap/Form'
import Alert from 'react-bootstrap/Alert'
import { useContext, useRef, useState} from "react";
import AuthContext from "../../store/auth-context";
import { Navigate } from "react-router-dom";
import { useEffect } from "react";

export default function(props){
    const authctx = useContext(AuthContext)
    
    const nameRef = useRef('')
    const [clicked, setClicked] = useState(false)
    const [failed, setFailed] = useState(false)

    const createGame = function(){
        setClicked(true)
        props.onClose()
    }

    return ( clicked ? <Navigate replace to="/game/create"/> :
        <Modal show={props.show} onHide={()=>{props.onClose()}}>
            <Modal.Dialog>
                <Modal.Header closeButton>
                    <Modal.Title>Register</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="gameName">
                            <Form.Label>Game Name</Form.Label>
                            <Form.Control type="text" placeholder="Enter username"/>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="gamePassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" placeholder="Enter password" ref={nameRef}/>
                            <Form.Text className="text-muted">Optional.</Form.Text>
                        </Form.Group>
                    </Form>
                </Modal.Body>

                <Modal.Footer>
                    {failed ? 
                    <Alert variant="danger">
                        Could not create game
                    </Alert> : <></>}
                    {/*<Link to="/game/0">Submit</Link>*/}
                    <Button onClick={createGame}>Submit</Button>
                </Modal.Footer>
            </Modal.Dialog>
        </Modal>
    )
}