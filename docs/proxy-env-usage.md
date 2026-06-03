# Local Proxy .env Usage

这个项目使用 `scripts/setup-proxy-env.ps1` 把本机代理写入项目根目录的 `.env` 文件。

脚本只修改当前项目目录里的 `.env`，不会修改系统环境变量，不会修改全局代理，也不会改动全局 Python、Node、Git 或 uv 配置。

## 如何运行

在项目根目录执行：

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\setup-proxy-env.ps1
```

运行后，脚本会自动定位项目根目录，并在 `.env` 中写入下面这个固定标记块：

```text
# === LOCAL_PROXY_BEGIN ===
...
# === LOCAL_PROXY_END ===
```

重复运行脚本时，只会更新这个标记块里的代理配置，不会覆盖 `.env` 中其他内容，例如 API_KEY、TOKEN、SECRET、PATH 等配置。

如果 `.env` 已存在，脚本会先创建备份文件，例如：

```text
.env.backup.20260603_181200
```

## 如何修改代理端口

临时换端口可以这样运行：

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\setup-proxy-env.ps1 -ProxyPort 7890
```

也可以同时修改主机和协议：

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\setup-proxy-env.ps1 -ProxyHost 127.0.0.1 -ProxyPort 7897 -ProxyScheme http
```

## 为什么不要提交 .env 到 GitHub

`.env` 常常会保存 API_KEY、TOKEN、SECRET、账号令牌、私有路径等敏感信息。提交到 GitHub 后，即使之后删除，也可能已经被其他人或自动扫描系统读取。

本项目会忽略：

```text
.env
.env.*
```

同时保留可提交的示例文件：

```text
!.env.example
```

## 为什么不会污染全局环境

这个方案只把代理变量写入项目根目录的 `.env` 文件。`.env` 只是项目本地配置文件，只有项目里的程序、脚本或工具主动读取它时才会生效。

脚本不会调用 `setx`，不会写注册表，不会修改 PowerShell Profile，不会写 Git 全局配置，也不会改动系统代理设置。
