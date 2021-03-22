# 5 个有趣的 Node.js 库，带你走进 彩色 Node.js 世界

## 1、Chalk

Github：[chalk](https://github.com/chalk/chalk)

这是一个能给你的 log 染色的库,让你的代码靓起来 !!

```js
const chalk = require("chalk");
const log = console.log;

// Combine styled and normal strings
log(chalk.blue("Hello") + " World" + chalk.red("!"));

// Compose multiple styles using the chainable API
log(chalk.blue.bgRed.bold("Hello world!"));

// Pass in multiple arguments
log(chalk.blue("Hello", "World!", "Foo", "bar", "biz", "baz"));

// Nest styles
log(chalk.red("Hello", chalk.underline.bgBlue("world") + "!"));

// Nest styles of the same type even (color, underline, background)
log(
  chalk.green(
    "I am a green line " +
      chalk.blue.underline.bold("with a blue substring") +
      " that becomes green again!"
  )
);

// ES2015 template literal
log(`
CPU: ${chalk.red("90%")}
RAM: ${chalk.green("40%")}
DISK: ${chalk.yellow("70%")}
`);

// ES2015 tagged template literal
log(chalk`
CPU: {red ${cpu.totalPercent}%}
RAM: {green ${(ram.used / ram.total) * 100}%}
DISK: {rgb(255,131,0) ${(disk.used / disk.total) * 100}%}
`);

// Use RGB colors in terminal emulators that support it.
log(chalk.keyword("orange")("Yay for orange colored text!"));
log(chalk.rgb(123, 45, 67).underline("Underlined reddish color"));
log(chalk.hex("#DEADED").bold("Bold gray!"));
```

## 2、Inquirer.js

Github：[Inquirer.js](https://github.com/SBoudrias/Inquirer.js)

一个非常好看的交互式命令行用户界面,用它来定制你的 CLI 吧 ！

```js
var inquirer = require("inquirer");
inquirer
  .prompt([
    /* Pass your questions in here */
  ])
  .then(answers => {
    // Use user feedback for... whatever!!
  })
  .catch(error => {
    if (error.isTtyError) {
      // Prompt couldn't be rendered in the current environment
    } else {
      // Something else when wrong
    }
  });
```

Checkbox list examples：

```js
var inquirer = require("inquirer");

inquirer
  .prompt([
    {
      type: "checkbox",
      message: "Select toppings",
      name: "toppings",
      choices: [
        new inquirer.Separator(" = The Meats = "),
        {
          name: "Pepperoni"
        },
        {
          name: "Ham"
        },
        {
          name: "Ground Meat"
        },
        {
          name: "Bacon"
        },
        new inquirer.Separator(" = The Cheeses = "),
        {
          name: "Mozzarella",
          checked: true
        },
        {
          name: "Cheddar"
        },
        {
          name: "Parmesan"
        },
        new inquirer.Separator(" = The usual ="),
        {
          name: "Mushroom"
        },
        {
          name: "Tomato"
        },
        new inquirer.Separator(" = The extras = "),
        {
          name: "Pineapple"
        },
        {
          name: "Olives",
          disabled: "out of stock"
        },
        {
          name: "Extra cheese"
        }
      ],
      validate: function(answer) {
        if (answer.length < 1) {
          return "You must choose at least one topping.";
        }

        return true;
      }
    }
  ])
  .then(answers => {
    console.log(JSON.stringify(answers, null, "  "));
  });
```

输出：

```shell
? Select toppings (Press <space> to select, <a> to toggle
 all, <i> to invert selection)
  = The Meats =
❯◯ Pepperoni
 ◯ Ham
 ◯ Ground Meat
 ◯ Bacon
  = The Cheeses =
 ◉ Mozzarella
(Move up and down to reveal more choices)
```

## 3、Ora

Github：[ora](https://github.com/sindresorhus/ora)

```js
const ora = require("ora");

const spinner = ora("Loading unicorns").start();

setTimeout(() => {
  spinner.color = "cyan";
  spinner.text = "Loading rainbows";
}, 1000);

setTimeout(() => {
  spinner.text = "Loading success";
  spinner.succeed();
  // spinner.fail();
}, 3000);
```

输出（icon 是有对应颜色的）：

```shell
⠧ Loading rainbows
✔ Loading success
```

## 4、figlet.js

Github：[figlet.js](https://github.com/patorjk/figlet.js)

```js
var figlet = require("figlet");

figlet("Hello World!!", function(err, data) {
  if (err) {
    console.log("Something went wrong...");
    console.dir(err);
    return;
  }
  console.log(data);
});
```

然后输出：

```shell
  _   _      _ _        __        __         _     _ _ _
 | | | | ___| | | ___   \ \      / /__  _ __| | __| | | |
 | |_| |/ _ \ | |/ _ \   \ \ /\ / / _ \| '__| |/ _` | | |
 |  _  |  __/ | | (_) |   \ V  V / (_) | |  | | (_| |_|_|
 |_| |_|\___|_|_|\___/     \_/\_/ \___/|_|  |_|\__,_(_|_)

```

## 5、boxen

Github：[boxen](https://github.com/sindresorhus/boxen)

```js
const boxen = require("boxen");

console.log(boxen("Hello World", { padding: 1, borderColor: "yellow" }));

console.log(
  boxen("I LOVE YOU", {
    padding: 1,
    margin: 1,
    borderStyle: "classic",
    borderColor: "red",
    backgroundColor: "magenta"
  })
);
```

输出效果：

```shell
┌─────────────────┐
│                 │
│   Hello World   │
│                 │
└─────────────────┘

   +----------------+
   |                |
   |   I LOVE YOU   |
   |                |
   +----------------+
```

## 资料

- [📦 5 个有趣的 Node.js 库,带你走进 彩色 Node.js 世界 🎉](https://juejin.im/post/5de4b6caf265da05fc66d9af)
