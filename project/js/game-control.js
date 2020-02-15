let gameMoney = document.querySelector('#money i')
let gameLife = document.querySelector('#life-icon')




class Game {
    constructor() {
        this.money = 300;
        this.life = 5;
        this.pause = false;
        this.reset = false;
        this.quit = false;
        this.success = false;
        this.fail = false;
    }
    gameUpdate() {
        gameMoney.innerHTML = this.money;
        if(this.life === 0) {
            this.fail = true;
            console.log('this game is over!')
        }
    }
}

let game = new Game();


