let i, temp;
export default class Complex4 {
    constructor() {
        /**Real part */
        this[0] = 0;
        /**Imaginary part */
        this[1] = 0;
        /**Modulus */
        this[2] = 0;
        /**Argument */
        this[3] = 0;
    }
    /**Calculates modulus and argument from real and imaginary parts*/
    calcModArg() {
        this[2] = Math.sqrt( this[0]*this[0] + this[1]*this[1] );
        this[3] = Math.atan2(this[1], this[0]);
    }
    /**Calculates real and imaginary parts from modulus and argument*/
    calcReIm() {
        this[0] = this[2] * Math.cos(this[3]);
        this[1] = this[2] * Math.sin(this[3]);
    }
    /**@param {Complex4} c */
    eq(c) {
        this[0] = c[0];
        this[1] = c[1];
        this[2] = c[2];
        this[3] = c[3];
        return this;
    }
    /**@param {Complex4} c */
    add(c) {
        this[0] += c[0];
        this[1] += c[1];
        this.calcModArg();
        return this;
    }
    /**@param {...Complex4} cs */
    add$(...cs) {
        for(i=cs.length-1; i>=0; i--) {
            this[0] += cs[i][0];
            this[1] += cs[i][1];
        }
        this.calcModArg();
        return this;
    }
    /**@param {Complex4} c */
    sub(c) {
        this[0] -= c[0];
        this[1] -= c[1];
        this.calcModArg();
        return this;
    }
    /**@param {Complex4} c */
    mul(c) {
        this[2] *= c[2];
        this[3] += c[3];
        this.calcReIm();
        return this;
    }
    /**@param {...Complex4} cs */
    mul$(...cs) {
        for(i=cs.length-1; i>=0; i--) {
            this[2] *= cs[i][2];
            this[3] += cs[i][3];
        }
        this.calcReIm();
        return this;
    }
    /**@param {Complex4} c */
    div(c) {
        this[2] /= c[2];
        this[3] -= c[3];
        this.calcReIm();
        return this;
    }
    /**@param {Complex4} c */
    exp(c) {

    }
    /**@param {Number} r */
    exp_r(r) {
        this[2] = Math.pow(this[2], r);
        this[3] *= r;
        this.calcReIm();
        return this;
    }
    exponentiate() {
        this[2] = Math.exp(this[0]);
        this[3] = this[1];
        this.calcReIm();
        return this;
    }
    logarize(k=0) {
        this[0] = Math.log(this[2]);
        this[1] = this[3] % Math.PI + k*2*Math.PI;
        this.calcModArg();
        return this;
    }
    toConjugate() {
        this[1] = -this[1];
        this[3] = -this[3];
        return this;
    }
    toReciprocal() {
        this[2] = 1/this[2];
        this[3] = -this[3];
        this[0] = this[0] * this[2] * this[2];
        this[1] = -this[1] * this[2] * this[2];
        return this;
    }
    static ModArg(m, a) {
        temp = new Complex4();
        temp[2] = m;
        temp[3] = a;
        temp.calcReIm();
        return temp;
    }
    static ReIm(r, i) {
        temp = new Complex4();
        temp[0] = r;
        temp[1] = i;
        temp.calcModArg();
        return temp;
    }
}