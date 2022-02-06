class Complex {
    constructor(real=0, imag=0) {
        this.real = real;
        this.imag = imag;
    }
    becomes(real=0, imag=0) {
        this.real = real;
        this.imag = imag;
        return this;
    }
    /**@param {Complex} c */
    eq(c) {
        this.real = c.real;
        this.imag = c.imag;
        return this;
    }
    /**@param {Complex} c */
    add(c) {
        this.real += c.real;
        this.imag += c.imag;
        return this;
    }
    /**@param {...Complex} cs*/
    add$(...cs) {
        for(var i=cs.length-1; i>=0; i--) {
            this.real += cs[i].real;
            this.imag += cs[i].imag;
        }
        return this;
    }
    /**@param {Complex} c */
    sub(c) {
        this.real -= c.real;
        this.imag -= c.imag;
        return this;
    }
    /**@param {Complex} c */
    mul(c) {
        var i = this.imag*c.real + this.real*c.imag;
        this.real = this.real*c.real - this.imag*c.imag;
        this.imag = i;
        return this;
    }
    mul_i() {
        var t = this.real;
        this.real = -this.imag;
        this.imag = t;
        return this;
    }
    /**@param {Number} r */
    mul_r(r) {
        this.real *= r;
        this.imag *= r;
        return this;
    }
    /**@param {...Complex} cs*/
    mul$(...cs) {
        var t;
        for(var i=cs.length-1; i>=0; i--) {
            t = this.imag*cs[i].real + this.real*cs[i].imag;
            this.real = this.real*cs[i].real - this.imag*cs[i].imag;
            this.imag = t;
        }
        return this;
    }
    /**@param {Complex} c */
    div(c) {
        var cr = c.real + c.imag/c.real*c.imag;
        var ci = c.imag + c.real/c.imag*c.imag;
        var i = this.imag/cr - this.real/ci;
        this.real = this.real/cr + this.imag/ci;
        this.imag = i;
        return this;
    }
    /**
     * Elevates itself to a complex number
     * @param {Complex} c complex power
     * @param {Number} [k=0] determines angle
     */
    pow(c, k=0) {
        return this.intoLog(k).mul(c).intoExp();
    }
    /**
     * Elevates itself to a real power
     * @param {Complex} r real power
     * @param {Number} [k=0] determines angle
     */
    por_r(r, k=0) {
        var mod = Math.pow(this.real*this.real + this.imag*this.imag, r/2); 
        var arg = Math.atan2(this.imag, this.real) + k*2*Math.PI;
        this.real = mod * Math.cos(r * arg);
        this.imag = mod * Math.sin(r * arg);
        return this;
    }
    /**
     * Evelevates itself to a integer power
     * @param {Number} n integer power
     */
    pow_n(n) {
        if(n == 0) return this.becomes(1, 0);
        const real = this.real, imag = this.imag;
        var end = n, t;
        if(n<0) {
            end = -n;
            this.toReciprocal();
        }
        for(var i=1; i<end; i++) {
            t = this.imag*real + this.real*imag;
            this.real = this.real*real - this.imag*imag;
            this.imag = t;
        }
        return this;
    }
    intoExp() {
        var mod = Math.exp(this.real);
        this.real = mod * Math.cos(this.imag);
        this.imag = mod * Math.sin(this.imag);
        return this;
    }
    intoLog(k=0) {
        var r = Math.log(this.real*this.real + this.imag*this.imag);
        var i = Math.atan2(this.imag, this.real) + k*2*Math.PI;
        this.real = r * .5;
        this.imag = i;
        return this;
    }
    intoSine() {
        var i = Math.cos(this.real)*Math.sinh(this.imag);
        this.real = Math.sin(this.real)*Math.cosh(this.imag);
        this.imag = i;
        return this;
    }
    intoCosine() {
        var i = -Math.sin(this.real)*Math.sinh(this.imag);
        this.real = Math.cos(this.real)*Math.cosh(this.imag);
        this.imag = i;
        return this;
    }
    toOne() {
        this.real = 1;
        this.imag = 0;
        return this;
    }
    toZero() {
        this.real = 0;
        this.imag = 0;
        return this;
    }
    toConjugate() {
        this.imag = -this.imag;
        return this;
    }
    toReciprocal() {
        var r = this.real;
        this.real = 1/(r + this.imag/r*this.imag);
        this.imag = -1/(this.imag + r/this.imag*r);
        return this;
    }
    normalize() {
        var i = Math.sign(this.imag)/Math.sqrt(1 + this.real/this.imag*this.real/this.imag)
        this.real = Math.sign(this.real)/Math.sqrt(1 + this.imag/this.real*this.imag/this.real);
        this.imag = i;
        return this;
    }
    static ReIm(real, imag) { return new Complex(real, imag) }
    static ModArg(mod, arg) { return new Complex(mod * Math.cos(arg), mod * Math.sin(arg)) }
}
module.exports = Complex;