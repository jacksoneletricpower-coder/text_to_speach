import { VoiceGender, VoiceOption, SpeechTone } from './types';

export const VOICES: VoiceOption[] = [
  { 
    id: 'kore', 
    name: 'Kore', 
    gender: VoiceGender.FEMALE, 
    apiName: 'Kore',
    description: 'Voz clara e expressiva.'
  },
  { 
    id: 'zephyr', 
    name: 'Zephyr', 
    gender: VoiceGender.FEMALE, 
    apiName: 'Zephyr',
    description: 'Voz serena e profissional.'
  },
  { 
    id: 'puck', 
    name: 'Puck', 
    gender: VoiceGender.MALE, 
    apiName: 'Puck',
    description: 'Voz jovem e energética.'
  },
  { 
    id: 'charon', 
    name: 'Charon', 
    gender: VoiceGender.MALE, 
    apiName: 'Fenrir', // Mapping Charon UI to Fenrir or Charon API if available. Using Fenrir as placeholder or Charon if valid.
    description: 'Voz profunda e autoritária.'
  },
];

export const TONES = [
  SpeechTone.FRIENDLY,
  SpeechTone.TECHNICAL,
  SpeechTone.CORPORATE
];

export const MAX_WORDS = 1500;
