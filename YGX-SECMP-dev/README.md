## 安装与使用

*   本地环境安装 `Node.js 、npm 、pnpm`
*   Node.js 版本建议`v20.15.0`、`v18.15.0`，要求`Node 20+` 版本以上

 ` ( 因为Vite5 不再支持已 EOL 的 Node.js 14 / 16 / 17 / 19，现在需要 Node.js 18 / 20+ )`
  
- Get the project code

```bash
git clone xxxxxxxxxxxxxxxx
```

- Installation dependencies

```bash
pnpm install
```

- 配置接口地址 `.env.development`

```bash
VITE_PROXY = [["/gateway","http://localhost:8080"],["/upload","http://localhost:3300/upload"]]
VITE_GLOB_DOMAIN_URL=http://localhost:8080
```

> 说明：把`http://localhost:8080` 换成自己地址，其他不用改。


- run

```bash
pnpm dev
```


- build

```bash
pnpm build
```
## 技术文档

-   官方文档：[https://help.jeecg.com](https://help.jeecg.com)
-   快速入门：[快速入门](http://jeecg.com/doc/quickstart) | [常见问题](http://help.jeecg.com/qa) 

##   浏览器支持

**本地开发**推荐使用`Chrome 最新版`浏览器，**不支持**`Chrome 90`以下版本。

**生产环境**支持现代浏览器，不支持 IE。

| [![IE](https://raw.githubusercontent.com/alrra/browser-logos/master/src/archive/internet-explorer_9-11/internet-explorer_9-11_48x48.png)](http://godban.github.io/browsers-support-badges/)IE | [![ Edge](https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png)](http://godban.github.io/browsers-support-badges/)Edge | [![Firefox](https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png)](http://godban.github.io/browsers-support-badges/)Firefox | [![Chrome](https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png)](http://godban.github.io/browsers-support-badges/)Chrome | [![Safari](https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari/safari_48x48.png)](http://godban.github.io/browsers-support-badges/)Safari |
| --- | --- | --- | --- | --- |
| not support | last 2 versions | last 2 versions | last 2 versions | last 2 versions |
## 移除的依赖
"@jeecg/online": "3.7.4-beta",
"@jeecg/aiflow": "1.1.1",
##   其他
1:本框架保留了原框架绝大部分demo\组件使用示例代码,以便参考使用，如不需要各项目可自行删除相关代码及依赖。
可删除文件夹为views下：dashboard、demo、openapi、report
2:env文件中VITE_GLOB_APP_SHORT_NAME值必须修改，严禁使用初始值。
3:api文件夹下应只包含系统公共接口，其余接口应在各自模块文件中添加。
4:静态图片等资源文件添加时，应尽量添加在assets/business文件夹下,以便后续升级维护。
5:mock功能根据实际情况使用，如不需要可自行删除相关代码及依赖。
6:流程引擎相关代码，可根据实际项目进行删减，如不需要可直接删除public/static/bpmnjs文件夹、src/views/system/workFlow文件夹。