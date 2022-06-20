# 前端 Husky+lint-staged+eslint 实现自动化工程增量提交检测

## 理论

- husky 可以在执行 git-hooks 处理一些额外配置任务，比如在 commit-msg 钩子检查提交信息是否规范
- lint-staged 只会对暂存区的文件运行已经配置 linter 或其他任务，比如 prettier 格式化代码

## 操作步骤

### 下载

```sh
yarn add -D husky lint-staged

yarn add -D @commitlint/config-conventional @commitlint/cli
```

### 设置 lint-staged

添加 pre-commit

```sh
npx husky add .husky/pre-commit "yarn lint:staged"

# 如果不生效请使用yarn
yarn husky add .husky/pre-commit "yarn lint:staged"
```

package.json 文件：

```json
{
  "scripts": {
    "prepare": "husky install",
    "lint:staged": "lint-staged"
  },
  "lint-staged": {
    "src/**/*.{js,jsx,css,scss}": ["prettier --write", "eslint --cache --fix"]
  }
}
```

### 设置 commitlint

添加 commit-msg

```sh
npx husky add .husky/commit-msg 'yarn commitlint --edit "$1"'

# 如果不生效请使用yarn
yarn husky add .husky/commit-msg 'yarn commitlint --edit "$1"'

```

commitlint.config.js 文件：

```js
module.exports = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "body-leading-blank": [2, "always"],
    "footer-leading-blank": [1, "always"],
    "header-max-length": [2, "always", 150],
    "subject-empty": [2, "never"],
    "type-empty": [2, "never"],
    "type-enum": [
      2, // type必须输入
      "always",
      [
        "feat", // 新功能
        "fix", // 修复bug
        "style", // 修改格式，删除代码空格、缩进等
        "docs", // 文档、注释修改
        "refactor", // 代码重构，没有功能修改
        "merge", // 代码合并
        "revert", // 版本回滚
        "chore", // 构建过程或辅助工具的变动
        "test",
        "perf",
        "build",
        "ci",
        "revert",
        "wip",
        "workflow",
        "types",
        "release",
      ],
    ],
  },
};
```

## 参考资料

- [前端 Husky+lint-staged+eslint 实现自动化工程增量提交检测](https://juejin.cn/post/7086365265260183583)
- [husky+lint-staged 规范代码提交](https://juejin.cn/post/7027013488132227079)——比较低版本的配置，有解决 sorcetree 无法处理的问题
- [@commitlint/config-conventional]（https://www.npmjs.com/package/@commitlint/config-conventional)
