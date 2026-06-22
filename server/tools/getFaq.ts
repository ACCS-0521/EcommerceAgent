import type { Faq } from '../types/Faq.js';
import type { ToolResult } from '../types/ToolResult.js';
import { readDataFile } from '../utils/fileReader.js';

export async function getFaq(input: {
  question: string;
}): Promise<ToolResult<Faq>> {
  const question = input.question.trim().toLocaleLowerCase('zh-CN');
  if (!question) return { success: false, error: '请提供问题' };

  const entries = await readDataFile<Faq[]>('faq.json');
  const ranked = entries
    .map((entry) => ({
      entry,
      score: [entry.question, ...entry.keywords].filter((term) =>
        question.includes(term.replace(/[？?]/g, '').toLocaleLowerCase('zh-CN')),
      ).length,
    }))
    .sort((left, right) => right.score - left.score);
  const match = ranked[0];

  return match && match.score > 0
    ? { success: true, data: match.entry }
    : { success: false, error: '未找到相关 FAQ' };
}
