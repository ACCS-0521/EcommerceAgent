# Security Policy

## Supported versions

EcommerceAgent 目前处于 MVP 阶段，仅维护最新的 `main` 分支和最新发布版本。

## Reporting a vulnerability

请使用 GitHub 的私密安全公告报告漏洞：

https://github.com/ACCS-0521/EcommerceAgent/security/advisories/new

请勿通过公开 Issue 报告 API Key 泄露、提示词绕过、越权 Tool 调用、隐私数据暴露或其他安全问题。

报告中请包含：

- 问题描述和影响范围
- 可复现的最小步骤
- 已脱敏的日志或截图
- 建议的缓解方式（如有）

维护者会尽快确认报告。在修复完成并协调披露之前，请不要公开漏洞细节。

## Sensitive data

请不要向仓库提交：

- `.env`、API Key、访问令牌、私钥或云服务凭证；
- 真实用户姓名、手机号、地址、身份证号、订单号、物流单号；
- 真实客服对话、投诉材料、支付凭证或售后争议材料；
- 未脱敏的请求日志、模型响应日志或浏览器调试导出。

更多数据和 AI 使用边界见 [CONTENT_NOTICE.md](CONTENT_NOTICE.md)。
