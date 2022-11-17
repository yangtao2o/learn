import { nanoid } from "nanoid";
import { IMindDataImportConvertor } from "./types";
import {
  IResource,
  IMinderNode,
  IRelativeLink,
  IMindData,
  INodeData,
} from "./types";
import { MubuHtmlNode, ListContent } from "./types";

export class MubuHtmlConvertor
  implements IMindDataImportConvertor<MubuHtmlNode>
{
  private htmlJson: MubuHtmlNode;
  private resources: Map<string, IResource> = new Map();
  protected freeNodes: Map<string, IMinderNode> = new Map();
  protected imageNodes: Map<string, IMinderNode> = new Map();
  constructor(htmlJson: MubuHtmlNode) {
    this.htmlJson = htmlJson;
  }
  getNodeStruct(source: MubuHtmlNode): string {
    throw new Error("Method not implemented.");
  }
  getNodeId(source: MubuHtmlNode): string {
    /**
     * 没有关联线和概要可以直接生成
     */
    return nanoid();
  }
  getNodeWidth(source: MubuHtmlNode): number | undefined {
    throw new Error("Method not implemented.");
  }
  /**
   * 解析链接文本
   */
  private getLinkText(elem: MubuHtmlNode): string {
    if (elem.a && elem.a.span && elem.a.span["#text"]) {
      return elem.a.span["#text"];
    }
    return "";
  }
  /**
   * 解析 span string 类型
   */
  private getSpanStringText(element: MubuHtmlNode): string {
    let text = "";
    text += element.span;
    text += this.getLinkText(element);
    return text;
  }
  /**
   * 解析 span array 类型
   */
  private getSpanArrayText(element: MubuHtmlNode): string {
    if (!element || !element.span || !Array.isArray(element.span)) {
      return "";
    }

    let text = "";
    element.span.forEach((item: { [x: string]: string }) => {
      if (typeof item === "string" || typeof item === "number") {
        text += item;
      } else {
        text += item["#text"];
      }
    });
    text += this.getLinkText(element);
    return text;
  }
  /**
   * 解析 span object 类型
   */
  private getSpanObjectText(element: MubuHtmlNode): string {
    if (!element || !element.span || typeof element.span !== "object") {
      return "";
    }

    let text = "";
    text += element.span["#text"];
    text += this.getLinkText(element);
    return text;
  }
  /**
   * 解析主体内容
   */
  private parseMainText(div: MubuHtmlNode[]): string {
    let text = "";
    for (let index = 0; index < div.length; index++) {
      const element = div[index];

      // 解析根节点
      if (element["#text"] && element["@_class"] === "title") {
        text = element["#text"];
        break;
      }

      // 解析span string 类型
      if (
        (typeof element.span === "string" ||
          typeof element.span === "number") &&
        element["@_class"] !== "publish"
      ) {
        text = this.getSpanStringText(element);
        break;
      }

      // 解析span数组
      if (Array.isArray(element.span)) {
        text = this.getSpanArrayText(element);
        break;
      }

      // 解析span对象
      if (typeof element.span === "object") {
        text = this.getSpanObjectText(element);
        break;
      }

      // 解析单独 a 文本
      if (element.a) {
        text = this.getLinkText(element);
        break;
      }

      // 解析收起节点后新的结构：新增div标签数组
      if (Array.isArray(element.div)) {
        text = this.parseMainText(element.div);
        break;
      }
    }

    return text;
  }
  getNodePlainText(source: MubuHtmlNode): { text: string } {
    const { div } = source;
    let text = "";

    if (Array.isArray(div)) {
      text = this.parseMainText(div);
    }
    // 其他特殊格式
    else if (typeof div === "object") {
      if (div["#text"]) {
        text = div["#text"];
      }
      // vip 节点穿进去结构
      else if (Array.isArray(div.div)) {
        text = this.getNodePlainText(div).text;
      }
    }

    return {
      text,
    };
  }
  getNodeRichText(source: MubuHtmlNode): { richText: string } | undefined {
    throw new Error("Method not implemented.");
  }
  getNodePlainNote(source: MubuHtmlNode): { note: string } | undefined {
    const { div } = source;

    if (Array.isArray(div)) {
      for (let index = 0; index < div.length; index++) {
        const element = div[index];
        if (element["@_class"] === "note mm-editor") {
          let note = "";
          if (typeof element.span === "string") {
            note = element.span;
          } else if (Array.isArray(element.span)) {
            note = this.getSpanArrayText(element);
          } else if (typeof element.span === "object") {
            note = this.getSpanObjectText(element);
          }
          return {
            note,
          };
        }
      }
    }

    return;
  }
  getNodeRichNote(source: MubuHtmlNode): { richNote: string } | undefined {
    throw new Error("Method not implemented.");
  }
  getNodeImage(source: MubuHtmlNode): IResource | undefined {
    let img;
    if (source.ul && source.ul["@_class"] === "image-list") {
      const list = source.ul.li;
      img = (list as any).img;
    }

    if (!img) {
      return;
    }

    const resource: IResource = {
      url: img["@_src"],
      resourceId: "",
      width: 160,
      height: 0,
    };

    return resource;
  }
  getAllImageResources(): Map<string, IResource> {
    return this.resources;
  }
  updateImageNodes(resources: Map<string, IResource>): void {
    resources.forEach((r, nodeId) => {
      const node = this.imageNodes.get(nodeId);
      if (node) {
        node.data.resourceId = r.resourceId;
        node.data.imageSize = {
          width: r.width,
          height: r.height,
        };
        node.data.image = r.url;
      }
    });
  }
  getNodeHyperLink(source: MubuHtmlNode): string | undefined {
    let result = "";
    const nodes = source.div;
    if (Array.isArray(nodes)) {
      const target = nodes.find((node) => node.a);
      if (target && target.a && target.a["@_class"] !== "publish-link") {
        result = target.a["@_href"] || "";
      }
    }
    return result;
  }
  getFreeNodePosition(source: MubuHtmlNode): { x: number; y: number } {
    return { x: 0, y: 0 };
  }
  getFreeNodeTrees(): IMinderNode[] {
    return [];
  }
  getRelativeLinks(source: unknown): IRelativeLink[] {
    return [];
  }
  convert(): IMindData {
    const node = this.htmlJson;
    const mindData: IMindData = {
      root: this.parseMubuHtmlNode(node),
      theme: "classical1",
      template: "default",
      relativeLinks: [],
      subTree: [],
    };

    return mindData;
  }
  private parseMubuHtmlNode(source: MubuHtmlNode): IMinderNode {
    const data: INodeData = {
      id: this.getNodeId(source),
      text: this.getNodePlainText(source).text,
    };
    const plainNote = this.getNodePlainNote(source);
    if (plainNote) {
      data.note = plainNote.note;
    }

    const hyperLink = this.getNodeHyperLink(source);
    if (hyperLink) {
      data.hyperlink = hyperLink;
    }

    const node: IMinderNode = {
      data,
      children: [],
    };

    /**
     * 图片数据需等上传成功后再设置节点的数据
     */
    const image = this.getNodeImage(source);
    if (image) {
      this.resources.set(data.id, image);
      this.imageNodes.set(data.id, node);
    }

    /**
     * 获取节点的子节点内容
     * @param node
     * @returns
     */
    const findChildren = (
      node: MubuHtmlNode[]
    ): ListContent | ListContent[] => {
      if (node[node.length - 1].ul) {
        return node[node.length - 1].ul?.li || [];
      }

      // 被收起节点导出后的结构数据
      const node2 = node.find((item) => Array.isArray(item.div));
      if (node2?.div) {
        return findChildren(node2.div as MubuHtmlNode[]);
      }

      return [];
    };

    /**
     * div 数组|对象解析
     * @param node
     * @returns
     */
    const parseChildDiv = (
      node: MubuHtmlNode | MubuHtmlNode[] | undefined
    ): ListContent | ListContent[] | undefined => {
      if (Array.isArray(node)) {
        return findChildren(node);
      } else if (typeof node === "object") {
        return parseChildDiv(node.div);
      }
    };

    // 判断子元素
    let children: any = [];

    // 1、根节点（过滤掉图片节点，不然会被解析成单独的节点，应该解析到对应的节点里面）
    if (source.ul && source.ul["@_class"] !== "image-list") {
      children = source.ul.li;
    }
    // 2、其他节点 | 被收起节点导出的
    else {
      children = parseChildDiv(source.div);
    }

    // children 类型：数组|对象
    if (Array.isArray(children)) {
      children.forEach((c) => {
        node.children.push(this.parseMubuHtmlNode(c));
      });
    } else {
      node.children.push(this.parseMubuHtmlNode(children));
    }

    return node;
  }
}
