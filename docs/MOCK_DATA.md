# MOCK_DATA.md

# 目的

第一阶段采用 JSON Mock 数据。

暂不接数据库。

所有业务数据存放于：

data/

目录下。

所有数据之间必须存在关联关系。

保证后续可无缝迁移至 MongoDB。

------

# 数据规模说明

## 开发数据集（Development Dataset）

用于：

- 本地开发
- 调试
- 单元测试
- Function Calling 测试

数量较小，便于维护。

### 当前开发数据量

products: 20

users: 20

orders: 50

logistics: 50

coupons: 20

faq: 50

conversations: 100

------

## 演示数据集（Target Dataset）

用于：

- 项目展示
- 简历项目
- Demo演示

### 最终目标数据量

products: 500

users: 100

orders: 500

logistics: 500

coupons: 50

faq: 100

conversations: 1000

------

# products.json

## 开发数量

20

## 最终数量

500

## 字段

id

name

category

brand

price

stock

sales

rating

colors

specifications

tags

description

faq

## 商品分类

耳机

键盘

鼠标

显示器

充电器

移动电源

数据线

支架

摄像头

麦克风

## 价格范围

19 ~ 2999

## 库存范围

0 ~ 500

------

# users.json

## 开发数量

20

## 最终数量

100

## 字段

userId

name

vipLevel

phone

address

totalOrders

totalConsumption

## 会员等级

普通会员

白银会员

黄金会员

钻石会员

------

# orders.json

## 开发数量

50

## 最终数量

500

## 字段

orderId

userId

productId

quantity

amount

status

paymentStatus

shippingStatus

trackingNo

createTime

## 状态

待支付

已支付

已发货

运输中

已签收

退款中

已退款

## 关联规则

userId 必须存在于 users.json

productId 必须存在于 products.json

trackingNo 必须存在于 logistics.json

------

# logistics.json

## 开发数量

50

## 最终数量

500

## 字段

trackingNo

company

status

estimatedArrival

history

## 物流公司

顺丰

京东

中通

圆通

申通

## history

time

content

必须按时间升序排列

------

# coupons.json

## 开发数量

20

## 最终数量

50

## 字段

couponId

name

discount

minAmount

expireTime

available

## 类型

新人券

满减券

会员券

节日券

------

# faq.json

## 开发数量

50

## 最终数量

100

## 字段

id

question

keywords

answer

## 分类

发货

物流

退款

退货

发票

优惠券

会员

售后

------

# refund_policy.json

## 数量

1

## 字段

sevenDaysReturn

qualityProblemShippingFee

refundTime

openedProductReturn

artificialService

------

# conversations.json

## 开发数量

20

## 最终数量

1000

## 字段

conversationId

userId

messages

## message

role

content

## role

user

assistant

------

# 数据关联关系

users
↓
orders
↓
products

orders
↓
logistics

所有数据必须能够互相查询。

禁止出现：

- 不存在的 userId
- 不存在的 productId
- 不存在的 trackingNo

------

# 数据生成原则

所有 ID 唯一。

所有订单必须关联用户。

所有订单必须关联商品。

所有物流必须关联订单。

禁止孤立数据。

禁止随机无意义数据。

数据内容尽量贴近真实电商场景。

------

# 第一阶段目标

使用开发数据集完成：

- 商品查询
- 商品推荐
- 订单查询
- 物流查询
- FAQ
- 人工转接

待系统稳定后，再扩展至演示数据集规模。