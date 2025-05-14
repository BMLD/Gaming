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
import { PirateModel } from './PirateModel.js'; // Import the PirateModel
var INTERPOLATION_FACTOR = 0.25; // Adjusted factor for smoother per-frame interpolation
export var RemotePlayer = /*#__PURE__*/ function(_THREE_Group) {
    "use strict";
    _inherits(RemotePlayer, _THREE_Group);
    function RemotePlayer(scene) {
        var initialPosition = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : new THREE.Vector3(5, 0.7, 0), initialRotationY = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : 0, initialIsWalking = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : false;
        _class_call_check(this, RemotePlayer);
        var _this;
        _this = _call_super(this, RemotePlayer);
        _this.scene = scene;
        _this.position.copy(initialPosition);
        _this.rotation.y = initialRotationY;
        _this.updateMatrixWorld(true); // Ensure quaternion is updated from Euler
        _this.pirateModel = new PirateModel();
        _this.add(_this.pirateModel);
        // Apply a tint to distinguish remote players
        _this.pirateModel.traverse(function(child) {
            if (child.isMesh && child.material) {
                if (child.material.name === 'ShirtMaterial' || child.material.name === 'SleeveMaterial') {
                    // Make shirt slightly greenish
                    child.material = child.material.clone(); // Clone to avoid modifying shared materials
                    child.material.color.setHex(0x90EE90); // LightGreen
                } else if (child.material.name === 'PantsMaterial') {
                    child.material = child.material.clone();
                    child.material.color.setHex(0x3CB371); // MediumSeaGreen
                }
            // Could add more specific tints for other parts if needed
            }
        });
        _this.scene.add(_this);
        // Initialize target states for interpolation
        _this.targetPosition = _this.position.clone();
        _this.targetQuaternion = _this.quaternion.clone();
        _this.isWalking = initialIsWalking;
        _this.targetIsWalking = initialIsWalking;
        return _this;
    }
    _create_class(RemotePlayer, [
        {
            key: "update",
            value: function update(deltaTime) {
                // Interpolate position and rotation towards target states
                this.position.lerp(this.targetPosition, INTERPOLATION_FACTOR);
                this.quaternion.slerp(this.targetQuaternion, INTERPOLATION_FACTOR);
                // For boolean states like isWalking, we can set it directly or with a slight delay if needed.
                // For now, setting it directly when a new state comes in (in updateState) is fine.
                this.isWalking = this.targetIsWalking;
                // Update the pirate model's internal animations
                if (this.pirateModel && typeof this.pirateModel.update === 'function') {
                    // Pass the walking state to the model. The model itself will handle animation changes.
                    if (typeof this.pirateModel.setWalking === 'function') {
                        this.pirateModel.setWalking(this.isWalking);
                    } else {
                        // Fallback if setWalking doesn't exist, maybe PirateModel uses a property
                        this.pirateModel.isWalking = this.isWalking;
                    }
                    this.pirateModel.update(deltaTime);
                }
            }
        },
        {
            // Call this to update the player's target state from network data
            key: "updateState",
            value: function updateState(data) {
                if (data.position) {
                    this.targetPosition.set(data.position.x, data.position.y, data.position.z);
                }
                if (data.rotationY !== undefined) {
                    var targetEuler = new THREE.Euler(0, data.rotationY, 0, 'YXZ');
                    this.targetQuaternion.setFromEuler(targetEuler);
                }
                if (data.isWalking !== undefined) {
                    this.targetIsWalking = data.isWalking;
                }
            // Add other state updates here (animations, etc.)
            }
        },
        {
            key: "dispose",
            value: function dispose() {
                if (this.pirateModel) {
                    // Dispose materials and geometries of the pirate model if they were cloned
                    this.pirateModel.traverse(function(child) {
                        if (child.isMesh) {
                            if (child.geometry) child.geometry.dispose();
                            // Dispose cloned materials
                            if (child.material && child.material.clonedFromOriginal) {
                                child.material.dispose();
                            } else if (Array.isArray(child.material)) {
                                child.material.forEach(function(mat) {
                                    if (mat.clonedFromOriginal) mat.dispose();
                                });
                            }
                        }
                    });
                    this.remove(this.pirateModel);
                    this.pirateModel = null;
                }
                if (this.parent) {
                    this.parent.remove(this);
                }
            // Any other cleanup specific to RemotePlayer
            }
        }
    ]);
    return RemotePlayer;
}(THREE.Group);
