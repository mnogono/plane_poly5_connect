function calculatePolynome() {
    //input data
	/*
    var n1 = [plane1.normal.x, plane1.normal.y, plane1.normal.z];
    var m1 = [M1.position.x, M1.position.y, M1.position.z];
    var n2 = [plane2.normal.x, plane2.normal.y, plane2.normal.z];
    var m2 = [M2.position.x, M2.position.y, M2.position.z];
    var d1 = DATA.d1;
    var d2 = DATA.d2;
	*/
	var n1 = [DATA.n1x, DATA.n1y, DATA.n1z];
	var m1 = [DATA.M1x, DATA.M1y, DATA.M1z];
	var n2 = [DATA.n2x, DATA.n2y, DATA.n2z];
	var m2 = [DATA.M2x, DATA.M2y, DATA.M2z];
    var d1 = DATA.d1;
    var d2 = DATA.d2;

    var l = vec_norm(vec_mul(n1, n2));

    //normal vector of intersect by 2 plane
    var vecDir = vec_norm(vec_mul(n1, n2));

    var r11 = [m1[0], m1[1], m1[2]];
    var r22 = [m2[0], m2[1], m2[2]];

    var r3 = vec_sum(r11,
        mul(
            vec_mul_scal(
                vec_sub(r22,r11),
                n2) /
            vec_mul_scal(
                vec_mul(n1,
                    vec_mul(n1,
                        n2)), n2),
            vec_mul(n1, vec_mul(n1, n2))));

    //calculate this vector from vecDir + d1 + n1
    var r1 = vec_sum(r3, mul(d1, vec_mul(l, n1)));

    //calculate this vector from vecDir + d2 + n2
    var r2 = vec_sum(r3, mul(d2, vec_mul(n2, l)));

    //var r3 = [0, 0, 0];

    var k31 = vec_norm(vec_sub(r3, r1));
    var k23 = vec_norm(vec_sub(r2, r3));

    var d = [0, 0, 0];
    var e = k31;
    var f = r1;

    var a0 = 1;
    var b0 = 1;
    var c0 = 1;
    var rr0 = vec_sub(vec_sub(r2, e), f);

    var a1 = 5;
    var b1 = 4;
    var c1 = 3;
    var rr1 = vec_sub(k23, e);

    var a2 = 20;
    var b2 = 12;
    var c2 = 6;
    var rr2 = [0, 0, 0];

    var rr = [
        rr0[0], rr0[1], rr0[2],
        rr1[0], rr1[1], rr1[2],
        rr2[0], rr2[1], rr2[2]
    ];

    var x = gauss(
        [
            [a0, 0, 0, b0, 0, 0, c0, 0, 0],
            [0, a0, 0, 0, b0, 0, 0, c0, 0],
            [0, 0, a0, 0, 0, b0, 0, 0, c0],

            [a1, 0, 0, b1, 0, 0, c1, 0, 0],
            [0, a1, 0, 0, b1, 0, 0, c1, 0],
            [0, 0, a1, 0, 0, b1, 0, 0, c1],

            [a2, 0, 0, b2, 0, 0, c2, 0, 0],
            [0, a2, 0, 0, b2, 0, 0, c2, 0],
            [0, 0, a2, 0, 0, b2, 0, 0, c2]
        ],
        rr
    );

    var x2 = gauss2(
        [
            //a      b       c       d      e      f
            [0,0,0,  0,0,0,  0,0,0,  0,0,0,  0,0,0,  1,0,0, r1[0]],
            [0,0,0,  0,0,0,  0,0,0,  0,0,0,  0,0,0,  0,1,0, r1[1]],
            [0,0,0,  0,0,0,  0,0,0,  0,0,0,  0,0,0,  0,0,1, r1[2]],

            [1,0,0,  1,0,0,  1,0,0,  1,0,0,  1,0,0,  1,0,0, r2[0]],
            [0,1,0,  0,1,0,  0,1,0,  0,1,0,  0,1,0,  0,1,0, r2[1]],
            [0,0,1,  0,0,1,  0,0,1,  0,0,1,  0,0,1,  0,0,1, r2[2]],

            [0,0,0,  0,0,0,  0,0,0,  0,0,0,  1,0,0,  0,0,0, k31[0]],
            [0,0,0,  0,0,0,  0,0,0,  0,0,0,  0,1,0,  0,0,0, k31[1]],
            [0,0,0,  0,0,0,  0,0,0,  0,0,0,  0,0,1,  0,0,0, k31[2]],

            [5,0,0,  4,0,0,  3,0,0,  2,0,0,  1,0,0,  0,0,0, k23[0]],
            [0,5,0,  0,4,0,  0,3,0,  0,2,0,  0,1,0,  0,0,0, k23[1]],
            [0,0,5,  0,0,4,  0,0,3,  0,0,2,  0,0,1,  0,0,0, k23[2]],

            [0,0,0,  0,0,0,  0,0,0,  2,0,0,  0,0,0,  0,0,0, 0],
            [0,0,0,  0,0,0,  0,0,0,  0,2,0,  0,0,0,  0,0,0, 0],
            [0,0,0,  0,0,0,  0,0,0,  0,0,2,  0,0,0,  0,0,0, 0],

            [20,0,0,  12,0,0,  6,0,0,  2,0,0, 0,0,0,  0,0,0, 0],
            [0,20,0,  0,12,0,  0,6,0,  0,2,0, 0,0,0,  0,0,0, 0],
            [0,0,20,  0,0,12,  0,0,6,  0,0,2, 0,0,0,  0,0,0, 0]
        ]
    );

    var a = [x2[0], x2[1], x2[2]];
    var b = [x2[3], x2[4], x2[5]];
    var c = [x2[6], x2[7], x2[8]];
    var d = [x2[9], x2[10], x2[11]];
    var e = [x2[12], x2[13], x2[14]];
    var f = [x2[15], x2[16], x2[17]];

    //test1;
    if (!vec_eq(f, r1)) {
        throw new Error("r(u)=0 wrong");
    }
    var t2 = [
      a[0]+b[0]+c[0]+d[0]+e[0]+f[0],
      a[1]+b[1]+c[1]+d[1]+e[1]+f[1],
      a[2]+b[2]+c[2]+d[2]+e[2]+f[2]
    ];

    if (!vec_eq(t2,r2)) {
        throw new Error("r(u)=1 wrong");
    }

    if (!vec_eq(e, vec_norm(vec_sub(r3,r1)))) {
        throw new Error("dr/du=0 wrong");
    }

    if (!vec_eq(d, [0,0,0])) {
        throw new Error("d2r/du2=0 wrong");
    }

    var t4 = [
        20*a[0]+12*b[0]+6*c[0],
        20*a[1]+12*b[1]+6*c[1],
        20*a[2]+12*b[2]+6*c[2]
    ];
    if (!vec_eq(t4, [0,0,0])) {
        throw new Error("d2r/du2=1 wrong");
    }

    var t3 = [
        5*a[0]+4*b[0]+3*c[0]+2*d[0]+e[0],
        5*a[1]+4*b[1]+3*c[1]+2*d[1]+e[1],
        5*a[2]+4*b[2]+3*c[2]+2*d[2]+e[2]
    ];
    if (!vec_eq(t3, vec_norm(vec_sub(r2, r3)))) {
        throw new Error("dr/du=1 wrong");
    }

    return {
        a: a,
        b: b,
        c: c,
        d: d,
        e: e,
        f: f,
        r1: r1,
        r2: r2,
        r3: r3,
        l: l
    };
}