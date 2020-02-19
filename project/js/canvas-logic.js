//create the map grid
for(let j = 0; j<9;j++) {
    for(let i = 0;i<18;i++) {
        let cell = document.createElement('div');
        cell.classList.add('cell');
        cell.classList.add('no-pointer');
        mapGrip.appendChild(cell);
    }
}




let canvas = document.getElementById('canvas');

//set canvas size
canvas.width = 900;
canvas.height = 500;
//create the drawing board
let ctx = canvas.getContext('2d');

/*
color theme 
1.#3D5E73 dark blue
2.#A3C9D9 light blue
3.#D9B54A yellow
4.#D9B166 brown
5.#D99177 red

*/
//create map
// the change points
let pathPointsArr = [
    {x:0,y:225},
    {x:200,y:225},
    {x:200,y:375},
    {x:500,y:375},
    {x:500,y:125},
    {x:900,y:125},
];

function renderMap() {
//background
    ctx.beginPath();
    ctx.rect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#3D5E73'
    ctx.fill();
//path
    

    ctx.beginPath();
    ctx.moveTo(pathPointsArr[0].x,pathPointsArr[0].y)
    for(let i =1; i<pathPointsArr.length;i++) {
        ctx.lineTo(pathPointsArr[i].x,pathPointsArr[i].y)
    }
    // pathPointsArr.forEach(p => {
    //     ctx.lineTo(p.x,p.y)
    // })
    ctx.lineWidth = 100;
    ctx.strokeStyle = '#A3C9D9'
    let path = ctx.stroke();
}


//draw the enemies

class Enemy {
    constructor(x,y,radius){
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.speed = 0.5;
        this.vx ;
        this.vy ;
        this.health = 40;
        this.reward = 5;
    }
    draw() {
        ctx.beginPath()
        ctx.moveTo(0,this.y)
        ctx.arc(this.x,this.y,this.radius,0,Math.PI*2)
        ctx.fillStyle = '#D99177'
        ctx.fill()
    }
    moveMent() {
        this.draw();
        if(game.pause === false) {
            for (let i =0; i<pathPointsArr.length-1; i++) {
                if(this.x === pathPointsArr[i].x && this.y === pathPointsArr[i].y ) {
                    let dX = pathPointsArr[i+1].x-pathPointsArr[i].x;
                    let dY = pathPointsArr[i+1].y-pathPointsArr[i].y;
                    if(dX === 0) {
                        this.vx = 0;
                        this.vy = dY/Math.abs(dY) * this.speed;
                    }
                    if(dY === 0) {
                        this.vx = dX/Math.abs(dX) * this.speed;
                        this.vy = 0;
                    }
                }
            }
            this.x += this.vx;
            this.y += this.vy;
        }

    }
    
}

class Bullet {
    constructor(x,y,type) {
        this.x = x;
        this.y = y;
        this.type = type;
        switch(type) {
            case 'cannon':
                this.speed = 5;
                this.radius = 10;
                this.damage = 10;
            break;
            case 'laser':
                this.speed = 6;
                // this.radius = 1;
                this.damage = 15;
            break;
            case 'missile':
                this.speed = 1;
                this.radius = 15;
                this.damage = 15;
            break;
        }
        this.target;

    }
    draw() {
        switch(this.type) {
            case 'cannon':
                ctx.beginPath()
                ctx.moveTo(this.x,this.y)
                ctx.arc(this.x,this.y,this.radius,0,Math.PI*2)
                ctx.fillStyle = 'red'
                ctx.fill()
            break;
            // case 'laser':
            //     ctx.beginPath()
            //     ctx.moveTo(this.x,this.y)
            //     ctx.arc(this.x,this.y,this.radius,0,Math.PI*2)
            //     ctx.fillStyle = 'white'
            //     ctx.fill()
            // break;
            case 'missile':
                ctx.beginPath()
                ctx.moveTo(this.x,this.y)
                ctx.arc(this.x,this.y,this.radius,0,Math.PI*2)
                ctx.fillStyle = 'black'
                ctx.fill()
            break;
        }

    }
    drawLaser(x,y) {
        ctx.beginPath()
        ctx.moveTo(this.x,this.y)
        ctx.lineTo(x,y)
        ctx.strokeStyle = 'white'
        ctx.lineWidth = 3
        ctx.stroke()
    }

}

class Tower {
    constructor(x,y,type) {
        this.x = x;
        this.y = y;
        this.radius = 25;
        this.type = type;
        this.target = null;
        this.bulletArray = [];
        switch(type) {
            case 'cannon':
                this.attackRange = 200;
                this.price = 10;
                break;
            case 'laser':
                this.attackRange = 100;
                this.price = 20;
                break;
            case 'missile':
                this.attackRange = 400;
                this.price = 30;
                break;
        }
    }

    draw() {
        ctx.beginPath()
        ctx.moveTo(this.x,this.y)
        ctx.arc(this.x,this.y,this.radius,0,Math.PI*2)
        switch(this.type) {
            case 'cannon':
                ctx.fillStyle = '#D9B54A';
            break;
            case 'laser':
                ctx.fillStyle = 'rgb(206, 93, 48)';
            break;
            case 'missile':
                ctx.fillStyle = 'rgb(217, 74, 217)';
            break;
        }
        
        ctx.fill()
    }
    chooseTarget(enemyArr) {
        if(enemyArr.length) {
            let disMap = enemyArr.map(en => {
                let dis = Math.sqrt((this.x-en.x)*(this.x-en.x) + (this.y-en.y)*(this.y-en.y))
                return dis;
            })
            let min = Math.min(...disMap)
            let index = disMap.indexOf(min);
            let en = enemyArr[index];
            this.target = en;
        } else {
            this.target = null;
        }


    }

    loadBullet(secondsPass) {
        if(this.target) {
            let dis = Math.sqrt((this.x-this.target.x)*(this.x-this.target.x) + (this.y-this.target.y)*(this.y-this.target.y));
            let bullet = null;
            if(dis < this.attackRange) {
                switch(this.type) {
                    case 'cannon':
                        if(secondsPass%2 === 0 ) {
                            bullet = new Bullet(this.x,this.y,'cannon')
                            this.bulletArray.push(bullet)
                        }
                    break;
                    case 'laser':
                        if(secondsPass%1 === 0 ) {
                            bullet = new Bullet(this.x,this.y,'laser')
                            this.bulletArray.push(bullet)
                        }
                    break;
                    case 'missile':
                        if(secondsPass%3 === 0 ) {
                            bullet = new Bullet(this.x,this.y,'missile')
                            this.bulletArray.push(bullet)
                        }
                    break;

                }

            }
        }
    }
    
    //this.target
    fire(enemyArr) {
        //fire for the cannon missile bullet
        if((this.type === 'cannon' || this.type ==='missile') && this.target){
            this.bulletArray.forEach(ele => {
                //make sure the target will not change when the bullet is shot out!
                            if(ele.x===this.x&&ele.y===this.y) {
                                ele.target=this.target;
                            } else {
                                ele.target = ele.target;
                            }
                            ele.draw();
                            if(game.pause === false) {
                                let disX = ele.target.x-this.x;
                                let disY = ele.target.y-this.y;
                                ele.x += ele.speed/Math.sqrt(disX*disX+disY*disY) * disX ;
                                ele.y += ele.speed/Math.sqrt(disX*disX+disY*disY) * disY ;
                            }

                //the bullet out of the canvas and disappear
                            if(ele.x<0 || ele.x>canvas.width || ele.y<0 || ele.y>canvas.height) {
                                let j = this.bulletArray.indexOf(ele)
                                this.bulletArray.splice(j,1);
                            }
                //the bullet hits the enemy in the enemyArr to make damage and disappear
                            enemyArr.forEach(en => {
                                let dis = Math.sqrt((ele.x-en.x)*(ele.x-en.x) + (ele.y-en.y)*(ele.y-en.y))
                                if( dis<=(ele.radius+en.radius) && enemyArr.indexOf(en)>=0 ) {
                                    en.health -= ele.damage;
                                    let i = this.bulletArray.indexOf(ele)
                                    this.bulletArray.splice(i,1);
                                }
                            })
                        })
        } else if(this.type ==='laser'&& this.target && game.pause === false) {
    //this is for the the laser fire bullet and damage calculate 
            this.bulletArray.forEach(ele => {
                ele.drawLaser(this.target.x,this.target.y)
                this.target.health -= ele.damage;
                this.bulletArray.splice(0,1);

            })
        }

        }

    
}

function updateEnemyArr(enemyArr) {
    enemyArr.forEach(e => {
        let index = enemyArr.indexOf(e)
        if(e.health <= 0) {
            enemyArr.splice(index,1);
            //update the game money
            game.money += e.reward
        } 
        if(e.x === canvas.width) {
            enemyArr.splice(index,1);
            game.life-=1;

        }
    })
}

    // buildArmy();

function sendArmy(secondsPass) {
    //snde the enemy every 10 seconds
    if(game.round < (game.totalRound+1)) {
        if(secondsPass % 15 === 0) {
            game.sending = true;
            game.round ++;
        }
        //create the enemyarr for every round
        if(game.round< (game.totalRound+1) && game.sending) {
            if(secondsPass % 1 === 0) {
                let enemy = new Enemy(0,225,15)
                game.enemyArr.push(enemy)
                game.enemyNum++
                if(game.enemyNum === (game.round+3)) {
                    game.enemyNum = 0;
                    game.sending = false;
                    return;
                }
            }
        }
    }

}

function  prepareTime (secondsPass) {
    if(game.round < game.totalRound) {
        timer.childNodes[1].innerHTML = game.roundTime
        if(game.roundTime === 0) {
            game.roundTime = 15;
        }
        if(secondsPass%1 === 0) {
            game.roundTime -= 1;
        }   
    }

}
//load the bullets for tower
// setInterval(()=>{cannonArr.forEach(tower => {
//     tower.loadBullet()
// }
// )},1000)
// setInterval(()=>{laserArr.forEach(tower => {
//     tower.loadBullet()
// }
// )},500)
// setInterval(()=>{missileArr.forEach(tower => {
//     tower.loadBullet()
// }
// )},3000)


function gameLoop(timeStamp) {
//this s for the pause function to stop the total time in game;
    if(game.run == true && game.pause === true ) {
        oldTimeStamp = timeStamp;
    }
    if(game.run === true && game.pause ===false) {
        fps.i++
        if(fps.i===60) {
            fps.i=0
        }
        if(!oldTimeStamp) {
            oldTimeStamp = timeStamp;
        }
        let secondsPass = (timeStamp - oldTimeStamp)/1000;
        oldTimeStamp = timeStamp;
        game.totalTime += secondsPass;
        if(fps.i === 0) {
            //this is the int-second in the game
            game.totalTime = Math.round(game.totalTime);
        }
//in the game loop send the enemy;
    
            sendArmy(game.totalTime);
            prepareTime(game.totalTime);
        
        
        //load the bullet for each cannon tower
        game.cannonArr.forEach(tower => { tower.loadBullet(game.totalTime) })
        game.laserArr.forEach(tower => {  tower.loadBullet(game.totalTime) })
        game.missileArr.forEach(tower => { tower.loadBullet(game.totalTime) })

     }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    game.gameUpdate();
    game.towerMoneyCheck();
    renderMap();
    game.cannonArr.forEach(tower=>{
        // tower.draw()
        tower.chooseTarget(game.enemyArr)
        tower.fire(game.enemyArr)
    });
    game.laserArr.forEach(tower=>{
        // tower.draw()
        tower.chooseTarget(game.enemyArr)
        tower.fire(game.enemyArr)

    });
    game.missileArr.forEach(tower=>{
        // tower.draw()
        tower.chooseTarget(game.enemyArr)
        tower.fire(game.enemyArr)
    });
    updateEnemyArr(game.enemyArr);
    if(game.run === true ) {
        game.enemyArr.forEach(e=> { e.moveMent();})
    }

    let animation = window.requestAnimationFrame(gameLoop);

    // window.cancelAnimationFrame(animation)
    
}

    window.requestAnimationFrame(gameLoop);


// gameLoop();

