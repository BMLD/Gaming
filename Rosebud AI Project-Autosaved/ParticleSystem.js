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
import { Particle } from './Particle.js';
export var ParticleSystem = /*#__PURE__*/ function() {
    "use strict";
    function ParticleSystem(scene) {
        _class_call_check(this, ParticleSystem);
        this.scene = scene;
        this.particles = [];
    }
    _create_class(ParticleSystem, [
        {
            key: "emit",
            value: function emit(config) {
                var count = config.count || 10;
                var basePosition = config.position || new THREE.Vector3();
                var baseVelocity = config.baseVelocity || new THREE.Vector3(0, 1, 0); // General upward direction
                var spread = config.spread || new THREE.Vector3(1, 1, 1); // How much velocity varies
                var lifetime = config.lifetime || 1.0;
                var size = config.size || 0.1;
                var color = config.color || new THREE.Color(0xBFB08F); // Dusty color
                var gravity = config.gravity !== undefined ? config.gravity : new THREE.Vector3(0, -2.0, 0);
                var initialOpacity = config.initialOpacity || 0.7;
                for(var i = 0; i < count; i++){
                    var particlePos = basePosition.clone(); // Each particle starts at the same base position
                    var randomVelocity = new THREE.Vector3((Math.random() - 0.5) * spread.x, (Math.random() * 0.5 + 0.5) * spread.y, (Math.random() - 0.5) * spread.z);
                    var particleVel = baseVelocity.clone().add(randomVelocity);
                    var particle = new Particle(this.scene, {
                        position: particlePos,
                        velocity: particleVel,
                        lifetime: lifetime * (Math.random() * 0.4 + 0.8),
                        size: size * (Math.random() * 0.4 + 0.8),
                        color: color,
                        gravity: gravity,
                        initialOpacity: initialOpacity
                    });
                    this.particles.push(particle);
                }
            }
        },
        {
            key: "update",
            value: function update(deltaTime) {
                for(var i = this.particles.length - 1; i >= 0; i--){
                    var particle = this.particles[i];
                    if (!particle.update(deltaTime)) {
                        this.particles.splice(i, 1); // Remove dead particle
                    }
                }
            }
        }
    ]);
    return ParticleSystem;
}();
