import React from "react";
import Modal from 'react-bootstrap/modal'
import Button from 'react-bootstrap/button'
import Form from 'react-bootstrap/Form'
import Alert from 'react-bootstrap/Alert'
import { base64ToHexString, int8ArrToHexString } from "../../helpers/helpers";
import { useContext } from "react";
import AuthContext from "../../store/auth-context";

export default function(props){
    const authctx = useContext(AuthContext)

    /*
    const name = useRef('')
    const username = useRef('')
    const password = useRef('')
    const email = useRef('')
    const pictureInputRef = useRef()
    
    */
    const handleClose = function(){
        const fullName = document.getElementById('registerName').value
        const userName = document.getElementById('registerUserName').value
        const password = document.getElementById('registerPassword').value
        const email = document.getElementById('registerEmail').value
        let f = document.getElementById('registerImage').files[0]
        if(f){
            let fr = new FileReader()
            fr.onload = () => {
                debugger
                //const hexString = base64ToHexString(fr.result)
                authctx.onRegister(fullName, userName, password, email, fr.result)//hexString)
            }
            fr.onerror = ()=>{
                authctx.onRegister(fullName, userName, password, email, '\\x')
            }
            fr.readAsDataURL(f)
        }
        
        
    }
    return (
        <Modal show={authctx.isRegistering} onHide={()=>{authctx.setIsRegistering(false)}}>
            <Modal.Dialog>
                <Modal.Header closeButton>
                    <Modal.Title>Register</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="registerName">
                            <Form.Label>Full Name</Form.Label>
                            <Form.Control type="text" placeholder="Enter name"/>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="registerUserName">
                            <Form.Label>Username</Form.Label>
                            <Form.Control type="text" placeholder="Enter username"/>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="registerPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" placeholder="Enter password"/>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="registerEmail">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control type="email" placeholder="Enter email"/>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="registerImage">
                            <Form.Label>Profile Picture</Form.Label>
                            <Form.Control type="file" accept="image/png, image/jpeg"/>
                        </Form.Group>
                    </Form>
                </Modal.Body>

                <Modal.Footer>
                    {authctx.registerError ? 
                    <Alert variant="danger">
                        Could not register
                    </Alert> : <></>}
                    
                    <Button onClick={handleClose}>Submit</Button>
                </Modal.Footer>
            </Modal.Dialog>
        </Modal>
    )
}