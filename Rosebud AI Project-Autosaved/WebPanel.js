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
function _instanceof(left, right) {
    if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) {
        return !!right[Symbol.hasInstance](left);
    } else {
        return left instanceof right;
    }
}
export var WebPanel = /*#__PURE__*/ function() {
    "use strict";
    function WebPanel(parentElement, audioManager) {
        _class_call_check(this, WebPanel);
        this.parentElement = parentElement || document.body;
        this.audioManager = audioManager;
        this.panelElement = null;
        this.isVisible = false;
        this._defaultTitle = 'Channel & Charity Information';
        this._defaultContentHTML = '\n<div style="font-size: 14px; line-height: 1.6; text-align: left;">\n    <h4 style="margin-top: 0; color: #A0C0FF; text-align: center; border-bottom: 1px solid #506070; padding-bottom: 10px; margin-bottom: 15px;">Channel & Charity Information</h4>\n    <p>On My Channel 75% Of Proceeds Will Be Going To <a href="https://www.okwildlifefoundation.org" target="_blank" rel="noopener noreferrer" style="color: #ADD8E6; text-decoration: underline;">The Oklahoma Wildlife Conservation Foundation</a>.</p>\n    <p>The Other Percentage Of The Proceeds Will Be Used to Grow And Improve My Channel.</p>\n    <p>I Will Be Rotating The Charities To:</p>\n    <ul style="padding-left: 20px; margin-bottom: 15px; list-style-type: disc;">\n        <li><a href="https://www.stjude.org/donate/pm.html" target="_blank" rel="noopener noreferrer" style="color: #ADD8E6; text-decoration: underline;">St. Jude Children\'s Research Hospital</a></li>\n        <li><a href="https://support.nature.org/site/Donation2" target="_blank" rel="noopener noreferrer" style="color: #ADD8E6; text-decoration: underline;">The Nature Conservancy</a></li>\n        <li><a href="https://secure.wfpusa.org/donate/save-lives-giving-food-today-donate-now-29" target="_blank" rel="noopener noreferrer" style="color: #ADD8E6; text-decoration: underline;">World Food Program USA</a></li>\n        <li><a href="https://support.woundedwarriorproject.org/Default" target="_blank" rel="noopener noreferrer" style="color: #ADD8E6; text-decoration: underline;">Wounded Warrior Project</a></li>\n    </ul>\n    <p>Every so often, and if you can support the Channel, even a little, I\'ll make sure to do my best to distribute the proceeds fairly to the charities & make frequent updates to both YouTube and Patreon, including streaming on Twitch.</p>\n    <hr style="border: 0; border-top: 1px solid #506070; margin: 20px 0;">\n    <h5 style="color: #A0C0FF; margin-bottom: 10px;">Proceeds Breakdown:</h5>\n    <ul style="padding-left: 20px; list-style-type: disc;">\n        <li>10% Goes To Expenses</li>\n        <li>15% Goes To The Channel</li>\n        <li>75% Goes To Charities</li>\n    </ul>\n    <p style="text-align: center; margin-top: 15px; font-size: 13px; color: #bbb;">Press [L] to view the shared document.</p>\n    <p style="text-align: center; margin-top: 5px; font-size: 13px; color: #aaa;">Press [M] to close this panel.</p>\n</div>\n';
        this.iframeElement = null; // For displaying web content
        this.htmlContentArea = null; // For displaying HTML content
        this._createDOMElements();
    }
    _create_class(WebPanel, [
        {
            key: "_createDOMElements",
            value: function _createDOMElements() {
                this.panelElement = document.createElement('div');
                this.panelElement.id = 'genericWebPanel';
                this.panelElement.style.position = 'absolute';
                this.panelElement.style.top = '50%';
                this.panelElement.style.left = '50%';
                this.panelElement.style.transform = 'translate(-50%, -50%)';
                this.panelElement.style.width = '400px'; // A bit wider
                this.panelElement.style.minHeight = '250px';
                // this.panelElement.style.padding = '25px'; // Padding will be on children or handled by flex
                this.panelElement.style.backgroundColor = 'rgba(30, 40, 50, 0.92)';
                this.panelElement.style.color = '#E0E0E0';
                this.panelElement.style.border = '1px solid #506070';
                this.panelElement.style.borderRadius = '10px';
                this.panelElement.style.boxShadow = '0 4px 15px rgba(0,0,0,0.3)';
                this.panelElement.style.fontFamily = "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif";
                this.panelElement.style.zIndex = '160';
                this.panelElement.style.display = 'none'; // Changed to 'flex' in show()
                this.panelElement.style.flexDirection = 'column';
                this.panelElement.style.boxSizing = 'border-box';
                this.panelElement.style.padding = '25px';
                var title = document.createElement('h3');
                title.id = 'webPanelTitle';
                title.textContent = this._defaultTitle;
                title.style.textAlign = 'center';
                title.style.marginTop = '0';
                title.style.marginBottom = '15px'; // Adjusted margin
                title.style.color = '#90B0FF';
                title.style.fontSize = '22px';
                title.style.borderBottom = '1px solid #506070';
                title.style.paddingBottom = '10px';
                title.style.flexShrink = '0'; // Title should not shrink
                var contentWrapper = document.createElement('div');
                contentWrapper.id = 'webPanelContentWrapper';
                contentWrapper.style.flexGrow = '1'; // Takes remaining vertical space
                contentWrapper.style.overflow = 'hidden'; // Crucial for iframe and general containment
                contentWrapper.style.position = 'relative'; // For children to fill 100%
                this.htmlContentArea = document.createElement('div');
                this.htmlContentArea.id = 'webPanelHtmlContent';
                this.htmlContentArea.style.width = '100%';
                this.htmlContentArea.style.height = '100%';
                this.htmlContentArea.style.overflowY = 'auto';
                this.htmlContentArea.style.fontSize = '16px';
                this.htmlContentArea.style.lineHeight = '1.6';
                this.htmlContentArea.style.display = 'block'; // Initial display, setContent will adjust
                // Help text is removed as default content is now a URL.
                // this._defaultContentHTML is set in the constructor.
                // this.htmlContentArea will be cleared by setContent if a URL is loaded.
                this.iframeElement = document.createElement('iframe');
                this.iframeElement.id = 'webPanelIframe';
                this.iframeElement.style.width = '100%';
                this.iframeElement.style.height = '100%';
                this.iframeElement.style.border = 'none';
                this.iframeElement.style.display = 'none'; // Hidden by default
                contentWrapper.appendChild(this.htmlContentArea);
                contentWrapper.appendChild(this.iframeElement);
                this.panelElement.appendChild(title);
                this.panelElement.appendChild(contentWrapper);
                this.parentElement.appendChild(this.panelElement);
                this.setContent(this._defaultContentHTML); // Initialize with default content
            }
        },
        {
            key: "showDefaultContent",
            value: function showDefaultContent() {
                this.setTitle(this._defaultTitle);
                this.setContent(this._defaultContentHTML);
                // Ensure it's visible if called when panel is hidden
                if (!this.isVisible) {
                    this.show();
                }
            }
        },
        {
            key: "show",
            value: function show() {
                if (this.panelElement) {
                    this.panelElement.style.display = 'flex'; // Use flex for column layout
                    this.isVisible = true;
                    if (this.audioManager) this.audioManager.playSound('dialogue_click');
                }
            }
        },
        {
            key: "hide",
            value: function hide() {
                if (this.panelElement) {
                    this.panelElement.style.display = 'none';
                    this.isVisible = false;
                    if (this.audioManager) this.audioManager.playSound('dialogue_click');
                }
            }
        },
        {
            key: "toggle",
            value: function toggle() {
                if (this.isVisible) {
                    this.hide();
                } else {
                    this.show();
                }
                return this.isVisible;
            }
        },
        {
            key: "isPanelVisible",
            value: function isPanelVisible() {
                return this.isVisible;
            }
        },
        {
            key: "setContent",
            value: function setContent(contentOrUrl) {
                if (typeof contentOrUrl === 'string' && (contentOrUrl.startsWith('http://') || contentOrUrl.startsWith('https://'))) {
                    // It's a URL, show iframe
                    if (this.htmlContentArea) {
                        this.htmlContentArea.style.display = 'none';
                    }
                    if (this.iframeElement) {
                        this.iframeElement.src = contentOrUrl;
                        this.iframeElement.style.display = 'block';
                    }
                } else {
                    // It's HTML string or an HTMLElement, show htmlContentArea
                    if (this.iframeElement) {
                        this.iframeElement.src = 'about:blank'; // Clear src
                        this.iframeElement.style.display = 'none';
                    }
                    if (this.htmlContentArea) {
                        this.htmlContentArea.innerHTML = ''; // Clear existing content
                        if (typeof contentOrUrl === 'string') {
                            this.htmlContentArea.innerHTML = contentOrUrl;
                        } else if (_instanceof(contentOrUrl, HTMLElement)) {
                            this.htmlContentArea.appendChild(contentOrUrl);
                        }
                        this.htmlContentArea.style.display = 'block';
                    }
                }
            }
        },
        {
            key: "setTitle",
            value: function setTitle(titleText) {
                var titleElement = this.panelElement.querySelector('#webPanelTitle'); // Use ID
                if (titleElement) {
                    titleElement.textContent = titleText;
                }
            }
        },
        {
            key: "dispose",
            value: function dispose() {
                if (this.panelElement && this.panelElement.parentElement) {
                    this.panelElement.parentElement.removeChild(this.panelElement);
                }
                this.panelElement = null;
                this.iframeElement = null;
                this.htmlContentArea = null;
            }
        }
    ]);
    return WebPanel;
}();
