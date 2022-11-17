export interface MubuHtmlContent {
  html: RootHtml;
}
interface RootHtml {
  head: object;
  body: BodyContent;
}
interface BodyContent {
  div: Div;
  ul: List;
}
interface Div {
  div: object[] | object;
}
interface List {
  li: ListContent | ListContent[];
  "@_class": "node-list" | string;
}

export interface ListContent {
  div?: Div[];
  img?: Image;
  "@_class"?: string;
}

interface SpanObject {
  "#text"?: string;
  "@_class"?: string;
}

interface SpanContent {
  span: string | SpanObject | any[];
  [index: string]: any;
}

interface Image {
  "@_src": string;
  "@_style"?: string;
  "@_crossorigin"?: string;
  "@_class"?: string;
}

interface Link {
  span?: SpanObject;
  "@_class"?: string;
  "@_target"?: string;
  "@_spellcheck"?: string;
  "@_rel"?: string;
  "@_href"?: string;
}

export interface MubuHtmlNode {
  div?: MubuHtmlNode | MubuHtmlNode[];
  length?: number;
  span?: SpanContent;
  ul?: List;
  a?: Link;
  img?: Image;
  "#text"?: string;
  "@_class"?: string;
}

export interface imgSize {
  width: number;
  height: number;
}
