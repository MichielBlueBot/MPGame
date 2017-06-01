/**
 * Created by Michiel on 1/06/2017.
 */
'use strict';

const DynamicObject = require('lance-gg').serialize.DynamicObject;
const Constants = require('../constants/constants');

class Orb extends DynamicObject {

    get bendingMultiple() { return 0.8; }
    get bendingVelocityMultiple() { return 0; }

    constructor(id, team, x, y) {
        super(id);
        this.position.set(x, y);
        this.team = team;
        this.class = Orb;
    }

    onAddToWorld(gameEngine) {
        if (gameEngine.renderer) {
            gameEngine.renderer.addSprite(this, 'orb');
        }
    }
}
module.exports = Orb;
