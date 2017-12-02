// -*- mode: js-jsx -*-
// -*- coding: utf-8 -*-
// @flow

/**
 * AsyncRoute
 *
 * Patched <Route />, used for code-split.
 *
 * Examples:
 *
 * - import { Route } from 'react-router-dom'
 * + import Route from 'rabbit-react-router-async'
 *
 * function SiteMaps() {
 *   return (
 *     <Route component={
 *       import(\/* ChunkName *\/ 'path/to/foo')
 *     } />
 *   )
 * }
 *
 *
 * TODO
 * 1. `render()` supports.
 * 2. `children` supports.
 */

import * as React    from 'react'
import { identity }  from 'lodash'
import { Route }     from 'react-router-dom'
import { isPromise } from 'rabbit-promise-extra'
import Lazy          from 'rabbit-lazy-component'

type Props = {
  component?: React.ComponentType<*> | Promise<{ default: React.ComponentType<*> }>,
  process?:   React.ComponentType<*> => React.ComponentType<*>
}

export default function (props: Props) {
  const { component, process, ...other } = props

  // Use native Route if component not a promise.
  if (!(component && isPromise(component))) {
    // $FlowFixMe: Promise type case
    return (<Route {...props} />)
  }

  const postprocess = process || identity

  return (
    <Route {...other} render={router => (
      <Lazy modules={component}>
        {(error, module) => {
          const Component = postprocess(
            module.hasOwnProperty('default')
              ? module.default
              : module
          )
          return (
            <Component {...router} />
          )
        }}
      </Lazy>
    )} />
  )
}
