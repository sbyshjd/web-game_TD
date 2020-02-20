let page = document.querySelector('body');
let towers = document.querySelector('.towers');
let statics = document.querySelector('.statics');
let controlPanel = document.querySelector('.control-panel')

let towerPackage = null;
let copiedTower = null;
let attackDiv = null;
let towerMenu = null;
let menuOpen = false;

//create a map to get its x and y for moving the towers
let map = {x:0,y:0}


//assigment the even listener to the towers btns 
towers.addEventListener('click',copy,false)
function copy(e) {
    if((e.target.parentNode.id==='cannon' || e.target.parentNode.id === 'laser' || e.target.parentNode.id === 'missile') && e.target === e.target.parentNode.children[0] ) {
        game.isCopied = true;
        game.showGrid = true;
        //create a copy tower button
        copiedTower = document.createElement('button');
        //set the tower button style
        copiedTower.classList.add('tower-btn');
        copiedTower.classList.add('tower-in-map');
        copiedTower.style.border = '';
        copiedTower.style.position = 'absolute';
        //add this tower button in the DOM
        e.target.parentNode.appendChild(copiedTower);
        // create the attack range div
        attackDiv = document.createElement('div');
        //set the attackDiv style
        attackDiv.classList.add('tower-in-map')
        // attackDiv.style.position = 'absolute';
        switch (e.target.parentNode.id) {
            case 'cannon':
                attackDiv.classList.add('cannon-range');
                attackDiv.style.top = '-175px';
                break;
            case 'laser':
                attackDiv.classList.add('laser-range');
                attackDiv.style.top = '-75px';
                
                break;
            case 'missile':
                attackDiv.classList.add('missile-range');
                attackDiv.style.top = '-375px';
                break;
            default:
                break;
        }
        attackDiv.style.borderRadius = '50%';
        attackDiv.style.backgroundColor = 'rgba(240, 52, 52, 0.5)';
        //add the attackDiv to the DOM
        e.target.parentNode.appendChild(attackDiv);
        attackDiv.classList.add('no-pointer');
        copiedTower.classList.add('no-pointer');
        statics.classList.add('no-pointer');
        controlPanel.classList.add('no-pointer');
        mapTower.classList.add('no-pointer');
    }  
}
// 
page.addEventListener('mousemove', translate,false)
function translate(e) {
    // let x 
    // let y
    
    let rect =null
    if(game.isCopied) {

        switch(copiedTower.parentNode.id) {
            case 'cannon':
                map.x = e.clientX-73.6/2-10-10;
                map.y = e.clientY-604;
                break;
            case 'laser':
                map.x = e.clientX-73.6-10-10-10-10-58.88/2;
                map.y = e.clientY-604;
                break;
            case 'missile':
                map.x = e.clientX-73.6-10-10-10-10-58.88-10-10-68.35/2;
                map.y = e.clientY-604;  
                break;          
        }
            attackDiv.style.transform = 'translate(' + map.x + 'px, ' + map.y +'px)';
            copiedTower.style.transform = 'translate(' + map.x + 'px, ' + map.y +'px)';
            rect = copiedTower.getBoundingClientRect();
    }
// only can put teh tower in the map  not on the path!!!
    if(rect) {
        if((rect.x >= 0 && rect.x <= 150-50)&&(rect.y < 315+25 && rect.y > 215-50+25) ) {
            canvas.classList.add('no-pointer')
            copiedTower.style.visibility = 'hidden'
            attackDiv.style.visibility = 'hidden'
        } else if ((rect.x >150-50 && rect.x <= 250)&&(rect.y < 465+25 && rect.y > 215-50+25)) {
            canvas.classList.add('no-pointer')
            copiedTower.style.visibility = 'hidden'
            attackDiv.style.visibility = 'hidden'
        } else if ((rect.x > 250 && rect.x<=450)&&(rect.y < 465+25 && rect.y > 365-50+25)) {
            canvas.classList.add('no-pointer')
            copiedTower.style.visibility = 'hidden'
            attackDiv.style.visibility = 'hidden'
        } else if ((rect.x > 400 && rect.x <= 550)&&(rect.y < 465+25 && rect.y > 115-50+25)) {
            canvas.classList.add('no-pointer')
            copiedTower.style.visibility = 'hidden'
            attackDiv.style.visibility = 'hidden'
        } else if ((rect.x > 550 && rect.x <= 900)&&(rect.y < 215+25 && rect.y > 115-50+25)) {
            canvas.classList.add('no-pointer')
            copiedTower.style.visibility = 'hidden'
            attackDiv.style.visibility = 'hidden'
        } else if (rect.x < 0 || rect.x > 825 || rect.y > 565 || rect.y < 65 ) {
            copiedTower.style.visibility = 'hidden'
            attackDiv.style.visibility = 'hidden'
        }
        else {
            copiedTower.style.visibility = 'visible'
            attackDiv.style.visibility = 'visible'
            canvas.classList.remove('no-pointer')
    }
         } 
}

//cancel the tower selection by press ESC
window.addEventListener('keydown', cancelSelection,false)
function cancelSelection(e) {
    if(game.isCopied) {
        if(e.key ==='Escape') {
            copiedTower.parentNode.removeChild(copiedTower);
            attackDiv.parentNode.removeChild(attackDiv);
            statics.classList.remove('no-pointer');
            controlPanel.classList.remove('no-pointer');
            game.isCopied = false;

        }
    }

}

//show the tower attack range individually ---in CSS finished

//show the tower attack range together 
window.addEventListener('keydown', showRange,false) 
window.addEventListener('keyup',hideRange,false)
function showRange(e) {
    //some weird default behavior of the window like play or pause in this case
    e.preventDefault();
    if(e.code === 'Space') {
        attackDivInMap.forEach(d => {
            d.style.display = 'block'
            
        })
    }
}
function hideRange(e) {
    //some weird default behavior of the window like play or pause in this case
    e.preventDefault();
    if(e.code === 'Space') {
        attackDivInMap.forEach(d => {
            d.style.display = ''
            
        })
    }
}

// put the towers on the canvas
canvas.addEventListener('click', setTower,false);
function setTower(e) {
    let x = gridTransferX(e.offsetX);
    let y = gridTransferY(e.offsetY);
    game.showGrid = false;
    if(game.isCopied) {
        let tower = null;
        console.log(x);
        switch(copiedTower.parentNode.id) {
            case 'cannon':
                copiedTower.style.backgroundColor = '#D9B54A';
                tower = new Tower(x,y,'cannon')
                game.cannonArr.push(tower) 
                break;
            case 'laser':
                copiedTower.style.backgroundColor = 'rgb(206, 93, 48)';
                tower = new Tower(x,y,'laser')
                game.laserArr.push(tower)
                break;
            case 'missile':
                copiedTower.style.backgroundColor = 'rgb(217, 74, 217)';
                tower = new Tower(x,y,'missile') 
                game.missileArr.push(tower)
                break;          
        }   
        game.money -= tower.price; 
        //create the tower package
        towerPackage = document.createElement('div')
        towerPackage.style.position = 'absolute';
        mapTower.appendChild(towerPackage);
        towerPackage.style.top = (y-25)+'px';
        towerPackage.style.left = (x-25)+'px';
        // console.log(copiedTower.getBoundingClientRect());
        //remove the copidTower from the control panel div and put it into the tower-map div
        copiedTower.parentNode.removeChild(copiedTower);
        towerPackage.appendChild(copiedTower);
        //reset the tranform by the new div
        copiedTower.style.transform = '';
        copiedTower.style.top = '0px';
        copiedTower.style.left = '0px';

        //remove the attackDiv like the copiedTower
        attackDiv.parentNode.removeChild(attackDiv);
        towerPackage.appendChild(attackDiv);
        //reset the transform like the copiedTower
        attackDiv.style.transform = '';
        if([...attackDiv.classList].includes('cannon-range')) {
            // attackDiv.style.top = (y-200)+'px';
            // attackDiv.style.left = (x-200)+'px';
            attackDiv.style.top = '-175px';
            attackDiv.style.left = '-175px';
        }
        if([...attackDiv.classList].includes('laser-range')) {
            // attackDiv.style.top = (y-100)+'px';
            // attackDiv.style.left = (x-100)+'px';
            attackDiv.style.top = '-75px';
            attackDiv.style.left = '-75px';
        }
        if([...attackDiv.classList].includes('missile-range')) {
            // attackDiv.style.top = (y-400)+'px';
            // attackDiv.style.left = (x-400)+'px';
            attackDiv.style.top = '-375px';
            attackDiv.style.left = '-375px';
        }

        //create the towerMenu
        towerMenu = document.createElement('ul')
        towerMenu.classList.add('tower-menu')
        towerMenu.classList.add('no-display')
        let towerMenuItem01 = document.createElement('li')
        towerMenuItem01.innerHTML = 'delete'
        towerMenu.appendChild(towerMenuItem01);
        towerPackage.appendChild(towerMenu);


        mapTower.classList.remove('no-pointer');
        copiedTower.classList.remove('no-pointer');
        attackDiv.classList.add('no-display');
        statics.classList.remove('no-pointer');
        controlPanel.classList.remove('no-pointer');
        game.isCopied = false;
    }     
}

//tranfer the event x.y to the grid x.y
function gridTransferX(x) {
    let n = Math.floor(x/50);
    return n*50 +25;
}
function gridTransferY(y) {
    let m = Math.floor((y-25)/50);
    return m*50 +25+25;
}


//show and hide the tower menu
mapTower.addEventListener('click',showTowerMenu,false)
function showTowerMenu(e) {
    if(e.target.parentNode.parentNode.id === 'map-tower') {
        if( menuOpen === false) {
            e.target.parentNode.lastChild.classList.remove('no-display')
            menuOpen = true
        } else {
            e.target.parentNode.lastChild.classList.add('no-display')
            menuOpen = false
        }
    }
    if([...e.target.parentNode.classList].includes('tower-menu')) {
        //get the tower x/y on the canvas to delete the canvas tower from the array
        let towerX = e.target.parentNode.parentNode.getClientRects()[0].x +25;
        let towerY = e.target.parentNode.parentNode.getClientRects()[0].y +25;
        
        if([...e.target.parentNode.previousElementSibling.classList].includes('cannon-range')) {
            let towerIndex = game.cannonArr.findIndex(t => {
                t.x === towerX && t.y === towerY
            });
            game.cannonArr.splice(towerIndex,1);
            game.money += 5;
        }
        if([...e.target.parentNode.previousElementSibling.classList].includes('laser-range')) {
            let towerIndex = game.laserArr.findIndex(t => {
                t.x === towerX && t.y === towerY
            });
            game.laserArr.splice(towerIndex,1);
            game.money += 10;
        }
        if([...e.target.parentNode.previousElementSibling.classList].includes('missile-range')) {
            let towerIndex = game.missileArr.findIndex(t => {
                t.x === towerX && t.y === towerY
            });
            game.missileArr.splice(towerIndex,1);
            game.money += 15;
        }
        e.target.parentNode.parentNode.parentNode.removeChild(e.target.parentNode.parentNode)
        
    }
}

