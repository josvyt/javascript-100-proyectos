const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d') // 2D rendering context

const $sprite = document.querySelector('#sprite')
const $bricks = document.querySelector('#bricks')



canvas.width = 448
canvas.height = 400

/* Ball variables */
const ballRadius = 3
// ball position
let x = canvas.width / 2
let y = canvas.height - 30

// ball speed
let dx = 3
let dy = -3

/* Paddle variables */
const paddleWidth = 50
const paddleHeight = 10

// paddle position
let paddleX = (canvas.width - paddleWidth) / 2
let paddleY = canvas.height - paddleHeight - 10

let rightPressed = false
let leftPressed = false

const PADDLE_SENSITIVITY = 7

/* Bricks variables  */
const brickRowCount = 7;
const brickColumnCount = 13;
const brickWidth = 32;
const brickHeight = 16;
const brickPadding = 0;
const brickOffsetTop = 80;
const brickOffsetLeft = 16;
const bricks = [];

const BRICK_STATUS = {
  ACTIVE: 1,
  DESTROYED: 0
}

for (let c = 0; c < brickColumnCount; c++) {
    bricks[c] = [] // create an empty array for each column
    for (let r = 0; r < brickRowCount; r++) {
        // calculate the brick position on the canvas
        const brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft
        const brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop

        // create a brick object for each row and column
        const random = Math.floor(Math.random() * 8)
        bricks[c][r] = { x: brickX, y: brickY, status: BRICK_STATUS.ACTIVED, color: random }
    }
}


function drawBall() {
    ctx.beginPath()
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2)
    ctx.fillStyle = '#fff'
    ctx.fill()
    ctx.closePath()
}

function drawPaddle() {
    // ctx.fillStyle = '#fafafa'
    // ctx.fillRect(paddleX, paddleY, paddleWidth, paddleHeight)

    ctx.drawImage(
        // imagen, clipX, clipY
        $sprite, 29, 268,
        paddleWidth, paddleHeight,
        paddleX, paddleY,
        paddleWidth, paddleHeight
    )

}

function drawBricks() {
    for (let c = 0; c < brickColumnCount; c++) {
      for (let r = 0; r < brickRowCount; r++) {
        const currentBrick = bricks[c][r]
        if (currentBrick.status === BRICK_STATUS.DESTROYED) continue;

        const clipX = currentBrick.color * 32

        ctx.drawImage(
          $bricks,
          clipX,
          0,
          brickWidth,
          brickHeight,
          currentBrick.x,
          currentBrick.y,
          brickWidth,
          brickHeight
        )
      }
    }
  }

function collisionDetection() { 
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            const currentBrick = bricks[c][r]
            if (currentBrick.status === BRICK_STATUS.DESTROYED) continue;

            const isBallSameXAsBrick =
                x > currentBrick.x &&
                x < currentBrick.x + brickWidth

            const isBallSameYAsBrick =
                y + dy > currentBrick.y &&
                y + dy < currentBrick.y + brickHeight

            if (isBallSameXAsBrick && isBallSameYAsBrick) {
                dy = -dy
                currentBrick.status = BRICK_STATUS.DESTROYED
            }
        }
    }
}

function ballMovement() {
    /* bounce the ball on the sidelines */
    if (
        x + dx > canvas.width - ballRadius || // right side
        x + dx < ballRadius // left side

    ) {
        dx = - dx
    }

    if (y + dy < ballRadius) { // top side
        dy = -dy
    }

    // ball bounces on the paddle
    const isBallSameXAsPaddle =
        x > paddleX &&
        x < paddleX + paddleWidth

    const isBallTouchingPaddle =
        y + dy > paddleY


    if (isBallSameXAsPaddle && isBallTouchingPaddle) {
        dy = -dy
    }
    // ball falls  the void
    else if (y + dy > canvas.height - ballRadius) { // bottom side
        document.location.reload() // reload the page to restart the game   
    }

    // move the ball
    x += dx
    y += dy


}

function paddleMovement() {
    if (rightPressed && paddleX < canvas.width - paddleWidth) {
        paddleX += PADDLE_SENSITIVITY
    } else if (leftPressed && paddleX > 0) {
        paddleX -= PADDLE_SENSITIVITY
    }

}

function cleanCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height) // clear canvas
}

function initEvents() {
    document.addEventListener('keydown', keyDownHandler)
    document.addEventListener('keyup', keyUpHandler)

    function keyDownHandler(event) {
        const { key } = event
        if (key === 'Right' || key === 'ArrowRight') {
            rightPressed = true
        } else if (key === 'Left' || key === 'ArrowLeft') {
            leftPressed = true
        }
    }

    function keyUpHandler(event) {
        const { key } = event
        if (key === 'Right' || key === 'ArrowRight') {
            rightPressed = false
        } else if (key === 'Left' || key === 'ArrowLeft') {
            leftPressed = false
        }
    }

}

function draw() {
    cleanCanvas()
    // draw elements
    drawBall()
    drawPaddle()
    drawBricks()

    // colisiones y movimientos
    collisionDetection()
    ballMovement()
    paddleMovement()

    window.requestAnimationFrame(draw)

}

draw()
initEvents()

