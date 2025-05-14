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
var MOUND_RADIUS = 0.7;
var MOUND_HEIGHT = 0.2;
export var BuriedTreasure = /*#__PURE__*/ function(_THREE_Group) {
    "use strict";
    _inherits(BuriedTreasure, _THREE_Group);
    function BuriedTreasure(scene) {
        var initialPosition = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : new THREE.Vector3(0, 0, 0), contents = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {
            gold: 10,
            silver: 50
        };
        _class_call_check(this, BuriedTreasure);
        var _this;
        _this = _call_super(this, BuriedTreasure);
        _this.scene = scene;
        _this.position.copy(initialPosition);
        _this.contents = contents;
        _this.isDugUp = false;
        // Visual representation: a simple mound of earth
        var moundGeometry = new THREE.CylinderGeometry(MOUND_RADIUS, MOUND_RADIUS, MOUND_HEIGHT, 16, 1, true, 0, Math.PI * 2);
        // Make it look more like a mound by squashing it and positioning half above ground
        moundGeometry.scale(1, 0.5, 1); // Flatten it a bit
        var moundMaterial = new THREE.MeshStandardMaterial({
            color: 0x967969
        }); // Earthy brown
        _this.mesh = new THREE.Mesh(moundGeometry, moundMaterial);
        _this.mesh.position.y = MOUND_HEIGHT / 4; // Position so base is roughly on ground
        _this.mesh.castShadow = true;
        _this.mesh.receiveShadow = true;
        _this.add(_this.mesh);
        _this.name = "Suspicious Mound";
        _this.type = "buriedTreasure"; // For interaction system
        // Collider for interaction
        // Positioned at the base of the mound, slightly larger radius for easier interaction
        _this.interactionCollider = new THREE.Sphere(_this.position.clone().setY(_this.position.y + MOUND_HEIGHT / 4), MOUND_RADIUS * 1.2);
        if (_this.scene) {
            _this.scene.add(_this);
        }
        return _this;
    }
    _create_class(BuriedTreasure, [
        {
            key: "getInteractionData",
            value: function getInteractionData() {
                var worldPosition = new THREE.Vector3();
                this.mesh.getWorldPosition(worldPosition); // Get world position of the visual mesh
                // Update collider position before returning
                this.interactionCollider.center.copy(worldPosition);
                return {
                    entity: this,
                    name: this.name,
                    type: this.type,
                    worldPosition: this.position.clone(),
                    collider: this.interactionCollider
                };
            }
        },
        {
            key: "digUp",
            value: function digUp(player) {
                if (this.isDugUp) return null;
                console.log("".concat(player.name || './Player.js', " dug up the treasure at ").concat(this.name, "!"));
                this.isDugUp = true;
                // Transfer contents to player
                if (player && typeof player.addGold === 'function' && typeof player.addSilver === 'function') {
                    player.addGold(this.contents.gold);
                    player.addSilver(this.contents.silver);
                } else {
                    console.warn("BuriedTreasure: Player object invalid or missing currency methods.");
                }
                // Make treasure invisible
                this.visible = false;
                // Optional: Play sound or particle effect here via game instance if needed
                // e.g., if (this.scene.game && this.scene.game.audioManager) this.scene.game.audioManager.playSound('dig_treasure');
                return this.contents; // Still return contents for UI notification
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
    return BuriedTreasure;
}(THREE.Group);
