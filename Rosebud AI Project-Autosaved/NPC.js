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
var NPC_SPEED = 1.5;
var WANDER_CHANGE_INTERVAL_MIN = 5; // seconds
var WANDER_CHANGE_INTERVAL_MAX = 15; // seconds
var WANDER_RADIUS = 10; // How far they might pick a target
var NPC_DIALOGUES = {
    "Guard Tom": [
        "Greetings, traveler. Keep the peace.",
        "Seen any trouble around?",
        "The crystals hum with strange energy..."
    ],
    "Mystic Mira": [
        "The island whispers secrets to those who listen.",
        "Seek the light, find your path.",
        "Every dawn brings new possibilities."
    ],
    "Old Fisherman Finn": [
        "The waters are calm today.",
        "Caught anything good lately?",
        "This island has seen many seasons."
    ],
    "Adventurer Alex": [
        "Always looking for the next discovery!",
        "Heard there are rare crystals deeper in.",
        "Watch out for the tricky paths!"
    ],
    "Quiet Sage Kai": [
        "...",
        "The wind carries messages.",
        "Observe. Understand."
    ]
};
export var NPC = /*#__PURE__*/ function() {
    "use strict";
    function NPC(sceneOrGroup, initialPosition, name) {
        var color = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : 0xff0000, customDialogue = arguments.length > 4 && arguments[4] !== void 0 ? arguments[4] : null;
        _class_call_check(this, NPC);
        this.parentObject = sceneOrGroup; // Can be scene or a THREE.Group
        this.name = name;
        this.dialogue = customDialogue || NPC_DIALOGUES[name] || [
            "Hello.",
            "I don't have much to say."
        ];
        var geometry = new THREE.CapsuleGeometry(0.4, 0.8, 4, 16);
        var material = new THREE.MeshStandardMaterial({
            color: color
        });
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.castShadow = true;
        this.mesh.position.copy(initialPosition);
        this.mesh.position.y = 0.9;
        this.parentObject.add(this.mesh); // Add to scene or group
        this.velocity = new THREE.Vector3();
        this.wanderTarget = new THREE.Vector3();
        this.wanderTimer = 0;
        this.setNewWanderTarget();
    }
    _create_class(NPC, [
        {
            key: "setNewWanderTarget",
            value: function setNewWanderTarget() {
                var angle = Math.random() * Math.PI * 2;
                var radius = Math.random() * WANDER_RADIUS;
                this.wanderTarget.set(this.mesh.position.x + Math.cos(angle) * radius, this.mesh.position.y, this.mesh.position.z + Math.sin(angle) * radius);
                this.wanderTimer = THREE.MathUtils.randFloat(WANDER_CHANGE_INTERVAL_MIN, WANDER_CHANGE_INTERVAL_MAX);
            }
        },
        {
            key: "update",
            value: function update(deltaTime, islandRadius) {
                this.wanderTimer -= deltaTime;
                if (this.wanderTimer <= 0 || this.mesh.position.distanceTo(this.wanderTarget) < 1.0) {
                    this.setNewWanderTarget();
                }
                var direction = new THREE.Vector3().subVectors(this.wanderTarget, this.mesh.position).normalize();
                this.velocity.copy(direction).multiplyScalar(NPC_SPEED);
                this.mesh.position.addScaledVector(this.velocity, deltaTime);
                // Look towards movement direction
                if (this.velocity.lengthSq() > 0.01) {
                    var targetRotation = Math.atan2(this.velocity.x, this.velocity.z);
                    this.mesh.rotation.y += (targetRotation - this.mesh.rotation.y) * 0.1; // Smooth rotation
                }
                // Boundary check (simple version)
                var distanceFromCenter = Math.sqrt(this.mesh.position.x * this.mesh.position.x + this.mesh.position.z * this.mesh.position.z);
                if (distanceFromCenter > islandRadius - 1) {
                    this.mesh.position.x = this.mesh.position.x / distanceFromCenter * (islandRadius - 1);
                    this.mesh.position.z = this.mesh.position.z / distanceFromCenter * (islandRadius - 1);
                    this.setNewWanderTarget(); // Pick a new target if they hit the boundary
                }
                this.mesh.position.y = 0.9; // Ensure they stay on ground
            }
        }
    ]);
    return NPC;
}();
