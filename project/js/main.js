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
    constructor(x,y,radius,speed){
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.speed = speed;
        this.vx ;
        this.vy ;
        this.health = 40;
        this.reward = 20;
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

class Bullet {
    constructor(x,y,type) {
        this.x = x;
        this.y = y;
        this.type = type;
        switch(type) {
            case 'cannon':
                this.speed = 3;
                this.radius = 10;
                this.damage = 5;
            break;
            case 'laser':
                this.speed = 4;
                // this.radius = 1;
                this.damage = 10;
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
                break;
            case 'laser':
                this.attackRange = 100;
                break;
            case 'missile':
                this.attackRange = 1000;
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

    loadBullet() {
        if(this.target) {
            let dis = Math.sqrt((this.x-this.target.x)*(this.x-this.target.x) + (this.y-this.target.y)*(this.y-this.target.y));
            let bullet = null;
            if(dis < this.attackRange) {
                switch(this.type) {
                    case 'cannon':
                        bullet = new Bullet(this.x,this.y,'cannon')
                        this.bulletArray.push(bullet)
                    break;
                    case 'laser':
                        bullet = new Bullet(this.x,this.y,'laser')
                        this.bulletArray.push(bullet)
                    break;
                    case 'missile':
                        bullet = new Bullet(this.x,this.y,'missile')
                        this.bulletArray.push(bullet)
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
                            let disX = ele.target.x-this.x;
                            let disY = ele.target.y-this.y;
                            ele.x += ele.speed/Math.sqrt(disX*disX+disY*disY) * disX ;
                            ele.y += ele.speed/Math.sqrt(disX*disX+disY*disY) * disY ;
                            
                
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
        } else if(this.type ==='laser'&& this.target) {
    //this is for the the laser fire bullet and damage calculate 
            this.bulletArray.forEach(ele => {
                ele.drawLaser(this.target.x,this.target.y)
                this.target.health -= ele.damage;
                this.bulletArray.splice(0,1);

            })
        }

        }

    
}

//create tower;
let cannonArr = [];
let laserArr = [];
let missileArr = [];

//create the enemy army
let enemyArr = [];

function updateEnemyArr(enemyArr) {
    enemyArr.forEach(e => {
        let index = enemyArr.indexOf(e)
        if(e.health <= 0) {
            enemyArr.splice(index,1);
            game.money += e.reward
        } 
        if(e.x === canvas.width) {
            enemyArr.splice(index,1);
            game.life-=1;
            //update the life icon
            gameLife.removeChild(gameLife.lastChild);
        }
    })
}
function buildArmy() {
    let i = 0;
    let setIntervalID = window.setInterval(()=>{
        let enemy = new Enemy(0,225,15,0.5)
        enemyArr.push(enemy)
        i++
        if(i===3) {
            clearInterval(setIntervalID)
        }
    },1500)
} 
buildArmy();
//send the army
setInterval(()=>{buildArmy()},10000)




//load the bullets for tower
setInterval(()=>{cannonArr.forEach(tower => {
    tower.loadBullet()
}
)},1000)
setInterval(()=>{laserArr.forEach(tower => {
    tower.loadBullet()
}
)},500)
setInterval(()=>{missileArr.forEach(tower => {
    tower.loadBullet()
}
)},3000)



function animation() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    game.gameUpdate();
    renderMap();
    cannonArr.forEach(tower=>{
        tower.draw()
        tower.chooseTarget(enemyArr)
        tower.fire(enemyArr)
    });
    laserArr.forEach(tower=>{
        tower.draw()
        tower.chooseTarget(enemyArr)
        tower.fire(enemyArr)

    });
    missileArr.forEach(tower=>{
        tower.draw()
        tower.chooseTarget(enemyArr)
        tower.fire(enemyArr)
    });
    updateEnemyArr(enemyArr);
    enemyArr.forEach(e=> {
        e.moveMent();
    })
    window.requestAnimationFrame(animation);

}
animation();

