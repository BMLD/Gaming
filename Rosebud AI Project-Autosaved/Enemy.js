function _assert_this_initialized(self) {
    if (self === void 0) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }
    return self;
}
function _call_super(_this, derived, args) {
    derived = _get_prototype_of(derived);
    return _possible_constructor_return(_this, _is_native_reflect_construct() ? Reflect.construct(derived, args || [], _get_prototype_of(_this).constructor) : derived.apply(_this, args));
}
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
function _get_prototype_of(o) {
    _get_prototype_of = Object.setPrototypeOf ? Object.getPrototypeOf : function getPrototypeOf(o) {
        return o.__proto__ || Object.getPrototypeOf(o);
    };
    return _get_prototype_of(o);
}
function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
        throw new TypeError("Super expression must either be null or a function");
    }
    subClass.prototype = Object.create(superClass && superClass.prototype, {
        constructor: {
            value: subClass,
            writable: true,
            configurable: true
        }
    });
    if (superClass) _set_prototype_of(subClass, superClass);
}
function _possible_constructor_return(self, call) {
    if (call && (_type_of(call) === "object" || typeof call === "function")) {
        return call;
    }
    return _assert_this_initialized(self);
}
function _set_prototype_of(o, p) {
    _set_prototype_of = Object.setPrototypeOf || function setPrototypeOf(o, p) {
        o.__proto__ = p;
        return o;
    };
    return _set_prototype_of(o, p);
}
function _type_of(obj) {
    "@swc/helpers - typeof";
    return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj;
}
function _is_native_reflect_construct() {
    try {
        var result = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {}));
    } catch (_) {}
    return (_is_native_reflect_construct = function() {
        return !!result;
    })();
}
import * as THREE from 'three';
import { PirateModel } from './PirateModel.js'; // Using PirateModel for visual consistency for now
var ENEMY_MODEL_SCALE = 0.9; // Slightly smaller than player
var ENEMY_PATROL_SPEED = 1.5;
var PATROL_DISTANCE = 5; // Distance enemy will patrol from its initial spot
var ENEMY_ATTACK_DAMAGE = 10; // Amount of damage an enemy deals per attack (already defined, good)
var ATTACK_RANGE = 2.0; // How close the enemy needs to be to attack
var ATTACK_COOLDOWN = 1.5; // Seconds between attacks
export var Enemy = /*#__PURE__*/ function(_THREE_Group) {
    "use strict";
    _inherits(Enemy, _THREE_Group);
    function Enemy(scene, initialPosition) {
        var name = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : "Bandit", gameInstance = arguments.length > 3 ? arguments[3] : void 0;
        _class_call_check(this, Enemy);
        var _this;
        _this = _call_super(this, Enemy);
        _this.scene = scene;
        _this.name = name;
        _this.game = gameInstance; // For accessing particle system, audio, etc.
        _this.health = 100;
        _this.maxHealth = 100;
        _this.isAggro = false;
        _this.isDefeated = false;
        _this.time = 0; // For animations
        _this.lastAttackTime = 0; // To manage attack cooldown
        // Patrol behavior
        _this.patrolPoints = [
            initialPosition.clone().add(new THREE.Vector3(PATROL_DISTANCE / 2, 0, 0)),
            initialPosition.clone().sub(new THREE.Vector3(PATROL_DISTANCE / 2, 0, 0))
        ];
        _this.currentPatrolIndex = 0;
        _this.patrolDirection = 1; // 1 for forward, -1 for backward in patrolPoints
        // Model (using a simplified or re-colored PirateModel for now)
        _this.model = new PirateModel(); // Or a new, simpler model
        _this.model.scale.set(ENEMY_MODEL_SCALE, ENEMY_MODEL_SCALE, ENEMY_MODEL_SCALE);
        // Recolor parts of the model to distinguish from player
        _this.model.traverse(function(child) {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
                // Check if the material has a name and clone/modify accordingly
                if (child.material && child.material.name) {
                    switch(child.material.name){
                        case 'ShirtMaterial':
                        case 'SleeveMaterial':
                            child.material = child.material.clone();
                            child.material.color.set(0x990000); // Dark Red for shirt/sleeves
                            break;
                        case 'PantsMaterial':
                            child.material = child.material.clone();
                            child.material.color.set(0x333333); // Dark Grey for pants
                            break;
                    }
                }
            }
        });
        _this.add(_this.model);
        _this.position.copy(initialPosition);
        // Ensure enemy feet are on the ground (similar to player setup)
        // PirateModel's feet are at local y = -0.7. Scaled model means feet at -0.7 * ENEMY_MODEL_SCALE.
        // We want this to be at world y = 0. So, group's y should be 0.7 * ENEMY_MODEL_SCALE.
        _this.position.y = 0.7 * ENEMY_MODEL_SCALE;
        _this.scene.add(_this);
        // Collider (adjust based on model size)
        // Approximate radius based on scaled PirateModel
        var colliderRadius = 1.0 * ENEMY_MODEL_SCALE;
        _this.collider = new THREE.Sphere(_this.position, colliderRadius);
        // Simple health bar (optional, can be improved later)
        _this._createHealthBar();
        return _this;
    }
    _create_class(Enemy, [
        {
            key: "_createHealthBar",
            value: function _createHealthBar() {
                var canvas = document.createElement('canvas');
                canvas.width = 128;
                canvas.height = 32;
                var context = canvas.getContext('2d');
                this.healthBarTexture = new THREE.CanvasTexture(canvas);
                var material = new THREE.SpriteMaterial({
                    map: this.healthBarTexture,
                    depthTest: false,
                    depthWrite: false
                });
                this.healthBarSprite = new THREE.Sprite(material);
                // Position above the model's head
                // PirateModel height ~2.3. Scaled height ~2.3 * 0.9 = ~2.07. Head is near the top.
                // Model origin is at its feet (y=0 relative to this.model). Head is roughly at y = 2.0 * ENEMY_MODEL_SCALE.
                this.healthBarSprite.position.set(0, 2.3 * ENEMY_MODEL_SCALE + 0.3, 0); // y offset from enemy group's origin
                this.healthBarSprite.scale.set(1.5, 0.375, 1); // Adjust size as needed
                this.add(this.healthBarSprite); // Add to the enemy group
                this.updateHealthBar();
            }
        },
        {
            key: "updateHealthBar",
            value: function updateHealthBar() {
                if (!this.healthBarTexture || this.isDefeated) {
                    if (this.healthBarSprite) this.healthBarSprite.visible = false;
                    return;
                }
                if (this.healthBarSprite) this.healthBarSprite.visible = true;
                var canvas = this.healthBarTexture.image;
                var context = canvas.getContext('2d');
                context.clearRect(0, 0, canvas.width, canvas.height);
                // Background
                context.fillStyle = 'rgba(50, 50, 50, 0.7)';
                context.fillRect(0, 0, canvas.width, canvas.height);
                // Health fill
                var healthPercentage = this.health / this.maxHealth;
                context.fillStyle = healthPercentage > 0.5 ? 'green' : healthPercentage > 0.2 ? 'orange' : 'red';
                context.fillRect(2, 2, (canvas.width - 4) * healthPercentage, canvas.height - 4);
                // Border
                context.strokeStyle = 'rgba(200, 200, 200, 0.8)';
                context.lineWidth = 2;
                context.strokeRect(0, 0, canvas.width, canvas.height);
                this.healthBarTexture.needsUpdate = true;
            }
        },
        {
            key: "update",
            value: function update(deltaTime, playerPosition) {
                if (this.isDefeated) return;
                this.time += deltaTime;
                // Update model animations (if any)
                if (this.model && typeof this.model.update === 'function') {
                    this.model.update(deltaTime); // Pass deltaTime to PirateModel's update
                }
                // Keep health bar facing the camera (simple billboard effect)
                if (this.healthBarSprite && this.game && this.game.camera) {
                    this.healthBarSprite.quaternion.copy(this.game.camera.quaternion);
                }
                // Basic AI: Patrol or Chase
                if (playerPosition) {
                    var distanceToPlayer = this.position.distanceTo(playerPosition);
                    var aggroRange = 10;
                    var loseAggroRange = 15;
                    if (distanceToPlayer < aggroRange) {
                        this.isAggro = true;
                    } else if (distanceToPlayer > loseAggroRange) {
                        this.isAggro = false;
                    }
                    if (this.isAggro) {
                        // Chase player
                        var directionToPlayer = playerPosition.clone().sub(this.position).normalize();
                        // Ensure enemy Y position remains correct while looking
                        var lookAtPosition = playerPosition.clone();
                        lookAtPosition.y = this.position.y; // Keep enemy upright
                        this.lookAt(lookAtPosition);
                        // Check if in attack range and cooldown is over
                        if (distanceToPlayer <= ATTACK_RANGE && this.time - this.lastAttackTime > ATTACK_COOLDOWN) {
                            this._attack();
                        } else if (distanceToPlayer > ATTACK_RANGE) {
                            // Move towards player if not in attack range
                            this.position.addScaledVector(directionToPlayer, ENEMY_PATROL_SPEED * 1.2 * deltaTime); // Chase faster
                        }
                    } else {
                        this._patrol(deltaTime);
                    }
                } else {
                    // No player position, just patrol
                    this._patrol(deltaTime);
                }
                // Update collider position
                this.collider.center.copy(this.position);
            }
        },
        {
            key: "_patrol",
            value: function _patrol(deltaTime) {
                if (this.patrolPoints.length < 2) return;
                var targetPoint = this.patrolPoints[this.currentPatrolIndex];
                var directionToTarget = targetPoint.clone().sub(this.position).normalize();
                // Look at the target patrol point (on the same Y plane)
                var lookAtTarget = targetPoint.clone();
                lookAtTarget.y = this.position.y;
                this.lookAt(lookAtTarget);
                this.position.addScaledVector(directionToTarget, ENEMY_PATROL_SPEED * deltaTime);
                // Check if close enough to target point
                if (this.position.distanceToSquared(targetPoint) < 0.5 * 0.5) {
                    this.currentPatrolIndex = (this.currentPatrolIndex + 1) % this.patrolPoints.length;
                }
            }
        },
        {
            key: "_attack",
            value: function _attack() {
                console.log("".concat(this.name, " attacks the player!"));
                this.lastAttackTime = this.time;
                // Actual damage dealing to player
                if (this.game && this.game.player && typeof this.game.player.takeDamage === 'function') {
                    this.game.player.takeDamage(ENEMY_ATTACK_DAMAGE);
                }
                // Optional: Play attack animation or sound
                if (this.game && this.game.audioManager) {
                // this.game.audioManager.playSound('enemy_attack_sound'); // Needs a sound
                }
            // Optional: Trigger attack animation on the model
            // if (this.model && typeof this.model.playAnimation === 'function') {
            // this.model.playAnimation('attack');
            // }
            }
        },
        {
            key: "takeDamage",
            value: function takeDamage(amount) {
                if (this.isDefeated) return;
                this.health -= amount;
                this.health = Math.max(0, this.health);
                this.updateHealthBar();
                console.log("".concat(this.name, " took ").concat(amount, " damage, health: ").concat(this.health));
                if (this.game && this.game.particleSystem) {
                    this.game.particleSystem.emit({
                        count: 15,
                        position: this.position.clone().add(new THREE.Vector3(0, 1 * ENEMY_MODEL_SCALE, 0)),
                        baseVelocity: new THREE.Vector3(0, 0.5, 0),
                        spread: new THREE.Vector3(1.5, 1.5, 1.5),
                        lifetime: 0.5,
                        size: 0.1,
                        color: new THREE.Color(0xff0000),
                        gravity: new THREE.Vector3(0, -1.0, 0)
                    });
                }
                if (this.game && this.game.audioManager) {
                    this.game.audioManager.playSound('dummy_hit'); // Placeholder hit sound
                }
                if (this.health <= 0) {
                    this.defeat();
                }
            }
        },
        {
            key: "defeat",
            value: function defeat() {
                var _this = this;
                if (this.isDefeated) return;
                this.isDefeated = true;
                console.log("".concat(this.name, " has been defeated!"));
                this.healthBarSprite.visible = false;
                // Simple defeat animation: fall over
                // This requires knowing the model's structure or having a specific animation method.
                // For now, let's make it disappear or play a particle effect.
                if (this.game && this.game.particleSystem) {
                    this.game.particleSystem.emit({
                        count: 50,
                        position: this.position.clone().add(new THREE.Vector3(0, 0.5 * ENEMY_MODEL_SCALE, 0)),
                        baseVelocity: new THREE.Vector3(0, 0.2, 0),
                        spread: new THREE.Vector3(2, 2, 2),
                        lifetime: 1.0,
                        size: 0.15,
                        color: new THREE.Color(0x555555)
                    });
                }
                // Give XP to player
                if (this.game && this.game.player) {
                    this.game.player.addXP(50); // Example XP amount
                }
                // Remove from scene after a delay or an animation
                setTimeout(function() {
                    if (_this.parent) {
                        _this.parent.remove(_this);
                    }
                    // Further cleanup of model, materials etc. if necessary
                    _this.model.traverse(function(child) {
                        if (child.isMesh) {
                            child.geometry.dispose();
                            if (child.material.isMaterial) {
                                child.material.dispose();
                            } else if (Array.isArray(child.material)) {
                                child.material.forEach(function(material) {
                                    return material.dispose();
                                });
                            }
                        }
                    });
                    if (_this.healthBarTexture) _this.healthBarTexture.dispose();
                    if (_this.healthBarSprite && _this.healthBarSprite.material) _this.healthBarSprite.material.dispose();
                }, 1000); // Delay to allow particles to show
            }
        }
    ]);
    return Enemy;
}(THREE.Group);
