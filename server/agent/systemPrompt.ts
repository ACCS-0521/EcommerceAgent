import { readFile } from 'node:fs/promises';
import path from 'node:path';

let cachedPrompt: Promise<string> | undefined;

export function getSystemPrompt(): Promise<string> {
  cachedPrompt ??= loadSystemPrompt();
  return cachedPrompt;
}

async function loadSystemPrompt(): Promise<string> {
  const document = await readFile(
    path.resolve(process.cwd(), 'docs/SYSTEM_PROMPT.md'),
    'utf8',
  );
  return `${document}\n\n可用工具由系统提供。业务数据必须来自工具结果；不要向用户暴露工具名称、内部参数或文件结构。最终回复使用纯文本，不要使用 Markdown。`;
}
