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
    const pictureInputRef = useRef()

    const handleClose = function(){
        authctx.onRegister()
    }
    return (
        <Modal show={authctx.isRegistering} onHide={handleClose}>
            <Modal.Dialog>
                <Modal.Header closeButton>
                    <Modal.Title>Register</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                <label htmlFor="registerUsername">Username</label>
                <input type="text" id="registerUsername" ref={username}>
                </input>
                <label htmlFor="registerPassword">Password</label>
                <input type="password" id="registerPassword" ref={password}>
                </input>
                <label htmlFor="registerImage">Profile Picture</label>
                <input type="file" id="registerImage" accept="image/png, image/jpeg">
                </input>
                </Modal.Body>

                <Modal.Footer>
                    <Button onClick={authctx.onRegister}>Submit</Button>
                </Modal.Footer>
            </Modal.Dialog>
        </Modal>
    )
}