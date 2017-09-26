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
 */

import React         from 'react'
import { Route }     from 'react-router-dom'
import { isPromise } from 'rabbit-promise-extra'
import Lazy          from 'rabbit-lazy-component'

type Props = {
  [key: string]: *
}

export default function (props: Props) {
  const { component, ...other } = props

  // Use native Route if component not a promise.
  if (!(component && isPromise(component)))
    return (<Route {...props} />)

  return (
    <Route {...other} render={router => (
      <Lazy modules={component}>
        {(error, module) => {
          const Component = module.hasOwnProperty('default')
                ? module.default
                : module
          return (
            <Component {...router} />
          )
        }}
      </Lazy>
    )} />
  )
}
