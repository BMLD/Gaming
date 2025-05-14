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
export var InputController = /*#__PURE__*/ function() {
    "use strict";
    function InputController() {
        _class_call_check(this, InputController);
        this.keys = {}; // Stores state like { KeyW: true, KeyA: false }
        this._initKeyboardEventListeners();
    }
    _create_class(InputController, [
        {
            key: "_initKeyboardEventListeners",
            value: function _initKeyboardEventListeners() {
                var _this = this;
                document.addEventListener('keydown', function(event) {
                    _this.keys[event.code] = true;
                });
                document.addEventListener('keyup', function(event) {
                    _this.keys[event.code] = false;
                });
            }
        },
        {
            // Method for touch controls to update key states
            key: "setKeyState",
            value: function setKeyState(keyCode, isPressed) {
                this.keys[keyCode] = isPressed;
            }
        }
    ]);
    return InputController;
}();
