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
export var GameOverManager = /*#__PURE__*/ function() {
    "use strict";
    function GameOverManager(parentElement) {
        _class_call_check(this, GameOverManager);
        this.parentElement = parentElement || document.body;
        this.gameOverElement = null;
        this.isGameOver = false;
        this._createDOMElements();
    }
    _create_class(GameOverManager, [
        {
            key: "_createDOMElements",
            value: function _createDOMElements() {
                this.gameOverElement = document.createElement('div');
                this.gameOverElement.style.position = 'absolute';
                this.gameOverElement.style.top = '50%';
                this.gameOverElement.style.left = '50%';
                this.gameOverElement.style.transform = 'translate(-50%, -50%)';
                this.gameOverElement.style.padding = '30px';
                this.gameOverElement.style.backgroundColor = 'rgba(150, 0, 0, 0.85)'; // Dark red
                this.gameOverElement.style.color = 'white';
                this.gameOverElement.style.fontFamily = '"Arial Black", Gadget, sans-serif';
                this.gameOverElement.style.fontSize = '48px';
                this.gameOverElement.style.fontWeight = 'bold';
                this.gameOverElement.style.textAlign = 'center';
                this.gameOverElement.style.borderRadius = '15px';
                this.gameOverElement.style.border = '3px solid #500000';
                this.gameOverElement.style.textShadow = '2px 2px 4px black';
                this.gameOverElement.style.display = 'none'; // Hidden by default
                this.gameOverElement.style.zIndex = '200'; // On top of most things
                this.gameOverElement.innerHTML = 'GAME OVER';
                var restartMessage = document.createElement('p');
                restartMessage.textContent = 'Refresh to try again!';
                restartMessage.style.fontSize = '20px';
                restartMessage.style.marginTop = '20px';
                restartMessage.style.color = '#ffdddd';
                this.gameOverElement.appendChild(restartMessage);
                this.parentElement.appendChild(this.gameOverElement);
            }
        },
        {
            key: "showGameOverScreen",
            value: function showGameOverScreen() {
                this.isGameOver = true;
                if (this.gameOverElement) {
                    this.gameOverElement.style.display = 'block';
                }
            }
        },
        {
            key: "hideGameOverScreen",
            value: function hideGameOverScreen() {
                // Typically not hidden once shown, but good to have
                this.isGameOver = false;
                if (this.gameOverElement) {
                    this.gameOverElement.style.display = 'none';
                }
            }
        },
        {
            key: "checkGameOverState",
            value: function checkGameOverState() {
                return this.isGameOver;
            }
        }
    ]);
    return GameOverManager;
}();
