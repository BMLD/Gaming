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
// Enum for message types (example)
var MessageType = {
    PLAYER_UPDATE: 0,
    REMOTE_PLAYER_UPDATE: 1,
    PLAYER_JOIN: 2,
    PLAYER_LEAVE: 3,
    CHAT_MESSAGE: 4,
    CHAT_BROADCAST: 5
};
// Thresholds for sending updates
var POSITION_THRESHOLD_SQ = 0.01 * 0.01; // Square of distance (e.g., 1cm)
var ROTATION_THRESHOLD = 0.01; // Radians (e.g., approx 0.57 degrees)
export var NetworkManager = /*#__PURE__*/ function() {
    "use strict";
    function NetworkManager(game) {
        _class_call_check(this, NetworkManager);
        this.game = game; // Reference to the main Game instance
        this.socket = null; // Placeholder for WebSocket or other connection
        this.localPlayerId = null; // ID assigned by the server (or generated locally for simulation)
        this.isConnecting = false;
        this.isConnected = false;
        // For simulation purposes
        this.simulatedLatency = 50; // ms
        this.simulatedPacketLoss = 0.01; // 1% packet loss
        // Throttling player state updates
        this.lastSentStateTime = 0;
        this.stateUpdateInterval = 100; // ms, so roughly 10 updates per second
        this.lastSentPosition = null;
        this.lastSentRotationY = null;
        console.log("NetworkManager initialized.");
    }
    _create_class(NetworkManager, [
        {
            key: "connect",
            value: function connect() {
                var _this = this;
                var serverUrl = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 'ws://localhost:8080';
                if (this.isConnected || this.isConnecting) {
                    console.warn("NetworkManager: Already connected or connecting.");
                    return;
                }
                this.isConnecting = true;
                console.log("NetworkManager: Attempting to connect to ".concat(serverUrl, "..."));
                // --- WebSocket Implementation (Example - will be commented out for now) ---
                /*
        this.socket = new WebSocket(serverUrl);

        this.socket.onopen = () => {
            this.isConnected = true;
            this.isConnecting = false;
            console.log("NetworkManager: Connected to server.");
            // Server might send a welcome message with player ID
            // For now, let's simulate receiving a player ID
            this.localPlayerId = `player_${Math.random().toString(36).substr(2, 9)}`;
            this.game.uiManager.showNotification(`Connected as ${this.localPlayerId}`, 3000);

            // Notify game about connection (e.g., to spawn local player representation on server)
            if (this.game.player) {
                 this.sendPlayerState(this.game.player.mesh.position, this.game.player.mesh.rotation.y, this.game.player.isWalking);
            }
        };

        this.socket.onmessage = (event) => {
            try {
                const message = JSON.parse(event.data);
                this._handleServerMessage(message);
            } catch (error) {
                console.error("NetworkManager: Error parsing server message:", error, event.data);
            }
        };

        this.socket.onerror = (error) => {
            console.error("NetworkManager: WebSocket error:", error);
            this.isConnecting = false;
            this.isConnected = false;
            // Optionally, try to reconnect or notify the user
            this.game.uiManager.showNotification("Connection error. Please try again.", 3000);
        };

        this.socket.onclose = () => {
            this.isConnected = false;
            this.isConnecting = false;
            console.log("NetworkManager: Disconnected from server.");
            // Clean up remote players, notify user, etc.
            this.game.uiManager.showNotification("Disconnected from server.", 3000);
            for (const playerId in this.game.remotePlayers) {
                this.game.removeRemotePlayer(playerId);
            }
        };
        */ // --- Simulation (for now, as WebSocket won't work directly in this environment) ---
                console.log("NetworkManager: Using simulated connection.");
                setTimeout(function() {
                    _this.isConnecting = false;
                    _this.isConnected = true;
                    _this.localPlayerId = "local_player_".concat(Math.floor(Math.random() * 10000));
                    console.log("NetworkManager: Simulated connection established. Local Player ID: ".concat(_this.localPlayerId));
                    _this.game.uiManager.showNotification("Simulated connection as ".concat(_this.localPlayerId), 2000);
                    // Simulate another player joining
                    setTimeout(function() {
                        if (!_this.isConnected) return; // Check if still connected
                        var remoteId = "sim_remote_".concat(Math.floor(Math.random() * 10000));
                        _this._handleServerMessage({
                            type: MessageType.PLAYER_JOIN,
                            id: remoteId,
                            data: {
                                position: {
                                    x: 5,
                                    y: 0.7,
                                    z: 2
                                },
                                rotationY: 0,
                                isWalking: false
                            }
                        });
                    }, 1000);
                }, 1500); // Simulate connection delay
            }
        },
        {
            key: "disconnect",
            value: function disconnect() {
                if (this.socket && this.socket.readyState === WebSocket.OPEN) {
                    this.socket.close();
                }
                this.isConnected = false;
                this.isConnecting = false;
                console.log("NetworkManager: Disconnected.");
                // Clean up any remaining remote players if disconnect is called manually
                for(var playerId in this.game.remotePlayers){
                    if (this.game.remotePlayers[playerId]) {
                        this.game.removeRemotePlayer(playerId); // Assuming Game has this method
                    }
                }
            }
        },
        {
            // Send local player's state to the server
            key: "sendPlayerState",
            value: function sendPlayerState(position, rotationY, isWalking) {
                if (!this.isConnected) return;
                var now = Date.now();
                // 1. Check time throttle: Has enough time passed since the last actual send?
                if (now - this.lastSentStateTime < this.stateUpdateInterval) {
                    return; // Too soon since the last successful send.
                }
                // 2. Check for significant change
                var significantChange = false;
                if (this.lastSentPosition === null || this.lastSentRotationY === null) {
                    significantChange = true; // Always send the first time after interval resets or initial connect
                } else {
                    var positionSignificantlyChanged = position.distanceToSquared(this.lastSentPosition) > POSITION_THRESHOLD_SQ;
                    var r1 = this.lastSentRotationY;
                    var r2 = rotationY;
                    var twoPI = 2 * Math.PI;
                    var deltaAngle = Math.abs(r1 - r2) % twoPI;
                    var angleDiff = deltaAngle > Math.PI ? twoPI - deltaAngle : deltaAngle;
                    var rotationSignificantlyChanged = angleDiff > ROTATION_THRESHOLD;
                    if (positionSignificantlyChanged || rotationSignificantlyChanged) {
                        significantChange = true;
                    }
                }
                if (!significantChange) {
                    return; // Not enough change to warrant an update
                }
                // If we're here, interval has passed AND there's a significant change.
                this.lastSentStateTime = now; // Update time of this transmission
                if (!this.lastSentPosition) {
                    this.lastSentPosition = new THREE.Vector3();
                }
                this.lastSentPosition.copy(position);
                this.lastSentRotationY = rotationY;
                var message = {
                    type: MessageType.PLAYER_UPDATE,
                    id: this.localPlayerId,
                    data: {
                        position: {
                            x: position.x,
                            y: position.y,
                            z: position.z
                        },
                        rotationY: rotationY,
                        isWalking: isWalking
                    }
                };
                // --- Real WebSocket send ---
                // if (this.socket && this.socket.readyState === WebSocket.OPEN) {
                //     this.socket.send(JSON.stringify(message));
                // }
                // --- Simulation ---
                if (Math.random() < this.simulatedPacketLoss) {
                    console.warn("NetworkManager (Sim): Packet lost (sendPlayerState)");
                    return;
                }
                setTimeout(function() {
                // Simulate server receiving and broadcasting this update
                // In a real scenario, server would send this to other clients
                // For simulation, we can directly update a test remote player or log
                // console.log("NetworkManager (Sim): Sent player state:", message.data);
                // Simulate other clients receiving this player's update
                // This part is tricky without a server; for now, we'll focus on receiving updates.
                }, this.simulatedLatency);
            }
        },
        {
            key: "_handleServerMessage",
            value: function _handleServerMessage(message) {
                var _this = this;
                if (Math.random() < this.simulatedPacketLoss && message.type !== MessageType.PLAYER_JOIN) {
                    console.warn("NetworkManager (Sim): Packet lost (handleServerMessage)", message);
                    return;
                }
                // Simulate latency for receiving messages
                setTimeout(function() {
                    // console.log("NetworkManager: Received message from server:", message);
                    switch(message.type){
                        case MessageType.REMOTE_PLAYER_UPDATE:
                            if (message.id !== _this.localPlayerId && _this.game.remotePlayers[message.id]) {
                                _this.game.remotePlayers[message.id].updateState(message.data);
                            }
                            break;
                        case MessageType.PLAYER_JOIN:
                            if (message.id !== _this.localPlayerId && !_this.game.remotePlayers[message.id]) {
                                console.log("NetworkManager: Player ".concat(message.id, " joined."));
                                _this.game.addRemotePlayer(message.id, message.data.position, message.data.rotationY, message.data.isWalking);
                                _this.game.uiManager.showNotification("Player ".concat(message.id.substring(0, 8), " joined"), 2000);
                            }
                            break;
                        case MessageType.PLAYER_LEAVE:
                            if (_this.game.remotePlayers[message.id]) {
                                console.log("NetworkManager: Player ".concat(message.id, " left."));
                                _this.game.removeRemotePlayer(message.id);
                                _this.game.uiManager.showNotification("Player ".concat(message.id.substring(0, 8), " left"), 2000);
                            }
                            break;
                        case MessageType.CHAT_BROADCAST:
                            if (_this.game && typeof _this.game.onChatMessageReceived === 'function') {
                                _this.game.onChatMessageReceived(message.data.senderName, message.data.text, message.data.senderId === _this.localPlayerId);
                            } else {
                                console.log("NetworkManager (Sim): Received chat broadcast to display:", message.data);
                            }
                            break;
                        // Handle other message types (e.g., initial state)
                        default:
                            console.warn("NetworkManager: Received unknown message type:", message.type, message);
                    }
                }, this.simulatedLatency / 2); // Simulate half latency for processing
            }
        },
        {
            key: "sendChatMessage",
            value: function sendChatMessage(text) {
                var _this = this;
                if (!this.isConnected || !this.localPlayerId) {
                    console.warn("NetworkManager: Cannot send chat message, not connected or no player ID.");
                    return;
                }
                var message = {
                    type: MessageType.CHAT_MESSAGE,
                    id: this.localPlayerId,
                    data: {
                        text: text
                    }
                };
                console.log("NetworkManager (Sim): Sending chat message:", message);
                // Simulate server receiving this message and broadcasting it
                // In a real scenario, server would validate, process, and then send CHAT_BROADCAST
                if (Math.random() < this.simulatedPacketLoss) {
                    console.warn("NetworkManager (Sim): Chat message packet lost (sendChatMessage)");
                    return;
                }
                setTimeout(function() {
                    var broadcastMessage = {
                        type: MessageType.CHAT_BROADCAST,
                        data: {
                            senderId: _this.localPlayerId,
                            // Simple way to get a display name from ID for simulation
                            senderName: "Player ".concat(_this.localPlayerId.substring(_this.localPlayerId.lastIndexOf('_') + 1)),
                            text: text
                        }
                    };
                    // Simulate all clients (including self) receiving the broadcast
                    _this._handleServerMessage(broadcastMessage);
                }, this.simulatedLatency);
            }
        },
        {
            // Called periodically from Game loop
            key: "update",
            value: function update(deltaTime) {
                if (!this.isConnected) return;
                // Example: Simulate receiving updates for a remote player
                // This would normally come from _handleServerMessage via WebSocket
                var testRemotePlayerId = 'remotePlayer1'; // The one created in Game.js
                if (this.game.remotePlayers[testRemotePlayerId]) {
                // This specific simulation is now handled in Game.js,
                // and real updates would come via _handleServerMessage.
                // We can keep a more generic simulation here if needed for other test players.
                }
                // Simulate another remote player that moves independently based on server "messages"
                var simPlayerId = Object.keys(this.game.remotePlayers).find(function(id) {
                    return id.startsWith('sim_remote_');
                });
                if (simPlayerId && this.game.remotePlayers[simPlayerId]) {
                    var time = Date.now() * 0.0003;
                    var newPos = {
                        x: 2 + Math.cos(time) * 3,
                        y: 0.7,
                        z: -3 + Math.sin(time) * 3
                    };
                    var newRotY = Math.atan2(-Math.sin(time) * 3, Math.cos(time) * 3) + Math.PI / 2; // Face direction of travel
                    var isSimWalking = true; // This simulated player is always moving
                    // Simulate a movement message from server for this player
                    this._handleServerMessage({
                        type: MessageType.REMOTE_PLAYER_UPDATE,
                        id: simPlayerId,
                        data: {
                            position: newPos,
                            rotationY: newRotY,
                            isWalking: isSimWalking
                        }
                    });
                    // Simulate a chat message from this remote player occasionally
                    if (Math.random() < 0.002) {
                        var chatTexts = [
                            "Ahoy there!",
                            "Has anyone seen a blue parrot?",
                            "This island is full of surprises.",
                            "Where's the tavern?",
                            "I'm looking for treasure!"
                        ];
                        var randomText = chatTexts[Math.floor(Math.random() * chatTexts.length)];
                        var broadcastMessage = {
                            type: MessageType.CHAT_BROADCAST,
                            data: {
                                senderId: simPlayerId,
                                senderName: "Player ".concat(simPlayerId.substring(simPlayerId.lastIndexOf('_') + 1)),
                                text: randomText
                            }
                        };
                        this._handleServerMessage(broadcastMessage);
                    }
                }
            }
        }
    ]);
    return NetworkManager;
}();
