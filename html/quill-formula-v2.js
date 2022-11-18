import Quill from "quill";

/**
 * 节点编辑状态下点击公式内容
 */
export default class FormulaClick {
  constructor({ container, node, quill }) {
    this.container = container;
    this.quill = quill;
    this.node = node;

    this.formulaNode = "";

    if (this.container) {
      this.container.addEventListener("click", this.clickHandler.bind(this));
    }

    this.quill.on("selection-change", (range) => {
      if (!range) return;
      if (!range.length && this.formulaNode) {
        this.cleanNodeAttr(this.formulaNode);
      }
    });
  }

  clickHandler(event) {
    const { target } = event;
    const formulaClassName = "ql-formula";
    const editorClassName = "ql-editor";
    const editorNode = document.querySelector("." + editorClassName);

    const formulaNode = this.findFormulaNode(
      target,
      editorNode,
      formulaClassName
    );

    this.formulaNode = formulaNode;

    if (formulaNode) {
      const value = this.getDataValue(formulaNode);
      this.dealwithSelectValue(value);
    }

    /**
     * 自定义选中样式
     * 通过 .ql-formula { user-select: none; } 禁止了默认选中样式
     */
    this.setNodeAttr(formulaNode);
    this.cleanOtherNodesAttr(formulaNode, editorNode, formulaClassName);
  }

  /**
   * 选中当前公式节点
   */
  dealwithSelectValue(value) {
    if (value && typeof value === "string") {
      this.updateValue(value);
      this.setSelection(1);
    }
  }

  setSelection(length) {
    const quill = this.quill;
    const linkBlot = Quill.find(this.formulaNode);
    const index = quill.getIndex(linkBlot);
    quill.setSelection(index, length, Quill.sources.API);
  }

  updateValue(value) {
    const minder = this.node?.getMinder();
    if (minder && value) {
      minder.fire("latexSelected", { latex: value });
    }
  }

  getDataValue(node) {
    if (this.isElement(node)) {
      return node.getAttribute("data-value");
    }
  }

  isElement(node) {
    return node && node.nodeType === 1;
  }

  hasClass(node, name) {
    if (this.isElement(node) && node.className) {
      return node.className
        .toString()
        .split(" ")
        .some((classname) => classname === name);
    }
  }

  findFormulaNode(current, editorNode, className) {
    let matched = "";
    let cur = current.parentNode;
    let isStop = (cur) =>
      (editorNode && editorNode === cur) || cur.nodeType === 9;

    while (cur && !isStop(cur)) {
      if (cur.nodeType === 1 && this.hasClass(cur, className)) {
        matched = cur;
        break;
      }
      cur = cur.parentNode;
    }

    return matched;
  }

  setAttr(node, { style }) {
    node.setAttribute("style", style);
  }

  setNodeAttr(node) {
    if (this.isElement(node)) {
      const styles = "background-color: #d0f1d7;color: inherit;";
      this.setAttr(node, { style: styles });
    }
  }

  cleanNodeAttr(node) {
    if (this.isElement(node)) {
      this.setAttr(node, { style: "" });
    }
  }

  cleanOtherNodesAttr(current, parentNode, className) {
    const nodeAll = parentNode.querySelectorAll("." + className);
    const nodes = Array.from(nodeAll);
    if (nodes.length) {
      nodes.forEach((item) => {
        if (item !== current) {
          this.setAttr(item, { style: "" });
        }
      });
    }
  }
}
