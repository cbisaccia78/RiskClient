export default class List {
    #listSize = 0
    #pos = 0
    #dataSource = []
    get length() {
        return this.#listSize
    }

    get currPos(){
        return this.#pos
    }

    clear(){
        this.#dataSource = []
        this.#pos = 0
        this.#listSize = 0
    }

    toString(){
        return this.#dataSource.reduce((accumulatedString, currString)=> `${accumulatedString}` + ` ${currString}`)
    }

    getElement(){
        return this.#dataSource[this.pos]
    }

    insert(ele, after){
        let after_index = this.findIndex(after)
        if (after_index == -1){
            return true
        }
        this.#dataSource.splice(after_index+1, 0, ele)
        ++this.#listSize
        return false
    }

    append(ele){
        this.#listSize = this.#dataSource.push(ele)
    }

    remove(ele){
        let ele_index = this.findIndex(ele)
        if(ele_index < 0){
            return false
        }
        this.#dataSource.splice(ele_index, 1)
        this.#listSize--
        return true
    }

    front(){
        this.#pos = 0
    }

    end(){
        this.#pos = this.#listSize
    }

    previous(){
        return this.#pos > 0 ? this.#dataSource[--this.#pos] : null
    }

    next(){
        return this.hasNext() ? this.#dataSource[this.#pos++] : null
    }

    hasNext(){
        return this.#pos < this.#listSize
    }

    hasPrevious(){
        return this.#pos > 0
    }

    moveTo(newPos){
        this.#pos = newPos
    }

    toArray(){
        return this.#dataSource
    }

    findIndex(ele){
        for(var i = 0; i < this.#listSize; i++){
            if (this.#dataSource[i] == ele){
                return i
            }
        }
        return -1
    }

    static fromArray(array){
        const l = new List()
        array.forEach(function(ele){
            l.append(ele)
        })
        return l
    }
}


