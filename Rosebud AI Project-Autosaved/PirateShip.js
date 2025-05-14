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
import * as THREE from 'three';
var SHIP_SPEED = 5.0;
var SHIP_ROTATION_SPEED = 1.0;
export var PirateShip = /*#__PURE__*/ function() {
    "use strict";
    function PirateShip(scene) {
        var _this = this;
        var initialPosition = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : new THREE.Vector3(0, 0.5, -30);
        _class_call_check(this, PirateShip);
        this.scene = scene;
        this.mesh = new THREE.Group(); // Use a group to combine ship parts
        // Hull (main body) - a stretched box
        var hullGeometry = new THREE.BoxGeometry(4, 1.5, 10); // width, height, length
        var hullMaterial = new THREE.MeshStandardMaterial({
            color: 0x8B4513
        }); // Brown
        var hull = new THREE.Mesh(hullGeometry, hullMaterial);
        hull.position.y = 0.75; // Raise it so bottom is at y=0
        this.mesh.add(hull);
        // Mast - a tall cylinder
        var mastGeometry = new THREE.CylinderGeometry(0.2, 0.2, 8, 8);
        var mastMaterial = new THREE.MeshStandardMaterial({
            color: 0xA0522D
        }); // Sienna
        var mast = new THREE.Mesh(mastGeometry, mastMaterial);
        mast.position.y = 0.75 + 1.5 / 2 + 8 / 2 - 0.5; // Position on top of hull, centered
        mast.position.z = -1; // Slightly towards the front from center of hull
        this.mesh.add(mast);
        // Sail - a plane
        var sailGeometry = new THREE.PlaneGeometry(5, 6);
        var sailMaterial = new THREE.MeshStandardMaterial({
            color: 0xFFFAF0,
            side: THREE.DoubleSide
        });
        var sail = new THREE.Mesh(sailGeometry, sailMaterial);
        sail.position.y = mast.position.y + 0.5; // Attach to mast
        sail.position.z = mast.position.z; // Align with mast
        // sail.rotation.y = Math.PI / 2; // Original: Perpendicular to mast, facing "side"
        // To make the ship's "front" (where cannons point, and where it moves) align with -Z local axis:
        // The hull is length 10 along Z. Cannons are at X offset. Mast at Z=-1.
        // If we want the ship to move "forward" along its local -Z axis:
        // The sail should be aligned with the mast (along Z), not perpendicular.
        // However, a typical square-rigged sail is perpendicular to the ship's length.
        // Let's keep the visual as is, and ensure movement code uses the ship's quaternion.
        sail.rotation.y = Math.PI / 2;
        this.mesh.add(sail);
        // Placeholder for a cannon on each side
        var cannonGeo = new THREE.CylinderGeometry(0.3, 0.2, 1.5, 8);
        var cannonMat = new THREE.MeshStandardMaterial({
            color: 0x404040
        }); // Dark grey
        var cannon1 = new THREE.Mesh(cannonGeo, cannonMat);
        cannon1.position.set(2.2, 1.2, 0); // Right side
        cannon1.rotation.z = Math.PI / 2; // Point outwards
        this.mesh.add(cannon1);
        var cannon2 = new THREE.Mesh(cannonGeo, cannonMat);
        cannon2.position.set(-2.2, 1.2, 0); // Left side
        cannon2.rotation.z = -Math.PI / 2; // Point outwards
        this.mesh.add(cannon2);
        this.mesh.position.copy(initialPosition);
        this.mesh.castShadow = true;
        this.mesh.children.forEach(function(child) {
            child.castShadow = true;
            child.receiveShadow = true;
        });
        this.scene.add(this.mesh);
        this.velocity = new THREE.Vector3();
        this.rotationY = 0; // Current ship rotation around Y axis
        this.speed = SHIP_SPEED;
        this.rotationSpeed = SHIP_ROTATION_SPEED;
        // Basic properties for future use
        this.health = 100;
        this.cargo = [];
        // Visual hit effect properties
        this.isHit = false;
        this.hitTimer = 0;
        this.hitDuration = 0.2; // seconds
        this.originalMaterials = new Map();
        this.hitMaterial = new THREE.MeshStandardMaterial({
            color: 0xff0000,
            emissive: 0xcc0000,
            emissiveIntensity: 0.8
        });
        // Store original materials for hit effect
        this.mesh.traverse(function(child) {
            if (child.isMesh && child.material) {
                _this.originalMaterials.set(child, child.material.clone());
            }
        });
        // AI properties
        this.patrolCenter = new THREE.Vector3(0, 0.5, -45); // Center of patrol circle
        this.patrolRadius = 15; // Radius of patrol circle
        this.patrolAngle = 0; // Current angle on the patrol circle
        this.patrolSpeed = 0.3; // Radians per second for circling
    }
    _create_class(PirateShip, [
        {
            key: "update",
            value: function update(deltaTime) {
                var _this = this;
                // Hit effect update
                if (this.isHit) {
                    this.hitTimer -= deltaTime;
                    if (this.hitTimer <= 0) {
                        this.isHit = false;
                        this.mesh.traverse(function(child) {
                            if (child.isMesh && _this.originalMaterials.has(child)) {
                                child.material = _this.originalMaterials.get(child);
                            }
                        });
                    }
                }
                // Circular patrol AI
                this.patrolAngle += this.patrolSpeed * deltaTime;
                if (this.patrolAngle > Math.PI * 2) {
                    this.patrolAngle -= Math.PI * 2;
                }
                var targetPosition = new THREE.Vector3(this.patrolCenter.x + Math.cos(this.patrolAngle) * this.patrolRadius, this.mesh.position.y, this.patrolCenter.z + Math.sin(this.patrolAngle) * this.patrolRadius);
                // Calculate direction to target
                var directionToTarget = new THREE.Vector3().subVectors(targetPosition, this.mesh.position);
                var distanceToTarget = directionToTarget.length();
                if (distanceToTarget > 0.1) {
                    directionToTarget.normalize();
                    // Calculate target rotation (angle in Y)
                    var targetRotationY = Math.atan2(directionToTarget.x, directionToTarget.z);
                    // Smoothly interpolate rotation
                    var rotationDiff = targetRotationY - this.mesh.rotation.y;
                    // Normalize the difference to be between -PI and PI
                    while(rotationDiff > Math.PI)rotationDiff -= Math.PI * 2;
                    while(rotationDiff < -Math.PI)rotationDiff += Math.PI * 2;
                    var turnStep = this.rotationSpeed * deltaTime;
                    if (Math.abs(rotationDiff) > turnStep) {
                        this.mesh.rotation.y += Math.sign(rotationDiff) * turnStep;
                    } else {
                        this.mesh.rotation.y = targetRotationY;
                    }
                }
                // Move forward
                var forward = new THREE.Vector3(0, 0, 1); // Ship's local forward is positive Z for BoxGeometry
                // If using a different model, local forward might be -Z. Our sail points forward with +Z.
                // Let's adjust the sail to point along -Z initially to match typical forward conventions.
                // Or, adjust the forward vector here. For now, let's assume current model's forward is +Z.
                // With current setup, sail is perpendicular, so forward is along its local X or -X.
                // Let's use the ship's quaternion to get its actual forward direction.
                var actualForward = new THREE.Vector3(0, 0, -1); // Standard forward
                actualForward.applyQuaternion(this.mesh.quaternion);
                this.mesh.position.addScaledVector(actualForward, this.speed * deltaTime);
            }
        },
        {
            // Example methods for future control
            key: "setSpeed",
            value: function setSpeed(newSpeed) {
                this.speed = newSpeed;
            }
        },
        {
            key: "turn",
            value: function turn(direction, deltaTime) {
                this.rotationY += direction * this.rotationSpeed * deltaTime;
                this.mesh.rotation.y = this.rotationY;
            }
        },
        {
            key: "moveForward",
            value: function moveForward(deltaTime) {
                var forward = new THREE.Vector3(0, 0, -1);
                forward.applyQuaternion(this.mesh.quaternion);
                this.mesh.position.addScaledVector(forward, this.speed * deltaTime);
            }
        },
        {
            // Methods for combat, upgrades etc. can be added later
            key: "takeDamage",
            value: function takeDamage(amount) {
                var _this = this;
                this.health -= amount;
                console.log("Ship health: ".concat(this.health));
                if (!this.isHit) {
                    this.isHit = true;
                    this.hitTimer = this.hitDuration;
                    this.mesh.traverse(function(child) {
                        if (child.isMesh && child.material) {
                            child.material = _this.hitMaterial;
                        }
                    });
                }
                if (this.health <= 0) {
                    console.log("Ship destroyed!");
                    // Add logic for ship destruction (e.g., make it disappear, play explosion)
                    this.mesh.visible = false; // Simple disappearance for now
                }
            }
        },
        {
            key: "fireCannons",
            value: function fireCannons() {
                console.log("Firing cannons! (Placeholder)");
            // Add logic for creating projectile objects
            }
        },
        {
            // Call this method when the ship is permanently removed to clean up materials
            key: "dispose",
            value: function dispose() {
                if (this.hitMaterial) {
                    this.hitMaterial.dispose();
                }
                this.originalMaterials.forEach(function(material) {
                    return material.dispose();
                });
                this.originalMaterials.clear();
            // If the ship's group is removed from the scene, its children's geometries/materials
            // might also need explicit disposal if not handled by THREE.js's automatic cleanup
            // when objects are removed from the scene graph.
            }
        }
    ]);
    return PirateShip;
}();
