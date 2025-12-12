export type ToneType = 'formal' | 'casual' | 'humorous';
export type StyleType = 'short' | 'standard' | 'manager' | 'developer';

export interface StandupInput {
  yesterday: string;
  today: string;
  blockers: string;
}

export interface StandupOptions {
  tone: ToneType;
  style: StyleType;
}

export interface StandupEntry extends StandupInput, StandupOptions {
  id: string;
  userId?: string;
  generatedText: string;
  createdAt: Date;
}

export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

