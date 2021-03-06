export default class Complex {
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
        var m2 = c.real*c.real + c.imag*c.imag;
        var r = (this.real*c.real + this.imag*c.imag) / m2;
        var i = (this.imag*c.real - this.real*c.imag) / m2;
        this.real = r;
        this.imag = i;
        return this;
    }
    /**
     * @param {Complex} c complex power
     * @param {Number} [k=0] determines angle
     */
    exp(c, k=0) {
        return this.logarize(k).mul(c).exponentiate();
    }
    /**
     * @param {Complex} r real power
     * @param {Number} [k=0] determines angle
     */
    exp_r(r, k=0) {
        var mod = Math.pow(this.real*this.real + this.imag*this.imag, r/2); 
        var arg = Math.atan2(this.imag, this.real) + k*2*Math.PI;
        this.real = mod * Math.cos(r * arg);
        this.imag = mod * Math.sin(r * arg);
        return this;
    }
    /**@param {Number} n integer power */
    exp_n(n) {
        if(n == 0) return this.becomes(1, 0);
        const real = this.real, imag = this.imag;
        var end = n, t;
        if(n<0) {
            end = -n;
            this.toReciprocal();
        }
        for(var i=0; i<end; i++) {
            t = this.imag*real + this.real*imag;
            this.real = this.real*real - this.imag*imag;
            this.imag = t;
        }
        return this;
    }
    exponentiate() {
        var mod = Math.exp(this.real);
        this.real = mod * Math.cos(this.imag);
        this.imag = mod * Math.sin(this.imag);
        return this;
    }
    logarize(k=0) {
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
        var m2 = this.real*this.real + this.imag*this.imag;
        this.real /= m2;
        this.imag = -this.imag/m2;
        return this;
    }
    toString() {
        if(this.real == 0) return this.imag ? nf(this.imag)+'i' : '0';
        if(this.imag == 0) return nf(this.real);
        let r = ['(', nf(this.real)];
        if(this.imag > 0) {
            if(this.imag === 1) r.push('+i)');
            else r.push('+', nf(this.imag), 'i)');
        } else {
            if(this.imag === -1) r.push('-i)');
            else r.push(nf(this.imag), 'i)');
        }
        return r.join('');
    }
    static ReIm(real, imag) { return new Complex(real, imag) }
    static ModArg(mod, arg) { return new Complex(mod * Math.cos(arg), mod * Math.sin(arg)) }
    // /**@param {Complex} c*/
    // static exp(c) { return new Complex(Math.cos(c.imag), Math.sin(c.imag)).mul_r(Math.exp(c.real)) }
    // /**@param {Complex} c*/
    // static sin(c) { return new Complex(Math.sin(c.real)*Math.cosh(c.imag), Math.cos(c.real)*Math.sinh(c.imag)) }
}
window.Complex = Complex;
function nf(n) { return Number.isInteger(n) ? n.toString() : n.toPrecision(4) } 