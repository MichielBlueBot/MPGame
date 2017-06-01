'use strict';

const DynamicObject = require('lance-gg').serialize.DynamicObject;

class Ball extends DynamicObject {

    get bendingMultiple() { return 0.8; }
    get bendingVelocityMultiple() { return 0; }

    constructor(id, x, y) {
        super(id);
        this.position.set(x, y);
        this.class = Ball;
        this.velocity.set(BALL_X_SPEED, BALL_Y_SPEED);
    }

    onAddToWorld(gameEngine) {
        if (gameEngine.renderer) {
            gameEngine.renderer.addSprite(this, 'ball');
        }
    }
}
module.exports = Ball;
