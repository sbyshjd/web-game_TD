let startPage = document.querySelector('#start-page')
let gamePage = document.querySelector('#game-page')
let endPage = document.querySelector('#end-page')

//start page
let startBtn = document.querySelector('#start-btn');


//game page
let mapGrip = document.querySelector('#map-grid')
let gameMoney = document.querySelector('#money i')
let gameLife = document.querySelector('#life-icon')
let nextRound = document.querySelector('.timer i')
let timer = document.querySelector('.timer h2')
let quitBtn = document.querySelector('#quit')
let pauseBtn = document.querySelector('#pause')
let gameRound = document.querySelector('#count i')
let rounds = document.querySelector('#count strong')
let resetBtn = document.querySelector('#reset')
let oldGame = document.querySelectorAll('.tower-in-map');
let towerInMap = document.querySelectorAll('button.tower-in-map')
let attackDivInMap = document.querySelectorAll('div.tower-in-map')
let mapTower = document.querySelector('#map-tower')
//gamepage for animation
let oldTimeStamp=0;
//60 frames per second
let fps = {i:-1};


//end page
let result = document.querySelector('#end-page h1')
let tryAgain = document.querySelector('#try-again')
console.log(result);

//

class Game {
    constructor() {
        //this is for the grid
        this.showGrid = false;

        //this is for the tower get and set
        this.isCopied = false;
        //thisis for statics
        this.money = 50;
        this.life = 5;
        this.round = 0;
        this.totalRound = 2;

        //this is for the game panel change
        this.starter = true;
        this.run = false;
        this.end= false;
        this.pause = false;
        
        //this is for the tower array and enemy array
        this.enemyArr = [];
        //this is for the sending enemy every round in the game
        this.sending = false;
        this.enemyNum = 0;
        this.cannonArr = [];
        this.laserArr = [];
        this.missileArr = [];
        
        //prepare time for every round
        this.totalTime = 0;
        this.roundTime = 16;

    }
    chargeLife() {
        //give the player 5 lifes
        gameLife.innerHTML = '';
        for(let i=0;i<this.life; i++) {
            let heartIcon = document.createElement('span');
            heartIcon.innerHTML = '&#9829;';
            gameLife.appendChild(heartIcon);
        }
        //cleanup the DOM tree

        oldGame.forEach(e => {
            e.parentNode.removeChild(e);
        })
        //set the round to first
        timer.innerHTML = 'NEXT ROUND: <i>15</i> S';
    }


    gameUpdate() {

        //update the DOM towers and show all the attack range in the map
        oldGame = document.querySelectorAll('.tower-in-map')
        towerInMap = document.querySelectorAll('button.tower-in-map')
        attackDivInMap = document.querySelectorAll('div.tower-in-map')

        //show the grid
        if(this.showGrid === true) {
            mapGrip.style.display = 'flex';
        } else {
            mapGrip.style.display = 'none';
        }


        //check for the life of the game
        if(this.life < gameLife.childElementCount) {
            gameLife.removeChild(gameLife.lastChild)
        }
        //lose condition
        if(this.life === 0) {
            this.starter = false;
            this.end = true;
            this.run = false;
            result.innerHTML = 'YOU LOSE'
            console.log('this game is over!')
        }
        //final round!!!
        if(this.round === this.totalRound) {
            timer.innerHTML = 'FINAL ROUND !!!'
        }
        //win condition
        if(this.life >0 && this.round === this.totalRound+1 && this.enemyArr.length ===0) {
            this.starter = false;
            this.end = true;
            this.run = false;
            result.innerHTML = 'YOU WIN!!!'
            console.log('this game is over!')
        }
        if(this.starter === true && this.run === false && this.end === false) {
            startPage.style.display = 'flex'
            gamePage.style.display = 'none'
            endPage.style.display = 'none'
        }
        if(this.starter === false && this.run === true && this.end === false) {
            startPage.style.display = 'none'
            gamePage.style.display = 'block'
            endPage.style.display = 'none'
        }
        if(this.starter === false && this.run === false && this.end === true) {
            startPage.style.display = 'none'
            gamePage.style.display = 'none'
            endPage.style.display = 'flex'
        }
        //assign the statics
        rounds.innerHTML = this.totalRound;
        gameMoney.innerHTML = this.money;
        if(this.round <this.totalRound +1) {
            gameRound.innerHTML = this.round;
        } else {
            gameRound.innerHTML = this.totalRound;
        }
        
    }
    towerMoneyCheck() {
        let cannonButton =  document.querySelector('#cannon button');
        let laserButton = document.querySelector('#laser button');
        let missileButton = document.querySelector('#missile button');
        if(game.money < 10) {
            cannonButton.classList.add('no-pointer')
        } else {
            cannonButton.classList.remove('no-pointer')
        }

        if(game.money <20) {
            laserButton.classList.add('no-pointer')
        } else {
            laserButton.classList.remove('no-pointer')
        }
        if(game.money <30) {
            missileButton.classList.add('no-pointer')
        } else {
            missileButton.classList.remove('no-pointer')
        }
    }
}

let game = new Game();
game.chargeLife();

//add event to start-btn 
startBtn.addEventListener('click', gameBegin, false)
function gameBegin() {
    game.starter = false;
    game.run = true;
    game.end = false;
}

//add event to quit button
quitBtn.addEventListener('click',gameQuit,false)
function gameQuit() {
    game = new Game();
    oldTimeStamp =0;
    fps.i = -1;
    game.starter = true;
    game.run = false;
    game.end = false;
}

//add event to try again button

tryAgain.addEventListener('click',gameAgain,false)
function gameAgain() {
    game = new Game;
    game.chargeLife();
    oldTimeStamp =0;
    fps.i = -1;
    game.starter = true;
    game.run = false;
    game.end = false;
}

//add event to pause button 

pauseBtn.addEventListener('click',gamePause,false)
function gamePause() {
    if(!game.pause) {
        pauseBtn.firstChild.innerHTML = 'PLAY';
        game.pause = true;
    } else {
        pauseBtn.firstChild.innerHTML = 'PAUSE';
        game.pause = false;
    }
    
}
//add event to reset button 
resetBtn.addEventListener('click',gameReset,false)
function gameReset() {
    game = new Game();
    game.chargeLife();
    pauseBtn.firstChild.innerHTML = 'PAUSE';
    game.starter = false;
    game.run = true;
    game.end= false;
    oldTimeStamp =0;
    fps.i = -1;


}


