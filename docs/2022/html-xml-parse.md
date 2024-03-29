# Html 解析成 xml

## 相关的库

解析：

- fast-xml-parser
- jsdom

其他库：

- download
- dayjs
- image-size

其他：

- 读取以及设置 File 文件

## 使用案例

### fast-xml-parser

```js
const fs = require("fs");
const { XMLParser } = require("fast-xml-parser");

const parsingOptions = {
  ignoreAttributes: false,
  attributeNamePrefix: "@_",
  allowBooleanAttributes: true,
  alwaysCreateTextNode: true,
  htmlEntities: true,
  ignorePiTags: true,
  leadingZeros: false,
  numParseOptions: {
    hex: false,
    leadingZeros: false,
  },
};

const parser = new XMLParser(parsingOptions);

const xml = fs.readFileSync("./test.html").toString();

// 替换head内容为空，但是内容太多，容易导致爆栈
const filterXml = xml.replace(/<head(([\s\S])*?)<\/head>/, "<head></head>");

// 所以使用截取再拼接
const emptyHead = (value) => {
  const prevHtml = "<html><head></head>";
  const nextHtml = value.split("</head>")[1];
  return prevHtml + nextHtml;
};

const content = parser.parse(filterXml);

fs.writeFileSync(
  "/Users/apple/Desktop/test/content.json",
  JSON.stringify(content)
);

console.log("Finished!!!");
```

### jsdom

```js
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const { content } = require("./html");

const dom = new JSDOM(content);
const document = dom.window.document;
const body = document.body;
```

### download

```js
const download = require("download");

async function downloadImg(keys) {
  for (const key of keys) {
    try {
      const url = details[key].url;
      await download(url, "dist");
    } catch (error) {
      console.log(error.message);
      continue;
    }
  }
}
```

`Promise.all`：

```js
async downloadResources(map: Map<string, IResource>): Promise<void> {
    const commonPath = resourcePath.getFilePath();
    const list: string[] = [];

    map.forEach((r) => {
        if (r.url) {
            list.push(r.url);
        }
    });

    if (commonPath) {
        await Promise.all(list.map((url) => download(url, commonPath)));
    }
}
```

### dayjs

```js
const dayjs = require("dayjs");

dayjs().format("YYYY-MM-DD");
```

### 获取 style 属性的宽高

```js
const getWidthHeight = (source: string): { width: number, height: number } => {
  const res = { width: 0, height: 0 };
  const sizeRegExp = {
    width: /width:\s?\d+px;?/,
    height: /height:\s?\d+px;?/,
  };
  const widthMatch = source.match(sizeRegExp.width);
  const heightMatch = source.match(sizeRegExp.height);
  const getSize = (value: string, taget: string) => {
    const key = taget + ":";
    return value.split(key).reverse()[0].trim().replace(/px;?/, "");
  };

  if (widthMatch) {
    res.width = Number(getSize(widthMatch[0], "width"));
  }
  if (heightMatch) {
    res.height = Number(getSize(heightMatch[0], "height"));
  }
  return res;
};

getWidthHeight("width: 100px;height: 999px;");
```

### image-size

```js
const sizeOf = require("image-size");
const url = require("url");
const http = require("http");

const dimensions = sizeOf("./test.png");

// Protocol "https:" not supported. Expected "http:"
const imgUrl = "http://my-amazing-website.com/image.jpeg";
const options = url.parse(imgUrl);

http.get(options, function (response) {
  const chunks = [];
  response
    .on("data", function (chunk) {
      chunks.push(chunk);
    })
    .on("end", function () {
      const buffer = Buffer.concat(chunks);
      console.log(sizeOf(buffer));
    });
});
```

获取图片真实大小，超出最大值，设置同等比例高度大小：

```js
/**
 * 获取图片真实大小
 * @param path 图片路径
 * @param img 图片属性
 * @returns
 */
function getImgSize(path: string, img: imgSize): imgSize {
  const MAX_WIDTH = 600;
  const size = { width: img.width, height: img.height };
  const { width, height } = sizeOf(path);

  if (width && height) {
    // 超过最大值
    if (width >= MAX_WIDTH) {
      size.width = MAX_WIDTH;
      size.height = Math.ceil((MAX_WIDTH / width) * height);
    }
  }

  return size;
}
```

### 读取 File 内容

```js
const readFileContent = (file) => {
  return new Promise((reslove, rejects) => {
    const reader = new FileReader();

    reader.readAsText(file, "utf-8");

    reader.onload = function (evt) {
      const value = evt.target.result;
      reslove(value);
    };

    reader.onerror = function (err) {
      rejects(err);
    };
  });
};
```

### 设置 File 内容

```js
/**
 * @param {String} details
 * @param {File} file
 * @returns
 */
const setFileContent = (details = "", file = {}) => {
  const { name, type } = file;

  return new File([details], name, { type });
};
```
