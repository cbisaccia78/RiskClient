import React from "react";
import { createPortal } from "react-dom";
import { Button } from "react-bootstrap";
import "./ArmyCount.css"

const ArmyCount = (props) => {
    let gameSVG = props.board.current.children['gameSVG']
    let territoryBB =  gameSVG.contentWindow.document.getElementById(props.territory).getBoundingClientRect()
    return createPortal((
    <Button style={{backgroundColor: props.color, left: territoryBB.left + 0.4*territoryBB.width, top: territoryBB.top + 0.4*territoryBB.height, width: territoryBB.width / 10, height: territoryBB.height / 10, position: 'absolute', zIndex: 1000, color: 'black'}}>
        {props.count}
    </Button>
    ), document.getElementById('game-table'))
}

export default ArmyCount