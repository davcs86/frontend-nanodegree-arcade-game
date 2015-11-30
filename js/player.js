// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function() {
    this.sprite = 'images/char-boy.png';
    this.x = getRandomIntInclusive(0, 4) * 101; // 101 is the width of the blocks
    this.y = 83 * 5; // 101 is the height of the rows
};
Player.prototype.update = function(){
    //console.log("update");
};
Player.prototype.render = function(){
    //console.log("render");
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};
Player.prototype.handleInput = function(pressedKey){
    switch (pressedKey) {
        case 'left':
            //this.x += -83;
            break;
        case 'up':
            //this.y += -101;
            break;
        case 'right':
            //this.x += 83;
            break;
        case 'down':
            //this.y += 101;
            break;
    }
    this.update();
}
