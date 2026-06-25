export interface SafetyDecision {
  intent: string;
  action: 'transferToHuman' | 'refuse';
}

const refusalRules: Array<{ intent: string; pattern: RegExp }> = [
  {
    intent: 'prompt_attack',
    pattern:
      /后台数据库|管理员密码|系统提示词|system_prompt|忽略之前|api\s*key|密钥/i,
  },
  {
    intent: 'privacy_request',
    pattern: /张三的订单|别人的物流|他人(?:订单|物流)|别人的(?:订单|信息)/i,
  },
  {
    intent: 'unauthorized_request',
    pattern: /内部优惠券|改成已签收|修改订单状态/i,
  },
];

const handoffRules: Array<{ intent: string; pattern: RegExp }> = [
  { intent: 'compensation', pattern: /赔我|赔偿|损失谁负责/i },
  { intent: 'legal_issue', pattern: /起诉|律师|法律程序|法律问题/i },
  { intent: 'account_issue', pattern: /账号|登录不了|异常登录|账户异常/i },
  { intent: 'complaint', pattern: /骗子|垃圾平台|投诉|举报|客服态度/i },
  { intent: 'angry_user', pattern: /傻逼|说人话|气死|愤怒/i },
  { intent: 'repeat_failure', pattern: /问三遍|一直解决不了|连续两次|还是没解决/i },
  { intent: 'human_service', pattern: /转人工|找人工|接人工|人工服务|真人客服|我要人工/i },
];

export function evaluateSafetyPolicy(message: string): SafetyDecision | null {
  const normalized = message.trim();

  for (const rule of refusalRules) {
    if (rule.pattern.test(normalized)) {
      return { intent: rule.intent, action: 'refuse' };
    }
  }

  for (const rule of handoffRules) {
    if (rule.pattern.test(normalized)) {
      return { intent: rule.intent, action: 'transferToHuman' };
    }
  }

  return null;
}
