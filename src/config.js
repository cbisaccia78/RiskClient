/*
percentage left / top of the viewport
ASSUMES A CONSTANT VIEWPORT RATIO OF 16/9
*/

export const IMAGEBASE = './static/images/playingcards/'
export const playerPartition = [
    [0.08, 0.44],
    [0.22, 0.12],
    [0.46, 0.03],
    [0.73479166, 0.1409259],
    [0.8458895833,0.585555],
    [0.668333, 0.8211111],
    [0.4391666, 0.8766666666],
    [0.1978125, 0.7987037]
]

export const cardPartition = [
    [[0.20, 0.4, 90], [0.20, 0.49, 90]],
    [[0.25, 0.30, 150], [0.29, 0.26, 150]],
    [[0.440, 0.2, 180], [0.490, 0.2, 180]],
    [[0.65, 0.25, -150],[0.70, 0.30, -150]],
    [[0.735, 0.52, -65], [0.7553, 0.44, -65]],
    [[0.61, 0.66, -20], [0.66, 0.63, -20]],
    [[0.42, 0.685, 4], [0.47, 0.69, 4]],
    [[0.26, 0.60, 29], [0.30, 0.64, 29]],
]

export const TERRITORIES = Object.freeze({
    HEARTS: 'hearts',
    SPADES: 'spades',
    CLUBS: 'clubs',
    DIAMONDS: 'diamonds'
})

export const UNITS = Object.freeze({
    INFANTRY : 1,
    CAVALRY : 5,
    ARTILLERY : 10
})

export const tableGeometry = {
    width: 0.7,
    height : 0.7,
    left: 0.15,
    top: 0.15,
    borderWidth: 30
}

export const DEVELOPMENT = false