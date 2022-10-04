export const print = function(arg){
    console.log(arg)
}

export const matrix = function(rows, columns, initial_val){
    var _matrix = []
    for(var i = 0; i < rows; i++){
        var row = []
        for(var j=0; j < columns; j++){
            row.push(initial_val)
        }
        _matrix.push(row)
    }
    return _matrix
}

export const range = function(start, end){
    var range = []
    for(var i = start; i < end; i++){
        range.push(i)
    }
    return range
}

export const randInt = function(start, end){
    return start + Math.floor(Math.random()*(end - start))
}

export const isInsidePolygon = function(polygon, mouseX, mouseY) {    
    const c = false;
    
    for (let i=1, j=0; i < polygon.length; i++, j++) {
        const ix = polygon[i].x;
        const iy = polygon[i].y;
        const jx = polygon[j].x;
        const jy = polygon[j].y;
        const iySide = (iy > mouseY);
        const jySide = (jy > mouseY);
        
        if (iySide != jySide) {
            const intersectX = (jx-ix) * (mouseY-iy) / (jy-iy) + ix;
            if (mouseX < intersectX)
                c = !c;
        }            
    }
    return c;
}

export const int8ArrToHexString = function(int8arr){
    const mostSig = 240
    const leastSig = 15
    var hexString = '\\x'
    int8arr.forEach(b=>{
        let ms = (mostSig & b) >> 4
        hexString += ms.toString(16)
        let ls = (leastSig & b)
        hexString += ls.toString(16)
    })
    return hexString
}

export const hexStringToInt8Arr = function(hexString){
    /*
         hexString: '\xhex1hex2...hexn'
         val = hexString.split('\\x')[1] //error check this
         val.forEach
    */
   const int8arrBuffer = []
    try {
        const val = hexString.split('\\x')[1]
        var mostSig = true
        var n = 0
        for(var i = 0; i < val.length; i++){
            var half = Number.parseInt(val[i])
            if(mostSig){
                n = half << 4
            }else{
                n += half       
                int8arrBuffer.push(n)
                n = 0
            }
            mostSig = !mostSig
        }
        
    } catch (error){}
    return Int8Array.from(int8arrBuffer)
}