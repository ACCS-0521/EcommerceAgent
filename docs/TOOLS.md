# TOOLS.md

# Tool 设计原则

Tool 返回真实数据。

禁止大模型编造业务数据。

所有业务数据必须通过 Tool 获取。

Tool 不负责生成自然语言。

Tool 只负责返回 JSON。

大模型负责组织最终回复。

------

# getProduct

作用：

查询商品信息。

输入：

```json
{
  "productName": "无线蓝牙耳机"
}
```

返回：

```json
{
  "success": true,
  "data": {
    "id": "P100001",
    "name": "无线蓝牙耳机",
    "price": 199,
    "stock": 86,
    "colors": [
      "黑色",
      "白色"
    ],
    "description": "支持主动降噪"
  }
}
```

数据来源：

products.json

------

# recommendProduct

作用：

根据用户需求推荐商品。

输入：

```json
{
  "priceRange": 300,
  "tags": [
    "运动",
    "降噪"
  ]
}
```

返回：

```json
{
  "success": true,
  "products": [
    {
      "name": "无线蓝牙耳机",
      "price": 199
    }
  ]
}
```

数据来源：

products.json

------

# getOrder

作用：

查询订单。

输入：

```json
{
  "orderId": "ORD202600001"
}
```

返回：

```json
{
  "success": true,
  "data": {
    "status": "已发货",
    "paymentStatus": "已支付",
    "shippingStatus": "运输中"
  }
}
```

数据来源：

orders.json

------

# getLogistics

作用：

查询物流。

输入：

```json
{
  "trackingNo": "SF123456789"
}
```

返回：

```json
{
  "success": true,
  "data": {
    "company": "顺丰",
    "status": "运输中",
    "estimatedArrival": "2026-06-25"
  }
}
```

数据来源：

logistics.json

------

# getCoupon

作用：

查询优惠券。

输入：

```json
{
  "userId": "U10001"
}
```

返回：

```json
{
  "success": true,
  "coupons": [
    {
      "name": "新人券",
      "discount": 10
    }
  ]
}
```

数据来源：

coupons.json

------

# getFaq

作用：

查询 FAQ。

输入：

```json
{
  "question": "多久发货"
}
```

返回：

```json
{
  "success": true,
  "answer": "一般48小时内发货"
}
```

数据来源：

faq.json

------

# getRefundPolicy

作用：

查询售后规则。

输入：

```json
{
  "question": "支持退货吗"
}
```

返回：

```json
{
  "success": true,
  "sevenDaysReturn": true,
  "refundTime": "1~3个工作日"
}
```

数据来源：

refund_policy.json

------

# transferToHuman

作用：

转人工。

输入：

```json
{}
```

返回：

```json
{
  "success": true,
  "message": "已转接人工客服",
  "contact": "service001"
}
```

数据来源：

固定配置

------

# Tool 设计规则

Tool 不输出自然语言。

Tool 不负责推理。

Tool 不负责推荐理由。

Tool 只返回 JSON。

大模型负责：

理解用户问题。

决定调用哪个 Tool。

根据 Tool 返回结果生成最终回复。

------

# 第一阶段 Tool

必须完成：

getProduct

recommendProduct

getOrder

getLogistics

getCoupon

getFaq

getRefundPolicy

transferToHuman

禁止新增复杂 Tool。

先完成 MVP。