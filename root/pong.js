// variables

// map: 15x9

let playerY = 6
let playerVY = 0
let player2Y = 6
let player2VY = 0
let ballX = 6
let ballY = 7
let ballVX = 1
let ballVY = 1
let playing = false
let computer = true
let score1 = 0
let score2 = 0

// support functions

const draw = function() {
    let map = []
    for (let y = 0; y < 9; y++) {
        let row = ''
        for (let x = 0; x < 15; x++) {
            if (x == 0 && y == playerY) row += '|'
            else if (x == 14 && y == player2Y) row += '|'
            else if (x == Math.floor(ballX) && y == Math.floor(ballY)) row += 'O'
            else if (x == 0 || x == 14) row += ' '
            else row += ' '
        }
        map.push(row)
    }
    write([
        'PONG',
        score1 + '          ' + score2,
        '===============',
        ...map,
        '==============='
    ])
}

// scene functions

const game = function() {
    const loop = function() {
        if (!playing) return

        playerY += playerVY
        if (playerY < 0) playerY = 0
        if (playerY > 8) playerY = 8

        if (computer) {
            if (ballX > 7) {
                if (player2Y < ballY - 1) player2VY = 1
                else if (player2Y > ballY + 1) player2VY = -1
                else player2VY = 0
            }
        }
        player2Y += player2VY
        if (player2Y < 0) player2Y = 0
        if (player2Y > 8) player2Y = 8

        ballX += ballVX
        ballY += ballVY

        if (ballY <= 0 || ballY >= 8) ballVY *= -1

        if (ballX <= 1) {
            if (Math.floor(ballY) == playerY) {
                ballVX = 1
                ballVY += (Math.random() - 0.5) * 0.6
            } else {
                score2++
                if (score2 >= 5) {
                    playing = false
                    write(['Player 2 Wins!'])
                    return
                }
                ballX = 6
                ballY = 4
                ballVX = 1
                ballVY = (Math.random() - 0.5) * 2
            }
        }

        if (ballX >= 13) {
            if (Math.floor(ballY) == player2Y) {
                ballVX = -1
                ballVY += (Math.random() - 0.5) * 0.6
            } else {
                score1++
                if (score1 >= 5) {
                    playing = false
                    write(['Player 1 Wins!'])
                    return
                }
                ballX = 6
                ballY = 4
                ballVX = -1
                ballVY = (Math.random() - 0.5) * 2
            }
        }

        draw()
        setTimeout(loop, 120)
    }

    ballX = 6
    ballY = 4
    ballVX = 1
    ballVY = (Math.random() - 0.5) * 2
    score1 = 0
    score2 = 0
    playing = true
    loop()
}

const menu = function() {
    const keypress = function(event) {
        if (event.key == 'h') {
            playing = true
            computer = true
            textarea.removeEventListener('keydown', keypress)
            game()
        } else if (event.key == 'j') {
            playing = true
            computer = false
            textarea.removeEventListener('keydown', keypress)
            game()
        }
    }

    write([
        'Pong\n',
        'Press \'h\' for 1p, \'j\' for 2p'
    ])

    textarea.addEventListener('keydown', keypress)
}

// main function

// initialization & boot

textarea.addEventListener('keydown', (event) => {
    if (playing) {
        if (event.key == 'w') playerVY = 1
        if (event.key == 'x') playerVY = -1
        if (event.key == 'e' || event.key == 'z') playerVY = 0

        if (!computer) {
            if (event.key == 'o') player2VY = 1
            if (event.key == 'l') player2VY = -1
            if (event.key == 'g' || event.key == 'v') player2VY = 0
        }
    }
})

menu()
