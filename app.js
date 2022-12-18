let canvas = document.querySelector('canvas')
let c = canvas.getContext('2d')
canvas.width = innerWidth
canvas.height = innerHeight

function clearScene(){
    background.draw()
}


function showHealthBar(){
    let enemyHealthDiv = document.querySelector('.enemy-health')
    let playerHealthDiv = document.querySelector('.player-health')
    let timeDiv = document.querySelector('.time')
    let maxHealth = 100
    let enemyHealth = (enemy.health/maxHealth)*100
    let playerHealth = (player.health/maxHealth)*100
    enemyHealthDiv.style.width = `${enemyHealth}%`
    playerHealthDiv.style.width = `${playerHealth}%`
    timeDiv.innerHTML = TimeLimitInSecond - currentTime
}

const TimeLimitInSecond = 60
let player;
let keys
let frame
let enemy
let movingSpeed
let jumpSpeed
let currentTime

let background = new Sprite({
    position:{
        x: 0,
        y: 0
    },
    src : './img/bg/1.png',
    fullscreen: true,

})

function makePLayers(){

    player = new Player(300, 100, 258, 200, 'right')
    enemy = new Player(600, 100, 538, 190, 'left')

    let playerPosition = player.position
    let enemyPosition = enemy.position

    player.idle = new Sprite({
        position:playerPosition,
        src : './img/Ninja_Monk/Idle.png', 
        imageContained: 7,  
        loop: true, 
    })
    player.attack1 = new Sprite({
        position:playerPosition,
        src : './img/Ninja_Monk/Attack_1.png', 
        paddingX: 25,
        imageContained: 5,  
        loop: false, 
        paddingX: 0,
        frameChangeRate: 3,
    })
    player.run = new Sprite({
        position:playerPosition,
        src : './img/Ninja_Monk/Run.png', 
        imageContained: 8,  
        loop: false, 
    })
    player.jump = new Sprite({
        position:playerPosition,
        src : './img/Ninja_Monk/Jump2.png', 
        imageContained: 3,
        frameChangeRate: 10,  
        loop: true, 
    })
    player.dead = new Sprite({
        position:playerPosition,
        src : './img/Ninja_Monk/Dead.png', 
        imageContained: 5, 
        loop: true, 
    })
    player.hurt = new Sprite({
        position:playerPosition,
        src : './img/Ninja_Monk/Hurt.png', 
        imageContained: 4, 
        loop: false, 
    })

    enemy.idle = new Sprite({
        position:enemyPosition,
        src : './img/kenji/Idle.png', 
        paddingY: 60,
        scale : 2,
        imageContained: 4, 
        loop: true,  
    })
    enemy.attack1 = new Sprite({
        position:enemyPosition,
        src : './img/kenji/Attack1.png', 
        paddingY: 60,
        loop: false,
        scale : 2,
        imageContained: 4,   
        frameChangeRate: 3,
    })
    enemy.run = new Sprite({
        position:enemyPosition,
        src : './img/kenji/Run.png', 
        paddingY: 60,
        loop: false,
        scale : 2,
        imageContained: 8,   
    })
    enemy.jump = new Sprite({
        position:enemyPosition,
        src : './img/kenji/Jump.png', 
        paddingY: 60,
        loop: true,
        scale : 2,
        imageContained: 2,   
    })
    enemy.dead = new Sprite({
        position:enemyPosition,
        src : './img/kenji/Death.png', 
        paddingY: 60,
        loop: true,
        scale : 2,
        imageContained: 7,   
    })
    enemy.hurt = new Sprite({
        position:enemyPosition,
        src : './img/kenji/Take hit.png', 
        paddingY: 60,
        loop: false,
        scale : 2,
        imageContained: 3,   
    })

    player.currentState = player.idle
    enemy.currentState = enemy.idle

}

setInterval(() => {
    currentTime++
}, 1000);

function init(){
    makePLayers()
    movingSpeed = 4
    jumpSpeed = 20
    currentTime = 0
    BgArray = []
    keys = {
        right: {
            pressed: false
        },
        left: {
            pressed:false
        },
        down: {
            pressed:false
        },
        up: {
            pressed:false
        },
        d: {
            pressed: false
        },
        a: {
            pressed:false
        },
        w: {
            pressed:false
        },
        s: {
            pressed:false
        },
        shift: {
            pressed: false,
        },
        space: {
            pressed: false,
        }
    }
    frame = 0

}

init()
// makeBgArray()

function main() {
    requestAnimationFrame(main)
    clearScene()
    enemy.update()
    player.update()
    if (keys.right.pressed) {
        enemy.velocity.x = movingSpeed
       if (enemy.currentState!=enemy.attack1) {
            enemy.currentState = enemy.run
        }
    }
    else if(keys.left.pressed){
        enemy.velocity.x = -movingSpeed
       if (enemy.currentState!=enemy.attack1) {
            enemy.currentState = enemy.run
        }
    }
    else{
        if (enemy.currentState===enemy.run) {
            enemy.currentState = enemy.idle
        }
    }
    if (keys.a.pressed) {
        player.velocity.x = -movingSpeed
        if (player.currentState!=player.attack1) {
            player.currentState = player.run
        }
    }
    else if(keys.d.pressed){
        player.velocity.x = movingSpeed
        if (player.currentState!=player.attack1) {
            player.currentState = player.run
        }
    }
    else{
        if (player.currentState===player.run) {
            player.currentState = player.idle
        }
    }
    showHealthBar()
    if (currentTime>=TimeLimitInSecond) {
        if (player.health>enemy.health) {
            enemy.gameOver()
        }
        else{
            player.gameOver()
        }
    }
    frame++
    
}

addEventListener('keydown', (e)=>{
    switch (e.code) {
        case 'ArrowUp':
            keys.up.pressed = true
            enemy.currentState = enemy.jump
            if (enemy.position.y+enemy.height>=canvas.height) {
                enemy.velocity.y -= jumpSpeed
            }
            break;
        case 'KeyW':
            keys.w.pressed = true
            player.currentState = player.jump
            if (player.position.y+player.height>=canvas.height) {
                player.velocity.y -= jumpSpeed*1.2
            }
            break;              

        case 'ArrowRight':
            keys.right.pressed = true
            break;
        case 'KeyD':
            keys.d.pressed = true
            break;

        case 'ArrowLeft':
            keys.left.pressed = true
            break;              
        case 'KeyA':
            keys.a.pressed = true
            break;

        case 'ArrowDown':
            if (!keys.down.pressed) {
                enemy.attack(player)
            }
            keys.down.pressed = true
            break;  
        case 'KeyS':
            if (!keys.s.pressed) {
                player.attack(enemy)
            }
            keys.s.pressed = true
            break;  

        case 'Space':
            keys.space.pressed = true
            break;   
        case 'ShiftRight':
            keys.shift.pressed = true
            break;
    }
})
addEventListener('keyup', (e)=>{
    switch (e.code) {
        case 'ArrowUp':
            keys.up.pressed = true
            break;

        case 'ArrowRight':
            enemy.velocity.x=0
            keys.right.pressed = false
            break;
        case 'KeyD':   
            player.velocity.x=0
            keys.d.pressed = false
            break;

        case 'ArrowLeft':
            enemy.velocity.x=0
            keys.left.pressed = false
            break;  
        case 'KeyA':
            player.velocity.x=0
            keys.a.pressed = false
            break;

        case 'ArrowDown':
            keys.down.pressed = false
            break;  
        case 'KeyS':
            keys.s.pressed = false
            break;  

        case 'Space':
            keys.space.pressed = false
            break; 
        case 'ShiftRight':
            keys.shift.pressed = false
            break;
}
})

requestAnimationFrame(main)