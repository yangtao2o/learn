/**
 * 渲染-DOM-元素
 * @param {*} element 需要渲染的元素
 * @param {*} parentDom Dom容器
 */

function render(element, parentDom) {
  const { type, props } = element

  // Create DOM element
  const isTextElement = type === 'TEXT ELEMENT'
  const dom = isTextElement
    ? document.createTextNode('')
    : document.createElement(type)

  // Add event listeners
  const isListener = name => name.startsWith('on')
  Object.keys(props)
    .filter(isListener)
    .forEach(name => {
      const eventType = name.toLowerCase().substring(2)
      dom.addEventListener(eventType, props[name])
    })

  // Set properties
  const isAttribute = name => !isListener(name) && name != 'children'
  Object.keys(props)
    .filter(isAttribute)
    .forEach(name => {
      dom[name] = props[name]
    })

  // Render children
  const childElements = props.children || []
  childElements.forEach(childElement => render(childElement, dom))

  // Append to parent
  parentDom.appendChild(dom)
}

const likes = Math.ceil(Math.random() * 100)
const buttonElement = {
  type: 'button',
  props: {
    children: [
      {
        type: 'TEXT ELEMENT',
        props: {
          nodeValue: likes,
        },
      },
      { type: 'TEXT ELEMENT', props: { nodeValue: '❤️' } },
    ],
  },
}
const appElement = {
  type: 'div',
  props: {
    children: [buttonElement],
  },
}

render(appElement, document.getElementById('root'))
