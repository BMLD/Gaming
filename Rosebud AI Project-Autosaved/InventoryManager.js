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
function _define_property(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}
function _object_spread(target) {
    for(var i = 1; i < arguments.length; i++){
        var source = arguments[i] != null ? arguments[i] : {};
        var ownKeys = Object.keys(source);
        if (typeof Object.getOwnPropertySymbols === "function") {
            ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
                return Object.getOwnPropertyDescriptor(source, sym).enumerable;
            }));
        }
        ownKeys.forEach(function(key) {
            _define_property(target, key, source[key]);
        });
    }
    return target;
}
function _object_without_properties(source, excluded) {
    if (source == null) return {};
    var target = _object_without_properties_loose(source, excluded);
    var key, i;
    if (Object.getOwnPropertySymbols) {
        var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
        for(i = 0; i < sourceSymbolKeys.length; i++){
            key = sourceSymbolKeys[i];
            if (excluded.indexOf(key) >= 0) continue;
            if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
            target[key] = source[key];
        }
    }
    return target;
}
function _object_without_properties_loose(source, excluded) {
    if (source == null) return {};
    var target = {};
    var sourceKeys = Object.keys(source);
    var key, i;
    for(i = 0; i < sourceKeys.length; i++){
        key = sourceKeys[i];
        if (excluded.indexOf(key) >= 0) continue;
        target[key] = source[key];
    }
    return target;
}
export var InventoryManager = /*#__PURE__*/ function() {
    "use strict";
    function InventoryManager(parentElement, audioManager, gameInstance) {
        _class_call_check(this, InventoryManager);
        this.parentElement = parentElement;
        this.audioManager = audioManager; // For potential UI sounds
        this.game = gameInstance; // Store the game instance
        this.inventoryPanel = null;
        this.itemsContainer = null; // To hold all item entries
        this.isVisible = false;
        this.items = {}; // Will store items like { name: { quantity, type, icon, ... } }
        this._createDOMElements();
    }
    _create_class(InventoryManager, [
        {
            key: "_createDOMElements",
            value: function _createDOMElements() {
                this.inventoryPanel = document.createElement('div');
                this.inventoryPanel.style.position = 'absolute';
                this.inventoryPanel.style.top = '50%';
                this.inventoryPanel.style.left = '50%';
                this.inventoryPanel.style.transform = 'translate(-50%, -50%)';
                this.inventoryPanel.style.width = '350px'; // Slightly wider for icons
                this.inventoryPanel.style.padding = '20px';
                this.inventoryPanel.style.backgroundColor = 'rgba(0, 0, 0, 0.88)';
                this.inventoryPanel.style.color = 'white';
                this.inventoryPanel.style.fontFamily = 'Arial, sans-serif';
                this.inventoryPanel.style.borderRadius = '10px';
                this.inventoryPanel.style.border = '2px solid #777';
                this.inventoryPanel.style.boxSizing = 'border-box';
                this.inventoryPanel.style.display = 'none'; // Hidden by default
                this.inventoryPanel.style.zIndex = '150';
                this.inventoryPanel.style.textAlign = 'left'; // Align item text to left
                var title = document.createElement('h2');
                title.textContent = 'Inventory';
                title.style.marginTop = '0';
                title.style.marginBottom = '15px';
                title.style.color = '#FFD700';
                title.style.textAlign = 'center';
                this.itemsContainer = document.createElement('div');
                this.itemsContainer.style.maxHeight = '200px'; // Prevent overly long list
                this.itemsContainer.style.overflowY = 'auto';
                var closeHint = document.createElement('p');
                closeHint.textContent = 'Press [I] to close';
                closeHint.style.fontSize = '14px';
                closeHint.style.color = '#aaa';
                closeHint.style.marginTop = '20px';
                closeHint.style.textAlign = 'center';
                this.inventoryPanel.appendChild(title);
                this.inventoryPanel.appendChild(this.itemsContainer);
                this.inventoryPanel.appendChild(closeHint);
                document.body.appendChild(this.inventoryPanel);
                this._renderInventoryItems(); // Initial render
            }
        },
        {
            key: "_renderInventoryItems",
            value: function _renderInventoryItems() {
                var _this = this;
                if (!this.itemsContainer) return;
                this.itemsContainer.innerHTML = ''; // Clear previous items
                if (Object.keys(this.items).length === 0) {
                    var emptyMessage = document.createElement('p');
                    emptyMessage.textContent = 'Your inventory is empty.';
                    emptyMessage.style.color = '#888';
                    emptyMessage.style.textAlign = 'center';
                    this.itemsContainer.appendChild(emptyMessage);
                    return;
                }
                Object.values(this.items).forEach(function(item) {
                    var itemDiv = document.createElement('div');
                    itemDiv.style.display = 'flex';
                    itemDiv.style.alignItems = 'center';
                    itemDiv.style.marginBottom = '10px';
                    itemDiv.style.padding = '5px';
                    itemDiv.style.borderBottom = '1px solid #444';
                    var iconPlaceholder = document.createElement('div');
                    iconPlaceholder.style.width = '32px';
                    iconPlaceholder.style.height = '32px';
                    iconPlaceholder.style.backgroundColor = '#555'; // Placeholder color
                    iconPlaceholder.style.marginRight = '10px';
                    iconPlaceholder.style.borderRadius = '4px';
                    // if (item.icon) { iconPlaceholder.style.backgroundImage = `url(${item.icon})`; }
                    var itemText = document.createElement('span');
                    itemText.textContent = "".concat(item.name, ": ").concat(item.quantity, " (").concat(item.type, ")");
                    itemText.style.fontSize = '16px';
                    itemDiv.appendChild(iconPlaceholder);
                    itemDiv.appendChild(itemText);
                    if (item.type === 'food') {
                        var eatButton = document.createElement('button');
                        eatButton.textContent = 'Eat';
                        eatButton.style.marginLeft = '10px';
                        eatButton.style.padding = '3px 8px';
                        eatButton.style.fontSize = '14px';
                        eatButton.style.backgroundColor = '#4CAF50'; // Green
                        eatButton.style.color = 'white';
                        eatButton.style.border = 'none';
                        eatButton.style.borderRadius = '3px';
                        eatButton.style.cursor = 'pointer';
                        eatButton.onclick = function() {
                            return _this._handleEatItem(item);
                        };
                        itemDiv.appendChild(eatButton);
                    }
                    _this.itemsContainer.appendChild(itemDiv);
                });
            }
        },
        {
            key: "_handleEatItem",
            value: function _handleEatItem(item) {
                console.log("Attempting to eat ".concat(item.name));
                if (!this.game || !this.game.player) {
                    console.warn("InventoryManager: Player reference not found, cannot consume item.");
                    return;
                }
            // Future: Call player.consumeFoodItem(item.name) or similar
            // Future: Decrement quantity or remove item
            // Future: Play sound
            // Future: this._renderInventoryItems();
            }
        },
        {
            key: "addItem",
            value: function addItem(itemData) {
                var name = itemData.name, quantity = itemData.quantity, type = itemData.type, otherProps = _object_without_properties(itemData, [
                    "name",
                    "quantity",
                    "type"
                ]);
                if (this.items[name]) {
                    this.items[name].quantity += quantity;
                } else {
                    this.items[name] = _object_spread({
                        name: name,
                        quantity: quantity,
                        type: type
                    }, otherProps);
                }
                this._renderInventoryItems();
            }
        },
        {
            key: "toggleInventory",
            value: function toggleInventory() {
                this.isVisible = !this.isVisible;
                if (this.isVisible) {
                    this._renderInventoryItems(); // Ensure it's up-to-date when opening
                    this.inventoryPanel.style.display = 'block';
                    if (this.audioManager) this.audioManager.playSound('dialogue_click');
                } else {
                    this.inventoryPanel.style.display = 'none';
                    if (this.audioManager) this.audioManager.playSound('dialogue_click');
                }
                return this.isVisible;
            }
        },
        {
            key: "isInventoryVisible",
            value: function isInventoryVisible() {
                return this.isVisible;
            }
        }
    ]);
    return InventoryManager;
}();
