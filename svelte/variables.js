import Complex from "./complex";
import { writable } from "svelte/store";

export const z1 = Complex.ReIm(-1, 1);
export const z2 = Complex.ModArg(2, Math.PI/4);
export const z3 = new Complex();

export const otherVars = { r: .5, k: 0 }

export const complex_function = writable(c => Complex.ReIm(c.real, c.imag));