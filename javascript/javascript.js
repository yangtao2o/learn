/**
 * JavaScript 固有对象
 */

var set = new Set()
var objects = [
  eval,
  isFinite,
  isNaN,
  parseFloat,
  parseInt,
  decodeURI,
  decodeURIComponent,
  encodeURI,
  encodeURIComponent,
  Array,
  Date,
  RegExp,
  Promise,
  Proxy,
  Map,
  WeakMap,
  Set,
  WeakSet,
  Function,
  Boolean,
  String,
  Number,
  Symbol,
  Object,
  Error,
  EvalError,
  RangeError,
  ReferenceError,
  SyntaxError,
  TypeError,
  URIError,
  ArrayBuffer,
  // SharedArrayBuffer,
  DataView,
  Float32Array,
  Float64Array,
  Int8Array,
  Int16Array,
  Int32Array,
  Uint8Array,
  Uint16Array,
  Uint32Array,
  Uint8ClampedArray,
  Atomics,
  JSON,
  Math,
  Reflect,
]
objects.forEach(o => set.add(o))

for (var i = 0; i < objects.length; i++) {
  var o = objects[i]
  for (var p of Object.getOwnPropertyNames(o)) {
    var d = Object.getOwnPropertyDescriptor(o, p)
    if (
      (d.value !== null && typeof d.value === 'object') ||
      typeof d.value === 'function'
    )
      if (!set.has(d.value)) set.add(d.value), objects.push(d.value)
    if (d.get) if (!set.has(d.get)) set.add(d.get), objects.push(d.get)
    if (d.set) if (!set.has(d.set)) set.add(d.set), objects.push(d.set)
  }
}

console.log(set)

/**
 * Promise
 * 实现一个红绿灯，绿色 3 秒，黄色 1 秒，红色 2 秒循环改变背景色
 */

function sleep(duration = 0) {
  return new Promise(function (resolve, reject) {
    setTimeout(resolve, duration)
  })
}
const fontStyle = 'font-size: 24px;font-weight: bold;'
const color = {
  green: { name: '绿绿绿', time: 3000, style: `${fontStyle}color: green` },
  yellow: { name: '黄黄黄', time: 1000, style: `${fontStyle}color: yellow` },
  red: { name: '红红红', time: 2000, style: `${fontStyle}color: red` },
}
const logger = target => console.log(`%c${target.name}`, target.style)

const handleStart = async () => {
  while (true) {
    await sleep(color.green.time)
    logger(color.green)
    await sleep(color.yellow.time)
    logger(color.yellow)
    await sleep(color.red.time)
    logger(color.red)
  }
}

console.log('%cStart', fontStyle)
handleStart()

/**
 * 找出所有具有 Symbol.iterator 的原生对象
 * String, Array, TypedArray, Map and Set 是所有内置可迭代对象
 */
Object.getOwnPropertyNames(window).filter(prop => {
  return (
    window[prop] &&
    window[prop].prototype &&
    window[prop].prototype[Symbol.iterator]
  )
})

// 打印结果
const result = [
  'Array',
  'String',
  'Uint8Array',
  'Int8Array',
  'Uint16Array',
  'Int16Array',
  'Uint32Array',
  'Int32Array',
  'Float32Array',
  'Float64Array',
  'Uint8ClampedArray',
  'BigUint64Array',
  'BigInt64Array',
  'Map',
  'Set',
  'URLSearchParams',
  'TouchList',
  'TextTrackList',
  'TextTrackCueList',
  'StyleSheetList',
  'StylePropertyMapReadOnly',
  'StylePropertyMap',
  'SVGTransformList',
  'SVGStringList',
  'SVGPointList',
  'SVGNumberList',
  'SVGLengthList',
  'RadioNodeList',
  'RTCStatsReport',
  'PluginArray',
  'Plugin',
  'NodeList',
  'NamedNodeMap',
  'MimeTypeArray',
  'MediaList',
  'Headers',
  'HTMLSelectElement',
  'HTMLOptionsCollection',
  'HTMLFormElement',
  'HTMLFormControlsCollection',
  'HTMLCollection',
  'HTMLAllCollection',
  'FormData',
  'FileList',
  'EventCounts',
  'DataTransferItemList',
  'DOMTokenList',
  'DOMStringList',
  'DOMRectList',
  'CSSUnparsedValue',
  'CSSTransformValue',
  'CSSStyleDeclaration',
  'CSSRuleList',
  'CSSNumericArray',
  'CSSKeyframesRule',
  'AudioParamMap',
  'KeyboardLayoutMap',
  'MIDIInputMap',
  'MIDIOutputMap',
  'MediaKeyStatusMap',
  'ImageTrackList',
  'XRAnchorSet',
  'XRInputSourceArray',
  'CustomStateSet',
  'SourceBufferList',
  'webkitSpeechGrammarList',
]

const getAllStyle = () =>
  Object.keys(document.body.style).filter(e => !e.match(/^webkit/))
