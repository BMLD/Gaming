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
// Helper function to create a dust particle texture, created once
function createDustParticleTexture() {
    var canvas = document.createElement('canvas');
    var size = 64; // Texture size
    canvas.width = size;
    canvas.height = size;
    var context = canvas.getContext('2d');
    var gradient = context.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    // Soft white center, fading to transparent, slightly dusty color at edges
    gradient.addColorStop(0, 'rgba(255, 255, 255, 0.7)');
    gradient.addColorStop(0.3, 'rgba(230, 230, 220, 0.5)');
    gradient.addColorStop(1, 'rgba(200, 200, 180, 0)');
    context.fillStyle = gradient;
    context.fillRect(0, 0, size, size);
    var texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true; // Ensure texture is updated
    return texture;
}
var dustParticleTexture = createDustParticleTexture();
export var Particle = /*#__PURE__*/ function() {
    "use strict";
    function Particle(scene, config) {
        _class_call_check(this, Particle);
        this.scene = scene;
        this.position = config.position.clone();
        this.velocity = config.velocity.clone();
        this.color = config.color || new THREE.Color(0xffffff);
        this.initialSize = config.size || 0.1; // Store initial size for scaling
        this.lifetime = config.lifetime || 1; // in seconds
        this.age = 0; // current age in seconds
        this.gravity = config.gravity || new THREE.Vector3(0, -0.5, 0); // A little bit of gravity
        this.initialOpacity = config.initialOpacity || 0.8;
        this.material = new THREE.SpriteMaterial({
            map: dustParticleTexture,
            color: this.color,
            transparent: true,
            opacity: this.initialOpacity,
            sizeAttenuation: true
        });
        this.mesh = new THREE.Sprite(this.material);
        this.mesh.position.copy(this.position);
        this.mesh.scale.set(this.initialSize, this.initialSize, 1); // Initial scale
        this.scene.add(this.mesh);
    }
    _create_class(Particle, [
        {
            key: "update",
            value: function update(deltaTime) {
                this.age += deltaTime;
                if (this.age >= this.lifetime) {
                    this.dispose();
                    return false; // Indicate particle is dead
                }
                this.velocity.addScaledVector(this.gravity, deltaTime);
                this.mesh.position.addScaledVector(this.velocity, deltaTime);
                var lifeRatio = this.age / this.lifetime;
                // Fade out over lifetime
                this.material.opacity = Math.max(0, (1 - lifeRatio) * this.initialOpacity);
                // Shrink over lifetime
                var currentScale = this.initialSize * (1 - lifeRatio);
                this.mesh.scale.set(currentScale, currentScale, 1);
                return true; // Indicate particle is still alive
            }
        },
        {
            key: "dispose",
            value: function dispose() {
                if (this.mesh.parent) {
                    this.scene.remove(this.mesh);
                }
                // SpriteMaterial does not have a geometry to dispose in the same way Mesh does.
                // The texture (dustParticleTexture) is shared and should not be disposed here.
                if (this.material) {
                    this.material.dispose();
                }
            }
        },
        {
            key: "isAlive",
            value: function isAlive() {
                return this.age < this.lifetime;
            }
        }
    ]);
    return Particle;
}();
