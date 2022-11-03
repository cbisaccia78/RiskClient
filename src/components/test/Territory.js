import React from "react";
import { createPortal } from "react-dom";
import Point from "./Point";

const Territory = function(props){
    const ret = createPortal(
        (
            <div style={{position: "relative"}}>
                {props.polygon.map(point => <Point key={point.x + "-" + point.y}x={point.x} y={point.y}/>)}
            </div>
        ), document.getElementById('game-table')
    )
    return ret
}


export default Territory