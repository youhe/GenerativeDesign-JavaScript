/*********************************
  HSVをRGBに変換
*********************************/
function hsvToRgb(h, s, v) {
    h /= 360; s /= 100; v /= 100;
    var r, g, b, i, f, p, q, t;
    i = Math.floor(h * 6);
    f = h * 6 - i;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);
    switch (i % 6) {
        case 0: r = v, g = t, b = p; break;
        case 1: r = q, g = v, b = p; break;
        case 2: r = p, g = v, b = t; break;
        case 3: r = p, g = q, b = v; break;
        case 4: r = t, g = p, b = v; break;
        case 5: r = v, g = p, b = q; break;
    }
    return {
        r: Math.round(r * 255),
        g: Math.round(g * 255),
        b: Math.round(b * 255)
    };
}

/*********************************
  写像
*********************************/
function map(val, s1, e1, s2, e2) {
    return s2 + (e2 - s2) * ((val - s1) / (e1 - s1));
}

/*********************************
  距離
*********************************/
function dist(x1, y1, x2, y2) {
    return Math.sqrt(((x1 - x2) * (x1 - x2)) + ((y1 - y2) * (y1 - y2)));
}

/*********************************
  線形補間
*********************************/
function lerp(a, b, c) {
    return ((b - a) * c) + a;
}

/*********************************
  val を min と max の間に制限する
*********************************/
function constrain(val, min, max) {
    return Math.min(Math.max(val, min), max);
}
