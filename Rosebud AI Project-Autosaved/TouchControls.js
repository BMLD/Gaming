function _class_call_check(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
    }
}
function _create_class(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
}
export var TouchControls = /*#__PURE__*/ function() {
    "use strict";
    function TouchControls(inputController) {
        var parentElement = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : document.body;
        _class_call_check(this, TouchControls);
        this.inputController = inputController;
        this.parentElement = parentElement;
        this.joystickActive = false;
        this.joystickBase = null;
        this.joystickStick = null;
        this.interactButton = null;
        this.jumpButton = null; // For jump action
        this.joystickRadius = 50; // px
        this.stickRadius = 25; // px
        this.buttonSize = 70; // px
        this.joystickBasePos = {
            x: 0,
            y: 0
        };
        this.joystickCurrentPos = {
            x: 0,
            y: 0
        };
        this._createDOMElements();
        this._addEventListeners();
    }
    _create_class(TouchControls, [
        {
            key: "_createDOMElements",
            value: function _createDOMElements() {
                // Joystick Base
                this.joystickBase = document.createElement('div');
                this.joystickBase.style.position = 'absolute';
                this.joystickBase.style.width = "".concat(this.joystickRadius * 2, "px");
                this.joystickBase.style.height = "".concat(this.joystickRadius * 2, "px");
                this.joystickBase.style.borderRadius = '50%';
                this.joystickBase.style.backgroundColor = 'rgba(128, 128, 128, 0.3)';
                this.joystickBase.style.left = '80px'; // Initial position
                this.joystickBase.style.bottom = '80px';
                this.joystickBase.style.zIndex = '200';
                this.parentElement.appendChild(this.joystickBase);
                // Joystick Stick
                this.joystickStick = document.createElement('div');
                this.joystickStick.style.position = 'absolute';
                this.joystickStick.style.width = "".concat(this.stickRadius * 2, "px");
                this.joystickStick.style.height = "".concat(this.stickRadius * 2, "px");
                this.joystickStick.style.borderRadius = '50%';
                this.joystickStick.style.backgroundColor = 'rgba(100, 100, 100, 0.7)';
                this.joystickStick.style.left = "".concat(this.joystickRadius - this.stickRadius, "px"); // Centered in base
                this.joystickStick.style.top = "".concat(this.joystickRadius - this.stickRadius, "px"); // Centered in base
                this.joystickBase.appendChild(this.joystickStick);
                // Interact Button
                this.interactButton = document.createElement('div');
                this.interactButton.style.position = 'absolute';
                this.interactButton.style.width = "".concat(this.buttonSize, "px");
                this.interactButton.style.height = "".concat(this.buttonSize, "px");
                this.interactButton.style.borderRadius = '50%';
                this.interactButton.style.backgroundColor = 'rgba(100, 100, 200, 0.5)';
                this.interactButton.style.right = '80px';
                this.interactButton.style.bottom = '80px';
                this.interactButton.style.display = 'flex';
                this.interactButton.style.alignItems = 'center';
                this.interactButton.style.justifyContent = 'center';
                this.interactButton.style.color = 'white';
                this.interactButton.style.fontSize = '18px';
                this.interactButton.style.fontWeight = 'bold';
                this.interactButton.style.zIndex = '200';
                this.interactButton.textContent = 'E'; // Simulate 'E' key
                this.parentElement.appendChild(this.interactButton);
                // Jump Button
                this.jumpButton = document.createElement('div');
                this.jumpButton.style.position = 'absolute';
                this.jumpButton.style.width = "".concat(this.buttonSize, "px");
                this.jumpButton.style.height = "".concat(this.buttonSize, "px");
                this.jumpButton.style.borderRadius = '50%';
                this.jumpButton.style.backgroundColor = 'rgba(200, 100, 100, 0.5)'; // Different color
                this.jumpButton.style.right = '80px'; // Align with interact button
                this.jumpButton.style.bottom = "".concat(80 + this.buttonSize + 20, "px"); // Position above interact button
                this.jumpButton.style.display = 'flex';
                this.jumpButton.style.alignItems = 'center';
                this.jumpButton.style.justifyContent = 'center';
                this.jumpButton.style.color = 'white';
                this.jumpButton.style.fontSize = '16px'; // Slightly smaller text
                this.jumpButton.style.fontWeight = 'bold';
                this.jumpButton.style.zIndex = '200';
                this.jumpButton.textContent = 'JUMP'; // Simulate 'Shift' key for jump
                this.parentElement.appendChild(this.jumpButton);
                this.joystickBasePos = {
                    x: this.joystickBase.offsetLeft + this.joystickRadius,
                    y: this.joystickBase.offsetTop + this.joystickRadius
                };
            }
        },
        {
            key: "_addEventListeners",
            value: function _addEventListeners() {
                // Joystick listeners
                this.joystickBase.addEventListener('touchstart', this._handleJoystickStart.bind(this), {
                    passive: false
                });
                this.joystickBase.addEventListener('touchmove', this._handleJoystickMove.bind(this), {
                    passive: false
                });
                this.joystickBase.addEventListener('touchend', this._handleJoystickEnd.bind(this));
                this.joystickBase.addEventListener('touchcancel', this._handleJoystickEnd.bind(this));
                // Interact button listeners
                this.interactButton.addEventListener('touchstart', this._handleInteractPress.bind(this), {
                    passive: false
                });
                this.interactButton.addEventListener('touchend', this._handleInteractRelease.bind(this));
                this.interactButton.addEventListener('touchcancel', this._handleInteractRelease.bind(this));
                // Jump button listeners
                this.jumpButton.addEventListener('touchstart', this._handleJumpPress.bind(this), {
                    passive: false
                });
                this.jumpButton.addEventListener('touchend', this._handleJumpRelease.bind(this));
                this.jumpButton.addEventListener('touchcancel', this._handleJumpRelease.bind(this));
            }
        },
        {
            key: "_handleJoystickStart",
            value: function _handleJoystickStart(event) {
                event.preventDefault();
                this.joystickActive = true;
                this.joystickStick.style.backgroundColor = 'rgba(80, 80, 80, 0.9)';
                this._updateJoystick(event.touches[0]);
            }
        },
        {
            key: "_handleJoystickMove",
            value: function _handleJoystickMove(event) {
                event.preventDefault();
                if (!this.joystickActive) return;
                this._updateJoystick(event.touches[0]);
            }
        },
        {
            key: "_handleJoystickEnd",
            value: function _handleJoystickEnd() {
                this.joystickActive = false;
                this.joystickStick.style.left = "".concat(this.joystickRadius - this.stickRadius, "px");
                this.joystickStick.style.top = "".concat(this.joystickRadius - this.stickRadius, "px");
                this.joystickStick.style.backgroundColor = 'rgba(100, 100, 100, 0.7)';
                this._resetJoystickInputs();
            }
        },
        {
            key: "_updateJoystick",
            value: function _updateJoystick(touch) {
                var rect = this.joystickBase.getBoundingClientRect();
                this.joystickBasePos = {
                    x: rect.left + this.joystickRadius,
                    y: rect.top + this.joystickRadius
                };
                var dx = touch.clientX - this.joystickBasePos.x;
                var dy = touch.clientY - this.joystickBasePos.y;
                var distance = Math.sqrt(dx * dx + dy * dy);
                if (distance > this.joystickRadius) {
                    dx = dx / distance * this.joystickRadius;
                    dy = dy / distance * this.joystickRadius;
                }
                this.joystickStick.style.left = "".concat(this.joystickRadius - this.stickRadius + dx, "px");
                this.joystickStick.style.top = "".concat(this.joystickRadius - this.stickRadius + dy, "px");
                this.joystickCurrentPos = {
                    x: dx,
                    y: dy
                };
                this._updateInputController();
            }
        },
        {
            key: "_resetJoystickInputs",
            value: function _resetJoystickInputs() {
                this.inputController.setKeyState('KeyW', false);
                this.inputController.setKeyState('KeyS', false);
                this.inputController.setKeyState('KeyA', false);
                this.inputController.setKeyState('KeyD', false);
                this.joystickCurrentPos = {
                    x: 0,
                    y: 0
                };
            }
        },
        {
            key: "_updateInputController",
            value: function _updateInputController() {
                var _this_joystickCurrentPos = this.joystickCurrentPos, x = _this_joystickCurrentPos.x, y = _this_joystickCurrentPos.y;
                var threshold = this.joystickRadius * 0.2; // 20% of joystick radius to activate
                // Forward/Backward (Y-axis)
                this.inputController.setKeyState('KeyW', y < -threshold);
                this.inputController.setKeyState('KeyS', y > threshold);
                // Left/Right (X-axis for turning)
                this.inputController.setKeyState('KeyA', x < -threshold); // Left turn
                this.inputController.setKeyState('KeyD', x > threshold); // Right turn
            }
        },
        {
            key: "_handleInteractPress",
            value: function _handleInteractPress(event) {
                event.preventDefault();
                this.inputController.setKeyState('KeyE', true);
                this.interactButton.style.backgroundColor = 'rgba(80, 80, 180, 0.8)';
            }
        },
        {
            key: "_handleInteractRelease",
            value: function _handleInteractRelease() {
                this.inputController.setKeyState('KeyE', false);
                this.interactButton.style.backgroundColor = 'rgba(100, 100, 200, 0.5)';
            }
        },
        {
            key: "_handleJumpPress",
            value: function _handleJumpPress(event) {
                event.preventDefault();
                this.inputController.setKeyState('ShiftLeft', true); // Player.js checks for ShiftLeft or ShiftRight
                this.jumpButton.style.backgroundColor = 'rgba(180, 80, 80, 0.8)'; // Darker when pressed
            }
        },
        {
            key: "_handleJumpRelease",
            value: function _handleJumpRelease() {
                this.inputController.setKeyState('ShiftLeft', false);
                this.jumpButton.style.backgroundColor = 'rgba(200, 100, 100, 0.5)'; // Back to normal
            }
        },
        {
            // Call this on window resize if joystick/button positions are relative to viewport size
            key: "onWindowResize",
            value: function onWindowResize() {
                // Re-calculate joystickBasePos if its positioning is dynamic (e.g., percentage-based)
                // For fixed pixel positions like current setup, this might not be strictly necessary
                // unless the parentElement itself resizes in a way that affects offsetLeft/Top.
                var rect = this.joystickBase.getBoundingClientRect();
                this.joystickBasePos = {
                    x: rect.left + this.joystickRadius,
                    y: rect.top + this.joystickRadius
                };
            // Note: If jumpButton or interactButton positions were percentage-based,
            // they would also need updating here. Current fixed pixel values are robust to resize.
            }
        }
    ]);
    return TouchControls;
}();
