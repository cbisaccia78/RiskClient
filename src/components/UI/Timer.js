import React, {useState, useEffect} from "react";
import { Button } from "react-bootstrap";
import './Timer.css'

export default function Timer(props){
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
            return "green"
        } else if(ratio > 1/4){
            return "yellow"
        } else{
            return "red"
        }
    }

    return (
        <Button key={`button-${props.table_position}`} className="spinTimer" style={{...props.generatePosition()/*, borderTop:`5px solid ${timeColorMap()}`*/}} variant={timeColorMap()}>
            {`${timeLeft} s`}
        </Button>
    )
}