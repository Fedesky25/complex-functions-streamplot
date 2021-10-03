function nf(n) { return Number.isInteger(n) ? n.toString() : n.toPrecision(4) } 
export default class Complex {
    constructor() {
        this.real=0;
        this.imag=0;
        this.mod=0;
        this.arg=0;
    }
    /**Calculates modulus and argument from real and imaginary parts*/
    calcModArg() {
        this.mod = Math.sqrt( this.real*this.real + this.imag*this.imag );
        this.arg = Math.atan2(this.imag, this.real);
    }
    /**Calculates real and imaginary parts from modulus and argument*/
    calcReIm() {
        this.real = this.mod * Math.cos(this.arg);
        this.imag = this.mod * Math.sin(this.arg);
    }
    toZero() {
        this.real=0;
        this.imag=0;
        this.mod=0;
        this.arg=0;
        return this;
    }
    toOne() {
        this.real=1;
        this.imag=0;
        this.mod=1;
        this.arg=0;
        return this;
    }
    /**
     * @param {Complex} c
     * @returns {Complex} 
     */
    eq(c) {
        this.real = c.real;
        this.imag = c.imag;
        this.mod = c.mod;
        this.arg = c.arg;
        return this;
    }
    /**
     * @param {Complex} c
     * @returns {Complex} 
     */
    add(c) {
        this.real += c.real;
        this.imag += c.imag;
        this.calcModArg()
        return this;
    }
    /**
     * @param {Number} n
     * @returns {Complex} 
     */
    add_r(r) {
        this.real += n;
        this.calcModArg();
        return this;
    }
    /**
     * @param {...Complex} cs
     * @returns {Complex} 
     */
    add$(...cs) {
        for(var i=cs.length-1; i>=0; i--){
            this.real += cs[i].real;
            this.imag += cs[i].imag;
        }
        this.calcModArg()
        return this;
    }
    /**
     * @param {Complex} c
     * @returns {Complex} 
     */
    sub(c) {
        this.real -= c.real;
        this.imag -= c.imag;
        this.calcModArg();
        return this;
    }
    /**
     * @param {Complex} c
     * @returns {Complex} 
     */
    mul(c) {
        var t = this.imag*c.real + this.real*c.imag;
        this.real = this.real*c.real - this.imag*c.imag;
        this.imag = t;
        this.mod *= c.mod;
        this.arg += c.arg;
        return this;
    }
    /**
     * @param {Number} n
     * @returns {Complex} 
     */
    mul_r(r) {
        this.real *= r;
        this.imag *= r;
        this.mod *= r;
        return this;
    }
    /**
     * @param {...Complex} cs
     * @returns {Complex} 
     */
    mul$(...cs) {
        var t;
        for(var i=cs.length-1; i>=0; i--) {
            var t = this.imag*cs[i].real + this.real*cs[i].imag;
            this.real = this.real*cs[i].real - this.imag*cs[i].imag;
            this.imag = t;
            this.mod *= cs[i].mod;
            this.arg += cs[i].arg;
        }
        this.calcReIm();
        return this;
    }
    /**
     * @param {Complex} c
     * @returns {Complex} 
     */
    div(c) {
        if(typeof c === "number") {
            this.real /= c;
            this.imag /= c;
            this.mod /= c;
        } else {
            this.mod /= c.mod;
            this.arg -= c.arg;
            this.calcReIm();
        }
        return this;
    }
    /**
     * @param {Complex} c complex power
     * @param {Number} [k=0] determines angle
     * @returns {Complex}
     */
    exp(c, k=0) {
        return this.logarize(k).mul(c).exponentiate();
    }
    /**
     * @param {Number} r 
     * @returns {Complex}
     */
    exp_r(r) {
        this.mod = Math.pow(this.mod, r);
        this.arg *= r;
        this.calcReIm();
        return this;
    }
    exponentiate() {
        this.mod = Math.exp(this.real);
        this.arg = this.imag;
        this.calcReIm();
        return this;
    }
    /**
     * @param {Number} [k=0]
     * @returns {Complex}
     */
    logarize(k=0) {
        this.real = Math.log(this.mod);
        this.imag = this.arg % Math.PI + k*Math.PI*2;
        this.calcModArg();
        return this;
    }
    toOpposite() {
        this.real = -this.real;
        this.imag = -this.imag;
        this.arg = this.arg + Math.PI;
        return this;
    }
    toReciprocal() {
        this.mod = 1/this.mod;
        this.arg = -this.arg;
        this.real = this.real * this.mod * this.mod;
        this.imag = this.imag * this.mod * this.mod;
        return this;
    }
    toConjugate() {
        this.imag = - this.imag;
        this.arg = -this.arg;
        return this;
    }
    normalize() {
        this.real /= this.mod;
        this.imag /= this.mod;
        this.mod = 1;
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
    static ModArg(mod, arg) {
        let c = new Complex();
        c.mod = mod;
        c.arg = arg;
        c.calcReIm();
        return c;
    }
    static ReIm(real, imaginary) {
        let c = new Complex();
        c.real = real;
        c.imag = imaginary;
        c.calcModArg();
        return c;
    }
    static copy(c) { return new Complex().eq(c)}
}
window.Complex = Complex;