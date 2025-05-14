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
import { NPC } from './NPC.js'; // Import NPC class
export var SeaTown = /*#__PURE__*/ function() {
    "use strict";
    function SeaTown(scene) {
        var position = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : new THREE.Vector3(50, 0, -50);
        _class_call_check(this, SeaTown);
        this.scene = scene;
        this.position = position;
        this.meshGroup = new THREE.Group();
        this.npcs = []; // Array to hold town-specific NPCs
        this._createTownModel();
        this._createTownNPCs(); // Create NPCs for the town
        this.meshGroup.position.copy(this.position);
        this.scene.add(this.meshGroup);
    }
    _create_class(SeaTown, [
        {
            key: "_createTownModel",
            value: function _createTownModel() {
                // Simple placeholder buildings (cubes)
                var buildingMaterial = new THREE.MeshStandardMaterial({
                    color: 0xD2B48C
                }); // Tan color
                // Building 1
                var building1Geo = new THREE.BoxGeometry(4, 5, 3); // width, height, depth
                var building1 = new THREE.Mesh(building1Geo, buildingMaterial);
                building1.position.set(0, 2.5, 0); // y = height/2
                building1.castShadow = true;
                building1.receiveShadow = true;
                this.meshGroup.add(building1);
                // Building 2
                var building2Geo = new THREE.BoxGeometry(3, 4, 5);
                var building2 = new THREE.Mesh(building2Geo, buildingMaterial);
                building2.position.set(5, 2, -1); // y = height/2
                building2.castShadow = true;
                building2.receiveShadow = true;
                this.meshGroup.add(building2);
                // Building 3 (smaller hut)
                var building3Geo = new THREE.BoxGeometry(2.5, 3, 2.5);
                var building3 = new THREE.Mesh(building3Geo, buildingMaterial);
                building3.position.set(-3, 1.5, 2); // y = height/2
                building3.castShadow = true;
                building3.receiveShadow = true;
                this.meshGroup.add(building3);
                // Simple dock/pier
                var dockMaterial = new THREE.MeshStandardMaterial({
                    color: 0x8B4513
                }); // Brown
                var dockPlatformGeo = new THREE.BoxGeometry(3, 0.5, 8);
                var dockPlatform = new THREE.Mesh(dockPlatformGeo, dockMaterial);
                dockPlatform.position.set(0, 0.25, 6); // Extending out from building1
                dockPlatform.castShadow = true;
                dockPlatform.receiveShadow = true;
                this.meshGroup.add(dockPlatform);
                // Add some simple roof structures (optional, but adds a bit more character)
                var roofMaterial = new THREE.MeshStandardMaterial({
                    color: 0xA52A2A
                }); // Brownish-red
                var roof1Geo = new THREE.ConeGeometry(3, 1.5, 4); // radius, height, segments
                var roof1 = new THREE.Mesh(roof1Geo, roofMaterial);
                roof1.position.set(building1.position.x, building1.position.y + 5 / 2 + 1.5 / 2 - 0.1, building1.position.z);
                roof1.rotation.y = Math.PI / 4; // Rotate to look more like a hip roof
                roof1.castShadow = true;
                this.meshGroup.add(roof1);
                var roof2Geo = new THREE.ConeGeometry(2.5, 1.2, 4);
                var roof2 = new THREE.Mesh(roof2Geo, roofMaterial);
                roof2.position.set(building2.position.x, building2.position.y + 4 / 2 + 1.2 / 2 - 0.1, building2.position.z);
                roof2.rotation.y = Math.PI / 4;
                roof2.castShadow = true;
                this.meshGroup.add(roof2);
            }
        },
        {
            // Removed extra closing brace that was here
            key: "_createTownNPCs",
            value: function _createTownNPCs() {
                // Quest Giver NPC - Captain Ishmael
                var questGiverDialogue = [
                    "Ahoy there, matey! The island's shimmerin' crystals... they hold a strange power.",
                    "I've heard tales they can be used for great things, or terrible ones.",
                    "If you could gather 5 of 'em for me, I'd be much obliged. I need to study their properties.",
                    "Bring 'em back here, and we'll see what secrets they unlock. What say ye?"
                ];
                // Modify NPC_DIALOGUES in NPC.js or handle custom dialogue directly
                // For now, we'll assign it directly.
                var captainIshmael = new NPC(this.meshGroup, new THREE.Vector3(0, 0.9, 5), "Captain Ishmael", 0x0000CD, questGiverDialogue // Custom dialogue
                );
                this.npcs.push(captainIshmael);
            }
        },
        {
            key: "getNPCs",
            value: function getNPCs() {
                return this.npcs;
            }
        },
        {
            // Future methods for interaction, population, etc.
            key: "update",
            value: function update(deltaTime) {
                // Update town-specific NPCs if they have local behavior (e.g., constrained to town)
                this.npcs.forEach(function(npc) {
                // For now, NPC update logic is global, but we might add town-specific logic here
                // npc.updateInTown(deltaTime, this.meshGroup.position); // Example
                });
            }
        }
    ]);
    return SeaTown;
}();
