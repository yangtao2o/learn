## GitLab CI 配置

### .gitlab-ci.yml

```yml
cache:
  key: ${CI_COMMIT_REF_SLUG}
  paths:
    - node_modules/
    - .next/cache/

stages:
  - deploy

build:
  stage: deploy
  when: manual
  before_script:
    - yarn
    - yarn build
  script:
    - pm2 start ecosystem.config.js --env test
```

注意：其实这里`pm2 start ecosystem.config.js --env test`中的`--env test`是不起作用的，主要为了告知当前执行的环境是什么，因为构建的时候就已经确定了 env，比如`"build:prod": "export APP_ENV=production && next build"`。

### ecosystem.config.js

```js
module.exports = {
  apps: [
    {
      name: 'xxx.xxx.com',
      script: './node_modules/.bin/next',
      args: ['start', '-p', '5010'],
      instances: 4,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'development',
      },
      env_test: {
        APP_ENV: 'test',
        NODE_ENV: 'production',
      },
      env_prep: {
        APP_ENV: 'prep',
        NODE_ENV: 'production',
      },
      env_production: {
        APP_ENV: 'production',
        NODE_ENV: 'production',
      },
    },
  ],
}
```

### package.json

```json
{
  "scripts": {
    "build": "SA_ENV=default next build",
    "build:prep": "export APP_ENV=prep && next build",
    "build:prod": "export APP_ENV=production && next build"
  }
}
```

## 参考资料

- [5. GitLab CI 流水线配置文件.gitlab-ci.yml 详解](https://meigit.readthedocs.io/en/latest/gitlab_ci_.gitlab-ci.yml_detail.html)
- [GITLAB CI/CD 前端缓存优化](https://juejin.cn/post/6951263132123988004)
- [GitLab CI/CD 在 Node.js 项目中的实践](https://cloud.tencent.com/developer/article/1484516)
