import { jsxDEV as _jsxDEV } from "react/jsx-dev-runtime";
import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App.js';
// The existing renderDiv might be used by the game canvas,
// but React needs its own root. We'll create a new root for the React app.
// The App component will then provide a div for the game.
// Clear current body and set up a root for React.
document.body.innerHTML = '<div id="reactRoot" style="width: 100%; height: 100%; margin: 0; overflow: hidden;"></div>';
var reactRootElement = document.getElementById('reactRoot');
if (reactRootElement) {
    var root = ReactDOM.createRoot(reactRootElement);
    root.render(/*#__PURE__*/ _jsxDEV(React.StrictMode, {
        children: /*#__PURE__*/ _jsxDEV(App, {}, void 0, false, {
            fileName: "main.js",
            lineNumber: 14,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "main.js",
        lineNumber: 13,
        columnNumber: 5
    }, this));
} else {
    console.error('Failed to find the reactRoot element. Chat and Game cannot be initialized.');
}
