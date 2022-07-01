# JS 工具库文档化 - JSDoc

## 下载

```sh
npm install jsdoc -g

# or
npm install jsdoc -save-dev
```

## 使用

命令行：

```sh
jsdoc a.js b.js ...
```

scripts：

```js
{
  "scripts": {
    "docs": "jsdoc -c jsdoc.json"
  },
}
```

新建 `jsdoc.json`:

```json
{
  "source": {
    "include": ["src/"],
    "exclude": []
  },
  "opts": {
    "template": "node_modules/docdash",
    "encoding": "utf8",
    "destination": "./docs/",
    "recurse": true,
    "verbose": true
  }
}
```

下载 template `docdash`：

```sh
npm install docdash -save-dev
```

## 其他

### 注释

下面介绍一些常见的级块标签：

- `@author` 该类/方法的作者。
- `@class` 表示这是一个类。
- `@function`/@method 表示这是一个函数/方法(这是同义词)。
- `@private` 表示该类/方法是私有的，JSDOC 不会为其生成文档。
- `@name` 该类/方法的名字。
- `@description` 该类/方法的描述。
- `@param` 该类/方法的参数，可重复定义。
- `@return` 该类/方法的返回类型。
- `@link` 创建超链接，生成文档时可以为其链接到其他部分。
- `@example` 创建例子。

比如：

```js
/**
 * @author Mondo
 * @description list 数据结构 转换成 树结构
 * @param {Array} data 需要转换的数据
 * @param {String} id 节点 id
 * @param {String} pid 父级节点 id
 * @param {String} child 子树为节点对象的某个属性值
 * @param {Object} labels 需要新增的字段名集合 { label: 'category_name' }
 * @return {Array}
 *
 * @example
 * formatListToTree({data: [{id:1}, {id: 2}, {id: 3, pid: 1}]})
 * =>
 * [ { id: 1, children: [ {id: 3, pid: 1} ] }, { id: 2 } ]
 */

function formatListToTree({
  data = [],
  id = "id",
  pid = "pid",
  child = "children",
  labels = null,
}) {}
```

### Sample `jsdoc.json`

```json
{
  "tags": {
    "allowUnknownTags": false
  },
  "source": {
    "include": "../js",
    "includePattern": "\\.js$",
    "excludePattern": "(node_modules/|docs)"
  },
  "plugins": ["plugins/markdown"],
  "opts": {
    "template": "assets/template/docdash/",
    "encoding": "utf8",
    "destination": "docs/",
    "recurse": true,
    "verbose": true
  },
  "templates": {
    "cleverLinks": false,
    "monospaceLinks": false
  }
}
```

## 参考资料

- [JS 工具库文档化 - JSDoc](https://juejin.cn/post/6844904160274415623)
- [docdash](https://github.com/clenemt/docdash)
