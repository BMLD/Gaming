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
import * as THREE from 'three';
export var ScreenFader = /*#__PURE__*/ function() {
    "use strict";
    function ScreenFader(parentElement) {
        _class_call_check(this, ScreenFader);
        this.parentElement = parentElement || document.body;
        this.fadeElement = null;
        this.isFading = false;
        this._createFadeElement();
    }
    _create_class(ScreenFader, [
        {
            key: "_createFadeElement",
            value: function _createFadeElement() {
                this.fadeElement = document.createElement('div');
                this.fadeElement.style.position = 'fixed';
                this.fadeElement.style.top = '0';
                this.fadeElement.style.left = '0';
                this.fadeElement.style.width = '100%';
                this.fadeElement.style.height = '100%';
                this.fadeElement.style.backgroundColor = 'black';
                this.fadeElement.style.opacity = '0';
                this.fadeElement.style.zIndex = '999'; // Above most UI, below critical popups if any
                this.fadeElement.style.pointerEvents = 'none'; // Initially allow clicks through
                this.fadeElement.style.transition = 'opacity 0.5s ease-in-out';
                this.parentElement.appendChild(this.fadeElement);
            }
        },
        {
            key: "fadeOut",
            value: function fadeOut() {
                var _this = this;
                var duration = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 500, onComplete = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : null;
                if (this.isFading) return Promise.reject("Already fading");
                this.isFading = true;
                this.fadeElement.style.pointerEvents = 'auto'; // Block clicks during fade
                this.fadeElement.style.transition = "opacity ".concat(duration / 1000, "s ease-in-out");
                this.fadeElement.style.opacity = '1';
                return new Promise(function(resolve) {
                    setTimeout(function() {
                        if (onComplete) onComplete();
                        _this.isFading = false;
                        resolve();
                    }, duration);
                });
            }
        },
        {
            key: "fadeIn",
            value: function fadeIn() {
                var _this = this;
                var duration = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 500, onComplete = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : null;
                if (this.isFading && this.fadeElement.style.opacity === '0') {
                // If it was fading out but now needs to fade in (e.g. quick transition)
                // This case might need more robust handling if complex sequences are expected.
                // For now, we assume fadeIn is called after a fadeOut or when screen is black.
                }
                this.isFading = true;
                // Opacity is already 1 from fadeOut, so we transition to 0
                this.fadeElement.style.transition = "opacity ".concat(duration / 1000, "s ease-in-out");
                this.fadeElement.style.opacity = '0';
                return new Promise(function(resolve) {
                    setTimeout(function() {
                        _this.fadeElement.style.pointerEvents = 'none'; // Allow clicks again
                        if (onComplete) onComplete();
                        _this.isFading = false;
                        resolve();
                    }, duration);
                });
            }
        },
        {
            key: "dispose",
            value: function dispose() {
                if (this.fadeElement && this.fadeElement.parentElement) {
                    this.fadeElement.parentElement.removeChild(this.fadeElement);
                }
                this.fadeElement = null;
            }
        }
    ]);
    return ScreenFader;
}();
