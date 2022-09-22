(function(){
    //debugger
    submit = document.getElementById("submit-button")
    input = document.getElementById("input")
    inputHistory = document.getElementById("history")

    submit.addEventListener("click", function(){
        payload = JSON.stringify({type: input.value})
        inputHistory.innerText += " " + payload
        sock.send(payload)
        input.value = ""
    })

    retval = "initial"
    sock = new WebSocket("ws://localhost:3001/gamesession")
    sock.onopen = ()=>{
        payload = JSON.stringify({type: "Greetings!"})
        innerHistory += payload + " "
        sock.send(payload)
    }
    sock.onerror = (e)=>{
        console.log(e.message)
    }
    sock.onclose = ()=>{
        inputHistory.innerText += "\nclosed"
    }
    sock.onmessage = (message)=>{
        //debugger
        inputHistory.innerText += ` ${message.data}\n`
    }
})()