import React, {useState, useRef} from "react";
import Modal from 'react-bootstrap/modal'
import Button from 'react-bootstrap/button'
import { useContext } from "react";
import AuthContext from "../../store/auth-context";

export default function(props){
    const authctx = useContext(AuthContext)

    const [submitClicked, setSubmitClicked] = useState(false)
    const username = useRef('')
    const password = useRef('')

    const handleClose = function(){
        authctx.onLogin()
    }

    return (
        <Modal show={authctx.isLoggingIn} onHide={handleClose}>
            <Modal.Dialog>
                <Modal.Header closeButton>
                    <Modal.Title>Register</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                <label htmlFor="loginUsername">Username</label>
                <input type="text" id="loginUsername" ref={username}>
                </input>
                <label htmlFor="loginPassword">Password</label>
                <input type="password" id="loginPassword" ref={password}>
                </input>
                </Modal.Body>

                <Modal.Footer>
                    <Button onClick={authctx.onLogin}>Submit</Button>
                </Modal.Footer>
            </Modal.Dialog>
        </Modal>
    )
}