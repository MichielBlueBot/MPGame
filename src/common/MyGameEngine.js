'use strict';

const Orb = require('./Orb');
const Constants = require('../constants/constants')
const GameEngine = require('lance-gg').GameEngine;

class MyGameEngine extends GameEngine {

    constructor(options) {
        super(options);
    }

    start() {
        super.start();
        console.log('Game Engine start()');

        this.on('postStep', () => { this.postStepHandle(); });
        // this.on('objectAdded', (object) => {
        // });
    }

    initGame() {
        console.log('GameEngine initGame');
        // create the paddle objects
        // this.addObjectToWorld(new Paddle(++this.world.idCount, Constants.PADDING, 1));
        // this.addObjectToWorld(new Paddle(++this.world.idCount, Constants.WIDTH - Constants.PADDING, 2));
        // this.addObjectToWorld(new Ball(++this.world.idCount, Constants.WIDTH / 2, Constants.HEIGHT / 2));
    }

    postStepHandle() {
        // there used to be bound checks for the ball here
    }

    registerClasses(serializer) {
        serializer.registerClass(require('../common/Orb'));
    }

    processInput(inputData, playerId) {

        super.processInput(inputData, playerId);

        // get the player paddle tied to the player socket
        // Used to update the paddle position
    }
}

module.exports = MyGameEngine;
