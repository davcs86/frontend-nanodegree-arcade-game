// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function(engine) {
    this.engine = engine;
    this.sprite = 'images/char-boy.png';
    this.x = getRandomIntInclusive(0, 4) * 101; // 101 is the width of the blocks
    this.initialY = (83 * 5) - 25;
    this.y = this.initialY; // 83 is the height of the rows
};
Player.prototype.update = function(){
    // console.log("update");
    // check if player in inside the boundaries
    this.x = (this.x > 0) ? this.x : 0;
    this.x = (this.x < this.engine.ctx.canvas.width) ? this.x : this.x - 101;
    this.y = (this.y > 0) ? this.y : 0;
    this.y = (this.y < (this.initialY + 1)) ? this.y : this.y - 83;

    if (this.y===0) {
        // return to initial position
        this.y = this.initialY;
        //update score
        this.engine.changeScore(200);
    }
};
Player.prototype.doCollide = function(){
    // return to initial position
    this.y = this.initialY;
    // update score
    this.engine.changeScore(-50);
    // update time
    this.engine.changeTime(-10);
};
Player.prototype.render = function(){
    this.engine.ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};
Player.prototype.handleInput = function(pressedKey){
    switch (pressedKey) {
        case 'left':
            this.x += -101;
            break;
        case 'up':
            this.y += -83;
            break;
        case 'right':
            this.x += 101;
            break;
        case 'down':
            this.y += 83;
            break;
    }
};
