/**
* @description Represents a gem to give more time to the user
* @constructor
*/
var Gem = function(engine) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started
    this.engine = engine;
    this.sprite;
    this.timeToAdd;
    this.expiresIn;
    this.x;
    this.y;
    this.reset();
};

/**
 * @description Update the gem time, required method for game.
 *
 * @param {integer} dt - a time delta between ticks
 */
Gem.prototype.update = function(dt) {
    // update the gem expiresIn
    this.expiresIn -= dt;
    //console.log(this.expiresIn);
    if (this.expiresIn <= 0.0) {
        this.reset();
    }
};

Gem.prototype.reset = function(){
    var gemSettings = {
        1: {
            sprite: 'images/Gem%20Blue.png',
            timeToAdd: 30, // 30 seconds
            expiresIn: 15
        },
        2: {
            sprite: 'images/Gem%20Green.png',
            timeToAdd: 20, // 20 seconds
            expiresIn: 10
        },
        3: {
            sprite: 'images/Gem%20Orange.png',
            timeToAdd: 10, // 10 seconds
            expiresIn: 5
        }
    };
    var randomGemIndex = getRandomIntInclusive(1,3),
        randomRow = getRandomIntInclusive(1,3),
        randomCol = getRandomIntInclusive(0,4),
        newGemSettings = gemSettings[randomGemIndex];

    this.sprite = newGemSettings.sprite;
    this.timeToAdd = newGemSettings.timeToAdd;
    this.expiresIn = newGemSettings.expiresIn;
    this.x = randomCol * 101;
    this.y = (randomRow * 83) - 25;
};

Gem.prototype.doCollide = function(){
    //update game timer
    this.engine.changeTime(this.timeToAdd);
    this.reset();
};
/**
 * @description Draw the gem on the screen, required method for game
 */
Gem.prototype.render = function() {
    this.engine.ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};
