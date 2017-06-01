'use strict';

const DynamicObject = require('lance-gg').serialize.DynamicObject;
const Constants = require('../constants/constants')

class Paddle extends DynamicObject {

    constructor(id, x, playerId) {
        super(id);
        this.position.set(x, 0);
        this.xspeed = Constants.PADDLE_X_SPEED;
        this.yspeed = Constants.PADDLE_Y_SPEED;
        this.playerId = playerId;
        this.class = Paddle;
    }

    onAddToWorld(gameEngine) {
        if (gameEngine.renderer) {
            gameEngine.renderer.addSprite(this, 'paddle');
        }
    }
}
module.exports = Paddle;
