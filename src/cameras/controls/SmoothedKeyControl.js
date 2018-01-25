var Class = require('../../utils/Class');
var GetValue = require('../../utils/object/GetValue');

// var controlConfig = {
//     camera: this.cameras.main,
//     left: cursors.left,
//     right: cursors.right,
//     up: cursors.up,
//     down: cursors.down,
//     zoomIn: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q),
//     zoomOut: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E),
//     zoomSpeed: 0.02,
//     acceleration: 0.06,
//     drag: 0.0005,
//     maxSpeed: 1.0
// };

var SmoothedKeyControl = new Class({

    initialize:

    /**
     * [description]
     *
     * @class SmoothedKeyControl
     * @memberOf Phaser.Cameras.Controls
     * @constructor
     * @since 3.0.0
     *
     * @param {object} config - [description]
     */
    function SmoothedKeyControl (config)
    {
        /**
         * The Camera that this Control will update.
         *
         * @property {Phaser.Cameras.Scene2D.Camera} camera
         * @default null
         * @since 3.0.0
         */
        this.camera = GetValue(config, 'camera', null);

        /**
         * The Key to be pressed that will move the Camera left.
         *
         * @property {Phaser.Input.Keyboard} left
         * @default null
         * @since 3.0.0
         */
        this.left = GetValue(config, 'left', null);

        /**
         * The Key to be pressed that will move the Camera right.
         *
         * @property {Phaser.Input.Keyboard} right
         * @default null
         * @since 3.0.0
         */
        this.right = GetValue(config, 'right', null);

        /**
         * The Key to be pressed that will move the Camera up.
         *
         * @property {Phaser.Input.Keyboard} up
         * @default null
         * @since 3.0.0
         */
        this.up = GetValue(config, 'up', null);

        /**
         * The Key to be pressed that will move the Camera down.
         *
         * @property {Phaser.Input.Keyboard} down
         * @default null
         * @since 3.0.0
         */
        this.down = GetValue(config, 'down', null);

        /**
         * The Key to be pressed that will zoom the Camera in.
         *
         * @property {Phaser.Input.Keyboard} zoomIn
         * @default null
         * @since 3.0.0
         */
        this.zoomIn = GetValue(config, 'zoomIn', null);

        /**
         * The Key to be pressed that will zoom the Camera out.
         *
         * @property {Phaser.Input.Keyboard} zoomOut
         * @default null
         * @since 3.0.0
         */
        this.zoomOut = GetValue(config, 'zoomOut', null);

        /**
         * The speed at which the camera will zoom if the `zoomIn` or `zoomOut` keys are pressed.
         *
         * @property {float} zoomSpeed
         * @default 0.01
         * @since 3.0.0
         */
        this.zoomSpeed = GetValue(config, 'zoomSpeed', 0.01);

        /**
         * The horizontal acceleration the camera will move.
         *
         * @property {float} accelX
         * @default 0
         * @since 3.0.0
         */

        /**
         * The vertical acceleration the camera will move.
         *
         * @property {float} accelY
         * @default 0
         * @since 3.0.0
         */
        var accel = GetValue(config, 'acceleration', null);

        if (typeof accel === 'number')
        {
            this.accelX = accel;
            this.accelY = accel;
        }
        else
        {
            this.accelX = GetValue(config, 'acceleration.x', 0);
            this.accelY = GetValue(config, 'acceleration.y', 0);
        }

        /**
         * The horizontal drag applied to the camera when it is moving.
         *
         * @property {float} dragX
         * @default 0
         * @since 3.0.0
         */

        /**
         * The vertical drag applied to the camera when it is moving.
         *
         * @property {float} dragY
         * @default 0
         * @since 3.0.0
         */
        var drag = GetValue(config, 'drag', null);

        if (typeof drag === 'number')
        {
            this.dragX = drag;
            this.dragY = drag;
        }
        else
        {
            this.dragX = GetValue(config, 'drag.x', 0);
            this.dragY = GetValue(config, 'drag.y', 0);
        }

        /**
         * The maximum horizontal speed the camera will move.
         *
         * @property {float} maxSpeedX
         * @default 0
         * @since 3.0.0
         */

        /**
         * The maximum vertical speed the camera will move.
         *
         * @property {float} maxSpeedY
         * @default 0
         * @since 3.0.0
         */
        var maxSpeed = GetValue(config, 'maxSpeed', null);

        if (typeof maxSpeed === 'number')
        {
            this.maxSpeedX = maxSpeed;
            this.maxSpeedY = maxSpeed;
        }
        else
        {
            this.maxSpeedX = GetValue(config, 'maxSpeed.x', 0);
            this.maxSpeedY = GetValue(config, 'maxSpeed.y', 0);
        }

        /**
         * [description]
         *
         * @property {number} _speedX
         * @private
         * @default 0
         * @since 3.0.0
         */
        this._speedX = 0;

        /**
         * [description]
         *
         * @property {number} _speedY
         * @private
         * @default 0
         * @since 3.0.0
         */
        this._speedY = 0;

        /**
         * [description]
         *
         * @property {number} _zoom
         * @private
         * @default 0
         * @since 3.0.0
         */
        this._zoom = 0;

        /**
         * A flag controlling if the Controls will update the Camera or not.
         *
         * @property {boolean} active
         * @since 3.0.0
         */
        this.active = (this.camera !== null);
    },

    /**
     * Starts the Key Control running, providing it has been linked to a camera.
     *
     * @method Phaser.Cameras.Controls.SmoothedKeyControl#start
     * @since 3.0.0
     *
     * @return {Phaser.Cameras.Controls.SmoothedKeyControl} This Key Control instance.
     */
    start: function ()
    {
        this.active = (this.camera !== null);

        return this;
    },

    /**
     * Stops this Key Control from running. Call `start` to start it again.
     *
     * @method Phaser.Cameras.Controls.SmoothedKeyControl#stop
     * @since 3.0.0
     *
     * @return {Phaser.Cameras.Controls.SmoothedKeyControl} This Key Control instance.
     */
    stop: function ()
    {
        this.active = false;

        return this;
    },

    /**
     * Binds this Key Control to a camera.
     *
     * @method Phaser.Cameras.Controls.SmoothedKeyControl#setCamera
     * @since 3.0.0
     *
     * @param {Phaser.Cameras.Scene2D.Camera} camera - The camera to bind this Key Control to.
     *
     * @return {Phaser.Cameras.Controls.SmoothedKeyControl} This Key Control instance.
     */
    setCamera: function (camera)
    {
        this.camera = camera;

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Cameras.Controls.SmoothedKeyControl#update
     * @since 3.0.0
     *
     * @param {[type]} delta - [description]
     */
    update: function (delta)
    {
        if (!this.active)
        {
            return;
        }

        if (delta === undefined) { delta = 1; }

        var cam = this.camera;

        //  Apply Deceleration

        if (this._speedX > 0)
        {
            this._speedX -= this.dragX * delta;

            if (this._speedX < 0)
            {
                this._speedX = 0;
            }
        }
        else if (this._speedX < 0)
        {
            this._speedX += this.dragX * delta;

            if (this._speedX > 0)
            {
                this._speedX = 0;
            }
        }

        if (this._speedY > 0)
        {
            this._speedY -= this.dragY * delta;

            if (this._speedY < 0)
            {
                this._speedY = 0;
            }
        }
        else if (this._speedY < 0)
        {
            this._speedY += this.dragY * delta;

            if (this._speedY > 0)
            {
                this._speedY = 0;
            }
        }

        //  Check for keys

        if (this.up && this.up.isDown)
        {
            this._speedY += this.accelY;

            if (this._speedY > this.maxSpeedY)
            {
                this._speedY = this.maxSpeedY;
            }
        }
        else if (this.down && this.down.isDown)
        {
            this._speedY -= this.accelY;

            if (this._speedY < -this.maxSpeedY)
            {
                this._speedY = -this.maxSpeedY;
            }
        }

        if (this.left && this.left.isDown)
        {
            this._speedX += this.accelX;

            if (this._speedX > this.maxSpeedX)
            {
                this._speedX = this.maxSpeedX;
            }
        }
        else if (this.right && this.right.isDown)
        {
            this._speedX -= this.accelX;

            if (this._speedX < -this.maxSpeedX)
            {
                this._speedX = -this.maxSpeedX;
            }
        }

        //  Camera zoom

        if (this.zoomIn && this.zoomIn.isDown)
        {
            this._zoom = -this.zoomSpeed;
        }
        else if (this.zoomOut && this.zoomOut.isDown)
        {
            this._zoom = this.zoomSpeed;
        }
        else
        {
            this._zoom = 0;
        }

        //  Apply to Camera

        if (this._speedX !== 0)
        {
            cam.scrollX -= ((this._speedX * delta) | 0);
        }

        if (this._speedY !== 0)
        {
            cam.scrollY -= ((this._speedY * delta) | 0);
        }

        if (this._zoom !== 0)
        {
            cam.zoom += this._zoom;

            if (cam.zoom < 0.1)
            {
                cam.zoom = 0.1;
            }
        }
    },

    /**
     * Destroys this Key Control.
     *
     * @method Phaser.Cameras.Controls.SmoothedKeyControl#destroy
     * @since 3.0.0
     */
    destroy: function ()
    {
        this.camera = null;

        this.left = null;
        this.right = null;
        this.up = null;
        this.down = null;

        this.zoomIn = null;
        this.zoomOut = null;
    }

});

module.exports = SmoothedKeyControl;
