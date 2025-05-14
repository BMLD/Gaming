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
import { NPC } from './NPC.js';
import { Enemy } from './Enemy.js';
import { Parrot } from './Parrot.js';
import { Tavern } from './Tavern.js';
import { BuriedTreasure } from './BuriedTreasure.js'; // Import BuriedTreasure
import { Deer } from './Deer.js'; // Import Deer
var ISLAND_RADIUS = 60;
var NUM_TREES = 30;
var NUM_ROCKS = 20;
var NUM_CRYSTALS = 15;
var NUM_NPCS = 5;
var NUM_TARGET_DUMMIES = 3; // Number of target dummies
var NUM_ENEMIES = 3; // Number of basic enemies
var NUM_PARROTS = 15;
var NUM_BURIED_TREASURES = 8; // Number of buried treasure spots
var NUM_DEER = 5; // Number of deer
export var World = /*#__PURE__*/ function() {
    "use strict";
    function World(scene, gameInstance) {
        _class_call_check(this, World);
        this.scene = scene;
        this.game = gameInstance;
        this.collectibles = []; // For crystals etc.
        this.questItems = []; // For specific quest-related items
        this.npcs = [];
        this.targetDummies = []; // Array for target dummies
        this.enemies = [];
        this.parrots = [];
        this.tavern = null;
        this.buriedTreasures = []; // Array for buried treasures
        this.deer = []; // Array for deer
        this._createGround();
        this._populateEnvironment();
        this._createCollectibles();
        this._createQuestItems(); // New method for quest items
        this._createNPCs();
        this._createTargetDummies(); // Create the dummies
        this._createEnemies();
        this._createParrots();
        this._createTavern();
        this._createBuriedTreasures(); // Create buried treasures
        this._createDeer(); // Create deer
    }
    _create_class(World, [
        {
            key: "_createGround",
            value: function _createGround() {
                var groundGeometry = new THREE.CylinderGeometry(ISLAND_RADIUS, ISLAND_RADIUS, 1, 64);
                var groundMaterial = new THREE.MeshStandardMaterial({
                    color: 0x55aa55
                }); // Grassy green
                var ground = new THREE.Mesh(groundGeometry, groundMaterial);
                ground.position.y = -0.5; // So top is at y=0
                ground.receiveShadow = true;
                this.scene.add(ground);
                // Water plane
                var waterGeometry = new THREE.PlaneGeometry(200, 200);
                var waterMaterial = new THREE.MeshStandardMaterial({
                    color: 0x3399ff,
                    transparent: true,
                    opacity: 0.7
                });
                var water = new THREE.Mesh(waterGeometry, waterMaterial);
                water.rotation.x = -Math.PI / 2;
                water.position.y = -0.8;
                this.scene.add(water);
            }
        },
        {
            key: "_populateEnvironment",
            value: function _populateEnvironment() {
                // Trees
                var treeTrunkGeo = new THREE.CylinderGeometry(0.3, 0.4, 2, 8);
                var treeTrunkMat = new THREE.MeshStandardMaterial({
                    color: 0x8B4513
                }); // Brown
                var treeLeavesGeo = new THREE.ConeGeometry(1.5, 3, 8);
                var treeLeavesMat = new THREE.MeshStandardMaterial({
                    color: 0x228B22
                }); // Forest green
                for(var i = 0; i < NUM_TREES; i++){
                    var angle = Math.random() * Math.PI * 2;
                    var radius = THREE.MathUtils.randFloat(5, ISLAND_RADIUS - 3); // Keep trees away from edge and center a bit
                    var x = Math.cos(angle) * radius;
                    var z = Math.sin(angle) * radius;
                    var trunk = new THREE.Mesh(treeTrunkGeo, treeTrunkMat);
                    trunk.position.set(x, 1, z); // Trunk base at y=1 (on ground)
                    trunk.castShadow = true;
                    trunk.receiveShadow = true;
                    this.scene.add(trunk);
                    var leaves = new THREE.Mesh(treeLeavesGeo, treeLeavesMat);
                    leaves.position.set(x, 3.5, z); // Leaves on top of trunk
                    leaves.castShadow = true;
                    leaves.receiveShadow = true;
                    this.scene.add(leaves);
                }
                // Rocks
                var rockGeo = new THREE.IcosahedronGeometry(THREE.MathUtils.randFloat(0.5, 1.5), 0);
                var rockMat = new THREE.MeshStandardMaterial({
                    color: 0x808080
                }); // Grey
                for(var i1 = 0; i1 < NUM_ROCKS; i1++){
                    var angle1 = Math.random() * Math.PI * 2;
                    var radius1 = THREE.MathUtils.randFloat(3, ISLAND_RADIUS - 2);
                    var x1 = Math.cos(angle1) * radius1;
                    var z1 = Math.sin(angle1) * radius1;
                    var rock = new THREE.Mesh(rockGeo, rockMat);
                    var rockSize = THREE.MathUtils.randFloat(0.4, 1.2);
                    rock.scale.set(rockSize, rockSize * THREE.MathUtils.randFloat(0.7, 1.3), rockSize); // Varied shapes
                    rock.position.set(x1, rockSize * 0.5, z1); // Rocks sit on ground
                    rock.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
                    rock.castShadow = true;
                    rock.receiveShadow = true;
                    this.scene.add(rock);
                }
            }
        },
        {
            key: "_createCollectibles",
            value: function _createCollectibles() {
                var crystalGeo = new THREE.OctahedronGeometry(0.5, 0);
                var crystalMat = new THREE.MeshStandardMaterial({
                    color: 0xffaa00,
                    emissive: 0xff8800,
                    emissiveIntensity: 0.5,
                    roughness: 0.2,
                    metalness: 0.1
                });
                for(var i = 0; i < NUM_CRYSTALS; i++){
                    var angle = Math.random() * Math.PI * 2;
                    var radius = THREE.MathUtils.randFloat(2, ISLAND_RADIUS - 4);
                    var x = Math.cos(angle) * radius;
                    var z = Math.sin(angle) * radius;
                    var y = THREE.MathUtils.randFloat(1, 3); // Vary height
                    // Each crystal needs its own material instance to animate emissiveIntensity independently
                    var individualCrystalMat = crystalMat.clone();
                    var crystal = new THREE.Mesh(crystalGeo, individualCrystalMat);
                    crystal.position.set(x, y, z);
                    crystal.castShadow = true;
                    // Add a point light to make crystals glow more
                    var pointLight = new THREE.PointLight(0xffaa00, 2, 5); // color, intensity, distance
                    // pointLight.position.copy(crystal.position); // Light is child of crystal, so its position is relative
                    crystal.add(pointLight); // Light moves with crystal
                    crystal.userData.collider = new THREE.Sphere(crystal.position, 0.6); // Collider for collection
                    crystal.userData.initialY = y; // For bobbing animation
                    crystal.userData.initialEmissiveIntensity = individualCrystalMat.emissiveIntensity;
                    crystal.userData.animationOffset = Math.random() * Math.PI * 2; // Randomize animation start
                    this.scene.add(crystal);
                    this.collectibles.push(crystal);
                }
            }
        },
        {
            key: "_createQuestItems",
            value: function _createQuestItems() {
                // Lost Locket for Mystic Mira's quest
                // A simple heart shape or a shiny disc. Let's go with a small, flat cylinder (disc).
                var locketGeo = new THREE.CylinderGeometry(0.25, 0.25, 0.05, 16); // radiusTop, radiusBottom, height, radialSegments
                var locketMat = new THREE.MeshStandardMaterial({
                    color: 0xFFD700,
                    metalness: 0.8,
                    roughness: 0.3,
                    emissive: 0xccaa00,
                    emissiveIntensity: 0.4
                });
                var locket = new THREE.Mesh(locketGeo, locketMat);
                // Place it somewhere specific, e.g., near a distinct rock formation or tree
                locket.position.set(10, 0.6, -15); // Example position, adjust as needed
                locket.rotation.x = Math.PI / 2; // Lay it flat
                locket.castShadow = true;
                locket.userData = {
                    itemName: 'locket',
                    collider: new THREE.Sphere(locket.position, 0.4),
                    type: 'questItem' // To distinguish from regular collectibles
                };
                this.scene.add(locket);
                this.questItems.push(locket);
                // Add a subtle point light to make it glint a bit
                var locketLight = new THREE.PointLight(0xFFD700, 0.5, 2);
                locket.add(locketLight); // Light is child of locket
            }
        },
        {
            key: "_createNPCs",
            value: function _createNPCs() {
                var npcColors = [
                    0xff6347,
                    0x4682b4,
                    0x3cb371,
                    0xdda0dd,
                    0xf0e68c
                ];
                var npcNames = [
                    "Guard Tom",
                    "Mystic Mira",
                    "Old Fisherman Finn",
                    "Adventurer Alex",
                    "Quiet Sage Kai"
                ];
                for(var i = 0; i < NUM_NPCS; i++){
                    var angle = Math.random() * Math.PI * 2;
                    var radius = THREE.MathUtils.randFloat(ISLAND_RADIUS * 0.2, ISLAND_RADIUS * 0.7);
                    var x = Math.cos(angle) * radius;
                    var z = Math.sin(angle) * radius;
                    var name = npcNames[i % npcNames.length];
                    var color = npcColors[i % npcColors.length];
                    var npc = new NPC(this.scene, new THREE.Vector3(x, 0.9, z), name, color);
                    this.npcs.push(npc);
                }
            }
        },
        {
            key: "getCollectibles",
            value: function getCollectibles() {
                return this.collectibles;
            }
        },
        {
            key: "getNPCs",
            value: function getNPCs() {
                return this.npcs;
            }
        },
        {
            key: "getQuestItems",
            value: function getQuestItems() {
                return this.questItems;
            }
        },
        {
            key: "getTargetDummies",
            value: function getTargetDummies() {
                return this.targetDummies.filter(function(dummy) {
                    return dummy.visible;
                }); // Only return visible dummies
            }
        },
        {
            key: "getEnemies",
            value: function getEnemies() {
                return this.enemies.filter(function(enemy) {
                    return !enemy.isDefeated;
                });
            }
        },
        {
            key: "getInteractableStructures",
            value: function getInteractableStructures() {
                var structures = [];
                if (this.tavern) {
                    structures.push(this.tavern.getInteractionData());
                }
                // Add buried treasures to interactables
                this.buriedTreasures.forEach(function(bt) {
                    if (bt.visible && !bt.isDugUp) {
                        structures.push(bt.getInteractionData());
                    }
                });
                // Add lootable deer
                this.deer.forEach(function(d) {
                    if (d.isLootable) {
                        structures.push(d.getInteractionData());
                    }
                });
                // Add other interactable structures here in the future
                return structures;
            }
        },
        {
            key: "getDeer",
            value: function getDeer() {
                return this.deer.filter(function(d) {
                    return d.isAlive || d.isLootable;
                }); // Return alive or lootable deer
            }
        },
        {
            key: "_createTargetDummies",
            value: function _createTargetDummies() {
                var dummyGeo = new THREE.BoxGeometry(1, 2, 1); // Simple box shape
                var dummyMat = new THREE.MeshStandardMaterial({
                    color: 0xcc0000
                }); // Red color
                for(var i = 0; i < NUM_TARGET_DUMMIES; i++){
                    var dummy = new THREE.Mesh(dummyGeo, dummyMat.clone()); // Clone material for individual color changes
                    // Position them at intervals
                    var x = (i - (NUM_TARGET_DUMMIES - 1) / 2) * 5; // Spread them out along x-axis
                    var z = -ISLAND_RADIUS + 5; // Place them towards one edge of the island
                    dummy.position.set(x, 1, z); // y=1 so it sits on the ground
                    dummy.castShadow = true;
                    dummy.receiveShadow = true;
                    dummy.userData.collider = new THREE.Box3().setFromObject(dummy);
                    dummy.userData.isHit = false;
                    dummy.userData.hitTimer = 0;
                    dummy.userData.originalColor = dummy.material.color.clone();
                    dummy.userData.hitColor = new THREE.Color(0xffff00); // Yellow when hit
                    this.scene.add(dummy);
                    this.targetDummies.push(dummy);
                }
            }
        },
        {
            // Method to be called by a projectile
            key: "handleDummyHit",
            value: function handleDummyHit(dummy) {
                if (!dummy.userData.isHit) {
                    dummy.userData.isHit = true;
                    dummy.material.color.copy(dummy.userData.hitColor);
                    dummy.userData.hitTimer = 0.2; // Briefly show hit color
                    // Emit particles on hit
                    if (this.game && this.game.particleSystem) {
                        var hitPosition = dummy.position.clone().add(new THREE.Vector3(0, 1, 0)); // Approx center of dummy
                        this.game.particleSystem.emit({
                            count: 25,
                            position: hitPosition,
                            baseVelocity: new THREE.Vector3(0, 1, 0),
                            spread: new THREE.Vector3(2.5, 2.5, 2.5),
                            lifetime: 0.6,
                            size: 0.12,
                            color: new THREE.Color(0xffff00),
                            gravity: new THREE.Vector3(0, -1.5, 0),
                            initialOpacity: 0.9
                        });
                    }
                    // Optional: Play a hit sound
                    if (this.game && this.game.audioManager) {
                        this.game.audioManager.playSound('dummy_hit');
                    }
                }
            }
        },
        {
            key: "update",
            value: function update(deltaTime) {
                // Animate collectibles (e.g., bobbing)
                this.collectibles.forEach(function(crystal) {
                    if (crystal.visible) {
                        var time = Date.now() * 0.001; // Time in seconds
                        var animTime = time + crystal.userData.animationOffset;
                        // Rotation
                        crystal.rotation.y += 0.5 * deltaTime;
                        // Bobbing
                        crystal.position.y = crystal.userData.initialY + Math.sin(animTime * 2) * 0.25;
                        // Pulsing scale
                        var scalePulse = 1.0 + Math.sin(animTime * 1.5) * 0.1; // Pulse between 0.9 and 1.1
                        crystal.scale.set(scalePulse, scalePulse, scalePulse);
                        // Pulsing emissive intensity
                        if (crystal.material && crystal.material.emissiveIntensity !== undefined) {
                            crystal.material.emissiveIntensity = crystal.userData.initialEmissiveIntensity + Math.sin(animTime * 2.5) * 0.3;
                        }
                        // Update collider position if crystal moves
                        crystal.userData.collider.center.copy(crystal.position);
                    }
                });
                // Animate quest items (e.g., gentle bob or spin)
                this.questItems.forEach(function(item) {
                    if (item.visible && item.userData.itemName === 'locket') {
                        var time = Date.now() * 0.001;
                        item.rotation.z += 0.3 * deltaTime; // Gentle spin on its flat axis (was Y, now Z due to X rotation)
                        item.position.y = 0.6 + Math.sin(time * 1.5) * 0.1; // Gentle bob
                        item.userData.collider.center.copy(item.position);
                    }
                });
                // Update NPCs
                this.npcs.forEach(function(npc) {
                    npc.update(deltaTime, ISLAND_RADIUS);
                });
                // Update enemies
                var playerPosition = this.game && this.game.player ? this.game.player.mesh.position : null;
                for(var i = this.enemies.length - 1; i >= 0; i--){
                    var enemy = this.enemies[i];
                    if (enemy.isDefeated && !enemy.parent) {
                        this.enemies.splice(i, 1);
                        continue;
                    }
                    enemy.update(deltaTime, playerPosition);
                }
                // Update target dummies
                for(var i1 = this.targetDummies.length - 1; i1 >= 0; i1--){
                    var dummy = this.targetDummies[i1];
                    if (dummy.userData.isHit) {
                        dummy.userData.hitTimer -= deltaTime;
                        if (dummy.userData.hitTimer <= 0) {
                            // After hit effect, make it disappear
                            dummy.visible = false;
                        // Optional: remove from scene and array for permanent removal
                        // this.scene.remove(dummy);
                        // this.targetDummies.splice(i, 1);
                        // For now, just making it invisible allows for potential reset later.
                        }
                    }
                    if (dummy.visible) {
                        dummy.userData.collider.setFromObject(dummy);
                    }
                }
                // Update parrots
                this.parrots.forEach(function(parrot) {
                    parrot.update(deltaTime);
                });
                // Update Tavern
                if (this.tavern) {
                    this.tavern.update(deltaTime);
                }
                // Update Deer
                this.deer.forEach(function(d) {
                    d.update(deltaTime, playerPosition);
                });
            }
        },
        {
            key: "_createParrots",
            value: function _createParrots() {
                var parrotColors = [
                    0xff0000,
                    0x00ff00,
                    0x0000ff,
                    0xffff00,
                    0xff00ff,
                    0x00ffff
                ];
                for(var i = 0; i < NUM_PARROTS; i++){
                    var angle = Math.random() * Math.PI * 2;
                    var radius = THREE.MathUtils.randFloat(ISLAND_RADIUS * 0.3, ISLAND_RADIUS * 0.9); // Spread them out
                    var x = Math.cos(angle) * radius;
                    var z = Math.sin(angle) * radius;
                    var y = THREE.MathUtils.randFloat(5, 10); // Flying height
                    var color = parrotColors[i % parrotColors.length];
                    var audioManager = this.game ? this.game.audioManager : null;
                    var player = this.game ? this.game.player : null;
                    var parrot = new Parrot(this.scene, new THREE.Vector3(x, y, z), color, audioManager, player);
                    this.parrots.push(parrot);
                }
            }
        },
        {
            key: "_createEnemies",
            value: function _createEnemies() {
                for(var i = 0; i < NUM_ENEMIES; i++){
                    var angle = Math.random() * Math.PI * 2;
                    // Place them in a slightly different area or spread them out
                    var radius = THREE.MathUtils.randFloat(ISLAND_RADIUS * 0.5, ISLAND_RADIUS * 0.8);
                    var x = Math.cos(angle) * radius;
                    var z = Math.sin(angle) * radius;
                    // Ensure gameInstance is passed to Enemy if it needs it for particles/audio
                    var enemy = new Enemy(this.scene, new THREE.Vector3(x, 0, z), "Bandit ".concat(i + 1), this.game);
                    this.enemies.push(enemy);
                }
            }
        },
        {
            key: "_createTavern",
            value: function _createTavern() {
                // Position the tavern somewhere accessible, e.g., near the center or a path
                var tavernPosition = new THREE.Vector3(5, 0, -10); // Example position
                this.tavern = new Tavern(this.scene, tavernPosition);
            }
        },
        {
            key: "_createBuriedTreasures",
            value: function _createBuriedTreasures() {
                for(var i = 0; i < NUM_BURIED_TREASURES; i++){
                    var angle = Math.random() * Math.PI * 2;
                    var radius = THREE.MathUtils.randFloat(ISLAND_RADIUS * 0.1, ISLAND_RADIUS * 0.9);
                    var x = Math.cos(angle) * radius;
                    var z = Math.sin(angle) * radius;
                    // Ensure y is at ground level for the treasure's base.
                    // The BuriedTreasure class positions its mesh relative to its group's origin.
                    var y = 0;
                    var goldAmount = THREE.MathUtils.randInt(5, 25);
                    var silverAmount = THREE.MathUtils.randInt(20, 100);
                    var treasure = new BuriedTreasure(this.scene, new THREE.Vector3(x, y, z), {
                        gold: goldAmount,
                        silver: silverAmount
                    });
                    this.buriedTreasures.push(treasure);
                }
            }
        },
        {
            key: "_createDeer",
            value: function _createDeer() {
                for(var i = 0; i < NUM_DEER; i++){
                    var angle = Math.random() * Math.PI * 2;
                    var radius = THREE.MathUtils.randFloat(ISLAND_RADIUS * 0.2, ISLAND_RADIUS * 0.8);
                    var x = Math.cos(angle) * radius;
                    var z = Math.sin(angle) * radius;
                    // Deer are positioned with their group origin at y=0, mesh base is at y=0 relative to group.
                    var deerInstance = new Deer(this.scene, new THREE.Vector3(x, 0, z), this.game);
                    this.deer.push(deerInstance);
                }
            }
        }
    ]);
    return World;
} // Closing brace for the World class
();
