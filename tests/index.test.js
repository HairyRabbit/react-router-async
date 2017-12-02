// -*- mode: js-jsx -*-
// -*- coding: utf-8 -*-
// @flow

import React from 'react'
import { Link, Router } from 'react-router-dom'
import createMemoryHistory from 'history/createMemoryHistory'
import { mount } from 'enzyme'
import renderer from 'react-test-renderer'
import Route from '../lib'

const Foo = () => (<h1>foo</h1>)
const Bar = () => (<h1>bar</h1>)
const Baz = () => (<h1>baz</h1>)
const Qux = () => (<h1>qux</h1>)
const HOC = () => Component => Qux

const App = () => (
  <div>
    <Route path='/foo' component={Promise.resolve(Foo)} />
    <Route path='/bar' component={Promise.resolve(Bar)} />
    <Route path='/baz' component={Promise.resolve(Bar)} process={HOC()} />
  </div>
)

const history = createMemoryHistory({
  initialEntries: [ '/', '/foo', '/bar', '/baz' ]
})

test('should render router async', (done) => {
  const component = (
    <Router history={history}>
      <App />
    </Router>
  )

  const wrapper = mount(component)
  const rendered = renderer.create(component)

  let tree

  tree = rendered.toJSON()
  expect(tree).toMatchSnapshot()

  history.replace('/foo')

  setTimeout(() => {
    tree = rendered.toJSON()
    expect(tree).toMatchSnapshot()

    expect(wrapper.find(Foo).exists()).toBe(true)
    expect(wrapper.find(Bar).exists()).toBe(false)
    expect(wrapper.find(Baz).exists()).toBe(false)
    expect(wrapper.find(Qux).exists()).toBe(false)

    history.replace('/bar')

    setTimeout(() => {
      tree = rendered.toJSON()
      expect(tree).toMatchSnapshot()

      expect(wrapper.find(Foo).exists()).toBe(false)
      expect(wrapper.find(Bar).exists()).toBe(true)
      expect(wrapper.find(Baz).exists()).toBe(false)
      expect(wrapper.find(Qux).exists()).toBe(false)

      // Test for process
      history.replace('/baz')

      setTimeout(() => {
        tree = rendered.toJSON()
        expect(tree).toMatchSnapshot()

        expect(wrapper.find(Foo).exists()).toBe(false)
        expect(wrapper.find(Bar).exists()).toBe(false)
        expect(wrapper.find(Baz).exists()).toBe(false)
        expect(wrapper.find(Qux).exists()).toBe(true)

        process.nextTick(done)
      })
    }, 100)
  }, 100)
})
