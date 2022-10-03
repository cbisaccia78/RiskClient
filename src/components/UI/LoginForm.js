import React, {useState, useRef} from "react";
import Modal from 'react-bootstrap/modal'
import Button from 'react-bootstrap/button'

export default function(props){
    const [submitClicked, setSubmitClicked] = useState(false)
    const username = useRef('')
    const password = useRef('')
    return (
        <Modal>
            <Modal.Dialog>
                <Modal.Header closeButton>
                    <Modal.Title>Register</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                <input type="text" ref={username}>
                </input>
                <input type="password" ref={password}>
                </input>
                </Modal.Body>

                <Modal.Footer>
                    <Button>Submit</Button>
                    <Button>Close</Button>
                </Modal.Footer>
            </Modal.Dialog>
        </Modal>
    )
}