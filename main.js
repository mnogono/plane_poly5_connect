function checkRayCasterIntersection(rayCaster, rayCaterMouse, camera, mousePos, options) {
    //check reay caster mesh intersection
    rayCasterMouse.x = (mousePos.x / this.renderer.domElement.clientWidth) * 2 - 1;
    rayCasterMouse.y = -(mousePos.y / this.renderer.domElement.clientHeight) * 2 + 1;

    rayCaster.setFromCamera(rayCasterMouse, this.camera);

    var intersects = this.rayCaster.intersectObjects(this.scene.children);
    if (intersects.length == 0) {
        return;
    }

    var intersect = null;
    for (var i = 0, len = intersects.length; i < len; ++i) {
        if (intersects[i].object instanceof THREE.Mesh === false) {
            continue;
        }
        if (intersects[i].object === meshSelection) {
            continue;
        }

        intersect = intersects[i];
        break;
    }

    if (intersect === null) {
        return;
    }

    meshSelection.position.x = intersect.point.x;
    meshSelection.position.y = intersect.point.y;
    meshSelection.position.z = intersect.point.z;

    if (options && options.plane_points) {
        if (intersect.object === meshPlane1 && !DATA.M1x && !DATA.M1y && !DATA.M1z) {
            DATA.M1x = meshSelection.position.x;
            DATA.M1y = meshSelection.position.y;
            DATA.M1z = meshSelection.position.z;
            M1.position.x = meshSelection.position.x;
            M1.position.y = meshSelection.position.y;
            M1.position.z = meshSelection.position.z;
        } else if (intersect.object === meshPlane2 && !DATA.M2x && !DATA.M2y && !DATA.M2z) {
            DATA.M2x = meshSelection.position.x;
            DATA.M2y = meshSelection.position.y;
            DATA.M2z = meshSelection.position.z;
            M2.position.x = meshSelection.position.x;
            M2.position.y = meshSelection.position.y;
            M2.position.z = meshSelection.position.z;
        }

        if (DATA.M1x && DATA.M1y && DATA.M1z && DATA.M2x && DATA.M2y && DATA.M2z) {
            meshSelection.visible = false;
        }
    }
}

function updatePlane(plane, planeMesh, x, y, z, constant) {
	var geometryPlane = planeMesh.geometry;
	
    var px = plane.normal.x;
    var py = plane.normal.y;
    var pz = plane.normal.z;

	var p = geometryPlane.vertices[60];
	var prevDistance = -vec_len([p.x, p.y, p.z]);
    var position = new THREE.Vector3(
      prevDistance * plane.normal.x,
      prevDistance * plane.normal.y,
      prevDistance * plane.normal.z);	
	
	geometryPlane.translate(position.x, position.y, position.z);
	
    //var matrix = new THREE.Matrix4()
	// .compose(position, quaternion, new THREE.Vector3(1,1,1));	
	 
	//geometryPlane.applyMatrix(matrix);
	
    // Normalize the plane
    plane.set(new THREE.Vector3(x, y, z), constant);
    plane.normalize();

    // Rotate from (0,0,1) to the plane's normal
    var quaternion = new THREE.Quaternion()
      .setFromUnitVectors(new THREE.Vector3(px,py,pz), plane.normal);
    // Calculate the translation
	
    var position = new THREE.Vector3(
      plane.constant * plane.normal.x,
      plane.constant * plane.normal.y,
      plane.constant * plane.normal.z);
     // Create the matrix
    var matrix = new THREE.Matrix4()
    // .compose(new THREE.Vector3(0, 0, 0), quaternion, new THREE.Vector3(1,1,1));
	 .compose(position, quaternion, new THREE.Vector3(1,1,1));
    // Transform the geometry (assumes that "geometry"
    // is a THREE.PlaneGeometry or indeed any
    // THREE.Geometry)
    geometryPlane.applyMatrix(matrix);
}

function createGui() {
	/*
    var step = 0.001;
    var gui = new dat.GUI();
    gui.add(DATA, "n1x", -1, 1).step(step).onChange(function(value){
        updatePlane(plane1, geometryPlane1, DATA.n1x, DATA.n1y, DATA.n1z, DATA.constant1);
    });

    gui.add(DATA, "n1y", -1, 1).step(step).onChange(function(){
        updatePlane(plane1, geometryPlane1, DATA.n1x, DATA.n1y, DATA.n1z, DATA.constant1);
    });
    gui.add(DATA, "n1z", -1, 1).step(step).onChange(function(){
        updatePlane(plane1, geometryPlane1, DATA.n1x, DATA.n1y, DATA.n1z, DATA.constant1);
    });

    gui.add(DATA, "constant1", 0).step(step).onChange(function(){
        updatePlane(plane1, geometryPlane1, DATA.n1x, DATA.n1y, DATA.n1z, DATA.constant1);
    });

    gui.add(DATA, "M1x", 0).step(step);
    gui.add(DATA, "M1y", 0).step(step);
    gui.add(DATA, "M1z", 0).step(step);

    gui.add(DATA, "n2x", -1, 1).step(step).onChange(function(){
        updatePlane(plane2, geometryPlane2, DATA.n2x, DATA.n2y, DATA.n2z, DATA.constant2);
    });
    gui.add(DATA, "n2y", -1, 1).step(step).onChange(function(){
        updatePlane(plane2, geometryPlane2, DATA.n2x, DATA.n2y, DATA.n2z, DATA.constant2);
    });
    gui.add(DATA, "n2z", -1, 1).step(step).onChange(function(){
        updatePlane(plane2, geometryPlane2, DATA.n2x, DATA.n2y, DATA.n2z, DATA.constant2);
    });
    gui.add(DATA, "constant2", 0).step(step).onChange(function(){
        updatePlane(plane2, geometryPlane2, DATA.n2x, DATA.n2y, DATA.n2z, DATA.constant2);
    });

    gui.add(DATA, "M2x", 0).step(step);
    gui.add(DATA, "M2y", 0).step(step);
    gui.add(DATA, "M2z", 0).step(step);
	*/
    DATA.calculate =  function() {
        var result = calculatePolynome();

        R1.position.x = result.r1[0];
        R1.position.y = result.r1[1];
        R1.position.z = result.r1[2];

        R2.position.x = result.r2[0];
        R2.position.y = result.r2[1];
        R2.position.z = result.r2[2];

        R3.position.x = result.r3[0];
        R3.position.y = result.r3[1];
        R3.position.z = result.r3[2];

        var a = result.a;
        var b = result.b;
        var c = result.c;
        var d = result.d;
        var e = result.e;
        var f = result.f;
        var l = result.l;

        var geometry = new THREE.Geometry();
        for (var u = 0; u <= 1; u += 0.01) {
            var x = a[0]*Math.pow(u, 5)+b[0]*Math.pow(u,4)+c[0]*Math.pow(u,3)+d[0]*Math.pow(u,2)+e[0]*Math.pow(u, 1)+f[0];
            var y = a[1]*Math.pow(u, 5)+b[1]*Math.pow(u,4)+c[1]*Math.pow(u,3)+d[1]*Math.pow(u,2)+e[1]*Math.pow(u, 1)+f[1];
            var z = a[2]*Math.pow(u, 5)+b[2]*Math.pow(u,4)+c[2]*Math.pow(u,3)+d[2]*Math.pow(u,2)+e[2]*Math.pow(u, 1)+f[2];
            geometry.vertices.push(new THREE.Vector3(x, y, z));
        }
        var material = new THREE.LineBasicMaterial({
            color: 0x00FF00
        });
		
		var meshLineResult = new THREE.Line(geometry, material);
		meshLineResult.name = "meshLineResult";
		
		var selectedObject = scene.getObjectByName("meshLineResult");
		if (selectedObject) {
			scene.remove( selectedObject );			
		}
		
        scene.add(meshLineResult);

        //surface mesh

        var N  = DATA.v2;

        var geometryResult = new THREE.Geometry();
        for (var u2 = 0; u2 < 100; u2++) {
            for (var v = DATA.v1; v < N; v++) {
                var u = u2 / 100.0;
                var x = a[0]*Math.pow(u, 5)+b[0]*Math.pow(u,4)+c[0]*Math.pow(u,3)+d[0]*Math.pow(u,2)+e[0]*Math.pow(u, 1)+f[0]+v*l[0];
                var y = a[1]*Math.pow(u, 5)+b[1]*Math.pow(u,4)+c[1]*Math.pow(u,3)+d[1]*Math.pow(u,2)+e[1]*Math.pow(u, 1)+f[1]+v*l[1];
                var z = a[2]*Math.pow(u, 5)+b[2]*Math.pow(u,4)+c[2]*Math.pow(u,3)+d[2]*Math.pow(u,2)+e[2]*Math.pow(u, 1)+f[2]+v*l[2];

                geometryResult.vertices.push(new THREE.Vector3(x, y, z));
            }
        }

        for (var u2 = 0; u2 < 99; u2++) {
            for (var v = 0; v < N - 1; v++) {
                geometryResult.faces.push(new THREE.Face3(N * u2 + v, N * u2 + 1 + v, N * u2 + N + 1 + v));
                geometryResult.faces.push(new THREE.Face3(N * u2 + v, N * u2 + N + 1 + v, N * u2 + N + v));
            }
        }

        var material2 = new THREE.MeshBasicMaterial({
            color: 0x00FF00,
            wireframe: true
        });
		
		var meshSurfaceResult = new THREE.Mesh(geometryResult, material2);
		meshSurfaceResult.name = "meshSurfaceResult";
		
		var selectedObject = scene.getObjectByName("meshSurfaceResult");
		if (selectedObject) {
			scene.remove( selectedObject );			
		}		
		
        scene.add(meshSurfaceResult);
		
		$("#result").val(JSON.stringify(
		{
			a: a,
			b: b,
			c: c,
			d: d,
			e: e,
			f: f
		}
		));
    };

    //gui.add(DATA, "calculate");
}

function sourceDataChange() {
	var n1 = $("#n1").val().split(",");
	DATA.n1x = parseFloat(n1[0]);
	DATA.n1y = parseFloat(n1[1]);
	DATA.n1z = parseFloat(n1[2]);
	
	var M1 = $("#M1").val().split(",");
	DATA.M1x = parseFloat(M1[0]);
	DATA.M1y = parseFloat(M1[1]);
	DATA.M1z = parseFloat(M1[2]);

	var n1_norm = vec_norm([DATA.n1x, DATA.n1y, DATA.n1z]);
	var dir1 = Math.sign(vec_mul_scal(n1_norm, [DATA.M1x, DATA.M1y, DATA.M1z]));
	DATA.constant1 = dir1 * vec_len([n1_norm[0] * DATA.M1x, n1_norm[1] * DATA.M1y, n1_norm[2] * DATA.M1z]);
	
	DATA.d1 = parseFloat($("#d1").val());
	
	var n2 = $("#n2").val().split(",");
	DATA.n2x = parseFloat(n2[0]);
	DATA.n2y = parseFloat(n2[1]);
	DATA.n2z = parseFloat(n2[2]);
	
	var M2 = $("#M2").val().split(",");
	DATA.M2x = parseFloat(M2[0]);
	DATA.M2y = parseFloat(M2[1]);
	DATA.M2z = parseFloat(M2[2]);
	
	var n2_norm = vec_norm([DATA.n2x, DATA.n2y, DATA.n2z]);
	var dir2 = Math.sign(vec_mul_scal(n2_norm, [DATA.M2x, DATA.M2y, DATA.M2z]));
	DATA.constant2 = dir2 * vec_len([n2_norm[0] * DATA.M2x, n2_norm[1] * DATA.M2y, n2_norm[2] * DATA.M2z]);
	
	DATA.d2 = parseFloat($("#d2").val());
	
	DATA.v1 = parseFloat($("#v1").val());
	DATA.v2 = parseFloat($("#v2").val());
	
    updatePlane(plane1, meshPlane1, DATA.n1x, DATA.n1y, DATA.n1z, DATA.constant1);
    updatePlane(plane2, meshPlane2, DATA.n2x, DATA.n2y, DATA.n2z, DATA.constant2);
	DATA.calculate();
}

$(document).ready(function() {
	$("#n1").change(function(){
		sourceDataChange();
	});
	$("#M1").change(function(){
		sourceDataChange();
	});
	$("#d1").change(function(){
		sourceDataChange();
	});	
	$("#n2").change(function(){
		sourceDataChange();
	});
	$("#M2").change(function(){
		sourceDataChange();
	});
	$("#d2").change(function(){
		sourceDataChange();
	});
	$("#v1").change(function(){
		sourceDataChange();
	});
	$("#v2").change(function(){
		sourceDataChange();
	});
	/*
	$("#calculate").click(function() {
		DATA.calculate();
	});
	*/
	
    keyboard = new THREEx.KeyboardState();

    clock = new THREE.Clock();

    scene = new THREE.Scene();

    renderer = new THREE.WebGLRenderer();
    renderer.setSize( 800, 600 );
    document.body.appendChild( renderer.domElement );

    camera = new THREE.SurfaceCamera({
        fov: 60,
        aspect: renderer.domElement.clientWidth / renderer.domElement.clientHeight,
        near: 0.1,
        far: 1000,
        position: [0, 10, -50]
    });

    plane1 = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
    plane1.normalize();

    geometryPlane1 = new THREE.PlaneGeometry(30, 30, 10, 10);
    var material1 = new THREE.MeshBasicMaterial( {color: 0xFFFFFF, side: THREE.FrontSide, wireframe: true});
    meshPlane1 = new THREE.Mesh( geometryPlane1, material1 );
    scene.add(meshPlane1);

    plane2 = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
    plane2.normalize();

    geometryPlane2 = new THREE.PlaneGeometry(30, 30, 10, 10);
    var material2 = new THREE.MeshBasicMaterial( {color: 0xFFFFFF, side: THREE.FrontSide, wireframe: true});
    meshPlane2 = new THREE.Mesh( geometryPlane2, material2 );
    scene.add(meshPlane2);

    var axisHelper = new THREE.AxisHelper( 50 );
    scene.add( axisHelper );

    geometrySelection = new THREE.SphereGeometry(1, 10, 10);
    var material3 = new THREE.MeshBasicMaterial({color: 0xFF0000, side: THREE.DoubleSide});
    meshSelection = new THREE.Mesh(geometrySelection, material3);

    //scene.add( meshSelection);

    var sphere = new THREE.SphereGeometry(0.1, 10, 10);
    var material4 = new THREE.MeshBasicMaterial({color: 0x0000FF, side: THREE.DoubleSide});
    M1 = new THREE.Mesh(sphere, material4);
    M1.position.z = -10000;

    scene.add(M1);

    sphere = new THREE.SphereGeometry(0.1, 10, 10);
    var material5 = new THREE.MeshBasicMaterial({color: 0x00FF00, side: THREE.DoubleSide});
    M2 = new THREE.Mesh(sphere, material5);
    M2.position.z = -10000;

    scene.add(M2);

    sphere = new THREE.SphereGeometry(0.1, 10, 10);
    var material6 = new THREE.MeshBasicMaterial({color: 0xA0A0A0, side: THREE.DoubleSide});
    R3 = new THREE.Mesh(sphere, material6);
    R3.position.z = -10000;

    scene.add(R3);

    sphere = new THREE.SphereGeometry(0.1, 10, 10);
    var material7 = new THREE.MeshBasicMaterial({color: 0x070AA0, side: THREE.DoubleSide});
    R1 = new THREE.Mesh(sphere, material7);
    R1.position.z = -10000;

    scene.add(R1);

    sphere = new THREE.SphereGeometry(0.1, 10, 10);
    var material8 = new THREE.MeshBasicMaterial({color: 0x10A010, side: THREE.DoubleSide});
    R2 = new THREE.Mesh(sphere, material8);
    R2.position.z = -10000;

    scene.add(R2);

    var render = function () {
        var delta = clock.getDelta();
        //flyControls.update(delta);

        camera.onAnimationFrame(delta);

        requestAnimationFrame( render );
        renderer.render(scene, camera);
    };

    render();
    updatePlane(plane1, meshPlane1, DATA.n1x, DATA.n1y, DATA.n1z, DATA.constant1);
    updatePlane(plane2, meshPlane2, DATA.n2x, DATA.n2y, DATA.n2z, DATA.constant2);

    document.addEventListener("mousemove", function(e) {
        var rect = renderer.domElement.getBoundingClientRect();
        var mousePos = {x:e.clientX - rect.left, y:e.clientY - rect.top};
        checkRayCasterIntersection(rayCaster, rayCasterMouse, camera, mousePos);
        camera.onMouseMove(mousePos, e);
    });

    document.addEventListener("mousedown", function(e) {
        isRightMouseDown = isRightMouseButton(e);
        var rect = renderer.domElement.getBoundingClientRect();
        var mousePos = {x:e.clientX - rect.left, y:e.clientY - rect.top};

        mouseDownPosition.x = mousePos.x;
        mouseDownPosition.y = mousePos.y;

        if (isRightMouseDown === false) {
            checkRayCasterIntersection(rayCaster, rayCasterMouse, camera, mousePos, {plane_points: true});
        }
    });

    document.addEventListener("mouseup", function(e) {
        isRightMouseDown = null;
    });

    createGui();
	DATA.calculate();
});