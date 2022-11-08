import React, {useState, useEffect} from "react";
import { Button } from "react-bootstrap";
import "./ArmyCount.css"

const ArmyCount = (props) => {
    return (
    <Button style={{backgroundColor: props.color}}>
        {props.count}
    </Button>
    )
}

export default ArmyCount