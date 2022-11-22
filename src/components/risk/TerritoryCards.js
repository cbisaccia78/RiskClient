import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
const TerritoryCards = function(props){
    const [show, setShow] = useState(false)
    const [redeemClicked, setRedeemClicked] = useState(false)

    useEffect(function(){
        if(redeemClicked){
            props.redeemAction()
        }
    }, [redeemClicked])
    return(
    <div>
        {/*show ? props.territory_cards.forEach(()=>{}) : <></>*/}
        <Button variant="success" onClick={()=>{setRedeemClicked(true)}} style={{zIindex: 1000, position: "relative"}}>REDEEM</Button>
    </div>
    )
}

export default TerritoryCards