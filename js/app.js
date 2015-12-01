/**
* This listens for key presses and sends the keys to your Player.handleInput() method.
*/
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
    engine.player.handleInput(allowedKeys[e.keyCode]);
});

/**
* Returns a random integer between min (included) and max (included).
* Using Math.round() will give you a non-uniform distribution!
* taken from MDN: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
*
* @param {integer} min - defines the minimum value that can be returned
*
* @param {integer} max - defines the maximum value that can be returned
*/
function getRandomIntInclusive(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
* Convert seconds to hh:mm:ss format
* taken from Stackoverflow: http://stackoverflow.com/a/29618671/2423859
*
* @param {integer} seconds - number of seconds to convert to hh:mm:ss format
*/
function toTimeString(seconds) {
    return (new Date(seconds * 1000)).toUTCString().match(/(\d\d:\d\d:\d\d)/)[0];
}
