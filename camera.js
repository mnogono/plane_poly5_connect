/**
 * extension of original THREE.Camera for surface flaw viewer
 *
 * @constructor
 */
THREE.SurfaceCamera = function(options) {
    THREE.PerspectiveCamera.call( this , options['fov'], options['aspect'], options['near'], options['far']);

    this.position.fromArray(options['position'] || [0, 0, 0]);

    /** @type{number} velocity */
    this.velocity = 25;

    /** @type {THREE.Vector3} max of available camera velocity */
    this.maxVelocity = options['maxVelocity'] || new THREE.Vector3(0.01, 0.01, 0.01);

    /** @type {THREE.Vector3} min of available camera velocity (reverse of max camera velocity parameter) */
    this.minVelocity = options['maxVelocity'] || this.maxVelocity.clone().negate();

    /** @type {THREE.Vector3} current camera acceleration */
    this.acceleration = options['acceleration'] || new THREE.Vector3(0, 0, 0);

    this.frictionAcceleration = new THREE.Vector3(0, 0, 0);

    /** @type {THREE.Vector3} forward acceleration */
    this.forwardAcceleration = options['forwardAcceleration'] || 0.3;

    /** @type {THREE.Vector3} backward acceleration */
    this.backwardAcceleration = options['backwardAcceleration'] || -0.3;

    /** @type {number} last time value when key was pressed by user */
    this.lastTimeKeyPress = 0;

    /** @type {THREE.Vector3} look direction */
    this.lookAtDirection = options['lookAtDirection'] || new THREE.Vector3(0.0, 0.0, 1.0);

    //this.lookAtVector = new THREE.Vector3(0.0, 0.0, 0.0);

    /** @type {number} tangage angle in radians */
    this.teta = Math.asin(this.lookAtDirection.x) - Math.PI;

    /** @type {number} prowl angle in radians */
    this.psi = Math.asin(this.lookAtDirection.y);

    this.xAxis = new THREE.Vector3(1.0, 0.0, 0.0);

    this.yAxis = new THREE.Vector3(0.0, 1.0, 0.0);

    this.zAxis = new THREE.Vector3(0.0, 0.0, 1.0);

    //this.plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);

    this.quaternion.fromArray([0, 0, 0, 1]);

    var q = new THREE.Quaternion();

    q.setFromAxisAngle(this.yAxis, this.teta);
    this.quaternion.multiply(q);

    q = new THREE.Quaternion();

    q.setFromAxisAngle(this.xAxis, this.psi);
    this.quaternion.multiply(q);

    //this.init();
};

THREE.SurfaceCamera.prototype = Object.create(THREE.PerspectiveCamera.prototype);
THREE.SurfaceCamera.prototype.constructor = THREE.SurfaceCamera;

THREE.SurfaceCamera.prototype.init = function() {
    this.subscribeEvents();
    /*
     this.updateLookAtVector();

     this.lookAt(this.lookAtVector);
     */
};

/*
 THREE.SurfaceCamera.prototype.updateLookAtVector = function() {
 this.lookAtVector.addVectors(this.position, this.lookAtDirection);
 };
 */

THREE.SurfaceCamera.prototype.subscribeEvents = function() {
    this.map.subscribe(EVENTS['ON_KEY_PRESS'],       this, this);
    this.map.subscribe(EVENTS['ON_KEY_UP'],          this, this);
    this.map.subscribe(EVENTS['ON_KEY_DOWN'],        this, this);
    this.map.subscribe(EVENTS['ON_ANIMATION_FRAME'], this, this);
    this.map.subscribe(EVENTS['ON_MOUSE_WHEEL'],     this, this);
    this.map.subscribe(EVENTS['ON_MOUSE_MOVE'],      this, this);
    this.map.subscribe(EVENTS['ON_MAP_SIZE_CHANGED'],this, this);
};

THREE.SurfaceCamera.prototype.onMouseWheel = function(mousePos, evt) {
    if (evt.deltaY > 0) {
        this.acceleration.y = this.forwardAcceleration;
    } else {
        this.acceleration.y = this.backwardAcceleration;
    }

    //this.lastTimeKeyPress = Date.now();
};

THREE.SurfaceCamera.prototype.onMouseMove = function(mousePos, evt) {
    if (isRightMouseDown === false) {
        //change teta and psi angle, recalculate the lookAtDirection vector
        var dx = mouseDownPosition.x - mousePos.x;
        var dy = mouseDownPosition.y - mousePos.y;

        mouseDownPosition.x = mousePos.x;
        mouseDownPosition.y = mousePos.y;

        this.teta += dx * DEGREE2RAD * 0.1;

        this.psi += dy * DEGREE2RAD * 0.1;

        this.quaternion.fromArray([0, 0, 0, 1]);

        var q = new THREE.Quaternion();

        q.setFromAxisAngle(this.yAxis, this.teta);
        this.quaternion.multiply(q);

        q.setFromAxisAngle(this.xAxis, this.psi);
        this.quaternion.multiply(q);
        //this.map.invokeObservers(EVENTS["ON_CAMERA_CHANGE_DIRECTION"], []);
    }
};

THREE.SurfaceCamera.prototype.onKeyDown = function(evt) {
    this.keyCode = evt.keyCode;
};

THREE.SurfaceCamera.prototype.onKeyUp = function(evt) {
    if ([KEYS['w'], KEYS['a'], KEYS['s'], KEYS['d'], KEYS['q'], KEYS['e']].indexOf(evt.keyCode) !== -1) {
        this.acceleration.multiplyScalar(0);
    }
    this.keyCode = null;
};

THREE.SurfaceCamera.prototype.onAnimationFrame = function(delta) {
    var moveDistance = this.velocity * delta;

    if (keyboard.pressed("w")) {
        this.translateZ(-moveDistance);
    }
    if (keyboard.pressed("s")) {
        this.translateZ(moveDistance);
    }
    if (keyboard.pressed("a")) {
        this.translateX(-moveDistance);
    }
    if (keyboard.pressed("d")) {
        this.translateX(moveDistance);
    }
    if (keyboard.pressed("q")) {
        this.position.y -= moveDistance;
    }
    if (keyboard.pressed("e")) {
        this.position.y += moveDistance;
    }
};

/**
 * change position camera to show around 1/10 of all image for user
 */
THREE.SurfaceCamera.prototype.onMapSizeChanged = function() {
    var x = 0.5 * this.map.width;
    var z = 0.5 * this.map.height;
    var y = Math.tan((90 - this.fov) * DEGREE2RAD) * 0.5 * Math.min(this.map.width, this.map.height);

    this.position.x = x;
    this.position.y = y;
    this.position.z = z;

    this.teta = 0;

    this.psi = -65 * DEGREE2RAD;

    this.quaternion.fromArray([0, 0, 0, 1]);

    var q = new THREE.Quaternion();

    q.setFromAxisAngle(this.yAxis, this.teta);
    this.quaternion.multiply(q);

    q = new THREE.Quaternion();

    q.setFromAxisAngle(this.xAxis, this.psi);
    this.quaternion.multiply(q);

    this.map.invokeObservers(EVENTS['ON_MOVE'], []);
};