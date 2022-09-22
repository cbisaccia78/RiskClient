import riskboard from "../../RiskBoard.svg"
import { useEffect } from "react"
import * as React from "react"
import { isInsidePolygon } from "../../helpers/helpers"



const determineCountry = (evt) => {
  //const { mouseX, mouseY } = 

}

const RiskMap = (props) => {
  useEffect(()=>{
    let img = document.createElement("img")
    img.src = riskboard
    const t = document.getElementById("RiskMap")
    t.appendChild(img)
  }, [])

  return (
  <div id="RiskMap" onClick = {determineCountry}>{props.children}</div>
)
}

export default RiskMap
