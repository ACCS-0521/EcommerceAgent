export interface ChatResponse {
  conversationId: string;
  message: string;
  intent?: string;
  toolCalls: string[];
}

export async function sendChat(
  message: string,
  conversationId?: string,
): Promise<ChatResponse> {
  const body: { message: string; conversationId?: string } = { message };
  if (conversationId) body.conversationId = conversationId;

  const response = await fetch('/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as { error?: string } | null;
    throw new Error(payload?.error ?? '消息发送失败，请稍后重试');
  }

  return (await response.json()) as ChatResponse;
}
