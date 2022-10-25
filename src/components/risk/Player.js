import './Player.css'
import React, {useState, useEffect} from 'react'

function Player(props){
    let data = props.data
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
    //console.log(data);
    let baseStyle = {...props.generatePosition(), position: "absolute", backgroundImage: 'url('+data.icon+')'}
    let p = (
    <>
        <button variant={timeColorMap()} className='player' style={baseStyle}>
            {/*<img src={data.icon} alt={data.name} style={{position: "relative", width: "inherit", height: "inherit", borderRadius: "50%", border: "5px solid rgb(0, 0, 0)" }}/>*/}
        </button>
        <h1>{data.name}</h1>
    </>
    )
    return (
    //createPortal(
        p//, document.getElementById('root'))
    )
}

export default Player