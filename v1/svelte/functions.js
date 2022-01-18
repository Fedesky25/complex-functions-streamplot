import Complex from "./complex";
import { z1, z2, z3, otherVars } from './variables';

const tm = [new Complex(), new Complex(), new Complex(), new Complex()];

/**@type {Object.<string, {label: string, fn: Function}[]>} */
export default {
    polynomials: [
        {
            label: 'z<sub>1</sub>x + z<sub>2</sub>',
            fn: c => tm[0].eq(c).mul(z1).add(z2),
        },
        {
            label: 'z<sub>1</sub>x<sup>2</sup> + z<sub>2</sub>x + z<sub>3</sub>',
            fn: c => tm[0].toZero().add$(
                tm[1].eq(c).mul$(c, z1),
                tm[2].eq(c).mul(z2),
                z3
            ),
        },
        {
            label: 'z<sub>1</sub>x<sup>3</sup> + z<sub>2</sub>x + z<sub>3</sub>',
            fn: c => tm[0].toZero().add$(
                tm[1].eq(c).mul$(c, c, z1),
                tm[2].eq(c).mul(z2),
                z3
            ),
        },
        {
            label: '(x - z<sub>1</sub>)(x - z<sub>2</sub>)(x - z<sub>3</sub>)',
            fn: c => tm[0].toOne().mul$(
                tm[1].eq(c).sub(z1),
                tm[2].eq(c).sub(z2),
                tm[3].eq(c).sub(z3)
            ),
        }, 
    ],
    powers: [
        {
            label: 'x<sup>k</sup>',
            fn: c => tm[0].eq(c).exp_n(otherVars.k),
        },
        {
            label: '(x<sub>k</sub>)<sup>r</sup>',
            fn: c => tm[0].eq(c).exp_r(otherVars.r, otherVars.k),
        },
        {
            label: '(x<sub>k</sub>)<sup>z<sub>1</sub></sup>',
            fn: c => tm[0].eq(c).exp(z1, otherVars.k),
        },
    ],
    exponentials: [
        {
            label: 'e<sup>x</sup>',
            fn: c => tm[0].eq(c).exponentiate(),
        },
        {
            label: 'e<sup>z<sub>1</sub>x</sup>',
            fn: c => tm[0].eq(c).mul(z1).exponentiate(),
        },
        {
            label: 'e<sup>x<sup>2</sup></sup>',
            fn: c => tm[0].eq(c).mul(c).exponentiate(),
        },
        {
            label: 'e<sup>(x<sub>k</sub>)<sup>r</sup></sup>',
            fn: c => tm[0].eq(c).exp_r(otherVars.r, otherVars.k).exponentiate(),
        },
        {
            label: '(z<sub>1, k</sub>)<sup>x</sup>',
            fn: c => tm[0].eq(z1).exp(c, otherVars.k),
        },
        {
            label: 'x<sup>3</sup>e<sup>x</sup>',
            fn: c => tm[0].eq(c).exponentiate().mul$(c, c, c),
        },
        {
            label: 'x<sup>r</sup>e<sup>x</sup>',
            fn: c => tm[0].eq(c).exponentiate().mul(tm[1].eq(c).exp_r(otherVars.r)),
        },
    ],
    logarithms: [
        {
            label: 'z<sub>1</sub>ln(x)<sub>k</sub>',
            fn: c => tm[0].eq(c).logarize(otherVars.k).mul(z1),
        },
        {
            label: 'x ln(x)<sub>k</sub>',
            fn: c => tm[0].eq(c).logarize(otherVars.k).mul(c),
        },
        {
            label: 'ln(x + z<sub>1</sub>)<sub>k</sub>',
            fn: c => tm[0].eq(c).add(z1).logarize(otherVars.k),
        },
    ],
    trigonometry: [
        {
            label: 'sin(x)',
            fn: c => tm[0].eq(c).intoSine(),
        },
        {
            label: 'cos(x)',
            fn: c => tm[0].eq(c).intoCosine(),
        },
        {
            label: 'sin(x + z<sub>1</sub>)',
            fn: c => tm[0].eq(c).add(z1).intoSine(),
        },
        {
            label: 'sin(z<sub>1</sub>x)',
            fn: c => tm[0].eq(c).mul(z1).intoSine(),
        },
        {
            label: 'cos(z<sub>1</sub>x)',
            fn: c => tm[0].eq(c).mul(z1).intoCosine(),
        },
        {
            label: 'z<sub>1</sub>sin(z<sub>2</sub>x)',
            fn: c => tm[0].eq(c).mul(z2).intoSine().mul(z1),
        },
    ],
    miscellaneous: [
        {
            label: '<span class="overline">x</span>i',
            fn: c => tm[0].eq(c).toConjugate().mul_i(),
        },
        {
            label: '<span class="overline">x</span>z<sub>1</sub>',
            fn: c => tm[0].eq(c).toConjugate().mul(z1),
        },
        {
            label: `(x<sup>2</sup> - z<sub>1</sub>) (x - z<sub>2</sub>)<sup>2</sup> / (x<sup>2</sup> + z<sub>3</sub>)`,
            fn: c => tm[0].toOne().mul$(
                tm[1].eq(c).mul(c).sub(z1),
                tm[2].eq(c).sub(z2).exp_r(2),
                tm[3].eq(c).mul(c).add(z3).toReciprocal()
            ),
        },
        {
            title: 'Binet function (Fibonacci)',
            label: '<em>F</em><sub>x</sub>',
            fn: binet,
        },
        {
            title: 'Gamma function (through Lanczos approximation)',
            label: '&Gamma;(x)',
            fn: gamma,
        },
        // {
        //     title: 'Riemann zeta function (through Riemann–Siegel formula)',
        //     label: '&zeta;(x)',
        //     fn: zeta,
        // },
    ],
}


const sqrt5 = Math.sqrt(5);
const ln_phi = Math.log((1 + sqrt5)/2);
function binet(z) {
    tm[0].eq(z).mul_r(ln_phi).exponentiate();
    tm[1].becomes(0, Math.PI).mul(z).exponentiate().div(tm[0]);
    tm[0].sub(tm[1]).mul_r(1/sqrt5);
    if(Math.abs(tm[0].imag) < Number.EPSILON) tm[0].imag = 0;
    return tm[0];
}


const p = [
    676.5203681218851,
    -1259.1392167224028,
    771.32342877765313,
    -176.61502916214059,
    12.507343278686905,
    -0.13857109526572012,
    9.9843695780195716e-6,
    1.5056327351493116e-7
]
const sqrt2PI = Math.sqrt(2 * Math.PI);

/**@param {Complex} z*/
function _gamma_pos(z) {
    tm[3].becomes(z.real-1, z.imag);
    tm[0].becomes(0.99999999999980993, 0);
    for(var i=0; i<8; i++) 
        tm[0].add( tm[1].becomes(1+i,0).add(tm[3]).toReciprocal().mul_r(p[i]) );
    tm[1].becomes(8 - .5, 0).add(tm[3]);
    tm[2].eq(tm[1]);
    tm[3].real += .5;
    tm[0].mul_r(sqrt2PI).mul$( tm[1].exp(tm[3]), tm[2].mul_r(-1).exponentiate() );
    if(Math.abs(tm[0].imag) < 1e-10) tm[0].imag = 0;
    return tm[0];
}
/**@param {Complex} z*/
function gamma(z) {
    if(z.real < .5) {
        _gamma_pos(tm[3].becomes(1-z.real, -z.imag));
        tm[1].eq(z).mul_r(Math.PI).intoSine().mul(tm[0]).toReciprocal().mul_r(Math.PI);
        if(Math.abs(tm[1].imag) < 1e-10) tm[1].imag = 0;
        return tm[1];
    } else return _gamma_pos(z);
}

const ln2pi = Math.log(2*Math.PI);
const logs_n = [1,2,3,4,5,6,7,8,9,10].map(n => Math.log(n));

/**@param {Complex} z*/
function zeta(z) {
    const M = Math.floor(Math.sqrt(Math.abs(z.imag)*.5/Math.PI));
    // calculates gamma first since gamma uses tm
    tm[3].becomes(1-z.real, -z.imag);
    tm[3].eq(gamma(tm[3]));
    // first summation
    tm[0].toZero();
    for(var i=0; i<M; i++) tm[0].add( tm[1].eq(z).mul_r(-logs_n[i]).exponentiate() );
    // things of second term
    tm[1].eq(z).mul_r(ln2pi).exponentiate();
    tm[2].eq(z).mul_r(Math.PI/2).intoSine();
    tm[3].mul(tm[1]).mul(tm[2]).mul_r(1/Math.PI);
    // second summation
    tm[1].toZero();
    for(var i=0; i<M; i++) tm[1].add( tm[2].becomes(z.real-1, z.imag).mul_r(logs_n[i]).exponentiate() );
    // all together
    return tm[3].mul(tm[1]).add(tm[0]);
}

window.binet = binet;
window.gamma = gamma;
window.zeta = zeta;