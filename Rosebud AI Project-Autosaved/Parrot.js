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
var PARROT_BODY_RADIUS = 0.2;
var PARROT_FLAP_SPEED = 5;
var PARROT_FLIGHT_RADIUS = 2; // Radius of their circular flight path
var PARROT_FLIGHT_SPEED = 0.5; // Speed of circling
var PARROT_BOB_AMPLITUDE = 0.1;
var PARROT_BOB_FREQUENCY = 3;
var PROXIMITY_THRESHOLD = 10.0; // Distance to player to trigger sound
var SOUND_COOLDOWN = 5.0; // Seconds between playing the sound
export var Parrot = /*#__PURE__*/ function(_THREE_Group) {
    "use strict";
    _inherits(Parrot, _THREE_Group);
    function Parrot(scene, initialPosition) {
        var color = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : 0xff0000, audioManager = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : null, player = arguments.length > 4 && arguments[4] !== void 0 ? arguments[4] : null;
        _class_call_check(this, Parrot);
        var _this;
        _this = _call_super(this, Parrot);
        _this.scene = scene;
        _this.audioManager = audioManager;
        _this.player = player;
        _this.position.copy(initialPosition);
        _this.baseY = initialPosition.y;
        _this.lastSoundPlayTime = 0; // Time when the sound was last played
        // Body
        var bodyGeometry = new THREE.SphereGeometry(PARROT_BODY_RADIUS, 8, 6);
        var bodyMaterial = new THREE.MeshStandardMaterial({
            color: color
        });
        _this.body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        _this.body.castShadow = true;
        _this.add(_this.body);
        // Simple wings (ellipsoids)
        // Wing geometry now a BoxGeometry for a more blocky/stylized look
        var wingWidth = PARROT_BODY_RADIUS * 1.8;
        var wingHeight = PARROT_BODY_RADIUS * 0.3;
        var wingDepth = PARROT_BODY_RADIUS * 0.8;
        var wingGeometry = new THREE.BoxGeometry(wingWidth, wingHeight, wingDepth);
        var wingMaterial = new THREE.MeshStandardMaterial({
            color: new THREE.Color(color).offsetHSL(0, 0, -0.2)
        });
        _this.leftWing = new THREE.Mesh(wingGeometry, wingMaterial);
        // Adjusted wing position to be more outward and slightly back
        _this.leftWing.position.set(-PARROT_BODY_RADIUS * 0.9, PARROT_BODY_RADIUS * 0.1, -PARROT_BODY_RADIUS * 0.1);
        _this.leftWing.rotation.z = Math.PI / 8; // Slightly less angled
        _this.add(_this.leftWing);
        _this.rightWing = new THREE.Mesh(wingGeometry, wingMaterial);
        _this.rightWing.position.set(PARROT_BODY_RADIUS * 0.9, PARROT_BODY_RADIUS * 0.1, -PARROT_BODY_RADIUS * 0.1);
        _this.rightWing.rotation.z = -Math.PI / 8;
        _this.add(_this.rightWing);
        // Beak
        var beakGeometry = new THREE.ConeGeometry(PARROT_BODY_RADIUS * 0.3, PARROT_BODY_RADIUS * 0.6, 6);
        var beakMaterial = new THREE.MeshStandardMaterial({
            color: 0xFFA500
        }); // Orange
        _this.beak = new THREE.Mesh(beakGeometry, beakMaterial);
        _this.beak.position.set(0, PARROT_BODY_RADIUS * 0.1, PARROT_BODY_RADIUS * 0.9); // Positioned at the front of the body
        _this.beak.rotation.x = Math.PI / 2; // Pointing forward
        _this.add(_this.beak);
        // Tail
        var tailWidth = PARROT_BODY_RADIUS * 0.4;
        var tailHeight = PARROT_BODY_RADIUS * 0.2;
        var tailLength = PARROT_BODY_RADIUS * 1.2;
        var tailGeometry = new THREE.BoxGeometry(tailWidth, tailHeight, tailLength);
        var tailMaterial = new THREE.MeshStandardMaterial({
            color: new THREE.Color(color).offsetHSL(0, 0, -0.1)
        }); // Slightly darker than body
        _this.tail = new THREE.Mesh(tailGeometry, tailMaterial);
        _this.tail.position.set(0, -PARROT_BODY_RADIUS * 0.15, -PARROT_BODY_RADIUS * 0.8); // Positioned at the back and slightly down
        _this.tail.rotation.x = -Math.PI / 12; // Slight upward angle
        _this.add(_this.tail);
        _this.scene.add(_this);
        // Animation parameters
        _this.animationTime = Math.random() * Math.PI * 2; // Random start phase
        _this.circleAngle = Math.random() * Math.PI * 2;
        _this.initialX = initialPosition.x;
        _this.initialZ = initialPosition.z;
        return _this;
    }
    _create_class(Parrot, [
        {
            key: "update",
            value: function update(deltaTime) {
                this.animationTime += deltaTime;
                this.circleAngle += PARROT_FLIGHT_SPEED * deltaTime;
                // Wing flapping
                var flapAngle = Math.sin(this.animationTime * PARROT_FLAP_SPEED) * (Math.PI / 4); // Flap up to 45 degrees
                this.leftWing.rotation.x = flapAngle;
                this.rightWing.rotation.x = -flapAngle;
                // Circular flight path
                this.position.x = this.initialX + Math.cos(this.circleAngle) * PARROT_FLIGHT_RADIUS;
                this.position.z = this.initialZ + Math.sin(this.circleAngle) * PARROT_FLIGHT_RADIUS;
                // Bobbing motion
                this.position.y = this.baseY + Math.sin(this.animationTime * PARROT_BOB_FREQUENCY) * PARROT_BOB_AMPLITUDE;
                // Orient parrot to face direction of flight (simplified)
                var nextCircleAngle = this.circleAngle + PARROT_FLIGHT_SPEED * 0.01; // Look slightly ahead
                var lookAtX = this.initialX + Math.cos(nextCircleAngle) * PARROT_FLIGHT_RADIUS;
                var lookAtZ = this.initialZ + Math.sin(nextCircleAngle) * PARROT_FLIGHT_RADIUS;
                this.lookAt(new THREE.Vector3(lookAtX, this.position.y, lookAtZ));
                // Check player proximity for sound
                if (this.player && this.audioManager) {
                    var distanceToPlayerSq = this.position.distanceToSquared(this.player.mesh.position);
                    var currentTime = this.animationTime; // Using animationTime as a rough current time
                    if (distanceToPlayerSq < PROXIMITY_THRESHOLD * PROXIMITY_THRESHOLD) {
                        if (currentTime - this.lastSoundPlayTime > SOUND_COOLDOWN) {
                            this.audioManager.playSound('parrot_nearby');
                            this.lastSoundPlayTime = currentTime;
                        }
                    }
                }
            }
        },
        {
            key: "dispose",
            value: function dispose() {
                this.body.geometry.dispose();
                this.body.material.dispose();
                this.leftWing.geometry.dispose(); // Wing geometry is now unique
                this.leftWing.material.dispose(); // Wing material is shared
                // rightWing shares geometry and material instance with leftWing
                // so we only need to dispose them once (above for leftWing).
                this.beak.geometry.dispose();
                this.beak.material.dispose();
                this.tail.geometry.dispose();
                this.tail.material.dispose();
                if (this.parent) {
                    this.parent.remove(this);
                }
            }
        }
    ]);
    return Parrot;
}(THREE.Group);
