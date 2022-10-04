import React from "react";
import Modal from 'react-bootstrap/modal'
import Button from 'react-bootstrap/button'
import Form from 'react-bootstrap/Form'
import Alert from 'react-bootstrap/Alert'
import { useContext } from "react";
import AuthContext from "../../store/auth-context";

export default function(props){
    const authctx = useContext(AuthContext)

    const handleClose = function(){
        const username = document.getElementById('loginUserName').value
        const password = document.getElementById('loginPassword').value
        authctx.onLogin(username, password)
    }

    return (
        <Modal show={authctx.isLoggingIn} onHide={handleClose}>
            <Modal.Dialog>
                <Modal.Header closeButton>
                    <Modal.Title>Register</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                <Form>
                    <Form.Group className="mb-3" controlId="loginUserName">
                        <Form.Label>Username</Form.Label>
                        <Form.Control type="text" placeholder="Enter username"/>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="loginPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" placeholder="Enter password"/>
                    </Form.Group>
                    </Form>
                </Modal.Body>

                <Modal.Footer>
                    {authctx.loginError ? 
                    <Alert variant="danger">
                        Could not register
                    </Alert> : <></>}
                    <Button onClick={handleClose}>Submit</Button>
                </Modal.Footer>
            </Modal.Dialog>
        </Modal>
    )
}