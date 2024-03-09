let isAnimating = false
let pullDeltaX = 0; // distance of drag
const DECISION_THRESHOLD = 75; // threshold for make decision

function onDragStart(event) {
    if (isAnimating) return

    // get the first article element
    let actualCard = event.target.closest('article')

    // get initial position of mouse or touch
    const starX = event.pageX ?? event.touches[0].pageX

    // listen the mouse and touch movevenets
    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseup', onEnd)

    document.addEventListener('touchmove', onMove, { passive: true })
    document.addEventListener('touchend', onEnd, { passive: true })

    function onMove(event) {
        // current position of mouse or touch
        const currentX = event.pageX ?? event.touches[0].pageX

        // the distance between the initial position and the current position
        pullDeltaX = currentX - starX

        // there is no difference between distance
        if (pullDeltaX === 0) return

        // Change flag to true to start animation
        isAnimating = true

        // calulate the rotation degree  based on the distance of the mouse or touch
        const deg = pullDeltaX / 12

        // apply the rotation to the card
        actualCard.style.transform = `translateX(${pullDeltaX}px) rotate(${deg}deg)`

        // change the cursor to grabbing
        actualCard.style.cursor = 'grabbing'

        // change opacity of the choice info
        const opacity = Math.abs(pullDeltaX) / 100
        const isRight = pullDeltaX > 0

        const choiceEl = isRight
            ? actualCard.querySelector('.choice.liked')
            : actualCard.querySelector('.choice.nope')

        choiceEl.style.opacity = opacity

    }

    function onEnd(event) {
        // clean the event listeners
        document.removeEventListener('mousemove', onMove)
        document.removeEventListener('mouseup', onEnd)

        document.removeEventListener('touchmove', onMove)
        document.removeEventListener('touchend', onEnd)

        // know if the user make a decision
        const decisionMake = Math.abs(pullDeltaX) >= DECISION_THRESHOLD

        // if the user make a decision
        if (decisionMake) {
            // if the user pull to the right

            const goRight = pullDeltaX >= 0
            const goLeft = !goRight

            // add class according to the decision
            actualCard.classList.add(goRight ? 'go-right' : 'go-left')

            actualCard.addEventListener('transitioned', () => {
                actualCard.remove()
                isAnimating = false
            })
        } else {
            actualCard.classList.add('reset')
            actualCard.classList.remove('go-left', 'go-right')
        }
        // reset the variables
        actualCard.addEventListener('transitionend', () => {
            actualCard.removeAttribute('style')
            actualCard.classList.remove('reset')

            pullDeltaX = 0
            isAnimating = false
        })

    }

}

document.addEventListener('mousedown', onDragStart)
document.addEventListener('touchstart', onDragStart)
