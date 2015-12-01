/**
* Represents the player object
* @constructor
*
* @param {object} engine - engine reference
*
*/
var Player = function(engine) {
    /**
    * Reference to engine owner, to use global variable "engine"
    */
    this.engine = engine;
    /**
    * The image/sprite for our enemies, this uses
    * a helper we've provided to easily load images
    */
    this.sprite = 'images/char-boy.png';
    /**
    * Set randomly the horizontal position for the player
    */
    this.x = getRandomIntInclusive(0, 4) * 101;
    /**
    * Set the initial vertical position for the player
    * store the position in 'initialY' variable for reuse it when reaches the water.
    */
    this.initialY = (83 * 5) - 25;
    this.y = this.initialY;
};

/**
* Update the position of the player, first check if the new position is inside the boundaries
* then check if the player reached the water area.
*/
Player.prototype.update = function(){
    /**
    * Check the horizontal boundaries, based on the canvas width.
    */
    this.x = (this.x > 0) ? this.x : 0;
    this.x = (this.x < this.engine.ctx.canvas.width) ? this.x : this.x - 101;
    /**
    * Check the vertical boundaries, based on the initial position of the player.
    */
    this.y = (this.y > 0) ? this.y : 0;
    this.y = (this.y < (this.initialY + 1)) ? this.y : this.y - 83;

    if (this.y===0) {
        /**
        * If the player reached the water, then return to the initial vertical position,
        * then update the game score.
        */
        this.y = this.initialY;
        this.engine.changeScore(200);
    }
};

/**
* Apply the game rules when a player collided a enemy. first, return to the initial vertical position,
* then update the game score and time.
*/
Player.prototype.doCollide = function(){
    // return to initial position
    this.y = this.initialY;
    this.engine.changeScore(-50);
    this.engine.changeTime(-10);
};

/**
* Draw the player on the screen, required method for game
*/
Player.prototype.render = function(){
    this.engine.ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

/**
* Change the player position based on the pressed key by the user.
* it will be fixed in the update() method.
*/
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
