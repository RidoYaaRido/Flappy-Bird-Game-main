let moveSpeed = 3;
let gravity = 0.5;
let bird = document.querySelector('.bird');
let img = document.getElementById('bird-1');
let soundPoint = new Audio('sounds effect/point.mp3');
let soundDie = new Audio('sounds effect/die.mp3');

// Getting bird element properties
let birdProps = bird.getBoundingClientRect();

// This method returns DOMRect -> top, right, bottom, left, x, y, width, and height
let background = document.querySelector('.background').getBoundingClientRect();

let scoreVal = document.querySelector('.score_val');
let message = document.querySelector('.message');
let scoreTitle = document.querySelector('.score_title');

let gameState = 'Start';
img.style.display = 'none';
message.classList.add('messageStyle');

// Variable untuk menghitung jumlah klik
let clickCount = 0;

document.addEventListener('dblclick', (e) => {
    if (gameState !== 'Play') {
        document.querySelectorAll('.pipe_sprite').forEach((element) => {
            element.remove();
        });
        img.style.display = 'block';
        bird.style.top = '40vh';
        gameState = 'Play';
        message.innerHTML = '';
        scoreTitle.innerHTML = 'Score : ';
        scoreVal.innerHTML = '0';
        message.classList.remove('messageStyle');
        play();
    } else {
        // This is where the bird jumps
        birdDy = -7.6;
        img.src = 'images/Bird-2.png';
        setTimeout(() => {
            img.src = 'images/Bird.png';
        }, 100);
    }
});

let birdDy = 0;

function play() {
    function move() {
        if (gameState !== 'Play') return;

        let pipeSprites = document.querySelectorAll('.pipe_sprite');
        pipeSprites.forEach((element) => {
            let pipeSpriteProps = element.getBoundingClientRect();
            let birdProps = bird.getBoundingClientRect();

            if (pipeSpriteProps.right <= 0) {
                element.remove();
            } else {
                if (birdProps.left < pipeSpriteProps.left + pipeSpriteProps.width &&
                    birdProps.left + birdProps.width > pipeSpriteProps.left &&
                    birdProps.top < pipeSpriteProps.top + pipeSpriteProps.height &&
                    birdProps.top + birdProps.height > pipeSpriteProps.top) {
                    gameState = 'End';
                    message.innerHTML = 'Game Over'.fontcolor('red') + '<br>Double Click To Restart';
                    message.classList.add('messageStyle');
                    img.style.display = 'none';
                    soundDie.play();
                    return;
                } else {
                    if (pipeSpriteProps.right < birdProps.left &&
                        pipeSpriteProps.right + moveSpeed >= birdProps.left &&
                        element.dataset.increaseScore === '1') {
                        scoreVal.innerHTML = +scoreVal.innerHTML + 1;
                        soundPoint.play();
                    }
                    element.style.left = (parseInt(element.style.left) - moveSpeed) + 'px';
                }
            }
        });
        requestAnimationFrame(move);
    }
    requestAnimationFrame(move);

    function applyGravity() {
        if (gameState !== 'Play') return;
        birdDy += gravity;

        if (birdProps.top <= 0 || birdProps.bottom >= background.bottom) {
            gameState = 'End';
            message.style.left = '28vw';
            window.location.reload();
            message.classList.remove('messageStyle');
            return;
        }
        bird.style.top = (birdProps.top + birdDy) + 'px';
        birdProps = bird.getBoundingClientRect();
        requestAnimationFrame(applyGravity);
    }
    requestAnimationFrame(applyGravity);

    let pipeSeparation = 0;
    let pipeGap = 35;

    function createPipe() {
        if (gameState !== 'Play') return;

        if (pipeSeparation > 115) {
            pipeSeparation = 0;

            let pipePosition = Math.floor(Math.random() * 43) + 8;
            let pipeSpriteInv = document.createElement('div');
            pipeSpriteInv.className = 'pipe_sprite';
            pipeSpriteInv.style.top = (pipePosition - 70) + 'vh';
            pipeSpriteInv.style.left = '100vw';

            document.body.appendChild(pipeSpriteInv);
            let pipeSprite = document.createElement('div');
            pipeSprite.className = 'pipe_sprite';
            pipeSprite.style.top = (pipePosition + pipeGap) + 'vh';
            pipeSprite.style.left = '100vw';
            pipeSprite.dataset.increaseScore = '1';

            document.body.appendChild(pipeSprite);
        }
        pipeSeparation++;
        requestAnimationFrame(createPipe);
    }
    requestAnimationFrame(createPipe);

    // Event listener untuk mengklik dua kali pada kursor
    document.addEventListener('click', (e) => {
        clickCount++;
        if (clickCount === 2) {
            clickCount = 0; // Reset click count
            document.querySelectorAll('.pipe_sprite').forEach((element) => {
                element.remove();
            });
            img.style.display = 'block';
            bird.style.top = '40vh';
            gameState = 'Play';
            message.innerHTML = '';
            scoreTitle.innerHTML = 'Score : ';
            scoreVal.innerHTML = '0';
            message.classList.remove('messageStyle');
            soundDie.pause(); // Pause sound die if playing
            soundDie.currentTime = 0; // Reset sound die
            play(); // Restart game
        } else {
            // Jika tidak mencapai dua kali klik, maka loncatkan burung
            birdDy = -7.6;
            img.src = 'images/Bird-2.png';
            setTimeout(() => {
                img.src = 'images/Bird.png';
            }, 100);
        }
    });
}

// Call the play function to start the game
play();
