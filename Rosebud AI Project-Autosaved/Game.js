function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
    try {
        var info = gen[key](arg);
        var value = info.value;
    } catch (error) {
        reject(error);
        return;
    }
    if (info.done) {
        resolve(value);
    } else {
        Promise.resolve(value).then(_next, _throw);
    }
}
function _async_to_generator(fn) {
    return function() {
        var self = this, args = arguments;
        return new Promise(function(resolve, reject) {
            var gen = fn.apply(self, args);
            function _next(value) {
                asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
            }
            function _throw(err) {
                asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
            }
            _next(undefined);
        });
    };
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
function _ts_generator(thisArg, body) {
    var f, y, t, g, _ = {
        label: 0,
        sent: function() {
            if (t[0] & 1) throw t[1];
            return t[1];
        },
        trys: [],
        ops: []
    };
    return g = {
        next: verb(0),
        "throw": verb(1),
        "return": verb(2)
    }, typeof Symbol === "function" && (g[Symbol.iterator] = function() {
        return this;
    }), g;
    function verb(n) {
        return function(v) {
            return step([
                n,
                v
            ]);
        };
    }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while(_)try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [
                op[0] & 2,
                t.value
            ];
            switch(op[0]){
                case 0:
                case 1:
                    t = op;
                    break;
                case 4:
                    _.label++;
                    return {
                        value: op[1],
                        done: false
                    };
                case 5:
                    _.label++;
                    y = op[1];
                    op = [
                        0
                    ];
                    continue;
                case 7:
                    op = _.ops.pop();
                    _.trys.pop();
                    continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                        _ = 0;
                        continue;
                    }
                    if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                        _.label = op[1];
                        break;
                    }
                    if (op[0] === 6 && _.label < t[1]) {
                        _.label = t[1];
                        t = op;
                        break;
                    }
                    if (t && _.label < t[2]) {
                        _.label = t[2];
                        _.ops.push(op);
                        break;
                    }
                    if (t[2]) _.ops.pop();
                    _.trys.pop();
                    continue;
            }
            op = body.call(thisArg, _);
        } catch (e) {
            op = [
                6,
                e
            ];
            y = 0;
        } finally{
            f = t = 0;
        }
        if (op[0] & 5) throw op[1];
        return {
            value: op[0] ? op[1] : void 0,
            done: true
        };
    }
}
import * as THREE from 'three';
import { Player } from './Player.js';
import { World } from './World.js';
import { InputController } from './InputController.js';
import { Stats } from './Stats.js';
import { DialogueManager } from './DialogueManager.js';
import { AudioManager } from './AudioManager.js';
import { InventoryManager } from './InventoryManager.js';
import { UIManager } from './UIManager.js';
import { TouchControls } from './TouchControls.js';
import { Projectile } from './Projectile.js';
import { GameOverManager } from './GameOverManager.js';
import { PirateShip } from './PirateShip.js';
import { City } from './City.js';
import { QuestManager } from './QuestManager.js';
import { ParticleSystem } from './ParticleSystem.js';
import { Tavern } from './Tavern.js'; // Ensure Tavern is imported if Player needs to instanceof check
import { CostumeShop } from './CostumeShop.js'; // Import CostumeShop
import { RemotePlayer } from './RemotePlayer.js'; // Import RemotePlayer
import { NetworkManager } from './NetworkManager.js'; // Import NetworkManager
import { WebPanel } from './WebPanel.js'; // Import WebPanel
export var Game = /*#__PURE__*/ function() {
    "use strict";
    function Game(renderDiv, onChatMessageReceivedCallback) {
        var _this = this;
        _class_call_check(this, Game);
        this.renderDiv = renderDiv;
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({
            antialias: true
        });
        this.inputController = new InputController();
        this.stats = new Stats(renderDiv); // Stats also appends to renderDiv
        this.audioManager = new AudioManager(this.camera);
        this.dialogueManager = new DialogueManager(document.body, this.audioManager); // Appends to body
        this.inventoryManager = new InventoryManager(document.body, this.audioManager, this); // Pass game instance
        this.uiManager = new UIManager(document.body);
        this.gameOverManager = new GameOverManager(document.body); // Initialize GameOverManager
        this.touchControls = null; // Will be initialized in _setup
        this.questManager = null; // Will be initialized in _setup
        this.clock = new THREE.Clock();
        this.isPaused = false;
        this.isGameEffectivelyPaused = false; // True if 'P' is pressed, inventory is open, or dialogue is active
        this.isReady = false;
        this.score = 0;
        this.projectiles = []; // Array to hold active projectiles
        this.pirateShip = null; // To hold the pirate ship instance
        this.city = null; // To hold the City instance (renamed from seaTown)
        this.costumeShop = null; // To hold the CostumeShop instance
        this.particleSystem = null; // To hold the ParticleSystem instance
        this.remotePlayers = {}; // To store remote players, keyed by ID
        this.networkManager = null; // To hold the NetworkManager instance
        this.webPanel = null; // To hold the WebPanel instance
        this.isInsideTavern = false; // State for being inside a tavern
        this.currentTavern = null; // Reference to the currently entered tavern
        this.onChatMessageReceivedCallback = onChatMessageReceivedCallback; // Store the callback
        this._loadAssets().then(function() {
            _this._setup();
            _this.isReady = true;
            console.log("Game is ready to start.");
        });
    }
    _create_class(Game, [
        {
            key: "_loadAssets",
            value: function _loadAssets() {
                var _this = this;
                return _async_to_generator(function() {
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                // URLs from the provided asset list
                                return [
                                    4,
                                    _this.audioManager.loadSound('collect_crystal', 'https://play.rosebud.ai/assets/symbol1.mp3?3qDq', false, 0.5)
                                ];
                            case 1:
                                _state.sent();
                                return [
                                    4,
                                    _this.audioManager.loadSound('dialogue_click', 'https://play.rosebud.ai/assets/press_but.mp3?Ep9M', false, 0.4)
                                ];
                            case 2:
                                _state.sent();
                                return [
                                    4,
                                    _this.audioManager.loadSound('shoot', 'https://play.rosebud.ai/assets/spin_but.mp3?xE90', false, 0.3)
                                ];
                            case 3:
                                _state.sent(); // Example shoot sound
                                return [
                                    4,
                                    _this.audioManager.loadSound('collect_quest_item', 'https://play.rosebud.ai/assets/symbol2.mp3?kebE', false, 0.6)
                                ];
                            case 4:
                                _state.sent(); // Sound for quest items
                                return [
                                    4,
                                    _this.audioManager.loadSound('level_up', 'https://play.rosebud.ai/assets/start_bonus.mp3?spw3', false, 0.7)
                                ];
                            case 5:
                                _state.sent(); // Dedicated level up sound
                                return [
                                    4,
                                    _this.audioManager.loadSound('jump_sound', 'https://play.rosebud.ai/assets/press_but.mp3?Ep9M', false, 0.45)
                                ];
                            case 6:
                                _state.sent(); // Jump sound
                                return [
                                    4,
                                    _this.audioManager.loadSound('land_sound', 'https://play.rosebud.ai/assets/reel_stop.mp3?pb4q', false, 0.4)
                                ];
                            case 7:
                                _state.sent(); // Landing sound
                                return [
                                    4,
                                    _this.audioManager.loadSound('dummy_hit', 'https://play.rosebud.ai/assets/reel_stop_bonus.mp3?FmPY', false, 0.5)
                                ];
                            case 8:
                                _state.sent(); // Sound for dummy hit
                                return [
                                    4,
                                    _this.audioManager.loadSound('chat_receive', 'https://play.rosebud.ai/assets/press_but.mp3?Ep9M', false, 0.35)
                                ];
                            case 9:
                                _state.sent(); // Sound for new chat message
                                return [
                                    4,
                                    _this.audioManager.loadSound('parrot_nearby', 'https://play.rosebud.ai/assets/symbol1.mp3?3qDq', false, 0.3)
                                ];
                            case 10:
                                _state.sent(); // Sound for nearby parrot
                                // Add more sounds here as needed
                                console.log("Audio assets loaded");
                                return [
                                    2
                                ];
                        }
                    });
                })();
            }
        },
        {
            key: "_setup",
            value: function _setup() {
                var _this = this;
                this.renderer.setSize(window.innerWidth, window.innerHeight);
                this.renderer.setPixelRatio(window.devicePixelRatio);
                this.renderer.shadowMap.enabled = true;
                this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
                this.renderDiv.appendChild(this.renderer.domElement);
                this.scene.background = new THREE.Color(0x87CEEB); // Sky blue
                this.scene.fog = new THREE.Fog(0x87CEEB, 50, 150);
                // Lighting
                var ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
                this.scene.add(ambientLight);
                var directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
                directionalLight.position.set(15, 20, 10);
                directionalLight.castShadow = true;
                directionalLight.shadow.mapSize.width = 2048;
                directionalLight.shadow.mapSize.height = 2048;
                directionalLight.shadow.camera.near = 0.5;
                directionalLight.shadow.camera.far = 500;
                directionalLight.shadow.camera.left = -50;
                directionalLight.shadow.camera.right = 50;
                directionalLight.shadow.camera.top = 50;
                directionalLight.shadow.camera.bottom = -50;
                this.scene.add(directionalLight);
                this.scene.add(directionalLight.target);
                this.world = new World(this.scene, this);
                // Player needs to be initialized before QuestManager if QuestManager needs a player reference
                this.player = new Player(this.scene, this.camera, this.inputController, this.world, this.dialogueManager, this.audioManager, this.uiManager, null, this); // Pass null for questManager initially
                this.questManager = new QuestManager(this.dialogueManager, this.inventoryManager, this.uiManager, this.player); // Now pass player to QuestManager
                this.player.questManager = this.questManager; // Assign questManager to player
                // Instantiate the PirateShip
                this.pirateShip = new PirateShip(this.scene, new THREE.Vector3(0, 0.5, -35));
                // Instantiate the City
                this.city = new City(this.scene, new THREE.Vector3(45, 0, 10)); // Position it at a new location
                // Instantiate the CostumeShop
                this.costumeShop = new CostumeShop(this.scene, new THREE.Vector3(15, 0, -5)); // Position the costume shop
                this.costumeShop.scene.game = this; // Give shop a ref to game for UIManager access
                // Instantiate the ParticleSystem
                this.particleSystem = new ParticleSystem(this.scene);
                // Instantiate the WebPanel
                this.webPanel = new WebPanel(document.body, this.audioManager);
                // The WebPanel now sets its own default title and content.
                this.camera.position.set(0, 5, 10);
                this.camera.lookAt(this.player.mesh.position);
                // Initialize TouchControls if on a touch device (basic check)
                if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
                    this.touchControls = new TouchControls(this.inputController, document.body);
                }
                // Example: Create a single remote player for testing (this will be managed by NetworkManager later)
                // const testRemotePlayerId = 'remotePlayer1';
                // this.remotePlayers[testRemotePlayerId] = new RemotePlayer(this.scene, new THREE.Vector3(3, 0.7, -2));
                // Initialize NetworkManager
                this.networkManager = new NetworkManager(this);
                this.networkManager.connect(); // Attempt to connect (simulated for now)
                window.addEventListener('resize', this._onWindowResize.bind(this), false);
                // Game control key listeners (these will still work alongside touch)
                document.addEventListener('keydown', function(event) {
                    if (event.key === 'p' || event.key === 'P') {
                        if (!_this.inventoryManager.isInventoryVisible()) {
                            _this.isPaused = !_this.isPaused;
                            _this.stats.togglePauseMessage(_this.isPaused);
                            _this._updateEffectivePauseState();
                        }
                    }
                    if (event.key === 'i' || event.key === 'I') {
                        if (!_this.isPaused) {
                            var inventoryWasVisible = _this.inventoryManager.isInventoryVisible();
                            var inventoryIsNowVisible = _this.inventoryManager.toggleInventory();
                            // If inventory just opened, or just closed, update effective pause
                            if (inventoryWasVisible !== inventoryIsNowVisible) {
                                _this._updateEffectivePauseState();
                            }
                        }
                    }
                    if (event.key === 'm' || event.key === 'M') {
                        if (!_this.isPaused && !(_this.inventoryManager && _this.inventoryManager.isInventoryVisible()) && !(_this.dialogueManager && _this.dialogueManager.isDialogueActive()) && !(_this.uiManager.screenFader && _this.uiManager.screenFader.isFading)) {
                            if (_this.webPanel) {
                                if (_this.webPanel.isPanelVisible()) {
                                    // If panel is visible, regardless of content, 'M' now hides it.
                                    _this.webPanel.hide();
                                } else {
                                    // If panel is hidden, 'M' now shows the default content.
                                    _this.webPanel.showDefaultContent();
                                }
                                _this._updateEffectivePauseState();
                            }
                        }
                    }
                    if (event.key === 'k' || event.key === 'K') {
                        if (!_this.isPaused && !(_this.inventoryManager && _this.inventoryManager.isInventoryVisible()) && !(_this.dialogueManager && _this.dialogueManager.isDialogueActive()) && !(_this.uiManager.screenFader && _this.uiManager.screenFader.isFading) && _this.webPanel && _this.player) {
                            var titleElement = _this.webPanel.panelElement.querySelector('#webPanelTitle');
                            var currentPanelTitle = titleElement ? titleElement.textContent : '';
                            if (_this.webPanel.isPanelVisible() && currentPanelTitle === "Player Stats") {
                                _this.webPanel.hide();
                            } else {
                                _this.webPanel.setTitle("Player Stats");
                                var pStats = _this.player.getCurrentXPStats();
                                var htStats = _this.player.getHungerThirstStats();
                                var cStats = _this.player.getCurrencyStats();
                                var statsHTML = '\n                            <div style="text-align: left; font-size: 15px;">\n                                <p><strong>Level:</strong> '.concat(pStats.level, "</p>\n                                <p><strong>XP:</strong> ").concat(pStats.xp, " / ").concat(pStats.xpToNextLevel, '</p>\n                                <hr style="border: 0; border-top: 1px solid #405060; margin: 8px 0;">\n                                <p><strong>Gold:</strong> ').concat(cStats.gold, "</p>\n                                <p><strong>Silver:</strong> ").concat(cStats.silver, '</p>\n                                <hr style="border: 0; border-top: 1px solid #405060; margin: 8px 0;">\n                                <p><strong>Hunger:</strong> ').concat(Math.floor(htStats.currentHunger), " / ").concat(htStats.maxHunger, "</p>\n                                <p><strong>Thirst:</strong> ").concat(Math.floor(htStats.currentThirst), " / ").concat(htStats.maxThirst, '</p>\n                                <button id="statsPanelBackToHelpButton" style="margin-top: 20px; padding: 10px 18px; background-color: #007bff; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 15px;">Show Default Panel</button>\n                            </div>\n                            <p style="text-align: center; margin-top: 25px; font-size: 13px; color: #888;">Press [K] to close. Press [M] for main menu.</p>\n                        ');
                                _this.webPanel.setContent(statsHTML);
                                var backButton = _this.webPanel.panelElement.querySelector('#statsPanelBackToHelpButton');
                                if (backButton) {
                                    backButton.onclick = function() {
                                        if (_this.webPanel) {
                                            _this.webPanel.showDefaultContent();
                                        }
                                    };
                                }
                                if (!_this.webPanel.isPanelVisible()) {
                                    _this.webPanel.show();
                                }
                            }
                            _this._updateEffectivePauseState();
                        }
                    }
                    if (event.code === 'KeyX' && _this.isInsideTavern) {
                        _this.exitTavern();
                    }
                    if (event.key === 'l' || event.key === 'L') {
                        if (!_this.isPaused && !(_this.inventoryManager && _this.inventoryManager.isInventoryVisible()) && !(_this.dialogueManager && _this.dialogueManager.isDialogueActive()) && !(_this.uiManager.screenFader && _this.uiManager.screenFader.isFading) && _this.webPanel) {
                            var panelTitle = "Shared Document";
                            var panelContentUrl = "https://drive.google.com/file/d/1H5qnXmJD4Q0IYdgwtHa3AKNu3ZfkeuBq/preview";
                            var titleElement1 = _this.webPanel.panelElement.querySelector('#webPanelTitle');
                            var currentPanelTitle1 = titleElement1 ? titleElement1.textContent : '';
                            // Check iframe src to determine if it's the same content
                            var currentIframeSrc = _this.webPanel.iframeElement ? _this.webPanel.iframeElement.src : '';
                            if (_this.webPanel.isPanelVisible() && currentPanelTitle1 === panelTitle && currentIframeSrc === panelContentUrl) {
                                _this.webPanel.hide();
                            } else {
                                _this.webPanel.setTitle(panelTitle);
                                _this.webPanel.setContent(panelContentUrl);
                                if (!_this.webPanel.isPanelVisible()) {
                                    _this.webPanel.show();
                                }
                            }
                            _this._updateEffectivePauseState();
                        }
                    }
                });
            }
        },
        {
            key: "_updateEffectivePauseState",
            value: function _updateEffectivePauseState() {
                var dialogueActive = this.dialogueManager ? this.dialogueManager.isDialogueActive() : false;
                var inventoryVisible = this.inventoryManager ? this.inventoryManager.isInventoryVisible() : false;
                var panelVisible = this.webPanel ? this.webPanel.isPanelVisible() : false;
                this.isGameEffectivelyPaused = this.isPaused || inventoryVisible || dialogueActive || panelVisible;
                // Update visual pause indicators
                if (this.isPaused) {
                    this.stats.togglePauseMessage(true);
                } else if (inventoryVisible || dialogueActive || panelVisible) {
                    // If paused due to UI, but not 'P', ensure general pause message is hidden
                    // The UI itself indicates the "paused" state for game actions.
                    this.stats.togglePauseMessage(false);
                } else {
                    this.stats.togglePauseMessage(false); // Not paused by any means
                }
            }
        },
        {
            key: "_onWindowResize",
            value: function _onWindowResize() {
                this.camera.aspect = window.innerWidth / window.innerHeight;
                this.camera.updateProjectionMatrix();
                this.renderer.setSize(window.innerWidth, window.innerHeight);
                if (this.touchControls) {
                    this.touchControls.onWindowResize();
                }
            }
        },
        {
            key: "start",
            value: function start() {
                this._animate();
            }
        },
        {
            key: "addProjectile",
            value: function addProjectile(projectile) {
                this.projectiles.push(projectile);
            }
        },
        {
            key: "_updateProjectiles",
            value: function _updateProjectiles(deltaTime) {
                for(var i = this.projectiles.length - 1; i >= 0; i--){
                    var projectile = this.projectiles[i];
                    projectile.update(deltaTime);
                    // Check for deer collisions
                    if (this.world && typeof this.world.getDeer === 'function') {
                        var deerList = this.world.getDeer();
                        var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                        try {
                            for(var _iterator = deerList[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
                                var deer = _step.value;
                                if (deer.isAlive && projectile.collider.intersectsSphere(deer.collider)) {
                                    deer.takeDamage(projectile.damage, projectile.direction);
                                    projectile.setExpired(); // Projectile is used up
                                    break;
                                }
                            }
                        } catch (err) {
                            _didIteratorError = true;
                            _iteratorError = err;
                        } finally{
                            try {
                                if (!_iteratorNormalCompletion && _iterator.return != null) {
                                    _iterator.return();
                                }
                            } finally{
                                if (_didIteratorError) {
                                    throw _iteratorError;
                                }
                            }
                        }
                    }
                    if (projectile.isExpired()) {
                        projectile.dispose();
                        this.projectiles.splice(i, 1);
                    }
                }
            }
        },
        {
            key: "_animate",
            value: function _animate() {
                requestAnimationFrame(this._animate.bind(this));
                var deltaTime = this.clock.getDelta();
                if (!this.isReady) {
                    this.renderer.render(this.scene, this.camera);
                    return;
                }
                // Check for Game Over first
                if (this.gameOverManager.checkGameOverState()) {
                    this.renderer.render(this.scene, this.camera); // Keep rendering scene
                    return; // Stop further game logic
                }
                this._updateEffectivePauseState(); // Call this each frame to ensure state is current
                // If inside tavern, player input might be handled differently or camera is fixed
                if (this.isInsideTavern) {
                    // Player update might be limited or camera fixed
                    // For now, allow player update but camera is fixed by enterTavern
                    if (this.player) this.player.update(deltaTime); // Still update for animations, etc.
                // Other tavern-specific logic could go here
                } else if (this.isGameEffectivelyPaused) {
                // Player.update() now handles its own dialogue input advancement.
                // No specific action needed here for dialogue if game is paused by 'P' or inventory,
                // as Player.update() will handle dialogue advancement if dialogueManager.isDialogueActive() is true.
                } else {
                    // Normal game updates when not in tavern and not paused
                    this._updateProjectiles(deltaTime);
                    if (this.player) {
                        this.player.update(deltaTime);
                        if (!this.gameOverManager.checkGameOverState() && this.player.mesh.position.y < -5) {
                            this.gameOverManager.showGameOverScreen();
                        }
                    }
                    if (this.world) this.world.update(deltaTime);
                    if (this.pirateShip) this.pirateShip.update(deltaTime);
                    if (this.city) this.city.update(deltaTime);
                    if (this.costumeShop) this.costumeShop.update(deltaTime);
                    if (this.particleSystem) this.particleSystem.update(deltaTime);
                    for(var id in this.remotePlayers){
                        if (this.remotePlayers[id]) {
                            this.remotePlayers[id].update(deltaTime);
                        }
                    }
                }
                // Update NetworkManager (should happen even if game is "paused" for UI reasons, but maybe not during tavern fade)
                if (this.networkManager && !(this.uiManager.screenFader && this.uiManager.screenFader.isFading)) {
                    this.networkManager.update(deltaTime);
                }
                var collectedCount = this.player ? this.player.getCollectedCount() : 0;
                if (this.score !== collectedCount) {
                    this.score = collectedCount;
                    this.stats.updateScore(this.score);
                // Crystal count in inventory is now handled by Player.js calling addItem
                }
                if (this.player && this.stats) {
                    var xpStats = this.player.getCurrentXPStats();
                    this.stats.updateXPLevel(xpStats.level, xpStats.xp, xpStats.xpToNextLevel);
                    var hungerThirstStats = this.player.getHungerThirstStats();
                    this.stats.updateHungerThirstStats(hungerThirstStats);
                    var currencyStats = this.player.getCurrencyStats();
                    this.stats.updateCurrencyStats(currencyStats);
                }
                this.renderer.render(this.scene, this.camera);
            }
        },
        {
            key: "enterTavern",
            value: function enterTavern(tavern) {
                var _this = this;
                if (!this.player || this.isInsideTavern || this.uiManager.screenFader && this.uiManager.screenFader.isFading) return;
                this.player.canControl = false;
                this.uiManager.fadeOutScreen(500, function() {
                    _this.isInsideTavern = true;
                    _this.currentTavern = tavern;
                    var entryPoint = tavern.getInteriorEntryPoint();
                    _this.player.mesh.position.copy(entryPoint);
                    _this.player.mesh.rotation.y = Math.PI; // Face "inwards"
                    _this.player.isWalking = false; // Stop walking animation
                    if (typeof _this.player.mesh.setWalking === 'function') {
                        _this.player.mesh.setWalking(false);
                    }
                    _this.camera.position.copy(tavern.getInteriorCameraPosition());
                    _this.camera.lookAt(tavern.getInteriorCameraLookAt());
                    _this.camera.updateProjectionMatrix(); // Ensure changes are applied
                    if (_this.currentTavern && typeof _this.currentTavern.showInterior === 'function') {
                        _this.currentTavern.showInterior();
                    }
                    _this.uiManager.showNotification("Press [X] to exit Tavern", 3000);
                    _this.uiManager.fadeInScreen(500, function() {
                        _this.player.canControl = true; // Allow control again (though movement is limited by fixed camera)
                    });
                });
            }
        },
        {
            key: "exitTavern",
            value: function exitTavern() {
                var _this = this;
                if (!this.player || !this.isInsideTavern || !this.currentTavern || this.uiManager.screenFader && this.uiManager.screenFader.isFading) return;
                this.player.canControl = false;
                this.uiManager.fadeOutScreen(500, function() {
                    _this.isInsideTavern = false;
                    var exitPoint = _this.currentTavern.getExteriorExitPoint();
                    _this.player.mesh.position.copy(exitPoint);
                    _this.player.mesh.rotation.y = 0; // Face away from tavern (or default)
                    _this.player.isWalking = false;
                    if (typeof _this.player.mesh.setWalking === 'function') {
                        _this.player.mesh.setWalking(false);
                    }
                    if (_this.currentTavern && typeof _this.currentTavern.hideInterior === 'function') {
                        _this.currentTavern.hideInterior();
                    }
                    _this.currentTavern = null;
                    // Player's _updateCameraLogic will take over on next frame
                    _this.uiManager.fadeInScreen(500, function() {
                        _this.player.canControl = true;
                    });
                });
            }
        },
        {
            key: "addRemotePlayer",
            value: function addRemotePlayer(id, positionData, rotationY) {
                if (this.remotePlayers[id]) {
                    console.warn("Game: Attempted to add existing remote player ".concat(id));
                    return;
                }
                var initialPosition = positionData ? new THREE.Vector3(positionData.x, positionData.y, positionData.z) : new THREE.Vector3(0, 0.7, 0);
                var initialRotY = rotationY !== undefined ? rotationY : 0;
                var initialIsWalking = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false; // Check for the 4th argument
                this.remotePlayers[id] = new RemotePlayer(this.scene, initialPosition, initialRotY, initialIsWalking);
                console.log("Game: Added remote player ".concat(id, " with walking state: ").concat(initialIsWalking));
            }
        },
        {
            key: "removeRemotePlayer",
            value: function removeRemotePlayer(id) {
                if (this.remotePlayers[id]) {
                    this.remotePlayers[id].dispose(); // Clean up Three.js resources
                    delete this.remotePlayers[id];
                    console.log("Game: Removed remote player ".concat(id));
                } else {
                    console.warn("Game: Attempted to remove non-existent remote player ".concat(id));
                }
            }
        },
        {
            key: "onChatMessageReceived",
            value: function onChatMessageReceived(senderName, text, isLocal) {
                if (this.onChatMessageReceivedCallback) {
                    this.onChatMessageReceivedCallback(senderName, text, isLocal);
                } else {
                    console.warn("Game: onChatMessageReceivedCallback is not set. Message not passed to UI:", {
                        senderName: senderName,
                        text: text,
                        isLocal: isLocal
                    });
                }
            }
        }
    ]);
    return Game;
}();
