class Player{
    constructor(x, y, width, height, face){
        this.width = width
        this.height = height 
        this.position = {
            x: x,
            y: y
        }
        this.velocity = {
            x: 0,
            y: 10
        }
        this.gravity = 1.4
        this.health = 100
        this.attackRange = 100
        this.face = face
        this.killed = false
        this.currentState;
    }
    draw(){
        c.fillStyle = 'red'
        c.fillRect(this.position.x, this.position.y, this.width, this.height)
    }
    update(){
        let lowerSide = this.position.y+this.height
        let nextLowerSide = this.position.y+this.height+this.velocity.y
        let sceneHeight = canvas.height
        if (nextLowerSide>=sceneHeight) {
            this.velocity.y = 0
        }
        else{
            this.velocity.y += this.gravity
        }
        if (this.velocity.x) {
            this.position.x += this.velocity.x  
        }
        if (this.health<=0) {
            this.killed = true
            this.currentState = this.dead
        }
        if (this.currentState===this.jump && lowerSide>=sceneHeight) {
            this.currentState = this.idle
        }
        else if(lowerSide<sceneHeight){
            this.currentState = this.jump
        }
        this.position.y += this.velocity.y  
        this.currentState.run(this)
    }
    attack(PlayerToAttack){
        c.fillStyle = 'green'
        if (this.face==='right') {
            if (this.position.x+this.attackRange>PlayerToAttack.position.x && this.position.x<=PlayerToAttack.position.x+200 && (this.currentState===this.idle || this.currentState===this.run)) {
                PlayerToAttack.health-=10
                PlayerToAttack.currentState = PlayerToAttack.hurt
            }
        }
        else{
            if (this.position.x-this.attackRange<PlayerToAttack.position.x && this.position.x>=PlayerToAttack.position.x-200 && (this.currentState===this.idle || this.currentState===this.run)) {
                PlayerToAttack.health-=10
                PlayerToAttack.currentState = PlayerToAttack.hurt
            }
        }
        this.currentState = this.attack1
    }
    gameOver(){
        if (this.face==='left') {
            alert('Player 1 won!')
        }
        else{
            alert('Player 2 won!')
        }
        init()
    }
}
class Sprite{
    constructor({position, src, fullscreen, imageContained=1, paddingX=0, paddingY=0, scale=1, loop, frameChangeRate=5}){
        this.image = new Image()
        this.image.src = src
        this.position = position
        if (fullscreen) {
            this.width = canvas.width
            this.height = canvas.height
        }else{
            this.width = this.image.width
            this.height = this.image.height
        }
        this.ImageSrc = src
        this.imageContained = imageContained
        this.currentFrame = 0
        this.frameWidth = this.width/this.imageContained
        this.currentFrame = 0
        this.frameNo = 0
        this.paddingX = paddingX
        this.paddingY = paddingY 
        this.scale = scale
        this.loop = loop
        this.frameChangeRate = frameChangeRate
    }
    draw(){
        c.drawImage(
            this.image, 
            this.position.x,
            this.position.y,
            this.width,
            this.height
        )
    }
    run(player){
        this.frameNo++
        c.drawImage(
            this.image, 
            this.currentFrame*this.frameWidth+this.paddingX,
            0+this.paddingY,
            this.frameWidth, 
            this.height-this.paddingY,
            player.position.x,
            player.position.y,
            player.width,
            player.height*this.scale
        )
        if (this.frameNo%this.frameChangeRate==0) {
            this.currentFrame++
            if (this.currentFrame*this.frameWidth>=this.width) {
                if (player.killed) {
                    player.gameOver()
                }
                if (!this.loop) {
                    player.currentState = player.idle
                }
                this.currentFrame = 0
            }
        }

    }
}