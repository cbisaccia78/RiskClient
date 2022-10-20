import React, {useEffect, useState} from "react";
import Button from "react-bootstrap/Button";

export default function Timer(props){
    //const [timer, setTimer] = useState(0)
    const [timeLeft, setTimeLeft] = useState(props.totalTime)

    useEffect(function(){
        setInterval(function(){
            if(timeLeft == 1){
                props.setTimerExpired(true)
            }else{
                setTimeLeft(timeLeft - 1)
            }
            
        }, 1)
    }, [])

    const timeColorMap = function(){
        //green yellow red blinking red
        const ratio = timeLeft/props.totalTime
        if(ratio > 3/4){
            return "success"
        } else if(ratio > 1/2){
            return "danger"
        } else{
            return "warning"
        }
    }

    return (
    <Button variant={timeColorMap()}>{timeLeft + "s"}</Button>
    )

}