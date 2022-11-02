import React from "react";
import { createPortal } from "react-dom";
import Point from "./Point";

const Territory = function(props){
    const ret = createPortal(
        (
            <>
                {props.polygon.map(point => <Point key={point.x + "-" + point.y}x={point.x} y={point.y}/>)}
            </>
        ), document.getElementById('table-background')
    )
    return ret
}


export default Territory