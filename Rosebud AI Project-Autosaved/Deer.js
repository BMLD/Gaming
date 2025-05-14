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
var DEER_HEALTH = 30;
var DEER_SPEED = 1.5;
var WANDER_CHANGE_INTERVAL = 5; // seconds
var DEATH_FALL_DURATION = 1; // seconds
export var Deer = /*#__PURE__*/ function(_THREE_Group) {
    "use strict";
    _inherits(Deer, _THREE_Group);
    function Deer(scene, initialPosition, gameInstance) {
        _class_call_check(this, Deer);
        var _this;
        _this = _call_super(this, Deer);
        _this.scene = scene;
        _this.game = gameInstance; // For accessing audio, particles later
        _this.position.copy(initialPosition);
        _this.health = DEER_HEALTH;
        _this.isAlive = true;
        _this.isLootable = false;
        _this.speed = DEER_SPEED;
        // Visual representation (brown cylinder placeholder)
        var deerGeometry = new THREE.CylinderGeometry(0.4, 0.3, 1.5, 8); // radiusTop, radiusBottom, height, radialSegments
        var deerMaterial = new THREE.MeshStandardMaterial({
            color: 0x8B4513
        }); // Brown
        _this.mesh = new THREE.Mesh(deerGeometry, deerMaterial);
        _this.mesh.castShadow = true;
        _this.mesh.position.y = 0.75; // Half height, so base is at y=0 relative to group
        _this.add(_this.mesh);
        // Collider (simple sphere for now)
        _this.collider = new THREE.Sphere(_this.position.clone().add(new THREE.Vector3(0, 0.75, 0)), 0.75);
        // AI state
        _this.aiState = 'wandering';
        _this.wanderTarget = new THREE.Vector3();
        _this.timeToNextWanderChange = Math.random() * WANDER_CHANGE_INTERVAL;
        _this._setNewWanderTarget();
        _this.deathFallProgress = 0; // For animation
        if (_this.scene) {
            _this.scene.add(_this);
        }
        return _this;
    }
    _create_class(Deer, [
        {
            key: "update",
            value: function update(deltaTime, playerPosition) {
                if (!this.isAlive) {
                    if (this.deathFallProgress < DEATH_FALL_DURATION) {
                        this.deathFallProgress += deltaTime;
                        var fallRatio = Math.min(1, this.deathFallProgress / DEATH_FALL_DURATION);
                        // Simple fall: rotate forward onto its "face"
                        this.mesh.rotation.x = THREE.MathUtils.lerp(0, Math.PI / 2, fallRatio);
                        this.mesh.position.y = THREE.MathUtils.lerp(0.75, 0.3, fallRatio); // Sink slightly
                    }
                    return;
                }
                if (this.aiState === 'wandering') {
                    this._wander(deltaTime);
                }
                this.collider.center.copy(this.position).add(new THREE.Vector3(0, 0.75, 0));
            }
        },
        {
            key: "_setNewWanderTarget",
            value: function _setNewWanderTarget() {
                var wanderDistance = 10;
                var angle = Math.random() * Math.PI * 2;
                this.wanderTarget.set(this.position.x + Math.cos(angle) * wanderDistance, this.position.y, this.position.z + Math.sin(angle) * wanderDistance);
                // Clamp target to island radius (approximate)
                var islandRadius = 55; // Slightly less than world's ISLAND_RADIUS
                if (this.wanderTarget.length() > islandRadius) {
                    this.wanderTarget.normalize().multiplyScalar(islandRadius);
                }
            }
        },
        {
            key: "_wander",
            value: function _wander(deltaTime) {
                this.timeToNextWanderChange -= deltaTime;
                if (this.timeToNextWanderChange <= 0) {
                    this._setNewWanderTarget();
                    this.timeToNextWanderChange = WANDER_CHANGE_INTERVAL + Math.random() * WANDER_CHANGE_INTERVAL;
                }
                var directionToTarget = this.wanderTarget.clone().sub(this.position);
                directionToTarget.y = 0; // Ignore Y for rotation and movement direction
                if (directionToTarget.lengthSq() > 0.1) {
                    directionToTarget.normalize();
                    // Rotate towards target
                    var targetRotationY = Math.atan2(directionToTarget.x, directionToTarget.z);
                    this.rotation.y = THREE.MathUtils.lerp(this.rotation.y, targetRotationY, 0.1);
                    // Move towards target
                    this.position.addScaledVector(directionToTarget, this.speed * deltaTime);
                } else {
                    // Reached target, get a new one
                    this._setNewWanderTarget();
                }
            }
        },
        {
            key: "takeDamage",
            value: function takeDamage(amount, _projectileDirection) {
                var _this = this;
                if (!this.isAlive) return;
                this.health -= amount;
                console.log("Deer took ".concat(amount, " damage, health: ").concat(this.health));
                // Simple hit flash (optional, could be handled by particle system later)
                var originalColor = this.mesh.material.color.clone();
                this.mesh.material.color.set(0xff0000); // Flash red
                setTimeout(function() {
                    if (_this.mesh && _this.mesh.material) {
                        _this.mesh.material.color.copy(originalColor);
                    }
                }, 150);
                if (this.health <= 0) {
                    this.die();
                }
            }
        },
        {
            key: "die",
            value: function die() {
                if (!this.isAlive) return;
                console.log("Deer has died.");
                this.isAlive = false;
                this.isLootable = true; // Ready for looting in a future step
                this.aiState = 'dead';
                this.deathFallProgress = 0; // Start fall animation
            // Optional: Play death sound
            // if (this.game && this.game.audioManager) {
            //     this.game.audioManager.playSound('deer_death_sound', this.position);
            // }
            // Optional: Emit death particles
            // if (this.game && this.game.particleSystem) {
            //     this.game.particleSystem.emit({ /* ... */ });
            // }
            }
        },
        {
            // Called when the player loots the deer
            key: "loot",
            value: function loot(player) {
                if (!this.isLootable) return null;
                this.isLootable = false;
                // Future: Could change appearance, e.g., slightly transparent or different model
                // For now, just make it non-lootable.
                // Return item details for the player/inventory system
                // In a more complex system, this might be an array of items or an object.
                return {
                    itemName: "Raw Venison",
                    quantity: 1,
                    type: "food"
                };
            }
        },
        {
            key: "getInteractionData",
            value: function getInteractionData() {
                return {
                    entity: this,
                    worldPosition: this.position.clone().add(new THREE.Vector3(0, 0.75, 0)),
                    type: 'lootableCorpse',
                    name: 'Dead Deer',
                    collider: this.collider // Use existing collider for distance check
                };
            }
        },
        {
            key: "dispose",
            value: function dispose() {
                if (this.mesh) {
                    if (this.mesh.geometry) this.mesh.geometry.dispose();
                    if (this.mesh.material) this.mesh.material.dispose();
                    this.remove(this.mesh);
                    this.mesh = null;
                }
                if (this.parent) {
                    this.parent.remove(this);
                }
            }
        }
    ]);
    return Deer;
}(THREE.Group);
