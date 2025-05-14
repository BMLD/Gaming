function _array_like_to_array(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for(var i = 0, arr2 = new Array(len); i < len; i++)arr2[i] = arr[i];
    return arr2;
}
function _array_with_holes(arr) {
    if (Array.isArray(arr)) return arr;
}
function _array_without_holes(arr) {
    if (Array.isArray(arr)) return _array_like_to_array(arr);
}
function _iterable_to_array(iter) {
    if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
}
function _iterable_to_array_limit(arr, i) {
    var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];
    if (_i == null) return;
    var _arr = [];
    var _n = true;
    var _d = false;
    var _s, _e;
    try {
        for(_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true){
            _arr.push(_s.value);
            if (i && _arr.length === i) break;
        }
    } catch (err) {
        _d = true;
        _e = err;
    } finally{
        try {
            if (!_n && _i["return"] != null) _i["return"]();
        } finally{
            if (_d) throw _e;
        }
    }
    return _arr;
}
function _non_iterable_rest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _non_iterable_spread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _sliced_to_array(arr, i) {
    return _array_with_holes(arr) || _iterable_to_array_limit(arr, i) || _unsupported_iterable_to_array(arr, i) || _non_iterable_rest();
}
function _to_consumable_array(arr) {
    return _array_without_holes(arr) || _iterable_to_array(arr) || _unsupported_iterable_to_array(arr) || _non_iterable_spread();
}
function _unsupported_iterable_to_array(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _array_like_to_array(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(n);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _array_like_to_array(o, minLen);
}
var _this = this;
import { jsxDEV as _jsxDEV, Fragment as _Fragment } from "react/jsx-dev-runtime";
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Game } from './Game.js';
import { ChatApp } from './ChatApp.js';
var AppStyles = {
    toggleChatButton: {
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        padding: '10px 15px',
        backgroundColor: '#6c757d',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        zIndex: 101,
        fontSize: '14px',
        boxShadow: '0 2px 5px rgba(0,0,0,0.3)'
    }
};
export var App = function() {
    var gameContainerRef = useRef(null);
    var gameInstanceRef = useRef(null);
    var _useState = _sliced_to_array(useState(true), 2), isChatVisible = _useState[0], setIsChatVisible = _useState[1];
    var _useState1 = _sliced_to_array(useState([
        {
            id: Date.now() + Math.random(),
            sender: 'System',
            text: 'Welcome to the chat!'
        }
    ]), 2), chatMessages = _useState1[0], setChatMessages = _useState1[1];
    var addChatMessageToApp = useCallback(function(senderName, text, isLocal) {
        var newId = Date.now() + Math.random(); // Ensure unique ID
        var messageSender = isLocal ? 'You' : senderName;
        setChatMessages(function(prevMessages) {
            return [
                {
                    id: newId,
                    sender: messageSender,
                    text: text
                }
            ].concat(_to_consumable_array(prevMessages));
        });
        if (!isLocal && gameInstanceRef.current && gameInstanceRef.current.audioManager) {
            gameInstanceRef.current.audioManager.playSound('chat_receive');
        }
    }, []);
    useEffect(function() {
        if (gameContainerRef.current && !gameInstanceRef.current) {
            var game = new Game(gameContainerRef.current, addChatMessageToApp); // Pass callback
            game.start();
            gameInstanceRef.current = game;
            return function() {
                if (gameInstanceRef.current) {
                    // Placeholder for game cleanup
                    console.log("Game instance would be cleaned up here.");
                }
            };
        }
    }, [
        addChatMessageToApp
    ]); // Add addChatMessageToApp to dependency array
    var toggleChatVisibility = useCallback(function() {
        setIsChatVisible(function(prev) {
            return !prev;
        });
    }, []);
    var handleSendChatMessage = useCallback(function(messageText) {
        if (gameInstanceRef.current && gameInstanceRef.current.networkManager) {
            gameInstanceRef.current.networkManager.sendChatMessage(messageText);
        } else {
            console.warn("App: Cannot send chat message, game or networkManager not available.");
        }
    }, []);
    useEffect(function() {
        var handleKeyPress = function(event) {
            // Prevent toggling if an input field, textarea, or contentEditable element has focus
            var activeElement = document.activeElement;
            var isInputFocused = activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA' || activeElement.isContentEditable);
            if (event.key.toLowerCase() === 't' && !isInputFocused) {
                toggleChatVisibility();
            }
        };
        window.addEventListener('keydown', handleKeyPress);
        return function() {
            window.removeEventListener('keydown', handleKeyPress);
        };
    }, [
        toggleChatVisibility
    ]);
    return /*#__PURE__*/ _jsxDEV(_Fragment, {
        children: [
            /*#__PURE__*/ _jsxDEV("div", {
                ref: gameContainerRef,
                style: {
                    width: '100%',
                    height: '100%',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    zIndex: 1
                }
            }, void 0, false, {
                fileName: "App.js",
                lineNumber: 76,
                columnNumber: 7
            }, _this),
            /*#__PURE__*/ _jsxDEV(ChatApp, {
                isVisible: isChatVisible,
                onToggleVisibility: toggleChatVisibility,
                messages: chatMessages,
                onSendMessage: handleSendChatMessage
            }, void 0, false, {
                fileName: "App.js",
                lineNumber: 87,
                columnNumber: 7
            }, _this),
            !isChatVisible && /*#__PURE__*/ _jsxDEV("button", {
                onClick: toggleChatVisibility,
                style: AppStyles.toggleChatButton,
                "aria-label": "Toggle Chat Visibility",
                children: "Chat (T)"
            }, void 0, false, {
                fileName: "App.js",
                lineNumber: 94,
                columnNumber: 9
            }, _this)
        ]
    }, void 0, true);
};
