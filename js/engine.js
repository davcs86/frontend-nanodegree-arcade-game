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

var Engine = function() {
    /* Predefine the variables we'll be using within this scope,
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

    /* Go ahead and load all of the images we know we're going to need to
     * draw our game level. Then set init as the callback method, so that when
     * all of these images are properly loaded our game will start.
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

    // settings for score labels
    this.ctx.font = '16pt Impact';
    this.ctx.textAlign = 'end';
    this.ctx.fillStyle = 'white';
    this.ctx.strokeStyle = 'black';
    this.ctx.lineWidth = 1;
    /* Assign the canvas' context object to the global variable (the window
     * object when run in a browser) so that developer's can use it more easily
     * from within their app.js files.
     */
    window.ctx = this.ctx;
};

/* This function serves as the kickoff point for the game loop itself
 * and handles properly calling the update and render methods.
 */
Engine.prototype.main = function () {
    if (this.time <= 0.0) {
        // save if it's highest score
        this.saveHighestScore();
        if (confirm('Time over. Do you want to play again?')) {
            this.init();
        } else {
            return;
        }
    }

    /* Get our time delta information which is required if your game
     * requires smooth animation. Because everyone's computer processes
     * instructions at different speeds we need a constant value that
     * would be the same for everyone (regardless of how fast their
     * computer is) - hurray time!
     */
    var now = Date.now();
    this.dt = (now - this.lastTime) / 1000.0;

    /* Call our update/render functions, pass along the time delta to
     * our update function since it may be used for smooth animation.
     */
    this.update();
    this.render();

    /* Set our lastTime variable which is used to determine the time delta
     * for the next time this function is called.
     */
    this.lastTime = now;

    /* Use the browser's requestAnimationFrame function to call this
     * function again as soon as the browser is able to draw another frame.
     */
    var that = this;
    this.win.requestAnimationFrame(function(){
        that.main();
    });
};

/* This function does some initial setup that should only occur once,
 * particularly setting the lastTime variable that is required for the
 * game loop.
 */
Engine.prototype.init = function() {
    this.reset();
    this.lastTime = Date.now();
    this.main();
};

/* This function is called by main (our game loop) and itself calls all
 * of the functions which may need to update entity's data. Based on how
 * you implement your collision detection (when two entities occupy the
 * same space, for instance when your character should die), you may find
 * the need to add an additional function call here. For now, we've left
 * it commented out - you may or may not want to implement this
 * functionality this way (you could just implement collision detection
 * on the entities themselves within your app.js file).
 */
Engine.prototype.update = function() {
    this.updateEntities();
    this.updateScore();
    this.checkCollisions();
};

/* This is called by the update function  and loops through all of the
 * objects within your allEnemies array as defined in app.js and calls
 * their update() methods. It will then call the update function for your
 * player object. These update methods should focus purely on updating
 * the data/properties related to  the object. Do your drawing in your
 * render methods.
 */
Engine.prototype.updateEntities = function() {
    var dt = this.dt;
    this.allEnemies.forEach(function(enemy) {
        enemy.update(dt);
    });
    this.gem.update(dt);
    this.player.update();
};

Engine.prototype.updateScore = function() {
    this.time -= this.dt;
    if (this.time < 0.0) {
        this.time = 0.0;
    }
    var currentScoreLbl = "Score: " + this.score + ", Time: " + toTimeString(this.time);
    this.ctx.clearRect(0, 8, this.ctx.canvas.width, 20);
    this.ctx.fillText(currentScoreLbl, this.ctx.canvas.width - 10, 26);
    this.ctx.strokeText(currentScoreLbl, this.ctx.canvas.width - 10, 26);
};

Engine.prototype.changeTime = function(seconds) {
    this.time += seconds;
};

Engine.prototype.changeScore = function(changeToScore) {
    this.score += changeToScore;
};

/* This function initially draws the "game level", it will then call
 * the renderEntities function. Remember, this function is called every
 * game tick (or loop of the game engine) because that's how games work -
 * they are flipbooks creating the illusion of animation but in reality
 * they are just drawing the entire screen over and over.
 */
Engine.prototype.render = function() {
    /* This array holds the relative URL to the image used
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

    /* Loop through the number of rows and columns we've defined above
     * and, using the rowImages array, draw the correct image for that
     * portion of the "grid"
     */
    for (row = 0; row < this.numRows; row++) {
        for (col = 0; col < this.numCols; col++) {
            /* The drawImage function of the canvas' context element
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
    this.renderHighestScore();
};

/* This function is called by the render function and is called on each game
 * tick. It's purpose is to then call the render functions you have defined
 * on your enemy and player entities within app.js
 */
Engine.prototype.renderEntities = function() {
    /* Loop through all of the objects within the allEnemies array and call
     * the render function you have defined.
     */
    this.allEnemies.forEach(function(enemy) {
        enemy.render();
    });
    this.gem.render();
    this.player.render();
};

Engine.prototype.renderHighestScore = function() {
    var highestScore = localStorage.getItem("HighestScore") || 0,
        highestScoreLbl = "Highest score: " + highestScore;
    this.ctx.clearRect(0, 28, this.ctx.canvas.width, 20);
    this.ctx.fillText(highestScoreLbl, this.ctx.canvas.width - 10, 46);
    this.ctx.strokeText(highestScoreLbl, this.ctx.canvas.width - 10, 46);
};

Engine.prototype.saveHighestScore = function() {
    var highestScore = localStorage.getItem("HighestScore") || 0,
        scoreVal = this.score;
    if (scoreVal > highestScore) {
        localStorage.setItem("HighestScore", scoreVal);
        this.renderHighestScore();
    }
};

Engine.prototype.checkCollisions = function(){
    var that = this;
    var playerAlreadyCollided = false;
    this.allEnemies.forEach(function(enemy) {
        // check if this enemy collided with player
        if (!playerAlreadyCollided && that.player.y === enemy.y && that.player.x - 101 <= enemy.x && that.player.x + 101 >= enemy.x) {
            that.player.doCollide();
            playerAlreadyCollided = true;
        }
    });
    // check if collided with a gem
    if (!playerAlreadyCollided) {
        if (this.player.y === this.gem.y && this.player.x - 101 <= this.gem.x && this.player.x + 101 >= this.gem.x) {
            // collect the gem
            this.gem.doCollide();
        }
    }
};

/* This function does nothing but it could have been a good place to
 * handle game reset states - maybe a new game menu or a game over screen
 * those sorts of things. It's only called once by the init() method.
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
};

var engine = new Engine();
Resources.onReady(function(){
    engine.init();
});
