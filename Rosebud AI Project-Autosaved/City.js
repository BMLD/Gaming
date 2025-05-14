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
// import { NPC } from './NPC.js'; // Import NPC if you plan to add NPCs managed by the City
export var City = /*#__PURE__*/ function() {
    "use strict";
    function City(scene) {
        var initialPosition = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : new THREE.Vector3(0, 0, 0);
        _class_call_check(this, City);
        this.scene = scene;
        this.mesh = new THREE.Group();
        this.mesh.position.copy(initialPosition);
        this.name = "Coastal City"; // Example name
        this.npcs = []; // Array to hold city-specific NPCs
        this._createCityLayout();
        this.scene.add(this.mesh);
        console.log("City created at:", initialPosition);
    }
    _create_class(City, [
        {
            key: "_createCityLayout",
            value: function _createCityLayout() {
                var _this = this;
                // Ground for the city area (optional, if world ground isn't sufficient or for distinct look)
                var cityGroundGeo = new THREE.PlaneGeometry(30, 30);
                var cityGroundMat = new THREE.MeshStandardMaterial({
                    color: 0xcccccc,
                    side: THREE.DoubleSide
                });
                var cityGround = new THREE.Mesh(cityGroundGeo, cityGroundMat);
                cityGround.rotation.x = -Math.PI / 2;
                cityGround.receiveShadow = true;
                // this.mesh.add(cityGround); // Add if you want a distinct ground for the city
                // Simple building structures
                var buildingMaterial = new THREE.MeshStandardMaterial({
                    color: 0xA0A0A0
                }); // Grey buildings
                var buildingShapes = [
                    {
                        size: new THREE.Vector3(4, 6, 4),
                        position: new THREE.Vector3(-8, 3, 0)
                    },
                    {
                        size: new THREE.Vector3(5, 8, 5),
                        position: new THREE.Vector3(8, 4, -2)
                    },
                    {
                        size: new THREE.Vector3(3, 5, 6),
                        position: new THREE.Vector3(0, 2.5, 8)
                    },
                    {
                        size: new THREE.Vector3(4, 7, 3),
                        position: new THREE.Vector3(-5, 3.5, 10)
                    }
                ];
                buildingShapes.forEach(function(shape) {
                    var buildingGeo = new THREE.BoxGeometry(shape.size.x, shape.size.y, shape.size.z);
                    var building = new THREE.Mesh(buildingGeo, buildingMaterial.clone()); // Clone material for potential individual changes
                    building.position.copy(shape.position);
                    building.castShadow = true;
                    building.receiveShadow = true;
                    _this.mesh.add(building);
                });
                // Example: Add a simple road or path
                var roadMaterial = new THREE.MeshStandardMaterial({
                    color: 0x444444
                });
                var roadGeo = new THREE.BoxGeometry(4, 0.1, 25); // Long strip for a road
                var road = new THREE.Mesh(roadGeo, roadMaterial);
                road.position.set(0, 0.05, 0); // Slightly above ground
                road.receiveShadow = true;
                this.mesh.add(road);
            // Placeholder for adding city-specific NPCs later
            // e.g., const cityNPC = new NPC(this.mesh, new THREE.Vector3(2, 0.9, 5), "City Guard", 0x0000ff);
            // this.npcs.push(cityNPC);
            }
        },
        {
            key: "getNPCs",
            value: function getNPCs() {
                // Return NPCs that are part of this city.
                // These NPCs' positions would be relative to the city's group (this.mesh).
                // The Player class will need to transform their positions to world space.
                return this.npcs;
            }
        },
        {
            key: "update",
            value: function update(deltaTime) {
                // Update city-specific elements, like animations or NPC logic
                this.npcs.forEach(function(npc) {
                    if (npc.update) {
                    // npc.update(deltaTime, someBounds); // NPCs might need bounds for movement
                    }
                });
                // Example: Animate something in the city
                this.mesh.rotation.y += deltaTime * 0.01; // Slow rotation of the entire city group for demo
            }
        },
        {
            // Helper to get interaction data, similar to CostumeShop or NPC
            key: "getInteractionData",
            value: function getInteractionData() {
                return {
                    name: this.name,
                    worldPosition: this.mesh.position.clone()
                };
            }
        }
    ]);
    return City;
}();
