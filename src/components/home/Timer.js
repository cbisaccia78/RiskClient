import React, {useEffect, useState} from "react";
import Button from "react-bootstrap/Button";

export default function Timer(props){
    //const [timer, setTimer] = useState(0)
    const [timeLeft, setTimeLeft] = useState(props.totalTime)
    const [timer, setTimer] = useState(0)
    
    useEffect(function(){
        console.log(timeLeft);
        setTimer(setInterval(function(){
            setTimeLeft(c => c - 1)
        }.bind(this), 1000))
        return ()=>{clearInterval(timer)}
    }.bind(this), [])

    useEffect(function(){
        if(timeLeft == 1){
            props.setTimerExpired(true)
            clearInterval(timer)
        }
    }, [timeLeft])

    const timeColorMap = function(){
        //green yellow red blinking red
        const ratio = timeLeft/props.totalTime
        if(ratio > 1/2){
            return "success"
        } else if(ratio > 1/4){
            return "warning"
        } else{
            return "danger"
        }
    }

    return (
    <Button variant={timeColorMap()}>{timeLeft + "s"}</Button>
    )

}