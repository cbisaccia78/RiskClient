import React from "react";
import "./Point.css"

const Point = function(props){
    return (
        <div className="Point" style={{top: props.y, left: props.x}} />
    )
}

export default Point