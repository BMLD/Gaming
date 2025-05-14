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
export var Stats = /*#__PURE__*/ function() {
    "use strict";
    function Stats(parentElement) {
        _class_call_check(this, Stats);
        this.parentElement = parentElement;
        this.scoreElement = null;
        this.xpLevelElement = null; // For Level and XP display
        this.hungerElement = null; // For Hunger display
        this.thirstElement = null; // For Thirst display
        this.goldElement = null; // For Gold display
        this.silverElement = null; // For Silver display
        this.pauseMessageElement = null;
        this._createDOMElements();
    }
    _create_class(Stats, [
        {
            key: "_createDOMElements",
            value: function _createDOMElements() {
                this.scoreElement = this._createScoreElement();
                this.parentElement.appendChild(this.scoreElement);
                this.pauseMessageElement = this._createPauseMessageElement();
                this.parentElement.appendChild(this.pauseMessageElement);
                this.xpLevelElement = this._createXpLevelElement();
                this.parentElement.appendChild(this.xpLevelElement);
                this.hungerElement = this._createHungerElement();
                this.parentElement.appendChild(this.hungerElement);
                this.thirstElement = this._createThirstElement();
                this.parentElement.appendChild(this.thirstElement);
                this.goldElement = this._createGoldElement();
                this.parentElement.appendChild(this.goldElement);
                this.silverElement = this._createSilverElement();
                this.parentElement.appendChild(this.silverElement);
            }
        },
        {
            key: "_createScoreElement",
            value: function _createScoreElement() {
                var scoreElement = document.createElement('div');
                scoreElement.style.position = 'absolute';
                scoreElement.style.top = '10px';
                scoreElement.style.left = '10px';
                scoreElement.style.color = 'white';
                scoreElement.style.fontFamily = 'Arial, sans-serif';
                scoreElement.style.fontSize = '24px';
                scoreElement.style.textShadow = '1px 1px 2px black';
                scoreElement.innerHTML = 'Crystals: 0';
                return scoreElement;
            }
        },
        {
            key: "_createPauseMessageElement",
            value: function _createPauseMessageElement() {
                var pauseMessageElement = document.createElement('div');
                pauseMessageElement.style.position = 'absolute';
                pauseMessageElement.style.top = '50%';
                pauseMessageElement.style.left = '50%';
                pauseMessageElement.style.transform = 'translate(-50%, -50%)';
                pauseMessageElement.style.color = 'white';
                pauseMessageElement.style.fontFamily = 'Arial, sans-serif';
                pauseMessageElement.style.fontSize = '48px';
                pauseMessageElement.style.textShadow = '2px 2px 4px black';
                pauseMessageElement.style.display = 'none'; // Hidden by default
                pauseMessageElement.innerHTML = 'PAUSED';
                return pauseMessageElement;
            }
        },
        {
            key: "_createXpLevelElement",
            value: function _createXpLevelElement() {
                var xpLevelElement = document.createElement('div');
                xpLevelElement.style.position = 'absolute';
                xpLevelElement.style.top = '40px'; // Below score
                xpLevelElement.style.left = '10px';
                xpLevelElement.style.color = 'white';
                xpLevelElement.style.fontFamily = 'Arial, sans-serif';
                xpLevelElement.style.fontSize = '18px'; // Slightly smaller than score
                xpLevelElement.style.textShadow = '1px 1px 2px black';
                xpLevelElement.innerHTML = 'Level: 1 | XP: 0/100'; // Initial text
                return xpLevelElement;
            }
        },
        {
            key: "_createHungerElement",
            value: function _createHungerElement() {
                var hungerElement = document.createElement('div');
                hungerElement.style.position = 'absolute';
                hungerElement.style.top = '65px'; // Below XP/Level
                hungerElement.style.left = '10px';
                hungerElement.style.color = 'white';
                hungerElement.style.fontFamily = 'Arial, sans-serif';
                hungerElement.style.fontSize = '16px';
                hungerElement.style.textShadow = '1px 1px 2px black';
                hungerElement.innerHTML = 'Hunger: 100/100';
                return hungerElement;
            }
        },
        {
            key: "_createThirstElement",
            value: function _createThirstElement() {
                var thirstElement = document.createElement('div');
                thirstElement.style.position = 'absolute';
                thirstElement.style.top = '85px'; // Below Hunger
                thirstElement.style.left = '10px';
                thirstElement.style.color = 'white';
                thirstElement.style.fontFamily = 'Arial, sans-serif';
                thirstElement.style.fontSize = '16px';
                thirstElement.style.textShadow = '1px 1px 2px black';
                thirstElement.innerHTML = 'Thirst: 100/100';
                return thirstElement;
            }
        },
        {
            key: "_createGoldElement",
            value: function _createGoldElement() {
                var goldElement = document.createElement('div');
                goldElement.style.position = 'absolute';
                goldElement.style.top = '105px'; // Below Thirst
                goldElement.style.left = '10px';
                goldElement.style.color = 'gold';
                goldElement.style.fontFamily = 'Arial, sans-serif';
                goldElement.style.fontSize = '16px';
                goldElement.style.textShadow = '1px 1px 2px black';
                goldElement.innerHTML = 'Gold: 0';
                return goldElement;
            }
        },
        {
            key: "_createSilverElement",
            value: function _createSilverElement() {
                var silverElement = document.createElement('div');
                silverElement.style.position = 'absolute';
                silverElement.style.top = '125px'; // Below Gold
                silverElement.style.left = '10px';
                silverElement.style.color = 'silver';
                silverElement.style.fontFamily = 'Arial, sans-serif';
                silverElement.style.fontSize = '16px';
                silverElement.style.textShadow = '1px 1px 2px black';
                silverElement.innerHTML = 'Silver: 0';
                return silverElement;
            }
        },
        {
            key: "updateScore",
            value: function updateScore(score) {
                if (this.scoreElement) {
                    this.scoreElement.innerHTML = "Crystals: ".concat(score);
                }
            }
        },
        {
            key: "updateXPLevel",
            value: function updateXPLevel(level, currentXP, xpToNextLevel) {
                if (this.xpLevelElement) {
                    this.xpLevelElement.innerHTML = "Level: ".concat(level, " | XP: ").concat(currentXP, "/").concat(xpToNextLevel);
                }
            }
        },
        {
            key: "updateHungerThirstStats",
            value: function updateHungerThirstStats(hungerStats) {
                if (this.hungerElement) {
                    this.hungerElement.innerHTML = "Hunger: ".concat(Math.floor(hungerStats.currentHunger), "/").concat(hungerStats.maxHunger);
                }
                if (this.thirstElement) {
                    this.thirstElement.innerHTML = "Thirst: ".concat(Math.floor(hungerStats.currentThirst), "/").concat(hungerStats.maxThirst);
                }
            }
        },
        {
            key: "updateCurrencyStats",
            value: function updateCurrencyStats(currencyStats) {
                if (this.goldElement) {
                    this.goldElement.innerHTML = "Gold: ".concat(currencyStats.gold);
                }
                if (this.silverElement) {
                    this.silverElement.innerHTML = "Silver: ".concat(currencyStats.silver);
                }
            }
        },
        {
            key: "togglePauseMessage",
            value: function togglePauseMessage(isPaused) {
                if (this.pauseMessageElement) {
                    this.pauseMessageElement.style.display = isPaused ? 'block' : 'none';
                }
            }
        }
    ]);
    return Stats;
}();
