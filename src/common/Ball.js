'use strict';

const DynamicObject = require('lance-gg').serialize.DynamicObject;
const Constants = require('../constants/constants')

class Ball extends DynamicObject {

    get bendingMultiple() { return 0.8; }
    get bendingVelocityMultiple() { return 0; }

    constructor(id, x, y) {
        super(id);
        this.position.set(x, y);
        this.class = Ball;
        this.velocity.set(Constants.BALL_X_SPEED, Constants.BALL_Y_SPEED);
    }

    onAddToWorld(gameEngine) {
        if (gameEngine.renderer) {
            gameEngine.renderer.addSprite(this, 'ball');
        }
    }
}
module.exports = Ball;
