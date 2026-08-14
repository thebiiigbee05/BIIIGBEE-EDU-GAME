import { defineStore } from 'pinia';
import { ROUND_SECONDS, type Matra } from '../data/types';

export type GameStatus = 'hub' | 'playing' | 'roundEnd';

interface GameState {
  status: GameStatus;
  score: number;
  hp: number;
  timeLeft: number;
  selectedMatra: Matra;
  round: number;
  combo: number;
  bestCombo: number;
  correctHits: number;
  wrongHits: number;
  escaped: number;
}

export const useGameStore = defineStore('game', {
  state: (): GameState => ({
    status: 'hub',
    score: 0,
    hp: 3,
    timeLeft: ROUND_SECONDS,
    selectedMatra: 'กก',
    round: 1,
    combo: 0,
    bestCombo: 0,
    correctHits: 0,
    wrongHits: 0,
    escaped: 0,
  }),

  getters: {
    /** แสดงเวลาแบบ มม:วว เช่น 3:00 */
    timeText(state): string {
      const m = Math.floor(state.timeLeft / 60);
      const s = state.timeLeft % 60;
      return `${m}:${String(s).padStart(2, '0')}`;
    },
    /** คะแนนโบนัสคอมโบ: ยิงติดต่อกันมากขึ้น ยิ่งได้โบนัส (docs/04-chapter-4-game-design.md ข้อ 4.8) */
    comboBonus(state): number {
      return Math.min(state.combo, 10) * 10;
    },
  },

  actions: {
    startRound() {
      this.status = 'playing';
      this.score = 0;
      this.hp = 3;
      this.timeLeft = ROUND_SECONDS;
      this.selectedMatra = 'กก';
      this.combo = 0;
      this.bestCombo = 0;
      this.correctHits = 0;
      this.wrongHits = 0;
      this.escaped = 0;
    },
    selectBullet(matra: Matra) {
      this.selectedMatra = matra;
    },
    /** ยิงถูก — บวกคะแนน + อัปเดตคอมโบ (points จาก Monster + โบนัสคอมโบ) */
    addScore(points: number, combo: number) {
      this.score += points + Math.min(combo, 10) * 10;
      this.combo = combo;
      this.bestCombo = Math.max(this.bestCombo, combo);
      this.correctHits += 1;
    },
    /** ยิงผิด — รีเซ็ตคอมโบ */
    registerWrong() {
      this.combo = 0;
      this.wrongHits += 1;
    },
    /** มอนสเตอร์หนีถึงฐาน — เสีย HP */
    registerEscape() {
      this.escaped += 1;
      if (this.status === 'playing') {
        this.hp = Math.max(0, this.hp - 1);
        if (this.hp === 0) this.endRound();
      }
    },
    /** เรียกทุก 1 วินาทีจาก GameScreen (docs/04-chapter-4-game-design.md — รอบ 3 นาที) */
    tick() {
      if (this.status === 'playing' && this.timeLeft > 0) {
        this.timeLeft -= 1;
        if (this.timeLeft === 0) this.endRound();
      }
    },
    /** จบรอบ (เวลาหมด / HP=0) — เปลี่ยนเป็นหน้าสรุป */
    endRound() {
      if (this.status !== 'playing') return;
      this.status = 'roundEnd';
    },
    backToHub() {
      this.status = 'hub';
    },
  },
});
