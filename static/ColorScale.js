const formats = {
    hex: /#([\da-fA-F]{2})([\da-fA-F]{2})([\da-fA-F]{2})/,
    rgb: /rgb[\(\s]\s*([\d]{1,3})\s*[\s,]\s*([\d]{1,3})\s*[\s,]\s*([\d]{1,3})\s*\)?/,
    hsl: /hsl[\(\s]\s*(\d{1,3})\s*[\s,]\s*(0|(?:1(?:\.0+)?)|(?:0?\.\d+))\s*[\s,]\s*(0|(?:1(?:\.0+)?)|(?:0?\.\d+))\s*\)?/,
};

function hue2rgb(p,q,t) {
    t = t - Math.floor(t);
    if(6*t < 1) return p + (q - p) * 6 * t;
    if(t < 0.5) return q;
    if(3*t < 2) return p + (q - p) * (2 - 3*t) * 2;
    return p;
}

/**
 * Converts an HSL color value to RGB. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
 * Assumes h, s, and l are contained in the set [0, 1] and
 * returns r, g, and b in the set [0, 255].
 *
 * @param {number}  h hue 
 * @param {number}  s saturation 
 * @param {number}  l lightness 
 * @return {[number, number, number]} RGB representation
 */
 function hslToRgb(h, s, l){
    var r, g, b;
    if(s == 0){
        r = g = b = l; // achromatic
    }else{
        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }
    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

function validTriplet(rgb) { return rgb[0] >= 0 && rgb[0] < 256 && rgb[1] >= 0 && rgb[1] < 256 && rgb[2] >= 0 && rgb[2] < 256 }

/**
 * Parses a color into RGB notation in set [0,255]
 * @param {string|[number, number, number]} c object to be parsed
 * @returns {[number, number, number]|null} RGB representation
 */
function parseColor(c) {
    if(Array.isArray(c)) return c.length >= 3 && validTriplet(c) ? c : null;
    if(typeof c !== "string") return null;
    var v;
    if(v = formats.hex.exec(c)) return [parseInt(v[1],16), parseInt(v[2],16), parseInt(v[3],16)];
    else if(v = formats.rgb.exec(c)) return validTriplet(v = [+v[1], +v[2], +v[3]]) ? v : null;
    else if(v = formats.hsl.exec(c)) return hslToRgb(+v[1]/360, +v[2], +v[3]);
    return null;
}

export function linear(start, stop) {
    const val = new Array(6);
    start = parseColor(start);
    stop = parseColor(stop);
    if(!start || !stop) throw Error("Invalid color format");
    for(i=0; i<3; i++) {
        val[2*i] = stop[i];
        val[2*i+1] = start[i];
    }
    return function(t) {
        return 'rgb(' 
        + Math.round(val[0]*t+val[1]*(1-t)) + ','
        + Math.round(val[2]*t+val[3]*(1-t)) + ','
        + Math.round(val[4]*t+val[5]*(1-t)) + ')';
    }
}

export function wheel() {

}