function SocketManager(){

}

SocketManager.prototype = {
    _sock: null,
    getSocket: function(){
        return this._sock
    },
    setSocket: function(sock){
        this._sock = sock
    },
    send: function(stringifiedData){
        this._sock.send(stringifiedData)
    }
}

export const socketManager = new SocketManager() 

