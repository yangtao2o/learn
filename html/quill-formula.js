export function bindEvents(div) {
  const handler = {
    /**
     * 点击点击判断是否为公式内容
     * @param {*} event
     */
    click(event) {
      const { target } = event

      const hasClass = (node, name) => {
        if (node && node.nodeType === 1) {
          return node.className
            .split(' ')
            .some((classname) => classname === name)
        }
      }
      const findFormulaNode = (current, stopNode, className) => {
        let matched = ''
        let cur = current.parentNode
        let isStop = (cur) =>
          (stopNode && stopNode === cur) || cur.nodeType === 9

        while (cur && !isStop(cur)) {
          if (cur.nodeType === 1 && hasClass(cur, className)) {
            matched = cur
            break
          }
          console.log(cur)
          cur = cur.parentNode
        }

        return matched
      }

      const setNodeAttr = (node, parentNode, className) => {
        const setAttr = (node, { style, isSelected }) => {
          node.setAttribute('style', style)
          node.setAttribute('data-selected', isSelected)
        }
        const cleanAttr = (current) => {
          const nodeAll = parentNode.querySelectorAll('.' + className)
          const nodes = Array.from(nodeAll)
          if (nodes.length) {
            nodes.forEach((item) => {
              if (item !== current) {
                setAttr(item, { style: '', isSelected: false })
              }
            })
          }
        }

        if (node && node.nodeType === 1) {
          const styles = 'background-color: #666;color: #fff;'
          setAttr(node, { style: styles, isSelected: true })
        }

        cleanAttr(node)
      }

      const formulaClassName = 'ql-formula'
      const stopNode = document.querySelector('.ql-editor')
      const getFormulaNode = findFormulaNode(target, stopNode, formulaClassName)

      console.log('getFormulaNode', getFormulaNode)
      setNodeAttr(getFormulaNode, stopNode, formulaClassName)

      if (getFormulaNode) {
        const getValue = getFormulaNode.getAttribute('data-value')
        console.log('getValue', getValue)
      }
    },
  }

  div.addEventListener('click', handler.click)
}

/**
 * 节点编辑状态下点击公式内容
 */
export default class FormulaClick {
  constructor({ container, node, editor }) {
    this.container = container
    this.editor = editor
    this.node = node

    this.formulaValue = ''
    this.formulaNode = ''

    if (this.container) {
      this.container.addEventListener('click', this.clickHandler.bind(this))
    }
  }

  clickHandler(event) {
    const { target } = event
    const formulaClassName = 'ql-formula'
    const editorClassName = 'ql-editor'
    const editorNode = document.querySelector('.' + editorClassName)

    const formulaNode = this.findFormulaNode(
      target,
      editorNode,
      formulaClassName
    )
    const value = this.getDataValue(formulaNode)

    console.log('formulaNode', value, formulaNode)

    // 注意执行的先后顺序
    this.dealwithSelectValue(value)
    this.updateValue(formulaNode, value)
    this.setNodeAttr(formulaNode)
    this.cleanNodeAttr(formulaNode, editorNode, formulaClassName)
  }

  updateValue(node, value) {
    this.formulaNode = node
    this.formulaValue = value
  }

  /**
   * 选中当前公式节点并高亮显示
   */
  dealwithSelectValue(value) {
    if (!value || value === this.formulaValue) {
      return
    }
    console.log('只绑定一次！！！')
    const minder = this.node?.getMinder()
    if (minder) {
      minder.fire('latexSelected', { latex: value })
    }
  }

  getDataValue(node) {
    if (this.isElement(node)) {
      return node.getAttribute('data-value')
    }
  }

  isElement(node) {
    return node && node.nodeType === 1
  }

  hasClass(node, name) {
    if (this.isElement(node)) {
      return node.className.split(' ').some((classname) => classname === name)
    }
  }

  findFormulaNode(current, editorNode, className) {
    let matched = ''
    let cur = current.parentNode
    let isStop = (cur) =>
      (editorNode && editorNode === cur) || cur.nodeType === 9

    while (cur && !isStop(cur)) {
      if (cur.nodeType === 1 && this.hasClass(cur, className)) {
        matched = cur
        break
      }
      console.log(cur)
      cur = cur.parentNode
    }

    return matched
  }

  setAttr(node, { style, isSelected }) {
    node.setAttribute('style', style)
    node.setAttribute('data-selected', isSelected)
  }

  setNodeAttr(node) {
    if (this.isElement(node)) {
      const styles = 'background-color: #12bb37;color: #fff;'
      this.setAttr(node, { style: styles, isSelected: true })
    }
  }

  cleanNodeAttr(current, parentNode, className) {
    const nodeAll = parentNode.querySelectorAll('.' + className)
    const nodes = Array.from(nodeAll)
    if (nodes.length) {
      nodes.forEach((item) => {
        if (item !== current) {
          this.setAttr(item, { style: '', isSelected: false })
        }
      })
    }
  }
}
