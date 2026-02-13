
export interface Alarm {
  id: string;
  time: string; // HH:mm
  label: string;
  enabled: boolean;
  repeat: string[]; // ['Mon', 'Tue', ...]
}

export interface UserProfile {
  name: string;
  photoBase64: string | null;
  voiceName: string;
}

export enum AppView {
  MAIN = 'MAIN',
  SETTINGS = 'SETTINGS',
  ALARMING = 'ALARMING'
}
