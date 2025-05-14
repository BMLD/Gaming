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
import { jsxDEV as _jsxDEV } from "react/jsx-dev-runtime";
import React, { useState, useEffect, useRef } from 'react';
var ChatAppStyles = {
    chatContainer: function(isVisible) {
        return {
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            width: '300px',
            height: '400px',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)',
            display: isVisible ? 'flex' : 'none',
            flexDirection: 'column',
            fontFamily: 'Arial, sans-serif',
            color: '#fff',
            zIndex: 100,
            overflow: 'hidden',
            transition: 'opacity 0.3s ease-in-out, transform 0.3s ease-in-out',
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(20px)'
        };
    },
    header: {
        padding: '10px',
        backgroundColor: 'rgba(20, 20, 20, 0.9)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        textAlign: 'center',
        fontSize: '16px',
        fontWeight: 'bold'
    },
    messageList: {
        flexGrow: 1,
        overflowY: 'auto',
        padding: '10px',
        display: 'flex',
        flexDirection: 'column-reverse'
    },
    messageItem: {
        marginBottom: '8px',
        padding: '6px 10px',
        borderRadius: '4px',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        wordWrap: 'break-word'
    },
    messageSender: {
        fontWeight: 'bold',
        fontSize: '0.9em',
        color: '#aaa',
        marginBottom: '2px'
    },
    messageText: {
        fontSize: '0.95em'
    },
    inputArea: {
        display: 'flex',
        padding: '10px',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        backgroundColor: 'rgba(10, 10, 10, 0.8)'
    },
    inputField: {
        flexGrow: 1,
        padding: '8px',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        borderRadius: '4px',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        color: '#fff',
        marginRight: '8px',
        outline: 'none'
    },
    sendButton: {
        padding: '8px 15px',
        border: 'none',
        borderRadius: '4px',
        backgroundColor: '#007bff',
        color: '#fff',
        cursor: 'pointer',
        fontWeight: 'bold'
    },
    toggleButton: {
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        padding: '10px 15px',
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        zIndex: 101,
        fontSize: '14px',
        boxShadow: '0 2px 5px rgba(0,0,0,0.3)'
    }
};
export var ChatApp = function(param) {
    var isVisible = param.isVisible, onToggleVisibility = param.onToggleVisibility, messages = param.messages, onSendMessage = param.onSendMessage;
    // Removed internal messages state: const [messages, setMessages] = useState(...)
    var _useState = _sliced_to_array(useState(''), 2), inputValue = _useState[0], setInputValue = _useState[1];
    var messageListRef = useRef(null);
    var inputRef = useRef(null);
    var handleInputChange = function(e) {
        setInputValue(e.target.value);
    };
    var handleSendMessage = function() {
        if (inputValue.trim() === '') return;
        if (onSendMessage) {
            onSendMessage(inputValue.trim());
        }
        setInputValue('');
        if (inputRef.current) {
            inputRef.current.focus();
        }
    };
    var handleKeyPress = function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };
    useEffect(function() {
        if (messageListRef.current) {
            messageListRef.current.scrollTop = 0;
        }
    }, [
        messages
    ]);
    useEffect(function() {
        if (isVisible && inputRef.current) {
            inputRef.current.focus();
        }
    }, [
        isVisible
    ]);
    return /*#__PURE__*/ _jsxDEV("div", {
        style: ChatAppStyles.chatContainer(isVisible),
        children: [
            /*#__PURE__*/ _jsxDEV("div", {
                style: ChatAppStyles.header,
                children: "Game Chat (Press 'T' to toggle)"
            }, void 0, false, {
                fileName: "ChatApp.js",
                lineNumber: 131,
                columnNumber: 7
            }, _this),
            /*#__PURE__*/ _jsxDEV("div", {
                style: ChatAppStyles.messageList,
                ref: messageListRef,
                children: _to_consumable_array(messages).reverse().map(function(msg) {
                    return /*#__PURE__*/ _jsxDEV("div", {
                        style: ChatAppStyles.messageItem,
                        children: [
                            /*#__PURE__*/ _jsxDEV("div", {
                                style: ChatAppStyles.messageSender,
                                children: msg.sender
                            }, void 0, false, {
                                fileName: "ChatApp.js",
                                lineNumber: 135,
                                columnNumber: 13
                            }, _this),
                            /*#__PURE__*/ _jsxDEV("div", {
                                style: ChatAppStyles.messageText,
                                children: msg.text
                            }, void 0, false, {
                                fileName: "ChatApp.js",
                                lineNumber: 136,
                                columnNumber: 13
                            }, _this)
                        ]
                    }, msg.id, true, {
                        fileName: "ChatApp.js",
                        lineNumber: 134,
                        columnNumber: 11
                    }, _this);
                })
            }, void 0, false, {
                fileName: "ChatApp.js",
                lineNumber: 132,
                columnNumber: 7
            }, _this),
            /*#__PURE__*/ _jsxDEV("div", {
                style: ChatAppStyles.inputArea,
                children: [
                    /*#__PURE__*/ _jsxDEV("input", {
                        ref: inputRef,
                        type: "text",
                        value: inputValue,
                        onChange: handleInputChange,
                        onKeyPress: handleKeyPress,
                        style: ChatAppStyles.inputField,
                        placeholder: "Type a message...",
                        disabled: !isVisible
                    }, void 0, false, {
                        fileName: "ChatApp.js",
                        lineNumber: 141,
                        columnNumber: 9
                    }, _this),
                    /*#__PURE__*/ _jsxDEV("button", {
                        onClick: handleSendMessage,
                        style: ChatAppStyles.sendButton,
                        disabled: !isVisible,
                        children: "Send"
                    }, void 0, false, {
                        fileName: "ChatApp.js",
                        lineNumber: 151,
                        columnNumber: 9
                    }, _this)
                ]
            }, void 0, true, {
                fileName: "ChatApp.js",
                lineNumber: 140,
                columnNumber: 7
            }, _this)
        ]
    }, void 0, true, {
        fileName: "ChatApp.js",
        lineNumber: 130,
        columnNumber: 5
    }, _this);
};
