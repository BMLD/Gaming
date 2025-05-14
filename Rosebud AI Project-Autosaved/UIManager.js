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
import { ScreenFader } from './ScreenFader.js'; // Import ScreenFader
export var UIManager = /*#__PURE__*/ function() {
    "use strict";
    function UIManager(parentElement) {
        _class_call_check(this, UIManager);
        this.parentElement = parentElement || document.body;
        this.interactionPromptElement = null;
        this.notificationElement = null; // For quest updates etc.
        this.notificationTimeout = null; // To clear existing notification timeouts
        this.screenFader = new ScreenFader(this.parentElement); // Initialize ScreenFader
        this._createInteractionPromptElement();
        this._createNotificationElement();
    }
    _create_class(UIManager, [
        {
            key: "_createInteractionPromptElement",
            value: function _createInteractionPromptElement() {
                this.interactionPromptElement = document.createElement('div');
                this.interactionPromptElement.style.position = 'absolute';
                this.interactionPromptElement.style.bottom = '20px';
                this.interactionPromptElement.style.left = '50%';
                this.interactionPromptElement.style.transform = 'translateX(-50%)';
                this.interactionPromptElement.style.padding = '10px 20px';
                this.interactionPromptElement.style.backgroundColor = 'rgba(0,0,0,0.7)';
                this.interactionPromptElement.style.color = 'white';
                this.interactionPromptElement.style.fontFamily = 'Arial, sans-serif';
                this.interactionPromptElement.style.fontSize = '18px';
                this.interactionPromptElement.style.borderRadius = '5px';
                this.interactionPromptElement.style.display = 'none'; // Hidden by default
                this.interactionPromptElement.style.zIndex = '90'; // Below dialogue box
                this.parentElement.appendChild(this.interactionPromptElement);
            }
        },
        {
            key: "showInteractionPrompt",
            value: function showInteractionPrompt(message) {
                if (this.interactionPromptElement) {
                    this.interactionPromptElement.innerHTML = message; // Display the provided message
                    this.interactionPromptElement.style.display = 'block';
                }
            }
        },
        {
            key: "hideInteractionPrompt",
            value: function hideInteractionPrompt() {
                if (this.interactionPromptElement) {
                    this.interactionPromptElement.style.display = 'none';
                }
            }
        },
        {
            key: "_createNotificationElement",
            value: function _createNotificationElement() {
                this.notificationElement = document.createElement('div');
                this.notificationElement.style.position = 'fixed'; // Use fixed to stay in viewport
                this.notificationElement.style.top = '20px';
                this.notificationElement.style.left = '50%';
                this.notificationElement.style.transform = 'translateX(-50%)';
                this.notificationElement.style.padding = '12px 25px';
                this.notificationElement.style.backgroundColor = 'rgba(30, 100, 200, 0.9)'; // A distinct blue
                this.notificationElement.style.color = 'white';
                this.notificationElement.style.fontFamily = 'Arial, sans-serif';
                this.notificationElement.style.fontSize = '18px';
                this.notificationElement.style.fontWeight = 'bold';
                this.notificationElement.style.borderRadius = '8px';
                this.notificationElement.style.boxShadow = '0 2px 10px rgba(0,0,0,0.3)';
                this.notificationElement.style.zIndex = '200'; // Above most other UI
                this.notificationElement.style.display = 'none'; // Hidden by default
                this.notificationElement.style.opacity = '0';
                this.notificationElement.style.transition = 'opacity 0.5s ease-in-out';
                this.parentElement.appendChild(this.notificationElement);
            }
        },
        {
            key: "showNotification",
            value: function showNotification(message) {
                var _this = this;
                var duration = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 3000;
                if (!this.notificationElement) return;
                // Clear any existing timeout to prevent premature hiding
                if (this.notificationTimeout) {
                    clearTimeout(this.notificationTimeout);
                }
                this.notificationElement.textContent = message;
                this.notificationElement.style.display = 'block';
                // Force reflow to ensure transition plays
                void this.notificationElement.offsetHeight;
                this.notificationElement.style.opacity = '1';
                this.notificationTimeout = setTimeout(function() {
                    _this.notificationElement.style.opacity = '0';
                    // Wait for fade out transition to complete before hiding
                    setTimeout(function() {
                        if (_this.notificationElement.style.opacity === '0') {
                            _this.notificationElement.style.display = 'none';
                        }
                    }, 500); // Matches transition duration
                }, duration);
            }
        },
        {
            // Screen fade methods, delegated to ScreenFader
            key: "fadeOutScreen",
            value: function fadeOutScreen() {
                var duration = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 500, onComplete = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : null;
                return this.screenFader.fadeOut(duration, onComplete);
            }
        },
        {
            key: "fadeInScreen",
            value: function fadeInScreen() {
                var duration = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 500, onComplete = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : null;
                return this.screenFader.fadeIn(duration, onComplete);
            }
        },
        {
            key: "dispose",
            value: function dispose() {
                if (this.screenFader) {
                    this.screenFader.dispose();
                }
                // Dispose other elements if necessary
                if (this.interactionPromptElement && this.interactionPromptElement.parentElement) {
                    this.interactionPromptElement.parentElement.removeChild(this.interactionPromptElement);
                }
                if (this.notificationElement && this.notificationElement.parentElement) {
                    this.notificationElement.parentElement.removeChild(this.notificationElement);
                }
            }
        }
    ]);
    return UIManager;
}();
