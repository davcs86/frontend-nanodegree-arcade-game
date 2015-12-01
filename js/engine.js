/* Engine.js
 * This file provides the game loop functionality (update entities and render),
 * draws the initial game board on the screen, and then calls the update and
 * render methods on your player and enemy objects (defined in your app.js).
 *
 * A game engine works by drawing the entire game screen over and over, kind of
 * like a flipbook you may have created as a kid. When your player moves across
 * the screen, it may look like just that image/character is moving or being
 * drawn but that is not the case. What's really happening is the entire "scene"
 * is being drawn over and over, presenting the illusion of animation.
 *
 * This engine is available globally via the Engine variable and it also makes
 * the canvas' context (ctx) object globally available to make writing app.js
 * a little simpler to work with.
 */

 /**
 * Represents the engine for game functionality.
 * @constructor
 */
var Engine = function() {
    /**
    * Predefine the variables we'll be using within this scope,
    * create the canvas element, grab the 2D context for that canvas
    * set the canvas elements height/width and add it to the DOM.
    */
    this.doc = window.document;
    this.win = window.window;
    this.canvas = this.doc.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.lastTime;
    this.dt;
    this.score;
    this.time;

    this.canvas.width = 505;
    this.canvas.height = 606;
    this.doc.body.appendChild(this.canvas);

    this.player;
    this.gem;
    this.allEnemies = [];
    this.numRows = 6;
    this.numCols = 5;

    /**
    * Preload the assets
    */
    Resources.load([
        'images/stone-block.png',
        'images/water-block.png',
        'images/grass-block.png',
        'images/enemy-bug.png',
        'images/char-boy.png',
        'images/Gem%20Blue.png',
        'images/Gem%20Green.png',
        'images/Gem%20Orange.png'
    ]);

    /**
    * Settings for score labels
    */
    this.ctx.font = '16pt Impact';
    this.ctx.textAlign = 'end';
    this.ctx.fillStyle = 'white';
    this.ctx.strokeStyle = 'black';
    this.ctx.lineWidth = 1;

};

/**
* This function serves as the kickoff point for the game loop itself
* and handles properly calling the update and render methods.
*/
Engine.prototype.main = function () {
    /**
    * Check if time is over
    */
    if (this.time <= 0.0) {
        /**
        * Save if it's highest score
        */
        this.saveHighestScore();
        /**
        * Ask user if want to play again
        */
        if (confirm('Time over. Do you want to play again?')) {
            /**
            * Restart the engine
            */
            this.init();
        } else {
            return;
        }
    }

    /**
    * Get our time delta information which is required if your game
    * requires smooth animation.
    */
    var now = Date.now();
    this.dt = (now - this.lastTime) / 1000.0;

    /**
    * Call our update/render functions.
    */
    this.update();
    this.render();

    /**
    * Set our lastTime variable which is used to determine the time delta
    * for the next time this function is called.
    */
    this.lastTime = now;

    /**
    * Use the browser's requestAnimationFrame function to call this
    * function again as soon as the browser is able to draw another frame.
    */
    var that = this;
    this.win.requestAnimationFrame(function(){
        that.main();
    });
};

/**
* This function does some initial setup that should only occur once
*/
Engine.prototype.init = function() {
    this.reset();
    /*
    * Start the animation by calling main() method
    */
    this.main();
};

/**
* This function is called by main (our game loop) and itself calls all
* of the functions which may need to update entity's data.
*/
Engine.prototype.update = function() {
    this.updateEntities();
    this.checkCollisions();
    this.renderScore();
    this.renderHighestScore();
};

/**
* This is called by the update function and loops through all of the
* objects within your allEnemies array as defined in app.js and calls
* their update() methods. Then, it will call the update function for
* your gem instance. After that, It will then call the update function
* for your player object.
*/
Engine.prototype.updateEntities = function() {
    var dt = this.dt;
    this.allEnemies.forEach(function(enemy) {
        enemy.update(dt);
    });
    this.gem.update(dt);
    this.player.update();
};

/**
* Update the game time based on the time delta. Then, redraws the
* label for display the score and the time.
*/
Engine.prototype.renderScore = function() {
    this.time -= this.dt;
    if (this.time < 0.0) {
        this.time = 0.0;
    }
    var currentScoreLbl = "Score: " + this.score + ", Time: " + toTimeString(this.time);
    /**
    * Cleans the label area, before drawing
    */
    this.ctx.clearRect(0, 8, this.ctx.canvas.width, 20);
    /**
    * Draws the label
    */
    this.ctx.fillText(currentScoreLbl, this.ctx.canvas.width - 10, 26);
    this.ctx.strokeText(currentScoreLbl, this.ctx.canvas.width - 10, 26);
};

/**
* Update the time remaining
*
* @param {integer} seconds - number of seconds to add/substract to the game time
*
*/
Engine.prototype.changeTime = function(seconds) {
    this.time += seconds;
};

/**
* Update the score
*
* @param {integer} changeToScore - score to add/substract to the game score
*
*/
Engine.prototype.changeScore = function(changeToScore) {
    this.score += changeToScore;
};

/**
* This function initially draws the "game level", it will then call
* the renderEntities function.
*/
Engine.prototype.render = function() {
    /**
    * This array holds the relative URL to the image used
    * for that particular row of the game level.
    */
    var rowImages = [
            'images/water-block.png',   // Top row is water
            'images/stone-block.png',   // Row 1 of 3 of stone
            'images/stone-block.png',   // Row 2 of 3 of stone
            'images/stone-block.png',   // Row 3 of 3 of stone
            'images/grass-block.png',   // Row 1 of 2 of grass
            'images/grass-block.png'    // Row 2 of 2 of grass
        ],
        row, col;

    /**
    * Loop through the number of rows and columns we've defined above
    * and, using the rowImages array, draw the correct image for that
    * portion of the "grid"
    */
    for (row = 0; row < this.numRows; row++) {
        for (col = 0; col < this.numCols; col++) {
            /**
            * The drawImage function of the canvas' context element
            * requires 3 parameters: the image to draw, the x coordinate
            * to start drawing and the y coordinate to start drawing.
            * We're using our Resources helpers to refer to our images
            * so that we get the benefits of caching these images, since
            * we're using them over and over.
            */
            this.ctx.drawImage(Resources.get(rowImages[row]), col * 101, row * 83);
        }
    }
    this.renderEntities();
};

/**
* This function is called by the render function and is called on each game
* tick.
*/
Engine.prototype.renderEntities = function() {
    /**
    * Loop through all of the objects within the allEnemies array and call
    * the render function you have defined.
    */
    this.allEnemies.forEach(function(enemy) {
        enemy.render();
    });
    this.gem.render();
    this.player.render();
};

/**
* Redraw the label for display the highest score stored in the localStorage.
*/
Engine.prototype.renderHighestScore = function() {
    var highestScore = localStorage.getItem("HighestScore") || 0,
        highestScoreLbl = "Highest score: " + highestScore;
    this.ctx.clearRect(0, 28, this.ctx.canvas.width, 20);
    this.ctx.fillText(highestScoreLbl, this.ctx.canvas.width - 10, 46);
    this.ctx.strokeText(highestScoreLbl, this.ctx.canvas.width - 10, 46);
};

/**
* When the game is over (based on the game time, see main() method),
* this method is called to save (if apply) the new highest score in
* the localStorage.
*/
Engine.prototype.saveHighestScore = function() {
    var highestScore = localStorage.getItem("HighestScore") || 0,
        scoreVal = this.score;
    if (scoreVal > highestScore) {
        /**
        * If the score is highest the update the localStorage and call
        * renderHighestScore() method to redraw the label.
        */
        localStorage.setItem("HighestScore", scoreVal);
        this.renderHighestScore();
    }
};

/**
* Check for player collisions with enemies and the gem,
* based on their positions.
*/
Engine.prototype.checkCollisions = function(){
    var that = this;
    /**
    * Flag that indicates when there's already a detected collision.
    */
    var playerAlreadyCollided = false;
    /**
    * Loop through all of the objects within the allEnemies array to detect collisions
    * and call the player.doCollide() method to apply the score and time rules, and
    * set true the flag 'playerAlreadyCollided'.
    */
    this.allEnemies.forEach(function(enemy) {
        /**
        * If it hadn't found a previous collision, check if this enemy collided with player
        */
        if (!playerAlreadyCollided
            && that.player.y === enemy.y
            && that.player.x - 101 <= enemy.x
            && that.player.x + 101 >= enemy.x) {
            that.player.doCollide();
            playerAlreadyCollided = true;
        }
    });
    /**
    * If it hadn't found a previous collision, check if the gem collided with player
    * and call the gem.doCollide() method to apply the time rules.
    */
    if (!playerAlreadyCollided
        && this.player.y === this.gem.y
        && this.player.x - 101 <= this.gem.x
        && this.player.x + 101 >= this.gem.x) {
        this.gem.doCollide();
    }
};

/**
* Sets a new initial state for all the game variables, including new enemies, player, gem, score, time and lastTime.
*/
Engine.prototype.reset = function() {
    this.allEnemies = [
        new Enemy(this, 1),
        new Enemy(this, 1),
        new Enemy(this, 2),
        new Enemy(this, 2),
        new Enemy(this, 3),
        new Enemy(this, 3)
    ];
    this.player = new Player(this);
    this.gem = new Gem(this);
    this.score = 0;
    this.time = 2 * 60;
    this.lastTime = Date.now();
};

/**
* Create an instance of Engine class
*/
var engine = new Engine();

/**
* When all the sources are preloaded, call the engine.init() method to start the engine process.
*/
Resources.onReady(function(){
    engine.init();
});
