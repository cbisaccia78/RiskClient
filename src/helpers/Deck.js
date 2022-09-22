import List from './List'
import {Suit, Rank} from '../config'

export class Deck extends List {
    #listSize = 0
    #pos = 0
    #dataSource = []

    constructor(shuffle=false){
        super()
        this.#listSize = 52
        this.#pos = 0
        let suit_keys = Object.keys(Suit)
        let rank_keys = Object.keys(Rank)
        for(var i = 0; i < suit_keys.length; i++){
            for(var j = 0; j < rank_keys.length; j++){
                this.append({suit: Suit[suit_keys[i]], rank: Rank[rank_keys[j]]})
            }
        }
        if(shuffle){
            this.shuffle()
        }
    }

    static cardsEqual(ele, card){
        return card.suit === ele.suit && card.rank.val === ele.rank.val
    }

    shuffle(){

    }

    findIndex(ele){
        for(var i = 0; i < this.#listSize; i++){
            let card = this.#dataSource[i]
            if (Deck.cardsEqual(ele, card)){
                return i
            }
        }
        return -1
    }

    toString(){
        return this.#dataSource.reduce((accumulatedString, currString)=> `${accumulatedString}` + ` ${currString}`)
    }
}