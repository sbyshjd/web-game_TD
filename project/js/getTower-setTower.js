let page = document.querySelector('body');
let towers = document.querySelector('.towers');
let statics = document.querySelector('.statics');
let controlPanel = document.querySelector('.control-panel')


let copiedTower = null;
let attackDiv = null;

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
        attackDiv.style.position = 'absolute';
        switch (e.target.parentNode.id) {
            case 'cannon':
                attackDiv.style.width = '400px';
                attackDiv.style.height = '400px';
                attackDiv.style.top = '-175px';
                attackDiv.classList.add('cannon');
                break;
            case 'laser':
                attackDiv.style.width = '200px';
                attackDiv.style.height = '200px';
                attackDiv.style.top = '-75px';
                attackDiv.classList.add('laser');
                break;
            case 'missile':
                attackDiv.style.width = '800px';
                attackDiv.style.height = '800px';
                attackDiv.style.top = '-375px';
                attackDiv.classList.add('missile');
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
        } else if ((rect.x >150-50 && rect.x <= 250)&&(rect.y < 465+25 && rect.y > 215-50+25)) {
            canvas.classList.add('no-pointer')
            copiedTower.style.visibility = 'hidden'
        } else if ((rect.x > 250 && rect.x<=450)&&(rect.y < 465+25 && rect.y > 365-50+25)) {
            canvas.classList.add('no-pointer')
            copiedTower.style.visibility = 'hidden'
        } else if ((rect.x > 400 && rect.x <= 550)&&(rect.y < 465+25 && rect.y > 115-50+25)) {
            canvas.classList.add('no-pointer')
            copiedTower.style.visibility = 'hidden'
        } else if ((rect.x > 550 && rect.x <= 900)&&(rect.y < 215+25 && rect.y > 115-50+25)) {
            canvas.classList.add('no-pointer')
            copiedTower.style.visibility = 'hidden'
        } else if (rect.x < 0 || rect.x > 825 || rect.y > 565 || rect.y < 65 ) {
            copiedTower.style.visibility = 'hidden'
        }
        else {
            copiedTower.style.visibility = 'visible'
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
// remove the tower and attackdiv from the control panel 
        // copiedTower.parentNode.removeChild(copiedTower);
        // attackDiv.parentNode.removeChild(attackDiv);
        // //add the tower and attackdiv into the tower-in-map 
        // towerInMap.appendChild(copiedTower);

        // towerInMap.appendChild(attackDiv);
        console.log(copiedTower.getBoundingClientRect());
        copiedTower.parentNode.removeChild(copiedTower);
        mapTower.appendChild(copiedTower);
        copiedTower.style.transform = '';
        copiedTower.style.top = (y-25)+'px';
        copiedTower.style.left = (x-25)+'px';
        attackDiv.parentNode.removeChild(attackDiv);
        mapTower.appendChild(attackDiv);
        attackDiv.style.transform = '';
        if([...attackDiv.classList].includes('cannon')) {
            attackDiv.style.top = (y-200)+'px';
            attackDiv.style.left = (x-200)+'px';
        }
        if([...attackDiv.classList].includes('laser')) {
            attackDiv.style.top = (y-100)+'px';
            attackDiv.style.left = (x-100)+'px';
        }
        if([...attackDiv.classList].includes('missile')) {
            attackDiv.style.top = (y-400)+'px';
            attackDiv.style.left = (x-400)+'px';
        }


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