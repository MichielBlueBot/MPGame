const ClientEngine = require('lance-gg').ClientEngine;
const MyRenderer = require('../client/MyRenderer');
const Constants = require('../constants/constants')

class MyClientEngine extends ClientEngine {

    constructor(gameEngine, options) {
        super(gameEngine, options, MyRenderer);

        console.log('Client Engine constructor()');
        this.gameEngine.on('client__preStep', this.preStep.bind(this));

        // keep a reference for key press state
        this.pressedKeys = {
            down: false,
            up: false,
            left: false,
            right: false,
            space: false
        };

        let that = this;
        document.onkeydown = (e) => { that.onKeyChange(e, true); };
        document.onkeyup = (e) => { that.onKeyChange(e, false); };
        document.addEventListener('onmousedown', (e) => { this.onMouseClickEvent(e, true);});
        document.addEventListener('onmouseup', (e) => { this.onMouseClickEvent(e, false);});
    }

    // our pre-step is to process all inputs
    preStep() {

        if (this.pressedKeys.up) {
            this.sendInput(Constants.UP, { movement: true });
        }

        if (this.pressedKeys.down) {
            this.sendInput(Constants.DOWN, { movement: true });
        }

        if (this.pressedKeys.left) {
            this.sendInput(Constants.LEFT, { movement: true });
        }

        if (this.pressedKeys.right) {
            this.sendInput(Constants.RIGHT, { movement: true });
        }

        if (this.pressedKeys.space) {
            this.sendInput(Constants.SPACE, { movement: true });
        }
    }

    onKeyChange(e, isDown) {
        e = e || window.event;

        if (e.keyCode == Constants.KEY_UP) {
            this.pressedKeys.up = isDown;
        } else if (e.keyCode == Constants.KEY_DOWN) {
            this.pressedKeys.down = isDown;
        } else if (e.keyCode == Constants.KEY_LEFT) {
            this.pressedKeys.left = isDown;
        } else if (e.keyCode == Constants.KEY_RIGHT) {
            this.pressedKeys.right = isDown;
        } else if (e.keyCode == Constants.KEY_SPACE) {
            this.pressedKeys.space = isDown;
        }
    }

    onMouseClickEvent(e, isDown) {
        console.log(e);
        console.log(isDown);
    }
}

module.exports = MyClientEngine;
