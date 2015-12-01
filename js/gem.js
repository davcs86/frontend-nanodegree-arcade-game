/**
* Represents a gem to give more time to the user
* @constructor
*
* @param {object} engine - engine reference
*
*/
var Gem = function(engine) {
    /**
    * Reference to engine owner, to use global variable "engine"
    */
    this.engine = engine;
    /**
    * Declare the variables needed, then call init() method.
    */
    this.sprite;
    this.timeToAdd;
    this.expiresIn;
    this.x;
    this.y;
    this.init();
};

/**
 * Update the gem expiration time, then redraw it if the gem already expired.
 *
 * @param {integer} dt - a time delta between ticks
 */
Gem.prototype.update = function(dt) {
    this.expiresIn -= dt;
    if (this.expiresIn <= 0.0) {
        this.init();
    }
};

/*
* Sets a new initial state for all the gem variables
*/
Gem.prototype.init = function(){
    /**
    * Array of the possible gems and their settings
    */
    var gemSettings = [
        {
            sprite: 'images/Gem%20Blue.png',
            timeToAdd: 30, // 30 seconds
            expiresIn: 15
        }, {
            sprite: 'images/Gem%20Green.png',
            timeToAdd: 20, // 20 seconds
            expiresIn: 10
        }, {
            sprite: 'images/Gem%20Orange.png',
            timeToAdd: 10, // 10 seconds
            expiresIn: 5
        }
    ];
    /**
    * Set randomly the kind of gem and its position (row and column)
    */
    var randomGemIndex = getRandomIntInclusive(0, gemSettings.length-1),
        randomRow = getRandomIntInclusive(1,3),
        randomCol = getRandomIntInclusive(0,4),
        newGemSettings = gemSettings[randomGemIndex];

    this.sprite = newGemSettings.sprite;
    this.timeToAdd = newGemSettings.timeToAdd;
    this.expiresIn = newGemSettings.expiresIn;
    this.x = randomCol * 101;
    this.y = (randomRow * 83) - 25;
};

/**
* Update game timer. Then call the init() method of the gem in order to redraw it.
*/
Gem.prototype.doCollide = function(){
    this.engine.changeTime(this.timeToAdd);
    this.init();
};

/**
* Draw the gem on the screen, required method for game
*/
Gem.prototype.render = function() {
    this.engine.ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};
