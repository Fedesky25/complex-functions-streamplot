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
            fn: c => tm[0].eq(c).mul_r(10).add(10),
        }, 
    ],
    powers: [
        {
            label: 'x<sup>k</sup>',
            fn: c => tm[0].eq(c).exp_n(otherVars.k),
        },
        {
            label: 'x<sup>r</sup><sub>k</sub>',
            fn: c => tm[0].eq(c).exp_r(otherVars.r, otherVars.k),
        },
        {
            label: 'x<sup>z<sub>1</sub></sup><sub>k</sub>',
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
            label: 'z<sub>1</sub><sup>x</sup>',
            fn: c => tm[0].eq(z1).exp(c, otherVars.k),
        },
        {
            label: 'x<sup>3</sup>e<sup>x</sup>',
            fn: c => tm[0].eq(c).exponentiate().mul$(c, c, c),
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
    ],
}