/**
* Represents an enemy our player must avoid
* @constructor
*
* @param {object} engine - engine reference
*
* @param {integer} rowNumber - number of row where will be the enemy
*/
var Enemy = function(engine, rowNumber) {
    /**
    * The image/sprite for our enemies, this uses
    * a helper we've provided to easily load images
    */
    this.sprite = 'images/enemy-bug.png';

    /**
    * The position for our enemies,
    * x, horizontal axis offset. It's negative to simulate the enemy is entering to the screen from the left (101 is the width of the assets).
    * y, vertical axis offset. It takes the number of row by 83 (row height), minus 25 (an offset to display the items better).
    */
    this.x = -101;
    this.y = (rowNumber * 83) - 25;
    /**
    * The speed for our enemies, random number between 3000-8000
    * which represents the time in miliseconds to crossing the screen
    */
    this.speed = getRandomIntInclusive(3000, 8000);
    /**
    * Reference to engine owner, to use global variable "engine"
    */
    this.engine = engine;
};

/**
* Update the enemy's position, required method for game.
*
* @param {integer} dt - a time delta between ticks
*/
Enemy.prototype.update = function(dt) {
    /**
    * Calculates the new horizontal position for this enemy instance, based on the speed and time delta.
    */
    var newXPosition = this.x + ((this.engine.ctx.canvas.width / (this.speed / 1000)) * dt);
    if (newXPosition > this.engine.ctx.canvas.width) {
        /**
        * if exceeds the screen width, return to initial position
        */
        newXPosition = -101;
    }
    /**
    * Update the enemy's horizontal position
    */
    this.x = newXPosition;
};

/**
* Draw the enemy on the screen, required method for game
*/
Enemy.prototype.render = function() {
    this.engine.ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};
