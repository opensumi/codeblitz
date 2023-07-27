# core

## client
适配在前端场景下部分服务

- extension kt-ext 的静态文件及文件读取

## server
实现相对 browser 端 的 server 端，使用 Proxy 代理到 server app
最大程度复用 browser 端的代码，只需按照需要实现对应 server path 的服务即可

- DiskFileServicePath 文件系统服务
- ExtensionNodeServiceServerPath 获取 extensions 相关数据服务
- LogServiceForClientPath 日志服务
- CommonServerPath 通用后端服务
- FileSchemeDocNodeServicePath 文件文档服务
