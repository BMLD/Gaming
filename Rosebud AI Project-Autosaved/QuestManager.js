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
export var QuestManager = /*#__PURE__*/ function() {
    "use strict";
    function QuestManager(dialogueManager, inventoryManager, uiManager, player) {
        _class_call_check(this, QuestManager);
        this.dialogueManager = dialogueManager;
        this.inventoryManager = inventoryManager;
        this.uiManager = uiManager;
        this.player = player; // Store player reference
        this.quests = {}; // To store quest states
        this.activeQuests = [];
        console.log("QuestManager initialized");
        // Example: Define a simple quest
        this._initializeQuests();
    }
    _create_class(QuestManager, [
        {
            key: "_initializeQuests",
            value: function _initializeQuests() {
                this.quests.crystalCollection = {
                    id: 'crystalCollection',
                    npcId: 'Captain Ishmael',
                    description: "Collect 5 shimmering crystals for Captain Ishmael.",
                    objective: {
                        type: 'collect',
                        item: 'crystal',
                        count: 0,
                        target: 5
                    },
                    rewards: {
                        experience: 100,
                        items: []
                    },
                    isStarted: false,
                    isCompleted: false,
                    dialogue: {
                        start: [
                            "Captain Ishmael: Ahoy! I need your help to gather 5 crystals. Their glow... it's peculiar.",
                            "Captain Ishmael: Bring them to me, and I'll make it worth your while."
                        ],
                        incomplete: [
                            "Captain Ishmael: Still need those crystals, matey. The full count, if ye please."
                        ],
                        complete: [
                            "Captain Ishmael: Remarkable! These crystals are just what I needed. Here's your reward.",
                            "Captain Ishmael: You've a keen eye for treasure, friend!"
                        ]
                    }
                };
                this.quests.lostLocket = {
                    id: 'lostLocket',
                    npcId: 'Mystic Mira',
                    description: "Find Mystic Mira's lost locket.",
                    objective: {
                        type: 'find',
                        item: 'locket',
                        found: false
                    },
                    rewards: {
                        experience: 75,
                        items: []
                    },
                    isStarted: false,
                    isCompleted: false,
                    dialogue: {
                        start: [
                            "Mystic Mira: Oh, traveler... I've misplaced something precious, a locket given to me by the stars themselves.",
                            "Mystic Mira: It must be somewhere on this island. Could you help me find it? The spirits feel... unsettled without it."
                        ],
                        incomplete: [
                            "Mystic Mira: The locket... it still calls out. Have you found it yet?"
                        ],
                        complete: [
                            "Mystic Mira: You found it! The stars sing their thanks through me. Blessings upon you, kind soul."
                        ]
                    }
                };
            }
        },
        {
            key: "startQuest",
            value: function startQuest(questId) {
                var quest = this.quests[questId];
                if (quest && !quest.isStarted) {
                    quest.isStarted = true;
                    this.activeQuests.push(questId);
                    console.log("Quest started: ".concat(quest.description));
                    if (this.uiManager) {
                        this.uiManager.showNotification("Quest Started: ".concat(quest.description));
                    }
                // Dialogue for quest start is now handled by handleNPCInteraction to avoid double dialogue
                // if (this.dialogueManager && quest.dialogue.start) {
                //      this.dialogueManager.startDialogue(quest.npcId, quest.dialogue.start);
                // }
                }
            }
        },
        {
            key: "notifyCrystalCollected",
            value: function notifyCrystalCollected() {
                var questId = 'crystalCollection'; // Assuming this is the relevant quest
                var quest = this.quests[questId];
                if (quest && quest.isStarted && !quest.isCompleted) {
                    if (quest.objective.type === 'collect' && quest.objective.item === 'crystal') {
                        quest.objective.count++;
                        console.log("Crystals collected for quest: ".concat(quest.objective.count, "/").concat(quest.objective.target));
                        if (this.uiManager) {
                            this.uiManager.showNotification("Quest Update: Crystals ".concat(quest.objective.count, "/").concat(quest.objective.target));
                        }
                        if (quest.objective.count >= quest.objective.target) {
                            this.completeQuest(questId);
                        }
                    }
                }
            }
        },
        {
            key: "handleNPCInteraction",
            value: function handleNPCInteraction(npc) {
                // Example: Captain Ishmael gives the crystal collection quest
                if (npc.name === 'Captain Ishmael') {
                    var quest = this.quests.crystalCollection;
                    if (!quest.isStarted) {
                        this.dialogueManager.startDialogue(npc.name, quest.dialogue.start);
                        this.startQuest('crystalCollection');
                        return true; // Dialogue handled by quest system
                    } else if (quest.isStarted && !quest.isCompleted) {
                        this.dialogueManager.startDialogue(npc.name, quest.dialogue.incomplete);
                        return true;
                    } else if (quest.isCompleted) {
                    // Potentially different dialogue if quest is already done
                    // For now, let it fall through or provide a generic "thanks again"
                    }
                }
                // Handle Mystic Mira and the Lost Locket quest
                if (npc.name === 'Mystic Mira') {
                    var quest1 = this.quests.lostLocket;
                    if (!quest1.isStarted) {
                        this.dialogueManager.startDialogue(npc.name, quest1.dialogue.start);
                        this.startQuest('lostLocket');
                        return true;
                    } else if (quest1.isStarted && !quest1.isCompleted) {
                        if (quest1.objective.found) {
                            this.dialogueManager.startDialogue(npc.name, quest1.dialogue.complete);
                            this.completeQuest('lostLocket');
                        } else {
                            this.dialogueManager.startDialogue(npc.name, quest1.dialogue.incomplete);
                        }
                        return true;
                    } else if (quest1.isCompleted) {
                        // Optional: dialogue if player talks to Mira after completing
                        this.dialogueManager.startDialogue(npc.name, [
                            "Mystic Mira: The stars are calm once more, thanks to you."
                        ]);
                        return true;
                    }
                }
                return false; // NPC interaction not handled by quest system, let default dialogue play
            }
        },
        {
            key: "notifyItemFound",
            value: function notifyItemFound(itemName) {
                if (itemName === 'locket') {
                    var quest = this.quests.lostLocket;
                    if (quest && quest.isStarted && !quest.objective.found) {
                        quest.objective.found = true;
                        console.log("Lost Locket found!");
                        if (this.uiManager) {
                            this.uiManager.showNotification("You found the Lost Locket! Return it to Mystic Mira.", 3000);
                        }
                        if (this.player) {
                            this.player.addXP(10); // Directly award XP
                        } else {
                            console.log("Player gained 10 XP (Insight) - Player reference missing in QuestManager.");
                        }
                    // No automatic completion, player needs to return it.
                    }
                }
            }
        },
        {
            key: "completeQuest",
            value: function completeQuest(questId) {
                var quest = this.quests[questId];
                if (quest && quest.isStarted && !quest.isCompleted) {
                    var canComplete = false;
                    if (quest.objective.type === 'collect' && quest.objective.count >= quest.objective.target) {
                        canComplete = true;
                    } else if (quest.objective.type === 'find' && quest.objective.found) {
                        // For 'find' quests, completion happens upon returning item,
                        // but this method marks it internally as completable.
                        // The actual dialogue and reward trigger is in handleNPCInteraction.
                        canComplete = true;
                    }
                    if (canComplete) {
                        quest.isCompleted = true;
                        console.log("Quest completed: ".concat(quest.description));
                        if (this.uiManager) {
                            this.uiManager.showNotification("Quest Completed: ".concat(quest.description, "!"));
                        }
                        // Give rewards, etc. (placeholder for now)
                        console.log("Rewards:", quest.rewards);
                    }
                }
            }
        },
        {
            key: "getQuestStatus",
            value: function getQuestStatus(questId) {
                return this.quests[questId];
            }
        }
    ]);
    return QuestManager;
}();
