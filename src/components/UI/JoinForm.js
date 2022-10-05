import Button from './Button'
import AuthContext from '../../store/auth-context'
import { useContext } from 'react';
import React, { useState} from "react";
import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'
import Alert from 'react-bootstrap/Alert'


function JoinForm(props){
    const [success, setSuccess] = useState(false)
    const [failed, setFailed] = useState(false)
    const selectedColor = useState("")
    const authctx = useContext(AuthContext)

    async function joinSubmitHandler(event){
        try{
            const result = await props.joinHandler()
            
            success = result.success
        } finally{
            props.setFailed(!success)
            props.setSuccess(success)
        }   
    }

    return (
        <Modal show={props.show} onHide={props.closeHandler}>
            <Modal.Dialog>
                <Modal.Header closeButton>
                    <Modal.Title>Join</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="gameName">
                            <Form.Label>Select Color</Form.Label>
                            <Form.Control type="radio" placeholder="Enter username"/>
                        </Form.Group>
                    </Form>
                </Modal.Body>

                <Modal.Footer>
                    {failed ? 
                    <Alert variant="danger">
                        Could not join game
                    </Alert> : <></>}
                    {/*<Link to="/game/0">Submit</Link>*/}
                    <Button onClick={joinSubmitHandler}>Submit</Button>
                </Modal.Footer>
            </Modal.Dialog>
        </Modal>
    )
}

export default JoinForm