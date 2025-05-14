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
function _instanceof(left, right) {
    if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) {
        return !!right[Symbol.hasInstance](left);
    } else {
        return left instanceof right;
    }
}
import * as THREE from 'three';
import { Projectile } from './Projectile.js'; // Import Projectile
import { PirateModel } from './PirateModel.js'; // Import the PirateModel
import { Tavern } from './Tavern.js'; // Import Tavern
var PLAYER_SPEED = 5.0;
var PLAYER_ROTATION_SPEED = 2.5;
var CAMERA_OFFSET = new THREE.Vector3(0, 4, 10); // Adjusted Y and Z for a closer, slightly lower angle
var CAMERA_LOOKAT_OFFSET = new THREE.Vector3(0, 1.1, 0); // Adjusted to aim more at the model's upper body/head
var SHOOT_COOLDOWN = 0.5; // seconds
// Player Stats Constants
var MAX_HUNGER = 100;
var MAX_THIRST = 100;
var HUNGER_DECAY_RATE = 0.5; // points per second
var THIRST_DECAY_RATE = 0.75; // points per second
export var Player = /*#__PURE__*/ function() {
    "use strict";
    function Player(scene, camera, inputController, world, dialogueManager, audioManager, uiManager, questManager, game) {
        _class_call_check(this, Player);
        this.scene = scene;
        this.camera = camera;
        this.inputController = inputController;
        this.world = world;
        this.dialogueManager = dialogueManager;
        this.audioManager = audioManager;
        this.uiManager = uiManager;
        this.questManager = questManager; // Store questManager
        this.game = game; // Store game reference for adding projectiles
        this.collectibles = world.getCollectibles();
        this.questItems = world.getQuestItems(); // Get quest items from the world
        this.enemies = world.getEnemies ? world.getEnemies() : []; // Get enemies from world
        this.collectedCount = 0;
        this.lastShotTime = 0;
        this.isWalking = false;
        this.canControl = true; // Player can be controlled by default
        // XP and Leveling
        this.level = 1;
        this.xp = 0;
        this.xpToNextLevel = 100; // XP needed for level 2
        // Hunger and Thirst
        this.maxHunger = MAX_HUNGER;
        this.hunger = MAX_HUNGER;
        this.maxThirst = MAX_THIRST;
        this.thirst = MAX_THIRST;
        this.hasMysteriousCoin = false; // Player doesn't start with the coin
        // Currency
        this.gold = 0;
        this.silver = 0;
        // Jump mechanics
        this.isJumping = false;
        this.jumpVelocity = 8.0;
        this.gravity = -25.0; // Acceleration due to gravity
        // Replace capsule with PirateModel
        this.mesh = new PirateModel(); // This is a THREE.Group
        this.mesh.castShadow = true; // Already handled in PirateModel, but good for clarity
        // The PirateModel's lowest point (feet) is at y = -0.7 relative to its own origin.
        // We want the feet on the ground (y=0).
        // The Player's mesh position tracks the *center* of the conceptual player.
        // Let's set the player's base height (where feet touch ground) to be 0.7.
        // So, the mesh's y position will be 0.7.
        this.mesh.position.set(0, 0.7, 0);
        this.scene.add(this.mesh);
        this.velocity = new THREE.Vector3(); // For XZ movement and Y for jump/gravity
        this.rotation = new THREE.Euler(0, 0, 0, 'YXZ');
        // Adjust collider size to roughly match the pirate model.
        // Pirate model is about 2.3 units tall. Centered around y ~ 0.7 + (2.3/2 - 0.7) = 0.7 + (1.15 - 0.7) = 0.7 + 0.45 = 1.15
        // Let's make the collider a sphere centered slightly higher and with a radius that covers most of it.
        // Radius of ~1.0, centered at y = 1.0 (relative to mesh.position which is at 0.7) -> world y = 1.7
        // For simplicity, keep collider centered on mesh.position, but adjust radius.
        // Pirate width is ~1 unit (arm span). Height ~2.3.
        // A sphere collider of radius 1.0 centered at mesh.position (y=0.7) will cover from y=-0.3 to y=1.7.
        this.playerCollider = new THREE.Sphere(this.mesh.position, 1.0);
    }
    _create_class(Player, [
        {
            key: "update",
            value: function update(deltaTime) {
                // Handle dialogue advancement first if active
                if (this.dialogueManager.isDialogueActive()) {
                    this.handleDialogueInput();
                }
                if (this.game.isInsideTavern) {
                    // If dialogue just started by tavern interaction, don't immediately check for new interaction
                    if (this.canControl && !this.dialogueManager.isDialogueActive()) {
                        this._checkTavernInteractions(deltaTime);
                    }
                    if (this.mesh && typeof this.mesh.update === 'function') {
                        this.mesh.update(deltaTime); // Keep model animations going
                    }
                } else if (!this.game.isGameEffectivelyPaused) {
                    if (this.canControl && !this.dialogueManager.isDialogueActive()) {
                        this._handleMovementInput(deltaTime);
                        this._handleActionInput(deltaTime);
                        this._checkNPCInteraction(); // General world interactions
                    }
                    this._applyPositionUpdate(deltaTime);
                    this._checkCollisions(); // Collectibles, quest items
                    this._updateHungerThirst(deltaTime);
                    if (this.mesh && typeof this.mesh.setWalking === 'function') {
                        this.mesh.setWalking(this.isWalking);
                    }
                    if (this.mesh && typeof this.mesh.update === 'function') {
                        this.mesh.update(deltaTime);
                    }
                    if (this.game.networkManager && this.game.networkManager.isConnected && !(this.game.uiManager.screenFader && this.game.uiManager.screenFader.isFading)) {
                        this.game.networkManager.sendPlayerState(this.mesh.position, this.mesh.rotation.y, this.isWalking);
                    }
                }
                // else: Game is effectively paused (P, inventory, or dialogue outside tavern)
                // Dialogue input is handled at the top. Movement/action input is skipped.
                this._updateCameraLogic();
                this.playerCollider.center.copy(this.mesh.position);
            }
        },
        {
            key: "_handleMovementInput",
            value: function _handleMovementInput(deltaTime) {
                if (!this.canControl || this.game && this.game.isInsideTavern) {
                    this.isWalking = false;
                    this.velocity.x = 0;
                    this.velocity.z = 0;
                    return;
                }
                var moveDirection = new THREE.Vector3();
                var rotationInput = 0;
                if (this.inputController.keys.KeyW) moveDirection.z = -1;
                if (this.inputController.keys.KeyS) moveDirection.z = 1;
                if (this.inputController.keys.KeyA) rotationInput = 1;
                if (this.inputController.keys.KeyD) rotationInput = -1;
                this.mesh.rotation.y += rotationInput * PLAYER_ROTATION_SPEED * deltaTime;
                if (moveDirection.lengthSq() > 0) {
                    moveDirection.normalize().applyQuaternion(this.mesh.quaternion);
                    this.velocity.copy(moveDirection).multiplyScalar(PLAYER_SPEED);
                    this.isWalking = true;
                } else {
                    this.velocity.x = 0;
                    this.velocity.z = 0;
                    this.isWalking = false;
                }
            }
        },
        {
            key: "_handleActionInput",
            value: function _handleActionInput(deltaTime) {
                if (!this.canControl || this.game && this.game.isInsideTavern) return;
                var currentTime = Date.now() / 1000; // Current time in seconds
                // Shooting
                if (this.inputController.keys.Space && currentTime - this.lastShotTime > SHOOT_COOLDOWN) {
                    this.lastShotTime = currentTime;
                    this._shoot();
                }
                // Jumping
                if ((this.inputController.keys.ShiftLeft || this.inputController.keys.ShiftRight) && !this.isJumping) {
                    this._jump();
                }
            }
        },
        {
            key: "_jump",
            value: function _jump() {
                if (!this.isJumping) {
                    this.isJumping = true;
                    this.velocity.y = this.jumpVelocity;
                    if (this.audioManager) {
                        this.audioManager.playSound('jump_sound');
                    }
                }
            }
        },
        {
            key: "_shoot",
            value: function _shoot() {
                var projectileStartPosition = this.mesh.position.clone().add(new THREE.Vector3(0, 0.5, 0)); // Start slightly above player center
                var projectileDirection = new THREE.Vector3(0, 0, -1); // Forward relative to player
                projectileDirection.applyQuaternion(this.mesh.quaternion); // Align with player's rotation
                var projectile = new Projectile(this.scene, projectileStartPosition, projectileDirection, this.world);
                this.game.addProjectile(projectile); // Add to game's projectile manager
                if (this.audioManager) {
                    this.audioManager.playSound('shoot');
                }
            }
        },
        {
            key: "_applyPositionUpdate",
            value: function _applyPositionUpdate(deltaTime) {
                // Apply gravity if jumping
                if (this.isJumping) {
                    this.velocity.y += this.gravity * deltaTime;
                }
                // Update position using XZ from movement and Y from jump/gravity
                this.mesh.position.x += this.velocity.x * deltaTime;
                this.mesh.position.y += this.velocity.y * deltaTime;
                this.mesh.position.z += this.velocity.z * deltaTime;
                // Ground collision and landing
                // The pirate model's feet are at its local y = -0.7.
                // The mesh.position.y is the group's origin.
                // So, ground is hit when mesh.position.y + (-0.7) <= 0, or mesh.position.y <= 0.7
                var groundLevel = 0.7;
                if (this.mesh.position.y <= groundLevel) {
                    this.mesh.position.y = groundLevel;
                    if (this.isJumping) {
                        this.isJumping = false;
                        this.velocity.y = 0;
                        if (this.audioManager) {
                            this.audioManager.playSound('land_sound');
                        }
                        // Emit dust puff particles on landing
                        if (this.game && this.game.particleSystem) {
                            this.game.particleSystem.emit({
                                count: 20,
                                // Emit particles from feet level. mesh.position.y is 0.7 at ground.
                                position: this.mesh.position.clone().setY(0.1),
                                baseVelocity: new THREE.Vector3(0, 0.3, 0),
                                spread: new THREE.Vector3(2.0, 0.8, 2.0),
                                lifetime: 0.8,
                                size: 0.1,
                                color: new THREE.Color(0xBFB08F),
                                gravity: new THREE.Vector3(0, -0.5, 0),
                                initialOpacity: 0.7 // Slightly more opaque
                            });
                        }
                    }
                }
                // Basic boundary to keep player on the island (XZ plane)
                var islandRadius = 23;
                var currentRadiusSq = this.mesh.position.x * this.mesh.position.x + this.mesh.position.z * this.mesh.position.z;
                if (currentRadiusSq > islandRadius * islandRadius) {
                    var scale = islandRadius / Math.sqrt(currentRadiusSq);
                    this.mesh.position.x *= scale;
                    this.mesh.position.z *= scale;
                }
            }
        },
        {
            key: "_updateCameraLogic",
            value: function _updateCameraLogic() {
                if (this.game && this.game.isInsideTavern) {
                    // When inside tavern, Game class handles camera directly via enterTavern/exitTavern.
                    // Player's default follow-camera logic is paused.
                    return;
                }
                // Existing camera follow logic
                var cameraPosition = new THREE.Vector3();
                cameraPosition.copy(CAMERA_OFFSET);
                cameraPosition.applyQuaternion(this.mesh.quaternion); // Rotate offset with player
                cameraPosition.add(this.mesh.position);
                this.camera.position.lerp(cameraPosition, 0.1); // Smooth camera movement
                var lookAtPosition = new THREE.Vector3();
                lookAtPosition.copy(this.mesh.position).add(CAMERA_LOOKAT_OFFSET);
                this.camera.lookAt(lookAtPosition);
            }
        },
        {
            key: "handleDialogueInput",
            value: function handleDialogueInput() {
                if (!this.canControl) return;
                // This method is called from Game.js when dialogue is active
                // Ensure inventory isn't also trying to handle 'E' if we add such functionality
                if (this.inputController.keys.KeyE && !(this.world && this.world.game && this.world.game.inventoryManager && this.world.game.inventoryManager.isInventoryVisible())) {
                    this.dialogueManager.advanceDialogue();
                    this.inputController.keys.KeyE = false; // Consume key press
                }
            }
        },
        {
            key: "_checkCollisions",
            value: function _checkCollisions() {
                for(var i = this.collectibles.length - 1; i >= 0; i--){
                    var collectible = this.collectibles[i];
                    if (collectible.visible && this.playerCollider.intersectsSphere(collectible.userData.collider)) {
                        collectible.visible = false; // "Collect" it
                        this.collectedCount++;
                        if (this.audioManager) {
                            this.audioManager.playSound('collect_crystal');
                        }
                        if (this.game && this.game.inventoryManager) {
                            this.game.inventoryManager.addItem({
                                name: 'Crystal',
                                quantity: 1,
                                type: 'resource'
                            });
                        }
                        if (this.questManager) {
                            this.questManager.notifyCrystalCollected();
                        }
                    }
                }
                // Check for quest item collisions
                for(var i1 = this.questItems.length - 1; i1 >= 0; i1--){
                    var questItem = this.questItems[i1];
                    if (questItem.visible && questItem.userData.collider && this.playerCollider.intersectsSphere(questItem.userData.collider)) {
                        if (questItem.userData.itemName === 'locket') {
                            questItem.visible = false; // "Collect" the locket
                            if (this.questManager) {
                                this.questManager.notifyItemFound('locket');
                            }
                            if (this.audioManager) {
                                this.audioManager.playSound('collect_quest_item'); // Play specific sound for quest item
                            }
                        // Remove from local list or mark as collected to prevent re-check
                        // For now, visibility check handles it. If items respawn, more logic needed.
                        }
                    }
                }
            }
        },
        {
            key: "_checkNPCInteraction",
            value: function _checkNPCInteraction() {
                if (this.dialogueManager.isDialogueActive()) {
                    this.uiManager.hideInteractionPrompt();
                    return;
                }
                var interactionDistance = 3.5;
                var closestInteractable = null;
                var minDistanceSq = interactionDistance * interactionDistance;
                // Gather all potential interactable entities
                var potentialInteractables = [];
                // Add NPCs from the main world
                this.world.getNPCs().forEach(function(npc) {
                    potentialInteractables.push({
                        entity: npc,
                        worldPosition: npc.mesh.position.clone(),
                        type: 'npc',
                        name: npc.name,
                        dialogue: npc.dialogue // Assuming NPC class has dialogue property
                    });
                });
                // Add NPCs from the city
                if (this.game.city && typeof this.game.city.getNPCs === 'function') {
                    this.game.city.getNPCs().forEach(function(npc) {
                        var worldPosition = new THREE.Vector3();
                        npc.mesh.getWorldPosition(worldPosition); // City NPCs might be nested
                        potentialInteractables.push({
                            entity: npc,
                            worldPosition: worldPosition,
                            type: 'npc',
                            name: npc.name,
                            dialogue: npc.dialogue
                        });
                    });
                }
                // Add Costume Shop
                if (this.game.costumeShop) {
                    var shopData = this.game.costumeShop.getInteractionData(); // { name, worldPosition, collider }
                    potentialInteractables.push({
                        entity: this.game.costumeShop,
                        worldPosition: shopData.worldPosition,
                        type: 'shop',
                        name: shopData.name,
                        collider: shopData.collider // Specific collider for shop, if any
                    });
                }
                // Add interactable structures (like the Tavern) from the world
                if (this.world && typeof this.world.getInteractableStructures === 'function') {
                    this.world.getInteractableStructures().forEach(function(structureData) {
                        potentialInteractables.push(_define_property({
                            entity: structureData.entity,
                            worldPosition: structureData.worldPosition,
                            type: structureData.type,
                            name: structureData.name,
                            collider: structureData.collider
                        }, "entity", structureData.entity // Ensure entity is passed for all structure types
                        ));
                    });
                }
                closestInteractable = this._findClosestInteractableEntity(potentialInteractables, minDistanceSq, interactionDistance);
                if (closestInteractable) {
                    this._handleInteractionWithClosestEntity(closestInteractable);
                } else {
                    this.uiManager.hideInteractionPrompt();
                }
            }
        },
        {
            key: "_handleInteractionWithClosestEntity",
            value: function _handleInteractionWithClosestEntity(closestInteractable) {
                var promptMessage = "Press [E] to talk to ".concat(closestInteractable.name);
                if (closestInteractable.type === 'shop') {
                    promptMessage = "Press [E] to browse ".concat(closestInteractable.name);
                } else if (closestInteractable.type === 'building') {
                    promptMessage = "Press [E] to interact with ".concat(closestInteractable.name);
                } else if (closestInteractable.type === 'buriedTreasure' && closestInteractable.entity && !closestInteractable.entity.isDugUp) {
                    promptMessage = "Press [E] to dig at ".concat(closestInteractable.name);
                } else if (closestInteractable.type === 'lootableCorpse' && closestInteractable.entity && closestInteractable.entity.isLootable) {
                    promptMessage = "Press [E] to loot ".concat(closestInteractable.name);
                }
                // Conditions to hide prompt or not show it
                var hidePrompt = false;
                if (closestInteractable.type === 'buriedTreasure' && closestInteractable.entity && closestInteractable.entity.isDugUp) {
                    hidePrompt = true;
                } else if (closestInteractable.type === 'lootableCorpse' && closestInteractable.entity && !closestInteractable.entity.isLootable) {
                    hidePrompt = true;
                }
                if (hidePrompt) {
                    this.uiManager.hideInteractionPrompt();
                } else {
                    this.uiManager.showInteractionPrompt(promptMessage);
                }
                if (this.inputController.keys.KeyE) {
                    if (closestInteractable.type === 'npc') {
                        var questHandled = this.questManager.handleNPCInteraction(closestInteractable.entity);
                        if (!questHandled) {
                            this.dialogueManager.startDialogue(closestInteractable.name, closestInteractable.dialogue);
                        }
                    } else if (closestInteractable.type === 'shop' && closestInteractable.name === "Costume Shop") {
                        if (this.hasMysteriousCoin) {
                            this.uiManager.showNotification("The Mysterious Coin hums faintly in your pocket...", 2000);
                        }
                        this.game.costumeShop.openShopUI(this, this.hasMysteriousCoin);
                    } else if (closestInteractable.type === 'building' && _instanceof(closestInteractable.entity, Tavern)) {
                        if (this.game && typeof this.game.enterTavern === 'function') {
                            this.game.enterTavern(closestInteractable.entity);
                        } else {
                            console.warn("Game object or enterTavern method not available.");
                            this.uiManager.showNotification("Cannot enter ".concat(closestInteractable.name, " right now."), 2000);
                        }
                    } else if (closestInteractable.type === 'buriedTreasure' && closestInteractable.entity && !closestInteractable.entity.isDugUp) {
                        var treasureContents = closestInteractable.entity.digUp(this); // Player instance is passed here
                        if (treasureContents) {
                            this.uiManager.showNotification("You dug up ".concat(treasureContents.gold, " gold and ").concat(treasureContents.silver, " silver!"), 3000);
                            if (this.audioManager) this.audioManager.playSound('collect_quest_item'); // Placeholder sound
                        } else {
                            this.uiManager.showNotification("There was nothing here...", 2000);
                        }
                        this.uiManager.hideInteractionPrompt(); // Hide prompt after digging
                    } else if (closestInteractable.type === 'lootableCorpse' && closestInteractable.entity && closestInteractable.entity.isLootable) {
                        var lootResult = closestInteractable.entity.loot(this);
                        if (lootResult) {
                            if (this.game && this.game.inventoryManager) {
                                this.game.inventoryManager.addItem({
                                    name: lootResult.itemName,
                                    quantity: lootResult.quantity,
                                    type: lootResult.type
                                });
                                this.uiManager.showNotification("Looted ".concat(lootResult.quantity, " ").concat(lootResult.itemName, "!"), 2000);
                            } else {
                                this.uiManager.showNotification("Looted ".concat(lootResult.quantity, " ").concat(lootResult.itemName, "! (Inventory not updated)"), 2000);
                            }
                            if (this.audioManager) this.audioManager.playSound('collect_quest_item'); // Placeholder sound for looting
                        }
                        this.uiManager.hideInteractionPrompt(); // Hide prompt after looting
                    } else if (closestInteractable.type === 'building') {
                        console.log("Interacting with building: ".concat(closestInteractable.name));
                        this.uiManager.showNotification("Approaching ".concat(closestInteractable.name), 2000);
                    }
                    this.inputController.keys.KeyE = false; // Consume the input
                }
            }
        },
        {
            key: "_findClosestInteractableEntity",
            value: function _findClosestInteractableEntity(potentialInteractables, initialMinDistanceSq, interactionDistance) {
                var closestInteractable = null;
                var minDistanceSq = initialMinDistanceSq;
                var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                try {
                    for(var _iterator = potentialInteractables[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
                        var item = _step.value;
                        var distanceSq = this.mesh.position.distanceToSquared(item.worldPosition);
                        var canInteract = distanceSq < minDistanceSq;
                        // For shops or buildings with specific colliders, also check intersection
                        // if general distance is too far but might be inside or very close to the interaction point.
                        if ((item.type === 'shop' || item.type === 'building' || item.type === 'buriedTreasure' || item.type === 'lootableCorpse') && item.collider && !canInteract) {
                            var playerInteractionSphere = new THREE.Sphere(this.mesh.position, 1.0);
                            var effectiveInteractionDistance = item.type === 'buriedTreasure' || item.type === 'lootableCorpse' ? interactionDistance + 1.0 : interactionDistance + 2.5;
                            if (item.collider.intersectsSphere(playerInteractionSphere) && distanceSq < effectiveInteractionDistance * effectiveInteractionDistance) {
                                canInteract = true;
                            }
                        }
                        if (canInteract) {
                            minDistanceSq = distanceSq;
                            closestInteractable = item;
                        }
                    }
                } catch (err) {
                    _didIteratorError = true;
                    _iteratorError = err;
                } finally{
                    try {
                        if (!_iteratorNormalCompletion && _iterator.return != null) {
                            _iterator.return();
                        }
                    } finally{
                        if (_didIteratorError) {
                            throw _iteratorError;
                        }
                    }
                }
                return closestInteractable;
            }
        },
        {
            key: "getCollectedCount",
            value: function getCollectedCount() {
                return this.collectedCount;
            }
        },
        {
            // XP and Leveling Methods
            key: "addXP",
            value: function addXP(amount) {
                if (amount <= 0 && this.xp < this.xpToNextLevel) return; // No XP gain or not enough for level up check
                this.xp += amount;
                if (this.uiManager && amount > 0) {
                    this.uiManager.showNotification("+".concat(amount, " XP"), 1500);
                }
                console.log("Player XP: ".concat(this.xp, "/").concat(this.xpToNextLevel, ", Level: ").concat(this.level));
                while(this.xp >= this.xpToNextLevel){
                    this._levelUp();
                }
            }
        },
        {
            key: "_levelUp",
            value: function _levelUp() {
                this.xp -= this.xpToNextLevel; // Subtract cost of current level, carry over excess
                this.level++;
                // Simple scaling for next level's XP requirement
                this.xpToNextLevel = Math.floor(100 * Math.pow(1.25, this.level - 1));
                var levelUpMessage = "Level Up! You reached Level ".concat(this.level, "!");
                console.log(levelUpMessage);
                if (this.uiManager) {
                    this.uiManager.showNotification(levelUpMessage, 3000);
                }
                // Play level up sound
                if (this.audioManager) {
                    this.audioManager.playSound('level_up'); // Use the new dedicated level_up sound
                }
            // Update any UI elements displaying level/XP (to be added later)
            // e.g., this.stats.updateLevel(this.level);
            // e.g., this.stats.updateXP(this.xp, this.xpToNextLevel);
            }
        },
        {
            key: "getCurrentXPStats",
            value: function getCurrentXPStats() {
                return {
                    level: this.level,
                    xp: this.xp,
                    xpToNextLevel: this.xpToNextLevel
                };
            }
        },
        {
            key: "_updateHungerThirst",
            value: function _updateHungerThirst(deltaTime) {
                if (this.hunger > 0) {
                    this.hunger -= HUNGER_DECAY_RATE * deltaTime;
                    this.hunger = Math.max(0, this.hunger);
                }
                if (this.thirst > 0) {
                    this.thirst -= THIRST_DECAY_RATE * deltaTime;
                    this.thirst = Math.max(0, this.thirst);
                }
            // Consequences for hunger/thirst reaching 0 can be added later
            }
        },
        {
            key: "replenishHunger",
            value: function replenishHunger(amount) {
                this.hunger = Math.min(this.maxHunger, this.hunger + amount);
                if (this.uiManager) {
                    this.uiManager.showNotification("Ate food! +".concat(amount, " Hunger"), 1500);
                }
            }
        },
        {
            key: "replenishThirst",
            value: function replenishThirst(amount) {
                this.thirst = Math.min(this.maxThirst, this.thirst + amount);
                if (this.uiManager) {
                    this.uiManager.showNotification("Drank water! +".concat(amount, " Thirst"), 1500);
                }
            }
        },
        {
            key: "getHungerThirstStats",
            value: function getHungerThirstStats() {
                return {
                    currentHunger: this.hunger,
                    maxHunger: this.maxHunger,
                    currentThirst: this.thirst,
                    maxThirst: this.maxThirst
                };
            }
        },
        {
            key: "addGold",
            value: function addGold(amount) {
                if (amount > 0) {
                    this.gold += amount;
                // Future: Notify UI or inventory manager if needed
                }
            }
        },
        {
            key: "addSilver",
            value: function addSilver(amount) {
                if (amount > 0) {
                    this.silver += amount;
                // Future: Notify UI or inventory manager if needed
                }
            }
        },
        {
            key: "getCurrencyStats",
            value: function getCurrencyStats() {
                return {
                    gold: this.gold,
                    silver: this.silver
                };
            }
        },
        {
            key: "_checkTavernInteractions",
            value: function _checkTavernInteractions(deltaTime) {
                var _this = this;
                if (!this.game.currentTavern || !this.game.currentTavern.bartenderMesh) {
                    this.uiManager.hideInteractionPrompt();
                    return;
                }
                var bartender = this.game.currentTavern.bartenderMesh;
                var bartenderWorldPosition = new THREE.Vector3();
                // The bartender mesh is part of interiorElements, which is part of the Tavern group.
                // So, its world position needs to be calculated.
                bartender.getWorldPosition(bartenderWorldPosition);
                var interactionDistance = 2.5; // Player needs to be fairly close to the bartender
                var distanceSq = this.mesh.position.distanceToSquared(bartenderWorldPosition);
                if (distanceSq < interactionDistance * interactionDistance) {
                    var promptMessage = "Press [E] to talk to ".concat(bartender.userData.name);
                    this.uiManager.showInteractionPrompt(promptMessage);
                    if (this.inputController.keys.KeyE) {
                        // If it's the special dialogue and it hasn't been completed by giving the coin
                        if (!bartender.userData.hasGivenCoin && bartender.userData.dialogue === bartender.userData.specialDialogue) {
                            this.dialogueManager.startDialogue(bartender.userData.name, bartender.userData.specialDialogue, function() {
                                // This callback executes after the special dialogue finishes
                                bartender.userData.hasGivenCoin = true;
                                bartender.userData.dialogue = bartender.userData.defaultDialogue; // Switch to default lines
                                _this.hasMysteriousCoin = true; // Player now possesses the coin
                                _this.uiManager.showNotification("Received Mysterious Coin! Barry mentioned a 'shop of wonders'...", 3000);
                                // Future step: if InventoryManager is unhidden, add: this.inventoryManager.addItem('Mysterious Coin', 1, 'quest');
                                console.log("Player received Mysterious Coin and hasMysteriousCoin is true. Bartender dialogue updated.");
                            });
                        } else {
                            // Otherwise, start normal (or already switched default) dialogue
                            this.dialogueManager.startDialogue(bartender.userData.name, bartender.userData.dialogue);
                        }
                        this.inputController.keys.KeyE = false; // Consume input
                    }
                } else {
                    this.uiManager.hideInteractionPrompt();
                }
            }
        }
    ]);
    return Player;
}();
