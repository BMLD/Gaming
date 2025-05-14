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
export var DialogueManager = /*#__PURE__*/ function() {
    "use strict";
    function DialogueManager(parentElement, audioManager) {
        _class_call_check(this, DialogueManager);
        this.parentElement = parentElement; // Could be renderDiv or document.body
        this.audioManager = audioManager;
        this.dialogueBox = null;
        this.npcNameElement = null;
        this.dialogueTextElement = null;
        this.isActive = false;
        this.currentLines = [];
        this.currentLineIndex = 0;
        this.currentNpcName = "";
        this._createDOMElements();
    }
    _create_class(DialogueManager, [
        {
            key: "_createDOMElements",
            value: function _createDOMElements() {
                this.dialogueBox = document.createElement('div');
                this.dialogueBox.style.position = 'absolute';
                this.dialogueBox.style.bottom = '10%';
                this.dialogueBox.style.left = '50%';
                this.dialogueBox.style.transform = 'translateX(-50%)';
                this.dialogueBox.style.width = '70%';
                this.dialogueBox.style.maxWidth = '600px';
                this.dialogueBox.style.padding = '20px';
                this.dialogueBox.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
                this.dialogueBox.style.color = 'white';
                this.dialogueBox.style.fontFamily = 'Arial, sans-serif';
                this.dialogueBox.style.borderRadius = '10px';
                this.dialogueBox.style.border = '2px solid #555';
                this.dialogueBox.style.boxSizing = 'border-box';
                this.dialogueBox.style.display = 'none'; // Hidden by default
                this.dialogueBox.style.zIndex = '100'; // Ensure it's on top
                this.npcNameElement = document.createElement('h3');
                this.npcNameElement.style.margin = '0 0 10px 0';
                this.npcNameElement.style.fontSize = '20px';
                this.npcNameElement.style.color = '#FFD700'; // Gold color for name
                this.dialogueTextElement = document.createElement('p');
                this.dialogueTextElement.style.margin = '0';
                this.dialogueTextElement.style.fontSize = '16px';
                this.dialogueTextElement.style.lineHeight = '1.5';
                this.dialogueBox.appendChild(this.npcNameElement);
                this.dialogueBox.appendChild(this.dialogueTextElement);
                // Append to document.body to ensure it overlays the canvas correctly
                document.body.appendChild(this.dialogueBox);
            }
        },
        {
            key: "startDialogue",
            value: function startDialogue(npcName, lines) {
                if (!lines || lines.length === 0) return;
                this.isActive = true;
                this.currentNpcName = npcName;
                this.currentLines = lines;
                this.currentLineIndex = 0;
                this._displayCurrentLine();
                this.dialogueBox.style.display = 'block';
            }
        },
        {
            key: "_displayCurrentLine",
            value: function _displayCurrentLine() {
                if (this.currentLineIndex < this.currentLines.length) {
                    this.npcNameElement.textContent = this.currentNpcName;
                    this.dialogueTextElement.textContent = this.currentLines[this.currentLineIndex];
                }
            }
        },
        {
            key: "advanceDialogue",
            value: function advanceDialogue() {
                if (!this.isActive) return;
                this.currentLineIndex++;
                if (this.currentLineIndex < this.currentLines.length) {
                    this._displayCurrentLine();
                } else {
                    this.endDialogue();
                }
                if (this.audioManager) {
                    this.audioManager.playSound('dialogue_click');
                }
            }
        },
        {
            key: "endDialogue",
            value: function endDialogue() {
                this.isActive = false;
                this.dialogueBox.style.display = 'none';
                this.currentLines = [];
                this.currentNpcName = "";
            }
        },
        {
            key: "isDialogueActive",
            value: function isDialogueActive() {
                return this.isActive;
            }
        }
    ]);
    return DialogueManager;
}();
