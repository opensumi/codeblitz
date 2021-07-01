# alipay code review component

## Badges

[![TNPM version][tnpm-image]][tnpm-url]
[![TNPM downloads][tnpm-downloads-image]][tnpm-url]

[tnpm-image]: https://npm.alibaba-inc.com/badge/v/@alipay/cr-component.svg
[tnpm-url]: https://npm.alibaba-inc.com/package/@alipay/cr-component
[tnpm-downloads-image]: https://npm.alibaba-inc.com/badge/d/@alipay/cr-component.svg

---

## Usage

### `monaco-loader.js`

确保 `@alipay/acr-ide/loader` 这个模块导出的 script 脚本是在 `@alipay/acr-ide` 组件初始化之前已经加载 ready 的状态，可通过在 head 中增加对应的标签，如

```html
<head>
  ...
  <script
    src="https://gw.alipayobjects.com/os/lib/ali/kaitian-monaco-loader/1.0.0/loader.js"
    type="text/javascript"
  ></script>
</head>
```

或者使用 `react-helmet`

```jsx
import Helmet from 'react-helmet';

<Helmet>
  <script
    // monaco-loader.js for `@alipay/acr-ide`
    src={require('@alipay/acr-ide/loader')}
    type="text/javascript"
  />
</Helmet>;
```

## Attentions

- 目前 target 是 es2015，是因为 ide-fw 的 target 是 esnext，这样打包的 class 函数，无法在 es5 模式下被继承

## Usage

> WIP
