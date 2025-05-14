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
export var PirateModel = /*#__PURE__*/ function(_THREE_Group) {
    "use strict";
    _inherits(PirateModel, _THREE_Group);
    function PirateModel() {
        _class_call_check(this, PirateModel);
        var _this;
        _this = _call_super(this, PirateModel);
        _this.time = 0; // For idle animation timing
        _this.isWalking = false;
        _this.walkCycleTime = 0.0; // For walking animation timing
        // Store references to parts that will be animated
        _this.animatedParts = {};
        // Colors
        var skinColor = 0xFFCC99; // Light skin tone
        var shirtColor = 0xFFFFFF; // White shirt
        var pantsColor = 0x4A3B31; // Dark brown pants
        var beltColor = 0x000000; // Black belt
        var hatColor = 0x333333; // Dark grey hat
        var eyePatchColor = 0x111111; // Almost black for eye patch
        // Body Parts
        // Torso (slightly tapered)
        var torsoGeo = new THREE.CylinderGeometry(0.35, 0.45, 0.8, 8);
        var torsoMat = new THREE.MeshStandardMaterial({
            color: shirtColor,
            name: 'ShirtMaterial'
        });
        var torso = new THREE.Mesh(torsoGeo, torsoMat);
        torso.position.y = 0.4; // Base of torso at y=0
        _this.add(torso);
        _this.animatedParts.torso = torso;
        // Head
        var headGeo = new THREE.SphereGeometry(0.3, 16, 16);
        var headMat = new THREE.MeshStandardMaterial({
            color: skinColor
        });
        var head = new THREE.Mesh(headGeo, headMat);
        head.position.y = torso.position.y + 0.4 + 0.3; // On top of torso
        _this.add(head);
        _this.animatedParts.head = head;
        // Pirate Hat
        var hatBrimGeo = new THREE.CylinderGeometry(0.5, 0.5, 0.1, 16);
        var hatBrimMat = new THREE.MeshStandardMaterial({
            color: hatColor
        });
        var hatBrim = new THREE.Mesh(hatBrimGeo, hatBrimMat);
        hatBrim.position.y = head.position.y + 0.2;
        _this.add(hatBrim);
        var hatTopGeo = new THREE.CylinderGeometry(0.3, 0.4, 0.4, 8);
        var hatTopMat = new THREE.MeshStandardMaterial({
            color: hatColor
        });
        var hatTop = new THREE.Mesh(hatTopGeo, hatTopMat);
        hatTop.position.y = hatBrim.position.y + 0.05 + 0.2;
        _this.add(hatTop);
        // Eye Patch (a small, thin cylinder rotated)
        var eyePatchGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.02, 8);
        var eyePatchMat = new THREE.MeshStandardMaterial({
            color: eyePatchColor
        });
        var eyePatch = new THREE.Mesh(eyePatchGeo, eyePatchMat);
        eyePatch.position.set(0.15, head.position.y + 0.05, 0.25); // Position over one eye
        eyePatch.rotation.x = Math.PI / 2; // Lay it flat against the face
        _this.add(eyePatch);
        // Legs (two cylinders)
        var legGeo = new THREE.CylinderGeometry(0.15, 0.1, 0.7, 8);
        var legMat = new THREE.MeshStandardMaterial({
            color: pantsColor,
            name: 'PantsMaterial'
        });
        var leftLeg = new THREE.Mesh(legGeo, legMat);
        leftLeg.position.set(-0.18, -0.35, 0); // Below torso
        _this.add(leftLeg);
        _this.animatedParts.leftLeg = leftLeg;
        leftLeg.userData.initialRotation = leftLeg.rotation.clone();
        var rightLeg = new THREE.Mesh(legGeo, legMat);
        rightLeg.position.set(0.18, -0.35, 0); // Below torso
        _this.add(rightLeg);
        _this.animatedParts.rightLeg = rightLeg;
        rightLeg.userData.initialRotation = rightLeg.rotation.clone();
        // Belt (a thin cylinder around the torso)
        var beltGeo = new THREE.CylinderGeometry(0.46, 0.46, 0.1, 16); // Slightly larger radius than torso top
        var beltMat = new THREE.MeshStandardMaterial({
            color: beltColor
        });
        var belt = new THREE.Mesh(beltGeo, beltMat);
        belt.position.y = torso.position.y - 0.1; // Around the waist area
        _this.add(belt);
        // Arms (simple cylinders for now)
        var armGeo = new THREE.CylinderGeometry(0.1, 0.08, 0.6, 8);
        var armMat = new THREE.MeshStandardMaterial({
            color: shirtColor,
            name: 'SleeveMaterial'
        }); // Could be same as shirt or different
        var leftArm = new THREE.Mesh(armGeo, armMat);
        leftArm.position.set(-0.45, torso.position.y + 0.2, 0);
        leftArm.rotation.z = Math.PI / 6; // Slightly angled down
        _this.add(leftArm);
        _this.animatedParts.leftArm = leftArm;
        leftArm.userData.initialRotationZ = leftArm.rotation.z;
        leftArm.userData.initialRotationX = leftArm.rotation.x; // Should be 0
        var rightArm = new THREE.Mesh(armGeo, armMat);
        rightArm.position.set(0.45, torso.position.y + 0.2, 0);
        rightArm.rotation.z = -Math.PI / 6; // Slightly angled down
        _this.add(rightArm);
        _this.animatedParts.rightArm = rightArm;
        rightArm.userData.initialRotationZ = rightArm.rotation.z;
        rightArm.userData.initialRotationX = rightArm.rotation.x; // Should be 0
        // Set shadows for all parts
        _this.traverse(function(child) {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true; // Meshes can also receive shadows
            }
        });
        return _this;
    }
    _create_class(PirateModel, [
        {
            key: "setWalking",
            value: function setWalking(isWalking) {
                if (this.isWalking === isWalking) return;
                this.isWalking = isWalking;
            }
        },
        {
            key: "update",
            value: function update(deltaTime) {
                this.time += deltaTime; // General time for idle animations
                if (this.isWalking) {
                    var walkSpeed = 6;
                    var legSwingAmplitude = Math.PI / 5;
                    var armSwingAmplitude = Math.PI / 4;
                    var torsoBobAmplitude = 0.03;
                    var torsoBobSpeedScale = 2;
                    this.walkCycleTime += deltaTime * walkSpeed;
                    // Legs
                    if (this.animatedParts.leftLeg) {
                        this.animatedParts.leftLeg.rotation.x = this.animatedParts.leftLeg.userData.initialRotation.x + Math.sin(this.walkCycleTime) * legSwingAmplitude;
                    }
                    if (this.animatedParts.rightLeg) {
                        this.animatedParts.rightLeg.rotation.x = this.animatedParts.rightLeg.userData.initialRotation.x - Math.sin(this.walkCycleTime) * legSwingAmplitude;
                    }
                    // Arms
                    if (this.animatedParts.leftArm) {
                        this.animatedParts.leftArm.rotation.x = this.animatedParts.leftArm.userData.initialRotationX - Math.sin(this.walkCycleTime) * armSwingAmplitude;
                        this.animatedParts.leftArm.rotation.z = this.animatedParts.leftArm.userData.initialRotationZ;
                    }
                    if (this.animatedParts.rightArm) {
                        this.animatedParts.rightArm.rotation.x = this.animatedParts.rightArm.userData.initialRotationX + Math.sin(this.walkCycleTime) * armSwingAmplitude;
                        this.animatedParts.rightArm.rotation.z = this.animatedParts.rightArm.userData.initialRotationZ;
                    }
                    // Torso and Head bob
                    var bobOffset = Math.sin(this.walkCycleTime * torsoBobSpeedScale) * torsoBobAmplitude;
                    if (this.animatedParts.torso) {
                        this.animatedParts.torso.position.y = 0.4 + bobOffset;
                    }
                    if (this.animatedParts.head) {
                        this.animatedParts.head.position.y = (this.animatedParts.torso ? this.animatedParts.torso.position.y : 0.4) + 0.4 + 0.3;
                    }
                } else {
                    var breathAmplitude = 0.02;
                    var breathSpeed = 1.5;
                    var breathOffset = Math.sin(this.time * breathSpeed) * breathAmplitude;
                    if (this.animatedParts.torso) {
                        this.animatedParts.torso.position.y = 0.4 + breathOffset / 2;
                    }
                    if (this.animatedParts.head) {
                        this.animatedParts.head.position.y = (this.animatedParts.torso ? this.animatedParts.torso.position.y : 0.4) + 0.4 + 0.3 + breathOffset / 2;
                    }
                    var armSwayAmplitude = Math.PI / 32;
                    var armSwaySpeed = 1.0;
                    if (this.animatedParts.leftArm) {
                        this.animatedParts.leftArm.rotation.x = this.animatedParts.leftArm.userData.initialRotationX;
                        this.animatedParts.leftArm.rotation.z = this.animatedParts.leftArm.userData.initialRotationZ + Math.sin(this.time * armSwaySpeed) * armSwayAmplitude;
                    }
                    if (this.animatedParts.rightArm) {
                        this.animatedParts.rightArm.rotation.x = this.animatedParts.rightArm.userData.initialRotationX;
                        this.animatedParts.rightArm.rotation.z = this.animatedParts.rightArm.userData.initialRotationZ - Math.sin(this.time * armSwaySpeed + Math.PI / 4) * armSwayAmplitude;
                    }
                    if (this.animatedParts.leftLeg) {
                        this.animatedParts.leftLeg.rotation.x = this.animatedParts.leftLeg.userData.initialRotation.x;
                    }
                    if (this.animatedParts.rightLeg) {
                        this.animatedParts.rightLeg.rotation.x = this.animatedParts.rightLeg.userData.initialRotation.x;
                    }
                }
            }
        }
    ]);
    return PirateModel;
}(THREE.Group);
