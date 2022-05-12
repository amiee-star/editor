# 技术栈以及文档

- React
  - [官方](https://react.docschina.org/docs/getting-started.html)
  - [菜鸟教程](https://www.runoob.com/react/react-tutorial.html)
- TypeScript
  - [官方](https://www.tslang.cn/docs/handbook/basic-types.html)
  - [菜鸟教程](https://www.runoob.com/typescript/ts-tutorial.html)
- [ES6+](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference)
- [Ant Design](https://ant.design/components/overview-cn/)
- [UmiJS](https://umijs.org/zh-CN/docs)

# 项目目录结构

> - config [UmiJS 配置](#)
>   - config.ts
>   - proxy.ts [各个环境 Host 配置](#)
> - src
>   - assets [附件素材样式](#)
>   - components [React 组件](#)
>   - constant [常量申明](#)
>   - interfaces [TS 类型申明](#)
>   - layouts [UmiJS 全局 layout---index.tsx](#)
>   - lib [三方库,涉及库源码修改](#)
>   - locales [多语言配置](#)
>   - pages [项目主路由页面](#)
>   - services [请求接口](#)
>   - utils [工具函数](#)
>   - app.ts [慎动,参考 UmiJS 文档](#)
>   - global.less [全局样式](#)
>   - global.ts [全局优先执行脚本,参考 UmiJS 文档](#)

# 项目全局变量,对象等

- API_ENV
  > string 类型,各个环境匹配默认"test"
- modalContext
  > Ant Design 框架 Modal 组件的全局调用对象(弹窗内部支持获取上下文) [文档](https://ant.design/components/modal-cn/#components-modal-demo-hooks)

# 全局上下文(Context)组件

    使用 React.useContext(上下文对象)来获取,申明位置:\src\components\provider

1.  浏览模式

    - JMKContext [JMKSDK 暴露](#)
    - UserContext [用户信息,后期接入用户系统](#)
    - panelContext [场景面板控制器上下文](#)

# 重要组件(修改需要@相关开发群)

1. form 组件(src\components\form)
   - 大量双向绑定表单使用
2. jmkui 组件(src\components\jmkui)
   - JMK 场景相关组件,通用组件
3. menus 组件(src\components\menus)
   - 场景菜单组件,布局组件
4. panel 组件(src\components\panel)
   - 场景面板组件,布局组件
5. transitions 组件(src\components\panel)
   - 动画组件,通用组件
6. utils 组件(src\components\utils)
   - 其他组件,通用组件

# 代码规范(待完善)

    重要:尽量无any,无报错

# 命名规范

- components 类 (方便 react-devtool 调试时获取具体虚拟 dom 的组件名,尽早定位 bug)
  - [小写目录名].[小写文件名].tsx
    - export default [目录名][文件名] (注意首字母大写)
- pages 类 (方便 react-devtool 调试时获取具体虚拟 dom 的名称,尽早定位 bug)

  - [小写目录名]
    - [小文件名].tsx
      - export default [目录名][文件名] (注意首字母大写)

- services 类 (方便 TS 调用并进行代码提示)
  - service.[小写服务名].ts
- utils 类 (方便 TS 调用并进行代码提示)
  - [小写组件名].func.ts
  - [小写组件名].util.ts
  - [小写组件名].other.ts
