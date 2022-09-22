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