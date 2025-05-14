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
export var CostumeShop = /*#__PURE__*/ function() {
    "use strict";
    function CostumeShop(scene) {
        var initialPosition = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : new THREE.Vector3(10, 0, 10);
        _class_call_check(this, CostumeShop);
        this.scene = scene;
        this.mesh = new THREE.Group();
        this.mesh.position.copy(initialPosition);
        this.name = "Costume Shop"; // Name for interaction prompt
        this._createShopStall();
        this.scene.add(this.mesh);
        // Define an interaction collider for the shop (e.g., a box around it)
        // This Box3 will be in world space after being updated.
        this.interactionCollider = new THREE.Box3();
        this._updateInteractionCollider(); // Initial calculation
        console.log("Costume Shop created at:", initialPosition);
    }
    _create_class(CostumeShop, [
        {
            key: "_createShopStall",
            value: function _createShopStall() {
                var _this = this;
                var stallMaterial = new THREE.MeshStandardMaterial({
                    color: 0x8B4513
                }); // Wood color
                var roofMaterial = new THREE.MeshStandardMaterial({
                    color: 0xD2691E
                }); // Chocolate color for roof
                // Base platform
                var baseGeo = new THREE.BoxGeometry(4, 0.5, 3);
                var base = new THREE.Mesh(baseGeo, stallMaterial);
                base.position.y = 0.25;
                this.mesh.add(base);
                // Counter
                var counterGeo = new THREE.BoxGeometry(3.8, 1, 0.5);
                var counter = new THREE.Mesh(counterGeo, stallMaterial);
                counter.position.set(0, 0.5 + 0.25, 1); // y is base height + half counter height, z in front
                this.mesh.add(counter);
                // Support poles
                var poleGeo = new THREE.CylinderGeometry(0.15, 0.15, 2.5, 8);
                var polePositions = [
                    new THREE.Vector3(-1.8, 0.25 + 1.25, 1.3),
                    new THREE.Vector3(1.8, 0.25 + 1.25, 1.3),
                    new THREE.Vector3(-1.8, 0.25 + 1.25, -1.3),
                    new THREE.Vector3(1.8, 0.25 + 1.25, -1.3)
                ];
                polePositions.forEach(function(pos) {
                    var pole = new THREE.Mesh(poleGeo, stallMaterial);
                    pole.position.copy(pos);
                    _this.mesh.add(pole);
                });
                // Roof
                var roofGeo = new THREE.BoxGeometry(4.2, 0.3, 3.2);
                var roof = new THREE.Mesh(roofGeo, roofMaterial);
                roof.position.y = 0.25 + 2.5 + 0.15; // Top of poles + half roof height
                this.mesh.add(roof);
                // Sign
                var signGeo = new THREE.PlaneGeometry(2, 1);
                var signCanvas = document.createElement('canvas');
                signCanvas.width = 256;
                signCanvas.height = 128;
                var ctx = signCanvas.getContext('2d');
                ctx.fillStyle = '#F0E68C'; // Light yellow background
                ctx.fillRect(0, 0, 256, 128);
                ctx.fillStyle = '#5D4037'; // Dark brown text
                ctx.font = 'bold 30px Arial';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText('Costumes!', 128, 64);
                var signTexture = new THREE.CanvasTexture(signCanvas);
                var signMat = new THREE.MeshStandardMaterial({
                    map: signTexture,
                    side: THREE.DoubleSide
                });
                var sign = new THREE.Mesh(signGeo, signMat);
                sign.position.set(0, base.position.y + 0.5 + 1 + 0.5, counter.position.z + 0.25 + 0.1); // Above counter, slightly forward
                sign.rotation.x = -Math.PI / 12; // Slight tilt
                this.mesh.add(sign);
                this.mesh.traverse(function(child) {
                    if (child.isMesh) {
                        child.castShadow = true;
                        child.receiveShadow = true;
                    }
                });
            }
        },
        {
            key: "_updateInteractionCollider",
            value: function _updateInteractionCollider() {
                // This creates a Box3 in world space around the shop's mesh.
                // For a simple approach, we can base it on the shop's mesh bounding box.
                // Ensure the mesh is updated if it moves or its children change significantly.
                this.mesh.updateMatrixWorld(true); // Ensure world matrix is up-to-date
                this.interactionCollider.setFromObject(this.mesh, true); // true to use precise option if available
                // Optionally expand it slightly to make interaction easier
                this.interactionCollider.expandByScalar(0.5);
            }
        },
        {
            key: "getInteractionData",
            value: function getInteractionData() {
                // This method will be called by the Player to check for interaction.
                // It needs to return data similar to what NPCs provide.
                return {
                    name: this.name,
                    // No dialogue array needed for now, interaction will open a UI later
                    // dialogue: ["Welcome to the Costume Shop! Press [I] to browse (placeholder)."], 
                    worldPosition: this.mesh.position.clone(),
                    collider: this.interactionCollider // Player can check intersection with this Box3
                };
            }
        },
        {
            key: "update",
            value: function update(deltaTime) {
            // Shop specific animations or updates can go here later
            // For example, a spinning sign or flickering lights
            // No dynamic updates needed for the collider if the shop doesn't move.
            }
        },
        {
            // Placeholder for when the player interacts and opens the shop UI
            key: "openShopUI",
            value: function openShopUI(player) {
                console.log("".concat(player.constructor.name, " is opening the ").concat(this.name));
                // Future: this.uiManager.showCostumeShop(this.availableCostumes);
                if (this.scene.game && this.scene.game.uiManager) {
                    this.scene.game.uiManager.showNotification("Welcome to the ".concat(this.name, "! (UI coming soon)"), 2000);
                }
            }
        }
    ]);
    return CostumeShop;
}();
