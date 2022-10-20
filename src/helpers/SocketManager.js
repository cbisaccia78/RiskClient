function SocketManager(jwt){}

SocketManager.prototype = {
    _sock: null,
    _jwt: "",
    _init: function(jwt){
        this._jwt = jwt
    },
    getSocket: function(){
        return this._sock
    },
    setSocket: function(sock){
        this._sock = sock
    },
    send: function(payload){
        this._sock?.send(JSON.stringify({...payload, JWT: this._jwt}))
    }
}

export const socketManager = new SocketManager() 

