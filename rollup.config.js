import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import builtins from 'rollup-plugin-node-builtins'
import json from '@rollup/plugin-json'
import nodePolyfills from 'rollup-plugin-polyfill-node'

const pkg = require('./package.json')

export default [
  {
    input: 'out-tsc/index.js',
    output: [
      {
        exports: 'named',
        file: pkg.module,
        sourcemap: true,
      },
    ],
    plugins: [
      resolve({ browser: true, preferBuiltins: false }),
      json(),
      commonjs(),
      builtins(),
      nodePolyfills({ include: null }),
    ],
  },
]
