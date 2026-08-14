import bank from './wordBank.json';
import type { WordEntry } from './types';

const WORDS = bank.words as WordEntry[];

/** คำทั้งหมดในธนาคาร */
export function getWordBank(): WordEntry[] {
  return WORDS;
}

/**
 * สุ่มคำที่ไม่ซ้ำกับคำที่ระบุ (exclude)
 * ถ้าเหลือน้อยจนไม่มีคำใหม่ จะสุ่มจากทั้งหมด (กันเกมค้าง)
 */
export function pickWord(excludeWords: ReadonlySet<string>): WordEntry {
  const pool = WORDS.filter((w) => !excludeWords.has(w.word));
  const source = pool.length > 0 ? pool : WORDS;
  return source[Math.floor(Math.random() * source.length)];
}
