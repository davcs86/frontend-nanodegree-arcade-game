/**
* @description Represents an enemy our player must avoid
* @constructor
*/
var Enemy = function(engine, row) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    this.x = -101;
    this.y = (row * 83) - 25; // 83 is the height of the blocks
    this.speed = getRandomIntInclusive(3000, 8000); // time in miliseconds to crossing the screen
    this.engine = engine;
};

/**
 * @description Update the enemy's position, required method for game.
 *
 * @param {integer} dt - a time delta between ticks
 */
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    var newXPosition = this.x + ((this.engine.ctx.canvas.width / (this.speed / 1000)) * dt);
    if (newXPosition > this.engine.ctx.canvas.width) {
        // if exceeds the screen width, return to initial position
        newXPosition = -101;
    }
    this.x = newXPosition;
};

/**
 * @description Draw the enemy on the screen, required method for game
 */
Enemy.prototype.render = function() {
    this.engine.ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};
