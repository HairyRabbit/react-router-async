import startCase from 'lodash/startCase'
import babel     from 'rollup-plugin-babel'
import uglify    from 'rollup-plugin-uglify'
import pkg       from './package.json'

const input     = 'lib/index.js'
const name      = startCase(pkg.npmName).replace(/\s/g, '')
const format    = 'umd'
const sourcemap = true
const globals = {
  'react-router-dom': 'ReactRouterDOM',
  '@rabbitcc/lazy-component': 'LazyComponent',
  '@rabbitcc/promise-extra': 'PromiseExtra'
}

let output, plugins = [ babel() ]


if(process.env.NODE_ENV === 'development') {
  output = {
    file: 'dist/react-router-async.js',
    format,
    sourcemap
  }
} else {
  output = {
    file: 'dist/react-router-async.min.js',
    format,
    sourcemap
  }

  plugins.push(uglify())
}

export default  {
  input,
  output,
  name,
  plugins,
  globals
}
