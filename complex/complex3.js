let i, temp1, temp2;
export default class Complex3 {
    constructor() {
        this.real = 0;
        this.imag = 0;
        this.mod = 0;
        this.arg = 0;
        this.state = 0; // 0 if alright, 1 if RI missing, -1 if MA missing
    }
    calcReIm() {
        if(this.state <= 0) return;
        this.real = this.mod * Math.cos(this.arg);
        this.imag = this.mod * Math.sin(this.arg);
        this.state = 0;
        return this;
    }
    calcModArg() {
        if(this.state >= 0) return;
        this.real = this.mod * Math.cos(this.arg);
        this.imag = this.mod * Math.sin(this.arg);
        this.state = 0;
        return this;
    }
    /**@param {Complex3} c */
    copies(c) {
        this.real = c.real;
        this.imag = c.imag;
        this.mod = c.mod;
        this.arg = c.arg;
        this.state = c.state;
        return this;
    }
    /**@param {Complex3} c */
    add(c) {
        this.calcReIm();
        this.real += c.real;
        this.imag += c.imag;
        this.state = -1;
    }
    /**@param {...Complex3} cs */
    addMore(...cs) {
        for(i=cs.length-1; i>=0; i--) {
            this.real += cs[i].real;
            this.imag += cs[i].imag;
        }
        this.state = -1;
    }
    /**@param {Complex3} c */
    sub(c) {
        this.calcReIm();
        this.real -= c.real;
        this.imag -= c.imag;
        this.state = -1;
    }
}