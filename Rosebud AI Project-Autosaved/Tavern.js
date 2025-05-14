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
function _instanceof(left, right) {
    if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) {
        return !!right[Symbol.hasInstance](left);
    } else {
        return left instanceof right;
    }
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
var TAVERN_WIDTH = 8;
var TAVERN_HEIGHT = 5;
var TAVERN_DEPTH = 10;
export var Tavern = /*#__PURE__*/ function(_THREE_Group) {
    "use strict";
    _inherits(Tavern, _THREE_Group);
    function Tavern(scene) {
        var initialPosition = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : new THREE.Vector3(0, 0, 0);
        _class_call_check(this, Tavern);
        var _this;
        _this = _call_super(this, Tavern);
        _this.scene = scene;
        _this.position.copy(initialPosition);
        // Basic visual representation for the tavern
        var tavernGeometry = new THREE.BoxGeometry(TAVERN_WIDTH, TAVERN_HEIGHT, TAVERN_DEPTH);
        var tavernMaterial = new THREE.MeshStandardMaterial({
            color: 0x8B4513
        }); // Brown color
        _this.mesh = new THREE.Mesh(tavernGeometry, tavernMaterial);
        _this.mesh.position.y = TAVERN_HEIGHT / 2; // Adjust so base is at y=0 relative to group
        _this.mesh.castShadow = true;
        _this.mesh.receiveShadow = true;
        _this.add(_this.mesh);
        _this.name = "The Salty Barnacle Tavern";
        _this.type = "building"; // For interaction system
        if (_this.scene) {
            _this.scene.add(_this);
        }
        _this._createInteriorElements();
        return _this;
    }
    _create_class(Tavern, [
        {
            key: "_createInteriorElements",
            value: function _createInteriorElements() {
                var _this = this;
                this.interiorElements = new THREE.Group();
                this.add(this.interiorElements); // Add to the main Tavern group
                // Counter
                var counterGeo = new THREE.BoxGeometry(TAVERN_WIDTH * 0.8, 1, 1);
                var counterMat = new THREE.MeshStandardMaterial({
                    color: 0x654321
                }); // Darker brown
                var counter = new THREE.Mesh(counterGeo, counterMat);
                counter.position.set(0, 0.5, -TAVERN_DEPTH / 2 + 1); // At the back wall, on the floor
                counter.castShadow = true;
                counter.receiveShadow = true;
                this.interiorElements.add(counter);
                // Tables (simple boxes for now)
                var tableGeo = new THREE.BoxGeometry(1.5, 0.8, 1.5);
                var tableMat = new THREE.MeshStandardMaterial({
                    color: 0x7a5230
                }); // Medium brown
                var table1 = new THREE.Mesh(tableGeo, tableMat);
                table1.position.set(-TAVERN_WIDTH / 4, 0.4, 0);
                table1.castShadow = true;
                table1.receiveShadow = true;
                this.interiorElements.add(table1);
                var table2 = new THREE.Mesh(tableGeo, tableMat.clone()); // Use clone if material properties might change
                table2.position.set(TAVERN_WIDTH / 4, 0.4, TAVERN_DEPTH / 4 - 1);
                table2.castShadow = true;
                table2.receiveShadow = true;
                this.interiorElements.add(table2);
                // Chairs (very simple: a box for seat, a box for back)
                var chairSeatGeo = new THREE.BoxGeometry(0.6, 0.1, 0.6);
                var chairBackGeo = new THREE.BoxGeometry(0.6, 0.7, 0.1);
                var chairMat = new THREE.MeshStandardMaterial({
                    color: 0x8B5A2B
                }); // Slightly different brown for chairs
                var createChair = function(tablePosition, offsetX, offsetZ) {
                    var rotationY = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : 0;
                    var chair = new THREE.Group();
                    var seat = new THREE.Mesh(chairSeatGeo, chairMat);
                    seat.position.y = 0.3; // Seat height
                    seat.castShadow = true;
                    seat.receiveShadow = true;
                    chair.add(seat);
                    var back = new THREE.Mesh(chairBackGeo, chairMat);
                    back.position.y = 0.3 + 0.35; // Backrest height
                    back.position.z = -0.25; // Position backrest behind the seat
                    back.castShadow = true;
                    back.receiveShadow = true;
                    chair.add(back);
                    chair.position.copy(tablePosition);
                    chair.position.x += offsetX;
                    chair.position.z += offsetZ;
                    chair.rotation.y = rotationY;
                    _this.interiorElements.add(chair);
                };
                // Chairs for table1
                createChair(table1.position, 0, 1, 0); // Front
                createChair(table1.position, 0, -1, Math.PI); // Back
                createChair(table1.position, 1, 0, -Math.PI / 2); // Right
                createChair(table1.position, -1, 0, Math.PI / 2); // Left
                // Chairs for table2
                createChair(table2.position, 0, 1, 0);
                createChair(table2.position, 0, -1, Math.PI);
                createChair(table2.position, 1, 0, -Math.PI / 2);
                createChair(table2.position, -1, 0, Math.PI / 2);
                // Bartender (simple cylinder for now)
                var bartenderGeo = new THREE.CylinderGeometry(0.4, 0.4, 1.8, 16); // radiusTop, radiusBottom, height, segments
                var bartenderMat = new THREE.MeshStandardMaterial({
                    color: 0x4682B4
                }); // Steel blue, like an apron
                var bartender = new THREE.Mesh(bartenderGeo, bartenderMat);
                // Position behind the center of the counter
                bartender.position.set(0, 0.9, counter.position.z - 0.7); // Y=0.9 for base on floor, Z slightly behind counter
                bartender.castShadow = true;
                bartender.receiveShadow = true;
                bartender.userData.name = "Bartender Barry";
                bartender.userData.defaultDialogue = [
                    "Welcome back to The Salty Barnacle!",
                    "The usual, or something to quench a mighty thirst today?",
                    "Keep your wits about ye, the tides are always turnin'."
                ];
                bartender.userData.specialDialogue = [
                    "Psst, friend. You look like you could use a bit o' luck. Take this old coin.",
                    "They say it brings fortune to those who know where to spend it...",
                    "...perhaps at a certain 'shop of wonders' if you catch my drift. Don't tell anyone I gave it to ya!"
                ];
                bartender.userData.hasGivenCoin = false;
                bartender.userData.dialogue = bartender.userData.specialDialogue; // Initial dialogue is the special one
                this.bartenderMesh = bartender; // Store a reference
                this.interiorElements.add(bartender);
                this.interiorElements.visible = false; // Initially hidden
            }
        },
        {
            key: "showInterior",
            value: function showInterior() {
                if (this.interiorElements) {
                    this.interiorElements.visible = true;
                }
                if (this.mesh && this.mesh.material) {
                    this.mesh.material.transparent = true;
                    this.mesh.material.opacity = 0.2; // Make walls semi-transparent
                    this.mesh.material.side = THREE.DoubleSide; // Ensure we can see through from both sides
                    this.mesh.material.needsUpdate = true;
                }
            }
        },
        {
            key: "hideInterior",
            value: function hideInterior() {
                if (this.interiorElements) {
                    this.interiorElements.visible = false;
                }
                if (this.mesh && this.mesh.material) {
                    this.mesh.material.transparent = false;
                    this.mesh.material.opacity = 1.0; // Restore full opacity
                    this.mesh.material.side = THREE.FrontSide; // Restore default side
                    this.mesh.material.needsUpdate = true;
                }
            }
        },
        {
            key: "update",
            value: function update(deltaTime) {
            // Tavern-specific animations or logic can go here
            }
        },
        {
            key: "getInteractionData",
            value: function getInteractionData() {
                // Ensure the collider is up-to-date with the tavern's current world position
                var worldPosition = new THREE.Vector3();
                this.mesh.getWorldPosition(worldPosition); // Get world position of the visual mesh
                // Create a Box3 in world space for interaction
                var worldCollider = new THREE.Box3();
                var size = new THREE.Vector3(TAVERN_WIDTH, TAVERN_HEIGHT, TAVERN_DEPTH);
                // The center of the Box3 is the world position of the mesh (which is already its center)
                worldCollider.setFromCenterAndSize(worldPosition.clone(), size);
                return {
                    entity: this,
                    name: this.name,
                    type: this.type,
                    worldPosition: this.position.clone(),
                    collider: worldCollider // A Box3 representing the tavern's bounds in world space
                };
            }
        },
        {
            key: "getInteriorEntryPoint",
            value: function getInteriorEntryPoint() {
                // Player's feet should be at y=0.7. Tavern base is at y=0.
                // Place player slightly inside the tavern model from its origin.
                var entryOffset = new THREE.Vector3(0, 0.7, TAVERN_DEPTH / 2 - 2); // Inside, near the back wall initially
                return this.position.clone().add(entryOffset);
            }
        },
        {
            key: "getInteriorCameraPosition",
            value: function getInteriorCameraPosition() {
                // Camera inside, looking towards where a bar might be.
                var cameraOffset = new THREE.Vector3(0, TAVERN_HEIGHT / 2, TAVERN_DEPTH / 2 - 0.5); // Near back wall, mid-height
                return this.position.clone().add(cameraOffset);
            }
        },
        {
            key: "getInteriorCameraLookAt",
            value: function getInteriorCameraLookAt() {
                // Look towards the center front of the tavern interior.
                var lookAtOffset = new THREE.Vector3(0, TAVERN_HEIGHT / 2 - 0.5, -TAVERN_DEPTH / 2 + 1);
                return this.position.clone().add(lookAtOffset);
            }
        },
        {
            key: "getExteriorExitPoint",
            value: function getExteriorExitPoint() {
                // Place player just outside the conceptual "door" (front center of the tavern model)
                // Player feet at y=0.7
                var exitOffset = new THREE.Vector3(0, 0.7, TAVERN_DEPTH / 2 + 1.5); // 1.5 units in front of the tavern
                return this.position.clone().add(exitOffset);
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
                if (this.interiorElements) {
                    this.interiorElements.traverse(function(child) {
                        if (_instanceof(child, THREE.Mesh)) {
                            if (child.geometry) child.geometry.dispose();
                            if (child.material) {
                                if (Array.isArray(child.material)) {
                                    child.material.forEach(function(mat) {
                                        return mat.dispose();
                                    });
                                } else {
                                    child.material.dispose();
                                }
                            }
                        }
                    });
                    this.remove(this.interiorElements);
                    this.interiorElements = null;
                }
                if (this.parent) {
                    this.parent.remove(this);
                }
            }
        }
    ]);
    return Tavern;
}(THREE.Group);
