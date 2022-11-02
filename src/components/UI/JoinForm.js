import Button from './Button'
//import AuthContext from '../../store/auth-context'
//import { useContext } from 'react';
import React, { useState} from "react";
import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'
import Alert from 'react-bootstrap/Alert'


function JoinForm(props){
    const [selectedColor, setSelectedColor] = useState(null)
    //const authctx = useContext(AuthContext)

    const joinWithColor = ()=>{
        props.setLocalColor(selectedColor || props.available_colors[0])
        props.joinHandler()
    }
    return (
        <Modal show={props.show} onHide={props.closeHandler}>
            <Modal.Dialog>
                <Modal.Header closeButton>
                    <Modal.Title>Join</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Form.Label>Pick your color</Form.Label>
                    <Form.Control
                    as="select"
                    custom="true"
                    onChange={(e)=>{setSelectedColor(e.target.value)}}
                    >
                        {props.available_colors.map((color)=><option key={color} value={color} style={{backgroundColor: color}}/>)}
                    </Form.Control>
                </Modal.Body>

                <Modal.Footer>
                    {false ? 
                    <Alert variant="danger">
                        Could not join game
                    </Alert> : <></>}
                    {/*<Link to="/game/0">Submit</Link>*/}
                    <Button onClick={joinWithColor}>Submit</Button>
                </Modal.Footer>
            </Modal.Dialog>
        </Modal>
    )
}

export default JoinForm