export enum VoiceGender {
  MALE = 'Masculino',
  FEMALE = 'Feminino'
}

export interface VoiceOption {
  id: string;
  name: string;
  gender: VoiceGender;
  apiName: string;
  description: string;
}

export enum SpeechTone {
  FRIENDLY = 'Amigável',
  TECHNICAL = 'Técnica',
  CORPORATE = 'Corporativa'
}

// Global window extensions for AI Studio specific APIs
declare global {
  interface Window {
    webkitAudioContext: typeof AudioContext;
    aistudio?: {
      hasSelectedApiKey: () => Promise<boolean>;
      openSelectKey: () => Promise<void>;
    };
  }
}