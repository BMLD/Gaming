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
var PROJECTILE_SPEED = 20;
var PROJECTILE_LIFESPAN = 2; // seconds
var PROJECTILE_RADIUS = 0.15;
export var Projectile = /*#__PURE__*/ function() {
    "use strict";
    function Projectile(scene, startPosition, direction, world) {
        _class_call_check(this, Projectile);
        this.scene = scene;
        this.world = world; // For collision detection
        this.velocity = direction.clone().multiplyScalar(PROJECTILE_SPEED);
        this.lifeTimer = 0;
        this.expired = false;
        var geometry = new THREE.SphereGeometry(PROJECTILE_RADIUS, 8, 8);
        var material = new THREE.MeshBasicMaterial({
            color: 0xffff00
        }); // Bright yellow
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.position.copy(startPosition);
        this.scene.add(this.mesh);
        this.collider = new THREE.Sphere(this.mesh.position, PROJECTILE_RADIUS);
    }
    _create_class(Projectile, [
        {
            key: "update",
            value: function update(deltaTime) {
                if (this.expired) return;
                this.mesh.position.addScaledVector(this.velocity, deltaTime);
                this.collider.center.copy(this.mesh.position);
                this.lifeTimer += deltaTime;
                if (this.lifeTimer > PROJECTILE_LIFESPAN) {
                    this.expired = true;
                }
                // Collision detection with target dummies
                var targetDummies = this.world.getTargetDummies();
                var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                try {
                    for(var _iterator = targetDummies[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
                        var dummy = _step.value;
                        if (dummy.visible && dummy.userData.collider && this.collider.intersectsBox(dummy.userData.collider)) {
                            this.world.handleDummyHit(dummy);
                            this.expired = true; // Projectile disappears on hit
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
                if (this.expired) return; // Don't check enemies if already hit a dummy
                // Collision detection with enemies
                var enemies = this.world.getEnemies();
                var _iteratorNormalCompletion1 = true, _didIteratorError1 = false, _iteratorError1 = undefined;
                try {
                    for(var _iterator1 = enemies[Symbol.iterator](), _step1; !(_iteratorNormalCompletion1 = (_step1 = _iterator1.next()).done); _iteratorNormalCompletion1 = true){
                        var enemy = _step1.value;
                        if (!enemy.isDefeated && enemy.collider && this.collider.intersectsSphere(enemy.collider)) {
                            enemy.takeDamage(25); // Example damage amount
                            this.expired = true; // Projectile disappears on hit
                            break;
                        }
                    }
                } catch (err) {
                    _didIteratorError1 = true;
                    _iteratorError1 = err;
                } finally{
                    try {
                        if (!_iteratorNormalCompletion1 && _iterator1.return != null) {
                            _iterator1.return();
                        }
                    } finally{
                        if (_didIteratorError1) {
                            throw _iteratorError1;
                        }
                    }
                }
            }
        },
        {
            key: "isExpired",
            value: function isExpired() {
                return this.expired;
            }
        },
        {
            key: "setExpired",
            value: function setExpired() {
                this.expired = true;
            }
        },
        {
            key: "dispose",
            value: function dispose() {
                if (this.mesh.parent) {
                    this.scene.remove(this.mesh);
                }
                // Dispose geometry and material if they are not shared and managed elsewhere
                this.mesh.geometry.dispose();
                this.mesh.material.dispose();
            }
        }
    ]);
    return Projectile;
}();
