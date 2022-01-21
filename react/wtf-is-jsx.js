/**
 * @address https://jasonformat.com/wtf-is-jsx/
 */

/** @jsx h */

// ^^^^ this tells a transpiler to inject calls to an `h()` function for each node.

const ITEMS = 'hello there people'.split(' ')

// a "partial" that does a filtered loop - no template BS, just functional programming:
function foo(items) {
  // imagine templates that adhere to your JS styleguide...
  return items.map(p => h('li', null, ' ', p, ' ')) // <-- can be multiline
}

// a simple JSX "view" with a call out ("partial") to generate a list from an Array:
let vdom = h(
  'div',
  { id: 'foo' },
  h('p', null, 'Look, a simple JSX DOM renderer!'),
  h('ul', null, foo(ITEMS))
)

// render() converts our "virtual DOM" (see below) to a real DOM tree:
let dom = render(vdom)

// append the new nodes somewhere:
document.body.appendChild(dom)

// Remember that "virtual DOM"? It's just JSON - each "VNode" is an object with 3 properties.
let json = JSON.stringify(vdom, null, '  ')

// The whole process (JSX -> VDOM -> DOM) in one step:
document.body.appendChild(render(h('pre', null, json)))

/** Render Virtual DOM to the real DOM */
function render(vnode) {
  if (typeof vnode === 'string') return document.createTextNode(vnode)
  let n = document.createElement(vnode.nodeName)
  Object.keys(vnode.attributes || {}).forEach(k =>
    n.setAttribute(k, vnode.attributes[k])
  )
  ;(vnode.children || []).forEach(c => n.appendChild(render(c)))
  return n
}

/** hyperscript generator, gets called by transpiled JSX */
function h(nodeName, attributes, ...args) {
  let children = args.length ? [].concat(...args) : null
  return { nodeName, attributes, children }
}

/*
// here's an alternative hyperscript-to-vdom method that creates sparse nodes:
function h(nodeName, attributes, ...args) {
  let vnode = { nodeName };
  if (attributes) vnode.attributes = attributes;
  if (args.length) vnode.children = [].concat(...args);
  return vnode;
}
*/
