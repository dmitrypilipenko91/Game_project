// constants
const ONE_STEP_HERO = 96;
const ONE_STEP_FIELD = 3;
const HERO_FRAMES = 5;
const ONE_TICK = 1000 / 8;
const BASE_SCREEN_CELL = 32;
const MAX_LIVES = 6;

// variables
const heroImg = document.getElementById('heroImg');
const heroImgBlock = document.getElementById('heroImgBlock');
const canvas = document.getElementById('canvas');
const fsBtn = document.getElementById('fsBtn');
const jumpBlock = document.getElementById('jumpBlock');
const hitBlock = document.getElementById('hitBlock');
const backgroundBlock = document.getElementById('backgroundBlock');
const restartBtn = document.getElementById('restartBtn');
const deathFinal = document.getElementById('deathFinal');
const winFinal = document.getElementById('winFinal');

// functions
const moveWorldLeft = () => {
    objectsArray.map(elem => {
        elem.style.left = `${(Number.parseInt(elem.style.left)) - 32}px`;
    })
    tileArray.map(elem => {
        elem[0] = elem[0] - 1;
    })
    enemiesArray.map(elem => {
        elem.moveLeft();
    })
    floor1WallArray.map(elem => {
        elem[0] -= 1;
        elem[1] -= 1;
    })
    floor2WallArray.map(elem => {
        elem[0] -= 1;
        elem[1] -= 1;
    })
}

const moveWorldRight = () => {
    objectsArray.map(elem => {
        elem.style.left = `${(Number.parseInt(elem.style.left)) + 32}px`;
    })
    tileArray.map(elem => {
        elem[0] = elem[0] + 1;
    })
    enemiesArray.map(elem => {
        elem.moveRight();
    })
    floor1WallArray.map(elem => {
        elem[0] += 1;
        elem[1] += 1;
    })
    floor2WallArray.map(elem => {
        elem[0] += 1;
        elem[1] += 1;
    })
}

let heroImgBlockStyles = window.getComputedStyle(heroImgBlock);
let heroX = Math.ceil((Number.parseInt(heroImgBlockStyles.left) + BASE_SCREEN_CELL) / BASE_SCREEN_CELL);
let heroY = Math.ceil(Number.parseInt(heroImgBlockStyles.bottom) / BASE_SCREEN_CELL);
const updateHeroXY = () => {
    heroX = Math.ceil((Number.parseInt(heroImgBlockStyles.left) + BASE_SCREEN_CELL) / BASE_SCREEN_CELL);
    heroY = Math.ceil(Number.parseInt(heroImgBlockStyles.bottom) / BASE_SCREEN_CELL);
}

let fall = false;
const checkFalling = () => {
    updateHeroXY();
    let isFalling = true;
    for (let i = 0; i < tileArray.length; i ++) {
        if (tileArray[i][0] === heroX && (tileArray[i][1] + 1) === heroY) {
            isFalling = false;
        }
    }
    if (isFalling) {
        fall = true;
    } else {
        fall = false;
    }
}

const fallHandler = () => {
    heroImg.style.top = '-96px';
    heroImgBlock.style.bottom = `${(Number.parseInt(heroImgBlockStyles.bottom)) - 32}px`;
    checkFalling();
}

const checkRightWallCollision = () => {
    isWallLeft = false;
    isWallRight = false;
    if (heroY === 1) {
        floor1WallArray.map(elem => {
            if (heroX === elem[0] - 2) {
                isWallRight = true;
            }
        })
    } else if (heroY === 5) {
        floor2WallArray.map(elem => {
            if (heroX === elem[0] - 2) {
                isWallRight = true;
            }
        })
    }
}

const checkLeftWallCollision = () => {
    isWallLeft = false;
    isWallRight = false;
    if (heroY === 1) {
        floor1WallArray.map(elem => {
            if (heroX === elem[1]) {
                isWallLeft = true;
            }
        })
    } else if (heroY === 5) {
        floor2WallArray.map(elem => {
            if (heroX === elem[1]) {
                isWallLeft = true;
            }
        })
    }
}

let currentImgPos = 0;
let currentFieldPos = 0;
let isRightSideBlocked = false;
let floor1WallArray = [[-10, 0], [14, 32], [42, 53], [64, 74], [92, 105], [119, 129]];
let floor2WallArray = [[54, 63]];
let isWallRight = false;
const rightHandler = () => {
    if(!fall) {
        if (!isRightSideBlocked && !isWallRight) {
            heroImg.style.transform = 'scale(-1,1)'; 
            currentImgPos ++;
            currentFieldPos ++;
            if (currentImgPos > HERO_FRAMES) {
                currentImgPos = 0;
            }
            heroImg.style.left = `-${currentImgPos * ONE_STEP_HERO}px`;
            heroImg.style.top = '-192px';
            heroImgBlock.style.left = `${currentFieldPos * ONE_STEP_FIELD}px`;
            checkFalling();
            wasHeroHit = false;
            moveWorldLeft();
            checkRightWallCollision();
            showWinMessage();
        }
    } else {
        fallHandler();
    }
}

let isLeftSideBlocked = false;
let isWallLeft = false;
const leftHandler = () => {
    if (!fall) {
        if (!isLeftSideBlocked && !isWallLeft) {
            heroImg.style.transform = 'scale(1,1)';
            currentImgPos ++;
            currentFieldPos --;
            if (currentImgPos > HERO_FRAMES) {
                currentImgPos = 0;
            }
            heroImg.style.left = `-${currentImgPos * ONE_STEP_HERO}px`;
            heroImg.style.top = '-192px';
            heroImgBlock.style.left = `${currentFieldPos * ONE_STEP_FIELD}px`;
            checkFalling();
            wasHeroHit = false;
            moveWorldRight();
            checkLeftWallCollision();
        }
    } else {
        fallHandler();
    }
}

let direction = 'right';
const standHandler = () => {
     switch (direction) {
        case 'right': {
            heroImg.style.transform = 'scale(-1,1)';
            if (currentImgPos > HERO_FRAMES - 1) {
                currentImgPos = 1;
            }
            break;
        }
        case 'left': {
            heroImg.style.transform = 'scale(1,1)';
            if (currentImgPos > HERO_FRAMES - 2) {
                currentImgPos = 0;
            }
            break;
        }
        default: break;
    }
    currentImgPos ++;
    heroImg.style.left = `-${currentImgPos * ONE_STEP_HERO}px`;
    heroImg.style.top = '0px';
    checkFalling();
}

let hit = false;
let wasHeroHit = false;
const hitHandler = () => {
    switch (direction) {
        case 'right': {
            heroImg.style.transform = 'scale(-1,1)';
            if (currentImgPos > HERO_FRAMES - 1) {
                currentImgPos = 1;
                hit = false;
                wasHeroHit = true;
            }
            break;
        }
        case 'left': {
            heroImg.style.transform = 'scale(1,1)';
            if (currentImgPos > HERO_FRAMES - 2) {
                currentImgPos = 0;
                hit = false;
                wasHeroHit = true;
            }
            break;
        }
        default: break;
    }
    currentImgPos ++;
    heroImg.style.left = `-${currentImgPos * ONE_STEP_HERO}px`;
    heroImg.style.top = '-288px';
}

let jump = false;
const jumpHandler = () => {
    isWallLeft = false;
    isWallRight = false;
    switch (direction) {
        case 'right': {
            heroImg.style.transform = 'scale(-1,1)';
            if (currentImgPos > HERO_FRAMES - 1) {
                currentImgPos = 1;
                jump = false;
                heroImgBlock.style.bottom = `${(Number.parseInt(heroImgBlockStyles.bottom)) + 160}px`;
                currentFieldPos  = currentFieldPos + 15;
                heroImgBlock.style.left = `${currentFieldPos * ONE_STEP_FIELD}px`;
            }
            break;
        }
        case 'left': {
            heroImg.style.transform = 'scale(1,1)';
            if (currentImgPos > HERO_FRAMES - 2) {
                currentImgPos = 0;
                jump = false;
                heroImgBlock.style.bottom = `${(Number.parseInt(heroImgBlockStyles.bottom)) + 160}px`;
                currentFieldPos  = currentFieldPos - 15;
                heroImgBlock.style.left = `${currentFieldPos * ONE_STEP_FIELD}px`;
            }
            break;
        }
        default: break;
    }
    currentImgPos ++;
    heroImg.style.left = `-${currentImgPos * ONE_STEP_HERO}px`;
    heroImg.style.top = '-96px';
}

let timer = null;
const lifeCycle = () => {
    timer = setInterval(() => {
        if (hit) {
            hitHandler();
        } else if (jump) {
            jumpHandler();
        } else if(fall) {
            fallHandler();
        } else {
            standHandler();
        }
    }, ONE_TICK)
}

let x = 0;
let halfWidth = window.screen.width / 2;
const move = (event) => {
    clearInterval(timer);
    x = (event.type = 'mousedown') ? event.screenX : event.touches[0].screenX;
    timer = setInterval(() => {
        if (x > halfWidth) {
            direction = 'right';
            rightHandler();
         } else {
            direction = 'left';
            leftHandler();
         } 
    }, ONE_TICK);
}

const stopMoving = () => {
    clearInterval(timer);
    lifeCycle();
}

const showDieMessage = () => {
    deathFinal.style.display = 'block';
}

const showWinMessage = () => {
    const fountain = objectsArray.filter(elem => elem.outerHTML.split('"')[1] === './assets/Objects/Fountain/2.png')[0]; 
    // for getting fountain like an object from objectArray by its path;
    if (heroX === ((Number.parseInt(fountain.style.left)) / 32)) {
        winFinal.style.display = 'block';
    }
}

jumpBlock.style.top = `${(window.screen.height / 2) - (144 / 2)}px`;
hitBlock.style.top = `${(window.screen.height / 2) - (144 / 2)}px`;

// event listeners
window.onmousedown = move;

window.ontouchstart = move;

window.onmouseup = stopMoving;

window.ontouchend = stopMoving;

window.addEventListener('keydown', (event) => {
    if (!event.repeat) {
        clearInterval(timer);
        timer = setInterval(() => {
            if (event.code === 'KeyD') {
                direction = 'right';
                rightHandler();
            } else if (event.code === 'KeyA') {
                direction = 'left';
                leftHandler();
            }
        }, ONE_TICK);
    }
})

window.addEventListener('keyup', (event) => {
    if (event.code === 'KeyW') {
        jump = true;
    }
    if (event.code === 'Space') {
        hit = true;
    }
    clearInterval(timer);
    lifeCycle();
})

fsBtn.addEventListener('click', () => {
    if (window.document.fullscreen) {
        fsBtn.src = './images/fullscreen.png';
        window.document.exitFullscreen();
    } else {
        fsBtn.src = './images/cancel.png';
        canvas.requestFullscreen();
    }
})

restartBtn.addEventListener('click', () => {
    window.document.location.reload();
})

heroImg.onclick = (event) => {
    event.preventDefault();
}

canvas.oncontextmenu = (event) => {
    event.preventDefault();
}

jumpBlock.onclick = () => {
    jump = true;
}
hitBlock.onclick = () => {
    hit = true;
}

let tileArray = [];
let objectsArray = [];
let enemiesArray = [];
const createTile = (x,y = 1) => {
    let tile = document.createElement('img');
    tile.src = './assets/Tiles/Tile_02.png';
    tile.style.position = 'absolute';
    tile.style.left = `${x * 32}px`;
    tile.style.bottom = `${y * 32}px`;
    canvas.appendChild(tile);
    objectsArray.push(tile);
    tileArray.push([x, y]);
}

const createTileBlack = (x, y = 0) => {
    let tileBlack = document.createElement('img');
    tileBlack.src = './assets/Tiles/Tile_04.png';
    tileBlack.style.position = 'absolute';
    tileBlack.style.left = `${x * 32}px`;
    tileBlack.style.bottom = `${y * 32}px`;
    canvas.appendChild(tileBlack);
    objectsArray.push(tileBlack);
}

const createTilesPlatform = (startX, endX, floor) => {
    for (let x_pos = startX - 1; x_pos < endX; x_pos ++) {
        createTile(x_pos, floor);
    }
}

const createTileBlackBlock = (startX, endX, floor) => {
    for (let y_pos = 0; y_pos < floor; y_pos ++) {
        for (let x_pos = startX - 1; x_pos < endX; x_pos ++) {
            createTileBlack(x_pos, y_pos);
        }
    }
}

const addTiles = (i) => {
    createTile(i);
    createTileBlack(i);
}

class Enemy {
    ATTACK = 'attack';
    HURT = 'hurt';
    IDLE = 'idle';
    WALK = 'walk';
    DEATH = 'death';
    
    posX;
    posY;
    img;
    block;
    blocksize;
    spritePos;
    spriteMaxPos;
    timer;
    sourcePath;
    state;
    animationWasChanged;
    startX;
    dir;
    stop;
    lives;
    
    constructor(x,y) {
        this.posX = x + this.getRandomOffset(6);
        this.startX = x;
        this.posY = y;
        this.blocksize = 96;
        this.spritePos = 0;
        this.spriteMaxPos = 3;
        this.sourcePath = './assets/Enemies/1/';
        this.state = this.IDLE;
        this.animationWasChanged = false;
        this.dir = 1.0;
        this.stop = false;
        this.lives = 3;
        
        this.createImg();
        this.changeAnimation(this.WALK);
        enemiesArray.push(this);
        this.lifeCycle();
    }
    
    createImg() {
        this.block = document.createElement('div');
        this.block.style.position = 'absolute';
        this.block.style.left = `${this.posX * 32}px`;
        this.block.style.bottom = `${this.posY * 32}px`;
        this.block.style.width = `${this.blocksize}px`;
        this.block.style.height = `${this.blocksize}px`;
        this.block.style.overflow = 'hidden';
        
        this.img = document.createElement('img');
        this.img.src = this.sourcePath + 'Idle.png';
        this.img.style.position = 'absolute';
        this.img.style.left = '0px';
        this.img.style.bottom = '0px';
        this.img.style.width = `${this.blocksize * 4}px`;
        this.img.style.height = `${this.blocksize}px`;
        
        this.block.appendChild(this.img);
        canvas.appendChild(this.block);
    }
    
    lifeCycle() {
        this.timer = setInterval(() => {
            if (this.animationWasChanged) {
                this.animationWasChanged = false;
                switch (this.state) {
                    case this.ATTACK: {
                        this.img.style.width = `${this.blocksize * 6}px`;
                        this.setAttack();
                        break;
                    }
                    case this.DEATH: {
                        this.img.style.width = `${this.blocksize * 6}px`;
                        this.setDeath();
                        break;
                    }
                    case this.HURT: {
                        this.img.style.width = `${this.blocksize * 2}px`;
                        this.setHurt();
                        break;
                    }
                    case this.IDLE: {
                        this.setIdle();
                        break;
                    }
                    case this.WALK: {
                        this.img.style.width = `${this.blocksize * 6}px`;
                        this.setWalk();
                        break;
                    }
                    default: break;
                }
            }
            this.spritePos ++;
            this.checkCollision();
            if (!this.stop) {
                this.move();
            } else {
                if (this.state !== this.DEATH) {
                    if (this.state !== this.HURT) {
                        this.changeAnimation(this.ATTACK);
                    }
                }
            }
            this.animate();
        }, ONE_TICK);
    }
    
    animate() {
        if (this.spritePos > this.spriteMaxPos) {
            this.spritePos = 0;
            if (this.state === this.ATTACK) {
                lives -= 0.5;
                updateHearts();
            }
            if (this.state === this.HURT) {
                this.changeAnimation(this.ATTACK);
                if (this.dir > 0) {
                    this.spritePos = 1;
                }
            }
            if (this.state === this.DEATH) {
                clearInterval(this.timer);
                isRightSideBlocked = false;
                isLeftSideBlocked = false;
                if (this.dir > 0) {
                    this.spritePos = 5;
                }
            }
        }
        this.img.style.left = `${-(this.spritePos * this.blocksize)}px`;
    }

    setAttack() {
        this.img.src = this.sourcePath + 'Attack.png';
        this.spriteMaxPos = 5;
    }
    
    setDeath() {
        this.img.src = this.sourcePath + 'Death.png';
        this.spriteMaxPos = 5; 
    }
    
    setHurt() {
        this.img.src = this.sourcePath + 'Hurt.png';
        this.spriteMaxPos = 1; 
    }
    
    setIdle() {
        this.img.src = this.sourcePath + 'Idle.png';
        this.spriteMaxPos = 3;  
    }
    
    setWalk() {
        this.img.src = this.sourcePath + 'Walk.png';
        this.spriteMaxPos = 5;  
    }

    changeAnimation(stateStr) {
        this.state = stateStr;
        this.animationWasChanged = true;
    }

    move() {
        if (this.posX > (this.startX + 6)) {
            this.dir *= -1;
            this.img.style.transform = 'scale(-1,1)';
        } else if (this.posX <= this.startX) {
            this.dir = Math.abs(this.dir);
            this.img.style.transform = 'scale(1,1)';
        }
        this.posX += this.dir;
        this.block.style.left = `${this.posX * 32}px`;
    }

    checkCollision() {
        if (heroY === this.posY) {
            if (heroX === this.posX) {
                // left side attack
                this.checkHurt();
                isRightSideBlocked = true;
                this.stop = true;
            } else if (heroX === (this.posX + 3)){
                // right side attack
                this.checkHurt();
                isLeftSideBlocked = true;
                this.stop = true;
            } else {
                isRightSideBlocked = false;
                isLeftSideBlocked = false;
                this.stop = false;
                this.changeAnimation(this.WALK);
            }
        } else {
            isRightSideBlocked = false;
            isLeftSideBlocked = false;
            this.stop = false;
            this.changeAnimation(this.WALK);
        }
    }

    checkHurt() {
        if (wasHeroHit) {
            if (this.lives <= 1) {
                wasHeroHit = false;
                this.changeAnimation(this.DEATH);
            } else {
                wasHeroHit = false;
                this.changeAnimation(this.HURT);
                // this.showHurt();
                this.lives --;
            }
        }
    }

    moveRight() {
        this.posX += 1;
        this.startX += 1;
        if (this.stop || this.state === this.DEATH) {
            this.block.style.left = `${(Number.parseInt(this.block.style.left)) + 32}px`;
        }
    }

    moveLeft() {
        this.posX -= 1;
        this.startX -= 1;
        if (this.stop || this.state === this.DEATH) {
            this.block.style.left = `${(Number.parseInt(this.block.style.left)) - 32}px`;
        }
    }

    getRandomOffset(max) {
        let randomValue = Math.floor(Math.random() * max);
        return randomValue;
    }
}

class Heart {
    img;
    x;
    constructor(x, src) {
        this.x = x + 1;
        this.img = window.document.createElement('img');
        this.img.src = src;
        this.img.style.position = 'absolute';
        this.img.style.left = `${this.x * 32}px`;
        this.img.style.top = '32px';
        this.img.style.width = '32px';
        this.img.style.height = '32px';

        canvas.appendChild(this.img);
    }
}

class HeartEmpty extends Heart {
    constructor(x) {
        super (x, './assets/Hearts/heart_empty.png');
    }
}

class HeartFilled extends Heart {
    constructor(x) {
        super (x, './assets/Hearts/heart_filled.png');
    }
}

let lives = 6;
let heartsArray = [];
const addHearts = () => {
    for (let i = 0; i < MAX_LIVES; i ++) {
        let heartEmpty = new HeartEmpty(i);
        let heartFilled = new HeartFilled(i);
        heartsArray.push(heartFilled);
    }
}

const updateHearts = () => {
    if (lives <= 0) {
        showDieMessage();
        heroImgBlock.style.display = 'none';
    }
    for (let i = 0; i < lives; i ++) {
        heartsArray[i].img.style.display = 'block';
    }
    for (let i = lives; i < MAX_LIVES; i ++) {
        heartsArray[i].img.style.display = 'none'; 
    }
}

const createBackImg = (i) => {
    let img = window.document.createElement('img');
    img.src = './assets/Background/Day/Background.png';
    img.style.position = 'absolute';
    img.style.left = `${(i * window.screen.width) - 32}px`;
    img.style.bottom = '32px';
    img.style.width = `${window.screen.width}px`;
    backgroundBlock.appendChild(img);
    objectsArray.push(img);
}

const addBackgroundImages = () => {
    for (let i = 0; i < 5; i ++) {
        createBackImg(i);
    }
}

const createImgEl = (src, x, y) => {
    let img = document.createElement('img');
    img.src = src;
    img.style.position = 'absolute';
    img.style.left = `${x * 32}px`;
    img.style.bottom = `${y * 32}px`;
    img.style.transform = 'scale(2,2) translate(-25%,-25%)';
    canvas.appendChild(img);
    objectsArray.push(img);
}

const addDecorationElement = (f1, f2, f3) => {
    const basePath = './assets/Objects/';
    // Trees
    createImgEl(basePath + 'Other/Tree4.png', 4, f1);
    createImgEl(basePath + 'Other/Tree2.png', 35, f1);
    createImgEl(basePath + 'Other/Tree3.png', 78, f1);
    createImgEl(basePath + 'Other/Tree4.png', 108, f1);
    createImgEl(basePath + 'Other/Tree1.png', 65, f2);
    // Stones
    createImgEl(basePath + 'Stones/6.png', 10, f1);
    createImgEl(basePath + 'Stones/4.png', 111, f1);
    createImgEl(basePath + 'Stones/4.png', 38, f1);
    createImgEl(basePath + 'Stones/6.png', 102, f3);
    // Ramps
    createImgEl(basePath + 'Other/Ramp1.png', 22, f2);
    createImgEl(basePath + 'Other/Ramp2.png', 26, f2);
    createImgEl(basePath + 'Other/Ramp1.png', 95, f2);
    createImgEl(basePath + 'Other/Ramp2.png', 99, f2);
    createImgEl(basePath + 'Other/Ramp1.png', 45, f2);
    createImgEl(basePath + 'Other/Ramp2.png', 49, f2);
    // Bushes
    createImgEl(basePath + 'Bushes/17.png', 84, f1);
    createImgEl(basePath + 'Bushes/17.png', 19, f2);
    createImgEl(basePath + 'Bushes/17.png', 50, f2);
    createImgEl(basePath + 'Bushes/17.png', 69, f2);
    createImgEl(basePath + 'Bushes/17.png', 100, f2);
    createImgEl(basePath + 'Bushes/17.png', 13, f3);
    // Fountain
    createImgEl(basePath + 'Fountain/2.png', 116, f1);
    // Box
    createImgEl(basePath + 'Other/Box.png', 84, f1);
    createImgEl(basePath + 'Other/Box.png', 48, f2);
    createImgEl(basePath + 'Other/Box.png', 14, f3);
    createImgEl(basePath + 'Other/Box.png', 104, f3);
} 

const addEnemies = () => {
    const enemy1 = new Enemy(9, 9);
    const enemy2 = new Enemy(19, 5);
    const enemy3 = new Enemy(44, 5);
    const enemy4 = new Enemy(65, 5);
    const enemy5 = new Enemy(79, 1);
    const enemy6 = new Enemy(93, 5);
    const enemy7 = new Enemy(100, 9);
}

const buildLevel = () => {
    let floor1 = 0;
    let floor2 = 4;
    let floor3 = 8;

    addDecorationElement(floor1 + 1, floor2 + 1, floor3 + 1);

    createTilesPlatform(0, 14, floor1);
    createTilesPlatform(33, 41, floor1);
    createTilesPlatform(76, 91, floor1);
    createTilesPlatform(106, 150, floor1); 

    createTilesPlatform(15, 32, floor2);
    createTilesPlatform(42, 53, floor2);
    createTilesPlatform(64, 75, floor2);
    createTilesPlatform(92, 105, floor2);

    createTilesPlatform(8, 20, floor3);
    createTilesPlatform(54, 63, floor3);
    createTilesPlatform(75, 87, floor3);
    createTilesPlatform(99, 111, floor3);

    createTileBlackBlock(15, 32, floor2);
    createTileBlackBlock(42, 53, floor2);
    createTileBlackBlock(64, 75, floor2);
    createTileBlackBlock(92, 105, floor2);

    createTileBlackBlock(54, 63, floor3);

    addEnemies();
}

const addStartScreen = () => {
    let div = window.document.createElement('div');
    div.style.position = 'absolute';
    div.style.left = '0px';
    div.style.bottom = '0px';
    div.style.width = '100%';
    div.style.height = '100vh';
    div.style.backgroundColor = '#37446e';
    div.style.display = 'grid';
    div.style.alignItems = 'center';
    div.style.justifyContent = 'center';
    canvas.appendChild(div);

    let header = window.document.createElement('h1');
    header.innerText = "Youry's Fury";
    header.style.fontFamily = '"Press Start 2P", cursive';
    header.style.fontSize = '70px';
    header.style.color = 'darkred';
    div.appendChild(header);
    
    let btn = window.document.createElement('button');
    btn.innerText = 'PLAY';
    btn.style.fontFamily = '"Press Start 2P", cursive';
    btn.style.fontSize = '30px';
    btn.style.backgroundColor = '#8babbf';
    btn.style.color = '#38002c';
    btn.style.padding = '20px 30px';
    btn.style.border = 'none';
    btn.addEventListener('click', () => {
        div.style.display = 'none';
    })
    div.appendChild(btn);
}

const start = () => {
    addBackgroundImages();
    buildLevel();
    lifeCycle();
    addHearts();
    updateHearts();
    addStartScreen();
}

start();