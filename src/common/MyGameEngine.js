'use strict';
const Paddle = require('./Paddle');
const Ball = require('./Ball');
const Constants = require('../constants/constants')

const GameEngine = require('lance-gg').GameEngine;

class MyGameEngine extends GameEngine {

    constructor(options) {
        super(options);
    }

    start() {

        super.start();

        this.on('postStep', () => { this.postStepHandleBall(); });
        this.on('objectAdded', (object) => {
            if (object.id == 1) {
                this.paddle1 = object;
            } else if (object.id == 2) {
                this.paddle2 = object;
            } else if (object.class == Ball) {
                this.ball = object;
            }
        });
    }

    initGame() {

        // create the paddle objects
        this.addObjectToWorld(new Paddle(++this.world.idCount, Constants.PADDING, 1));
        this.addObjectToWorld(new Paddle(++this.world.idCount, Constants.WIDTH - Constants.PADDING, 2));
        this.addObjectToWorld(new Ball(++this.world.idCount, Constants.WIDTH / 2, Constants.HEIGHT / 2));
    }

    postStepHandleBall() {
        if (!this.ball)
            return;

        // CHECK LEFT EDGE:
        if (this.ball.position.x <= Constants.PADDING + Constants.PADDLE_WIDTH &&
            this.ball.position.y >= this.paddle1.y && this.ball.position.y <= this.paddle1.position.y + Constants.PADDLE_HEIGHT &&
            this.ball.velocity.x < 0) {

            // ball moving left hit player 1 paddle
            this.ball.velocity.x *= -1;
            this.ball.position.x = Constants.PADDING + Constants.PADDLE_WIDTH + 1;
        } else if (this.ball.position.x <= 0) {

            // ball hit left wall
            this.ball.velocity.x *= -1;
            this.ball.position.x = 0;
            console.log(`player 2 scored`);
        }

        // CHECK RIGHT EDGE:
        if (this.ball.position.x >= Constants.WIDTH - Constants.PADDING - Constants.PADDLE_WIDTH &&
            this.ball.position.y >= this.paddle2.position.y && this.ball.position.y <= this.paddle2.position.y + Constants.PADDLE_HEIGHT &&
            this.ball.velocity.x > 0) {

            // ball moving right hits player 2 paddle
            this.ball.velocity.x *= -1;
            this.ball.position.x = Constants.WIDTH - Constants.PADDING - Constants.PADDLE_WIDTH - 1;
        } else if (this.ball.position.x >= Constants.WIDTH ) {

            // ball hit right wall
            this.ball.velocity.x *= -1;
            this.ball.position.x = Constants.WIDTH - 1;
            console.log(`player 1 scored`);
        }

        // ball hits top
        if (this.ball.position.y <= 0) {
            this.ball.position.y = 1;
            this.ball.velocity.y *= -1;
        } else if (this.ball.position.y >= Constants.HEIGHT) {
            // ball hits bottom
            this.ball.position.y = Constants.HEIGHT - 1;
            this.ball.velocity.y *= -1;
        }

    }

    registerClasses(serializer) {
        serializer.registerClass(require('../common/Paddle'));
        serializer.registerClass(require('../common/Ball'));
    }

    processInput(inputData, playerId) {

        super.processInput(inputData, playerId);

        // get the player paddle tied to the player socket
        let playerPaddle = this.world.getPlayerObject(playerId);
        if (playerPaddle) {
            console.log('Received key :' + inputData.input + ' ' + playerPaddle)
            if (inputData.input === Constants.UP) {
                console.log('up')
                playerPaddle.position.y -= playerPaddle.yspeed;
            } else if (inputData.input === Constants.DOWN) {
                playerPaddle.position.y += playerPaddle.yspeed;
            } else if (inputData.input === Constants.RIGHT) {
                playerPaddle.position.x += playerPaddle.xspeed;
            } else if (inputData.input === Constants.LEFT) {
                playerPaddle.position.x -= playerPaddle.xspeed;
            }
        }
    }
}

module.exports = MyGameEngine;
