import resolve from '@rollup/plugin-node-resolve'
import replace from '@rollup/plugin-replace'
import commonjs from '@rollup/plugin-commonjs'
import builtins from 'rollup-plugin-node-builtins'
import copy from 'rollup-plugin-copy'
import json from '@rollup/plugin-json'
import nodePolyfills from 'rollup-plugin-polyfill-node'

const pkg = require('./package.json')

export default [
  {
    input: 'out-tsc/esm/index.js',
    output: [
      {
        exports: 'named',
        file: pkg.module,
        sourcemap: true,
      },
    ],
    plugins: [
      replace({
        "import require$$0 from 'buffer'": "import * as require$$0 from 'buffer'",
        delimiters: ['', ''],
        preventAssignment: true,
      }),
      resolve({ browser: true, preferBuiltins: false }),
      json(),
      commonjs(),
      builtins(),
      nodePolyfills({ include: null }),
      copy({ targets: [{ src: 'lib/cadence/*', dest: 'dist/cadence' }] }),
    ],
    // Ignore warnings from third party modules
    onwarn: (warning, warn) => {
      if (warning.id?.indexOf(__dirname + '/node_modules/') === 0) {
        return
      }
      warn(warning)
    },
  },
]
