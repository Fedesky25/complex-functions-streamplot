import svelte from 'rollup-plugin-svelte'
import css from 'rollup-plugin-css-only'
import resolve from '@rollup/plugin-node-resolve'


export default [
    {
        input: './v1/App.js',
        output: {
            format: 'iife',
            name: 'app',
            file: './v1/script.js'
        },
        plugins: [
            svelte(),
            css({output: 'style.css'}),
            resolve({browser: true})
        ]
    },
    {
        input: './v2/App.js',
        output: {
            format: 'iife',
            name: 'app',
            file: './v2/script.js'
        },
        plugins: [
            svelte(),
            css({output: 'style.css'}),
            resolve({browser: true})
        ]
    }
]