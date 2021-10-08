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
            label: 'e<sup>x<sup>2</sup>+x</sup>',
            fn: c => tm[0].eq(c).mul(c).add(c).exponentiate(),
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
            label: '&Gamma;(x)',
            fn: gamma,
        },
    ],
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
const epsilon = 1e-7, sqrt2PI = Math.sqrt(2 * Math.PI);

/**@param {Complex} z*/
function gamma(z) {
    if(z.real < .5) {
        z.real = 1 - z.real;
        z.imag = -z.imag;
        gamma(z);
        z.real = 1 - z.real;
        z.imag = -z.imag;
        tm[1].eq(z).mul_r(Math.PI).intoSine().mul(tm[3]).toReciprocal().mul_r(Math.PI);
        if(Math.abs(tm[1].imag) < epsilon) tm[1].imag = 0;
        return tm[1];
    } else {
        z.real -= 1;
        tm[0].becomes(0.99999999999980993, 0);
        for(var i=0; i<8; i++) 
            tm[0].add( tm[1].becomes(1+i,0).add(z).toReciprocal().mul_r(p[i]) );
        tm[1].becomes(8 - .5, 0).add(z);
        tm[2].eq(tm[1]);
        z.real += .5;
        tm[3].becomes(sqrt2PI, 0).mul$(
            tm[0],
            tm[1].exp(z),
            tm[2].mul_r(-1).exponentiate(),
        );
        if(Math.abs(tm[3].imag) < epsilon) tm[3].imag = 0;
        z.real += .5;
        return tm[3];
    }
} 
window.gamma = gamma;