(function(){
    //debugger
    submit = document.getElementById("submit-button")
    credSubmit = document.getElementById("cred-submit")
    user = document.getElementById("username")
    password = document.getElementById("password")
    input = document.getElementById("input")
    inputHistory = document.getElementById("history")

    submit.addEventListener("click", function(){
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
        payload = JSON.stringify({type: input.value})
        inputHistory.innerText += " " + payload
        sock.send(payload)
        input.value = ""
    })
    credSubmit.addEventListener("click", async function(){
        payload = JSON.stringify({username: user.value, password: password.value})
        try{
            const response = await fetch("http://localhost:3001/login", {
                method: 'POST',
                body: payload
            })
            return response.json();
        } catch(error){
            console.error(error)
        }
    })

    retval = "initial"
    
})()