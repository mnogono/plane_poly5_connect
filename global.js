var DATA = {
    n1x: 0,
    n1y: 1,
    n1z: 0,
    constant1: 0,

    M1x: 0,
    M1y: 0,
    M1z: 0,

    n2x: 0,
    n2y: Math.cos(Math.PI / 6),
    n2z: -Math.sin(Math.PI / 6),
    constant2: 0,

    M2x: 0,
    M2y: 0,
    M2z: 0,

    d1: 5,
    d2: 5,
	
	v1: 0,
	v2: 30
};

/** @type{THREE.Raycaster} */
var rayCaster = new THREE.Raycaster();

/** @type{THREE.Vector2} */
var rayCasterMouse = new THREE.Vector2();

var scene;

var renderer;

var geometryPlane1;
var plane1;

var geometryPlane2;
var plane2;

var clock;

var geometrySelection;
var meshSelection;

var camera;

var mouseDownPosition = {
    x: 0,
    y: 0
};

var isRightMouseDown = null;

var RAD2DEGREE = 180.0 / Math.PI;

var DEGREE2RAD = 1.0 / RAD2DEGREE;

var keyboard;

function isRightMouseButton(evt) {
    var isRightMB;
    if ("which" in evt) {
        // Gecko (Firefox), WebKit (Safari/Chrome) & Opera
        isRightMB = evt.which == 3;
    } else if ("button" in evt) {
        // IE, Opera
        isRightMB = evt.button == 2;
    }
    return isRightMB;
}

var meshPlane1;

var meshPlane2;

var M1;
var M2;
var R1;
var R2;
var R3;
