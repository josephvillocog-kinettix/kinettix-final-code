/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Message {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: string;
}

export interface Ritual {
  id: string;
  title: string;
  description: string;
  category: 'spiritual' | 'physical' | 'communal';
  completed: boolean;
  rewardValue: number;
}

export interface Totem {
  id: string;
  name: string;
  animal: string;
  description: string;
  element: 'Fire' | 'Water' | 'Earth' | 'Air';
  blessingEffect: string;
  iconName: string;
  colorTheme: string;
}

export interface OracleCard {
  id: string;
  name: string;
  symbol: string;
  element: 'Fire' | 'Water' | 'Earth' | 'Air' | 'Spirit';
  keyword: string;
  description: string;
  uprightMeaning: string;
  reversedMeaning: string;
}

export interface SacredScripture {
  originalText: string;
  originalKeyword: string;
  originalCode: string;
  originalFinalCode?: string;
  text: string;
  keyword: string;
  code: string;
  finalcode?: string;
  enabled: boolean;
}

