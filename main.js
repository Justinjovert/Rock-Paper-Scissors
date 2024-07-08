
let score = 0
let mode
let userOption = 1
mode = userOption

let templateMode = `#pick-template`

/* const game = ['rock', 'scissors', 'paper'] */
const game = ['scissors', 'paper', 'rock', 'lizard', 'spock']


// Main contianer
const mainContainer = document.querySelector('.main-container')
const template = document.querySelector('[data-templates]')
const rulesContainer = document.querySelector('.rules-popup')
const changeModeContainer = document.querySelector('.change-mode-popup')
const SCOREspan = document.querySelector('#SCORE')
let gameContainer

const changeMode = () => {
    const selectedMode = changeModeContainer.querySelector('input[name="modeType"]:checked')
    // Change rules image
    const rulesIMG = rulesContainer.querySelector('IMG')
    if (selectedMode.value === 'normal') {
        templateMode = `#pick-template`
        rulesIMG.innerHTML = ''
        rulesIMG.src = "./images/image-rules.svg"
    }
    else if (selectedMode.value === 'bonus') {
        templateMode = `#bonus-template`
        rulesIMG.innerHTML = ''
        rulesIMG.src = "./images/image-rules-bonus.svg"
    }

    generateGame()
}


// Generate gammeboard
const generateGame = () => {

    // Remove existing containers
    const existingGameContainer = mainContainer.querySelector('.game-container')
    const existingGameplay = mainContainer.querySelector('.gameplay')
    const existingResult = mainContainer.querySelector('.result-container')

    if (existingGameContainer) {
        existingGameContainer.remove();
    }
    if (existingGameplay) {
        existingGameplay.remove();
    }
    if (existingResult) {
        existingResult.remove();
    }

    gameContainer = template.content.querySelector(templateMode).cloneNode(true)
    // Bonus
    //gameContainer = template.content.querySelector('#bonus-template').cloneNode(true)
    mainContainer.insertBefore(gameContainer, rulesContainer)
}

// Generate 1 time
generateGame()


// Function that removes and adds specific class
let classMode
const changeClassList = (element) => {
    /* if(userOption === 0){
        classMode = 'pick'
    }
    else if(userOption === 1){
        classMode = 'bonus'
    } */
    const array = ['paper', 'rock', 'scissors', 'lizard', 'spock']
    Array.from(element.classList).forEach(elementClass => {
        for (let index = 0; index < array.length; index++) {
            if (elementClass.includes(array[index])) {
                element.classList.remove(elementClass)
                element.classList.add(`${array[index]}-pick`)
            }
        }
        /* if (elementClass.includes('paper') || elementClass == 'rock' || elementClass == 'scissors') {
            console.log(elementClass)
            element.classList.remove(elementClass)
            element.classList.add(`${elementClass}-pick`)
        } */
    })
}

// Function that moves the DOM outside of DOM container
// To not include during opacity transition to 0
const moveElementOutside = (element) => {
    const rect = element.getBoundingClientRect()

    // Get the element's width and height
    const width = element.offsetWidth;
    const height = element.offsetHeight;

    // Remove element from container
    element.parentElement.removeChild(element)

    //rmeove class, add class
    /* element.classList.remove('paper')
    element.classList.add('paper-pick') */
    changeClassList(element)

    // Append to main container
    mainContainer.appendChild(element)

    // Optionally, set the width and height to maintain dimensions
    element.style.width = `${width}px`;
    element.style.height = `${height}px`;


    element.style.top = `${rect.top + window.scrollY}px`
    element.style.left = `${rect.left + window.scrollX}px`;

    return element
}



// Function that gets the bounding client rect
const getRect = (userPickElement, templateElement) => {
    const rect = templateElement.getBoundingClientRect()

    const TEwidth = templateElement.offsetWidth;
    const TEheight = templateElement.offsetHeight;

    // Set dimensions
    userPickElement.style.width = `${TEwidth}px`
    userPickElement.style.height = `${TEheight}px`

    // Set X and Y
    userPickElement.style.top = `${rect.top + window.scrollY}px`
    userPickElement.style.left = `${rect.left + window.scrollX}px`;

    return userPickElement
}


// Generate a pick from house
const generateHousePick = () => {

    let container = `.game-container`

    const pickTemplate = template.content.querySelector(templateMode).cloneNode(true)

    const choiceIndex = Math.floor(Math.random() * game.length)
    const dataAttri = `[data-pick=${game[choiceIndex]}]`
    // Gets element from template
    // i.e. choice index = scissors, housepick = scissors element
    const housePick = pickTemplate.querySelector(dataAttri)

    changeClassList(housePick)

    // Returns element and index
    return { housePick, choiceIndex }
}


const gameSuccess = (textContent) => {
    const resultContainer = template.content.querySelector('#resultContainer').cloneNode(true)
    mainContainer.insertBefore(resultContainer, rulesContainer)
    //Add button OnClick
    const button = resultContainer.querySelector('#playAgain')
    button.onclick = generateGame
    // Change text content
    const span = resultContainer.querySelector('.result-span')
    span.textContent = textContent
    resultContainer.style.display = 'flex'
    setTimeout(() => {
        resultContainer.classList.add('opacity-to-full')
    }, 10);
}


const winnerWINNERCD = (userChoice, gameChoice) => {
    const index = game.indexOf(userChoice)
    if (userChoice === gameChoice) { // If same choice
        return 'DRAW'
    } else if (index + 1 === game.length && game[0] === gameChoice) { // Special condition for if choice exceeded array length
        SCOREspan.innerHTML = parseInt(SCOREspan.textContent) + 1
        return 'YOU WIN'
    } else if (game[(index - 2 + game.length) % game.length] === gameChoice) { // Special condition if index is lower than 0
        SCOREspan.innerHTML = parseInt(SCOREspan.textContent) + 1
        return 'YOU WIN'
    } else if (game[index + 1] === gameChoice || game[index - 2] === gameChoice) { // If +1 or -2 choice. Refer to array
        SCOREspan.innerHTML = parseInt(SCOREspan.textContent) + 1
        return 'YOU WIN'
    }
    else {
        SCOREspan.innerHTML = 0
        return 'YOU LOSE'
    }

}


// Using event delegation on main container
mainContainer.addEventListener("click", ({ target }) => {
    if (target.closest('.outer-circle')) {
        const userPick = target.closest('.outer-circle')
        // Clone the picked item
        const clone = userPick.cloneNode(true)

        // Change class. i.e. 'paper' to 'paper-pick'
        changeClassList(clone)

        // Retrieve the picked element and move DOM outside of current container
        let userPickElement
        gameContainer.classList.add('opacity-to-zero')
        Array.from(gameContainer.children).forEach(element => {
            if (element.dataset.pick === userPick.dataset.pick)
                userPickElement = moveElementOutside(element)
        })


        // After transition
        // Set display to none
        gameContainer.addEventListener('transitionend', () => {
            Array.from(gameContainer.children).forEach(element => {
                element.style.display = 'none'
            })
            gameContainer.style.display = 'none'

            const gameplay = template.content.querySelector('.gameplay').cloneNode(true)
            mainContainer.insertBefore(gameplay, rulesContainer)
            gameplay.style.display = 'flex'
            setTimeout(() => {
                gameplay.classList.add('opacity-to-full')
            }, 10);

            // Move picked element to gameplay container template (X, Y)
            const circleContainer = gameplay.querySelector('.circle-container')
            const element = getRect(userPickElement, circleContainer)

            // After transition
            // Set display to none to UserPickElement
            // And add clone to container
            // This is to keep responsiveness of item
            userPickElement.addEventListener('transitionend', () => {
                circleContainer.insertBefore(clone, circleContainer.firstChild)
                userPickElement.style.display = 'none'

                // Generate house pick
                const { housePick, choiceIndex } = generateHousePick()
                const housePickContainer = gameplay.querySelector('#housePick')
                housePickContainer.append(housePick)

                // Call function that checks who won
                const textContent = winnerWINNERCD(userPick.dataset.pick, game[choiceIndex])

                // Display game status
                setTimeout(() => {
                    gameSuccess(textContent)
                }, 300);
            }, { once: true })


        }, { once: true })

    }
})



// RULES MODAL
const rulesButton = document.querySelector('.rules')
rulesButton.addEventListener('click', () => {
    rulesContainer.style.display = 'flex'
})

// Change mode modal
const changeModeButton = document.querySelector('.change-mode')
const changeModeModal = document.querySelector('.change-mode-popup')
changeModeButton.addEventListener('click', () => {
    changeModeModal.style.display = 'flex'
})

const closeButton = document.querySelectorAll('#close-button')
Array.from(closeButton).forEach(button => {
    button.addEventListener('click', () => {
        const popupContainer = button.closest('[data-close]')
        popupContainer.style.display = 'none'
    })
})