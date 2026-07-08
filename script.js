// variables 

const textarea = document.getElementById('textarea');
const games = { a: function() {
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
}}

// support functions

const write = function(strings) {
    var text = ''
    for (const string of strings) {
        text = `${text}    ${string}\n` }
    textarea.value = text
}

// scene functions

const startgame = function(cpy) {
    const name = Object.keys(games).sort()[cpy]
    const func = games[name]

    write([
        `You are about to play the game ${name}`,
        'Continue? (h for yes, j for no)'
    ])

    const keypress = function(event) {
        if (event.key == 'h') {
            textarea.removeEventListener('keydown', keypress)
            func()
        } else if (event.key == 'j') {
            textarea.removeEventListener('keydown', keypress)
            mainmenu()
        }
    }

    textarea.addEventListener('keydown', keypress)
}

const urgame = function() {
    mode = prompt('Select a mode (upload/remove)')
    if (mode.startsWith('u')) {
        code = prompt('Enter your code (javascript only)')
        name = prompt('Enter your game name')

        if (name.trim().length == 0) alert('Invalid name')
        else games[name] = new Function(code.split('\n'))
    } else if (mode.startsWith('r')) {
        name = prompt('Enter your game name')
        try { delete games[name] }
        catch { alert('Game does not exist') }
        finally { alert('Game succesfully deleted') }
    }
}

const mainmenu = function() {
    var cursorY = 0
    const gamekeys = Object.keys(games).sort()

    const keypress = (event) => {
        if (event.key == 'w') cursorY -= 1
        if (event.key == 'x') cursorY += 1

        if (event.key == 'h') {
            textarea.removeEventListener('keydown', keypress)
            if (interval) clearInterval(interval)
            interval = null
            startgame(cursorY)
        } else if (event.key == 'j') {
            urgame()
        }

        if (cursorY == -1) cursorY = gamekeys.length - 1
        if (cursorY == gamekeys.length) cursorY = 0
    }

    var interval = null
    const intervalfunc = function() {
        var tdgames = []

        for (var i=0; i<gamekeys.length; i++) {
            const key = gamekeys[i]
            if (i == cursorY) tdgames.push(` > ${key}`)
            else tdgames.push(`   ${key}`)
        }

        write([
            'Welcome to Pyoton\'s iCade Games!',
            'Use the joystick to navigate the games',
            'Press key \'h\' or bottom red button to select the game',
            'Press key \'j\' or bottom left black button to upload/remove a game', ...tdgames
        ])
    }

    textarea.addEventListener('keydown', keypress)
    interval = setInterval(intervalfunc, 100)
}

// main function

const main = function(debug) {
    if (!debug) {
        write(['Pyoton presents...'])
        setTimeout(() => { write(['Pyoton\'s iCade Games!']) }, 3000) }
    setTimeout(mainmenu, (debug) ? 0:6000)
}

// initialization & boot

main(true)