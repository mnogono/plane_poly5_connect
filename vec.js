function vec_mul(a, b) {
    return [
        a[1] * b[2] - a[2] * b[1],
        a[2] * b[0] - a[0] * b[2],
        a[0] * b[1] - a[1] * b[0]
    ];
}

function mul(scalar, v) {
    return [v[0]*scalar, v[1]*scalar, v[2]*scalar];
}

function vec_mul_scal(a, b) {
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}

function vec_len(a) {
    return Math.sqrt(a[0] * a[0] + a[1] * a[1] + a[2] * a[2]);
}

function vec_norm(a) {
    var an = [a[0], a[1], a[2]];
    var len = vec_len(a);
    for (var i = 0; i < 3; ++i) {
        an[i] /= (len || 1.);
    }
    return an;
}

function vec_sum(a, b) {
    return [
        a[0] + b[0],
        a[1] + b[1],
        a[2] + b[2]
    ];
}

function vec_sub(a, b) {
    return [
        a[0] - b[0],
        a[1] - b[1],
        a[2] - b[2]
    ];
}

function vec_eq(v1, v2) {
    for (var i = 0; i <v1.length; ++i) {
        if (!eq(v1[i], v2[i])) {
            return false;
        }
    }
    return true;
}

function eq(v1, v2) {
    return Math.abs(v1 - v2) < 1e-5;
}