import _ from "lodash"

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

export const delay = t => {
    return new Promise(resolve => {setTimeout(resolve, t)})
}

export const TerritoryCardMap = {
    'eastern_australia' : 0, 'indonesia' : 1, 'new_guinea': 2, 
    'alaska': 0, 'ontario' : 1, 'northwest_territory': 2, 
    'venezuela': 0, 'madagascar' : 1, 'north_africa': 2, 
    'greenland': 0, 'iceland' : 1, 'great_britain': 2, 
    'scandinavia': 0, 'japan' : 1, 'yakursk': 2, 
    'siberia': 0, 'ural' : 1, 'afghanistan': 2, 
    'india': 0, 'siam' : 1, 'china': 2,  
    'ukraine': 0, 'southern_europe' : 1, 'western_europe': 2,
    'northern_europe': 0, 'egypt' : 1, 'east_africa': 2,
    'congo': 0, 'south_africa' : 1, 'brazil': 2, 
    'eastern_united_states': 0, 'western_united_states': 1, 'middle_east': 2,
    'quebec': 0, 'central_america': 1, 'peru': 2, 
    'western_australia': 0, 'alberta': 1, 'kamchatka': 2,
    'irkutsk': 0, 'mongolia': 1, 'argentina': 2,
    'wildcard1': 3, 'wildcard2': 3
}

export const randInt = function(start, end){
    return start + Math.floor(Math.random()*(end - start))
}

export const debounce = function(bouncee, time=100){
    //
    return bouncee
    /*
    let timer = 0
    const ret = function(){
        if(timer < time){
            timer = setTimeout(bouncee, time)
        }
        clearTimeout(timer)
        bouncee()
    }
    return ret
    */
}

export const linearApproxBezier = function(numPoints=2, p_0, p_1, p_2){
    /*
        parametrize linear interpolants from p0->p1 and p1->p2 between 0-1
        step size is equal to 1/numPoints
        let polygon = []
        for each step i do
            let L01i
            let L12i
            parametrize line from L01i to L12i (call this Lstep) between 0-1
            polygon.push(Lstep(i))
    */
   let approximation = []
   for(var i = 0; i <= 1; i += 1/numPoints){
        let lStepXi = (1-i)*((1-i)*p_0.x + i*p_1.x) + i*((1-i)*p_1.x+i*p_2.x)
        let lStepYi = (1-i)*((1-i)*p_0.y + i*p_1.y) + i*((1-i)*p_1.y+i*p_2.y)
        approximation.push({x: lStepXi, y: lStepYi})
   }
   return approximation
}

export const pathDToPoly = function(d, a, b){
    //only handles absolute commands for now. 
    var polygon = []
    let full = d.split(" ")
    var prevCommand = ""
    var paramNum = 1
    var threePoints = []
    var command = true
    var params = []
    //var twoPoints
    for(var i = 0; i < full.length; i++){
        let ele = full[i]
        if(!command){
            switch(prevCommand){
                case "L":
                case "M":
                    params = ele.split(",")
                    var x_0 = parseFloat(params[0]), y_0 = parseFloat(params[1])
                    //var r = x_0 > y_0 ? y_0 / x_0 : x_0 / y_0
                    //polygon.push({x: x_0 + r*(1-a)*vPx + (1-r)*(1-b)*vPy, y: y_0 + (1-r)*(1-a)*vPx + r*(1-b)*vPy}) #  USE THIS IF ASPECT RATIO MUST BE PRESERVED UPON VIEWBOX CHANGES
                    polygon.push({x: x_0/a, y: y_0/b})
                    command=true
                    break
                case "C":
                    
                    params = ele.split(",")
                    var x_0 = parseFloat(params[0]), y_0 = parseFloat(params[1])
                    //var r = x_0 > y_0 ? y_0 / x_0 : x_0 / y_0
                    //polygon.push({x: x_0 + r*(1-a)*vPx + (1-r)*(1-b)*vPy, y: y_0 + (1-r)*(1-a)*vPx + r*(1-b)*vPy})
                    threePoints.push({x: x_0/a, y: y_0/b})
                    paramNum++
                    if(paramNum == 4){
                        polygon = polygon.concat(linearApproxBezier(3, threePoints[0], threePoints[1], threePoints[2]))
                        paramNum = 1
                        threePoints = []
                        command = true
                    }
                    break
                case "c":
                case "Z":
                case "z":
                case "m": 
                case "l":
                case "H":
                case "h":
                case "V":
                case "v":
                default:
                    break
            }
        }else{
            prevCommand = ele
            command = false
        }
    }
    polygon.push(polygon[0])
    return polygon
}

export const isInsidePolygon = function(polygon, mouseX, mouseY) {    
    /*
    var c = false;
    
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
    return c;*/
    /*
        Edge Crossing Rules
         1.   an upward edge includes its starting endpoint, and excludes its final endpoint;
            
         2.   a downward edge excludes its starting endpoint, and includes its final endpoint;
            
         3.   horizontal edges are excluded
            
         4.   the edge-ray intersection point must be strictly right of the point P.
    */
    var cn = 0
    for (let i=0; i < polygon.length - 1; i++) {
        //if edge i crosses upward (rule 1) OR edge i crosses downward (rule 2)
        let vI = polygon[i]
        let vJ = polygon[i+1]
        if(((vI.y <= mouseY) && (vJ.y > mouseY)) || ((vI.y > mouseY) && (vJ.y <= mouseY))){
            let vt = (mouseY - vI.y) / (vJ.y - vI.y)
            if(mouseX < vI.x + vt*(vJ.x - vI.x)){
                cn++
            }
        } 
    }
    return cn&1
}

export const bufferToBase64 = function( buffer ) {
    var binary = '';
    var bytes = new Uint8Array( buffer );
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
        binary += String.fromCharCode( bytes[ i ] );
    }
    return window.btoa( binary );
}

export const base64ToHexString = function(b64String){
    var hexString = '\\x'
    let bFilter = 0xFF, mSig = 0xF0, lSig = 0xF
    for(var i = 0; i < b64String.length; i++){
        let twoB = b64String.charCodeAt(i)// && twoBFilter
        for(var j = 0; j < 2; j++){
            let b = (twoB >> (1-j)*8) && bFilter   
            let ms = (mSig & b) >> 4
            hexString += ms.toString(16)
            let ls = (lSig & b)
            hexString += ls.toString(16)
        }
    }
}

export const hexStringToBase64 = function(hexString){
    var int8arrBuffer = []
    const val = hexString.split('\\x')[1]
    if(!val) return ""
    try {
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
   debugger
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

export const playerCoordScale= function(i){
    /*
    var scale_top = 0.15, scale_left = 0.15
    if(i==0) return {scale_top: h*scale_top, scale_left: w*scale_left}
    const separation = 2*(w+h)/6
    for(var j = 1; j <= i || j < 6; j++){
        let _st = (scale_top + separation), _sl = (scale_top + separation)
        scale_top = _st > 1.0 ? 1.1 : 
        scale_left = _sl > 1.0 ? 
    }
    return {scale_top: h*scale_top, scale_left: w*scale_left}*/
    

    //need to calculate these positions exactly
    
    switch(i){
        case 1:
            return {scale_top: `${10}vh`, scale_left: `${-6}vw`, position: "absolute"} 
        case 2:
            return {scale_top: `${60}vh`, scale_left: `${-6}vw`, position: "absolute"}
        case 3:
            return {scale_top: `${84}vh`, scale_left: `${24}vw`, position: "absolute"}
        case 4:
            return {scale_top: `${84}vh`, scale_left: `${54}vw`, position: "absolute"}
        case 5:
            return {scale_top: `${60}vh`, scale_left: `${86}vw`, position: "absolute"}
        case 6:
            return {scale_top: `${10}vh`, scale_left: `${86}vw`, position: "absolute"}
        default:
            debugger
            throw new Error("Out of range of position")
    }
}

export const insertTurn = function(turn_stack, assignedSeat){
    
    let l = turn_stack.length
    const turnstack = _.cloneDeep(turn_stack)
    
    if(l == 0 || l == 1){
        turnstack.push(assignedSeat)
        return turnstack
    }

    var last = turnstack[0]
    var curr = turnstack[1]
    if(l == 2){
        if(last < curr){
            if(assignedSeat > last && assignedSeat < curr){ 
                turnstack.splice(1, 0, assignedSeat)
            }else{
                turnstack.push(assignedSeat)
            }
        }else{
            if(assignedSeat < last && assignedSeat > curr){
                turnstack.push(assignedSeat)
            }else{
                turnstack.splice(1, 0, assignedSeat)
            }
        }
        return turnstack
    }

    var i = 1

    var modulated = false //did we go backwards in order ie) 6->1
    while(i < l){ //l is at least 3
        curr = turnstack[i]
        modulated = curr < last
        if(!modulated){//still going up
            if(assignedSeat > last){
                if(assignedSeat < curr){//in between
                    turnstack.splice(i, 0, assignedSeat)
                    return turnstack
                }//else its greater than both, in which case need to increment
            }//else we havent found the right position because we haven't modulated
        }else{ //went backwards
            if(assignedSeat < curr || assignedSeat > last){
                turnstack.splice(i, 0, assignedSeat)
                return turnstack
            }
        }
        last = curr
        i++
    }

    turnstack.push(assignedSeat)
    return turnstack

}

export const deleteTurn = function(turn_stack, assignedSeat){
    return turn_stack.filter((position) => assignedSeat != position)
}