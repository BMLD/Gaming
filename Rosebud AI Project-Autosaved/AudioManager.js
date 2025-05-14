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
export var AudioManager = /*#__PURE__*/ function() {
    "use strict";
    function AudioManager(camera) {
        _class_call_check(this, AudioManager);
        this.listener = new THREE.AudioListener();
        if (camera) {
            camera.add(this.listener);
        }
        this.sounds = {};
        this.audioLoader = new THREE.AudioLoader();
    }
    _create_class(AudioManager, [
        {
            key: "loadSound",
            value: function loadSound(name, path) {
                var _this = this;
                var loop = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : false, volume = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : 0.5;
                return new Promise(function(resolve, reject) {
                    _this.audioLoader.load(path, function(buffer) {
                        var sound = new THREE.Audio(_this.listener);
                        sound.setBuffer(buffer);
                        sound.setLoop(loop);
                        sound.setVolume(volume);
                        _this.sounds[name] = sound;
                        resolve(sound);
                    }, undefined, function(err) {
                        console.error("AudioManager: Error loading sound ".concat(name, " from ").concat(path), err);
                        reject(err);
                    });
                });
            }
        },
        {
            key: "playSound",
            value: function playSound(name) {
                var sound = this.sounds[name];
                if (sound) {
                    if (sound.isPlaying) {
                        sound.stop(); // Stop and restart if already playing (for rapid SFX)
                    }
                    sound.play();
                } else {
                    console.warn('AudioManager: Sound "'.concat(name, '" not found or not loaded.'));
                }
            }
        }
    ]);
    return AudioManager;
}();
