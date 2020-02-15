let page = document.querySelector('body');
let towers = document.querySelector('.towers');
let statics = document.querySelector('.statics');
let controlPanel = document.querySelector('.control-panel')

let copiedTower = null;
let attackDiv = null;
let isCopied = false;

towers.addEventListener('click',copy,false)
function copy(e) {
    isCopied = true;
    copiedTower = document.createElement('button');
    attackDiv = document.createElement('div');

    // switch(e.target.parentNode.id) {
    //     case 'cannon':
    //         copiedTower.
    // }
    copiedTower.classList.add('tower-btn');
    copiedTower.style.border = 'none';
    copiedTower.style.position = 'absolute';
    e.target.parentNode.appendChild(copiedTower);
    console.log(isCopied);
    copiedTower.classList.add('no-pointer');
    statics.classList.add('no-pointer');
    controlPanel.classList.add('no-pointer');

    
}
// 
page.addEventListener('mousemove', translate,false)
function translate(e) {
    let x 
    let y
    let rect =null
    if(isCopied) {
        switch(copiedTower.parentNode.id) {
            case 'cannon':
                x = e.clientX-73.6/2-10-10;
                y = e.clientY-604;
                break;
            case 'laser':
                x = e.clientX-73.6-10-10-10-10-58.88/2;
                y = e.clientY-604;
                break;
            case 'missile':
                x = e.clientX-73.6-10-10-10-10-58.88-10-10-68.35/2;
                y = e.clientY-604;  
                break;          
        }
            copiedTower.style.transform = 'translate(' + x + 'px, ' + y +'px)';
            rect = copiedTower.getBoundingClientRect();
            console.log(rect);
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
        } else if (rect.x < 25 || rect.x > 825 || rect.y > 565 || rect.y < 65 ) {
            copiedTower.style.visibility = 'hidden'
        }
        else {
            copiedTower.style.visibility = 'visible'
            canvas.classList.remove('no-pointer')
    }
         } 
}

//cancel the tower selection by press ESC
page.addEventListener('keydown', cancelSelection,false)
function cancelSelection(e) {
    if(isCopied) {
        if(e.key ==='Escape') {
            copiedTower.parentNode.removeChild(copiedTower);
            statics.classList.remove('no-pointer');
            controlPanel.classList.remove('no-pointer');
            isCopied = false;

        }
    }

}

canvas.addEventListener('click', setTower,false);
function setTower(e) {
    let x = e.offsetX;
    let y = e.offsetY;
    console.log('towerisSet'+x+y)
    if(isCopied) {
        let tower = null;
        switch(copiedTower.parentNode.id) {
            case 'cannon':
                tower = new Tower(x,y,'cannon')
                cannonArr.push(tower)
                break;
            case 'laser':
                tower = new Tower(x,y,'laser')
                laserArr.push(tower)
                break;
            case 'missile':
                tower = new Tower(x,y,'missile') 
                missileArr.push(tower)
                break;          
        }    
        copiedTower.parentNode.removeChild(copiedTower);
        statics.classList.remove('no-pointer');
        controlPanel.classList.remove('no-pointer');
        isCopied = false;
    }     
}

