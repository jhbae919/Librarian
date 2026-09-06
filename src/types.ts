export type Language = 'ko' | 'en';

export type Phase = 'explore' | 'dialogue';

export interface Stats {
  hp: number;
  maxHp: number;
  str: number;
  mag: number;
  agi: number;
}

export interface Choice {
  label: string;
  action: () => void;
}

export interface DialogueNode {
  speaker: string;
  portrait: string; // 'king' | 'mystic' | 'warrior' | 'mage' | 'scout' | 'alchemist' | 'book' | 'system'
  text: string;
  choices?: Choice[];
}





export interface UIState {
  phase: Phase;
  stats: Stats;
  day: number;
}

