import React, { useState, useRef, useEffect } from 'react';
import { Mic, Play, Download, Loader2, StopCircle, CheckCircle2, Briefcase, Settings, Smile } from 'lucide-react';
import { VOICES, TONES, MAX_WORDS } from '../constants';
import { SpeechTone, VoiceGender } from '../types';
import { generateSpeech } from '../services/geminiService';
import { decodeBase64, decodeAudioData, audioBufferToWav } from '../utils/audioUtils';

export const TTSPanel: React.FC = () => {
  const [text, setText] = useState('');
  const [selectedVoice, setSelectedVoice] = useState(VOICES[0].id);
  const [selectedTone, setSelectedTone] = useState<SpeechTone>(TONES[0]);
  const [isLoading, setIsLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceNodeRef = useRef<AudioBufferSourceNode | null>(null);
  const audioBufferRef = useRef<AudioBuffer | null>(null);

  useEffect(() => {
    return () => {
      if (audioUrl) URL.revokeObjectURL(audioUrl);
      if (sourceNodeRef.current) sourceNodeRef.current.stop();
      if (audioContextRef.current) audioContextRef.current.close();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const wordCount = text.trim().split(/\s+/).filter(w => w.length > 0).length;

  const handleGenerate = async () => {
    if (!text.trim()) return;
    setIsLoading(true);
    setAudioUrl(null);
    if (sourceNodeRef.current) {
        try { sourceNodeRef.current.stop(); } catch(e) {}
    }
    setIsPlaying(false);

    try {
      const voice = VOICES.find(v => v.id === selectedVoice);
      if (!voice) throw new Error("Voz inválida");

      const base64Data = await generateSpeech(text, voice.apiName, selectedTone);
      const rawBytes = decodeBase64(base64Data);

      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)({ sampleRate: 24000 });
      }

      const buffer = await decodeAudioData(rawBytes, audioContextRef.current, 24000, 1);
      audioBufferRef.current = buffer;

      const wavBlob = audioBufferToWav(buffer);
      const url = URL.createObjectURL(wavBlob);
      setAudioUrl(url);

    } catch (error) {
      console.error(error);
      alert("Erro ao gerar áudio. Verifique sua chave API ou tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const togglePlay = () => {
    if (!audioBufferRef.current || !audioContextRef.current) return;

    if (isPlaying) {
      if (sourceNodeRef.current) {
        sourceNodeRef.current.stop();
        sourceNodeRef.current = null;
      }
      setIsPlaying(false);
    } else {
      const source = audioContextRef.current.createBufferSource();
      source.buffer = audioBufferRef.current;
      source.connect(audioContextRef.current.destination);
      source.onended = () => setIsPlaying(false);
      source.start();
      sourceNodeRef.current = source;
      setIsPlaying(true);
    }
  };

  const getToneIcon = (tone: SpeechTone) => {
    switch(tone) {
      case SpeechTone.FRIENDLY: return <Smile size={18} />;
      case SpeechTone.TECHNICAL: return <Settings size={18} />;
      case SpeechTone.CORPORATE: return <Briefcase size={18} />;
      default: return <Smile size={18} />;
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      
      {/* 1. Text Section */}
      <section className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <div className="flex justify-between items-center mb-4">
          <label className="text-sm font-bold text-slate-700">Seu Texto</label>
        </div>
        <div className="relative">
          <textarea
            className="w-full min-h-[180px] p-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 text-lg resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all placeholder:text-slate-400"
            placeholder="Digite ou cole aqui o texto que você deseja converter em áudio..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <div className="absolute bottom-4 right-4 text-xs font-medium text-slate-400">
             <span className={wordCount > MAX_WORDS ? 'text-red-500' : ''}>{wordCount}</span> / {MAX_WORDS} palavras
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* 2. Tone Section (Left Column) */}
        <section className="md:col-span-5 bg-white rounded-2xl p-6 shadow-sm border border-slate-200 h-full">
           <div className="flex items-center gap-2 mb-4">
             <div className="w-1.5 h-1.5 rounded-full bg-indigo-600"></div>
             <label className="text-sm font-bold text-slate-700">Estilo da Narração</label>
           </div>
           
           <div className="space-y-3">
             {TONES.map((tone) => {
               const isSelected = selectedTone === tone;
               return (
                 <button
                   key={tone}
                   onClick={() => setSelectedTone(tone)}
                   className={`
                     w-full flex items-center gap-3 px-4 py-4 rounded-xl border transition-all duration-200 text-left
                     ${isSelected 
                       ? 'border-indigo-500 bg-indigo-50 text-indigo-700 shadow-sm' 
                       : 'border-slate-100 bg-slate-50 text-slate-600 hover:bg-slate-100'}
                   `}
                 >
                   <span className={isSelected ? 'text-indigo-600' : 'text-slate-400'}>
                     {getToneIcon(tone)}
                   </span>
                   <span className="font-semibold">{tone}</span>
                 </button>
               );
             })}
           </div>
        </section>

        {/* 3. Voice Section (Right Column) */}
        <section className="md:col-span-7 bg-white rounded-2xl p-6 shadow-sm border border-slate-200 h-full">
           <div className="flex items-center gap-2 mb-4">
             <div className="w-1.5 h-1.5 rounded-full bg-indigo-600"></div>
             <label className="text-sm font-bold text-slate-700">Escolha a Voz</label>
           </div>

           <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
             {VOICES.map((voice) => {
               const isSelected = selectedVoice === voice.id;
               return (
                 <button
                   key={voice.id}
                   onClick={() => setSelectedVoice(voice.id)}
                   className={`
                     flex flex-col items-center justify-center p-4 rounded-xl border transition-all duration-200 text-center gap-1
                     ${isSelected 
                       ? 'border-indigo-500 bg-indigo-50 shadow-md transform scale-[1.02]' 
                       : 'border-slate-100 bg-slate-50 hover:bg-slate-100 hover:border-slate-200'}
                   `}
                 >
                   <span className={`font-bold text-lg ${isSelected ? 'text-indigo-800' : 'text-slate-700'}`}>
                     {voice.name}
                   </span>
                   <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">
                     {voice.gender}
                   </span>
                   <span className={`text-xs mt-1 ${isSelected ? 'text-indigo-600' : 'text-slate-500'}`}>
                     {voice.description}
                   </span>
                 </button>
               );
             })}
           </div>
        </section>
      </div>

      {/* 4. Action Section */}
      <div className="flex flex-col items-center justify-center pt-4">
        <button
          onClick={handleGenerate}
          disabled={isLoading || wordCount === 0 || wordCount > MAX_WORDS}
          className={`
            relative overflow-hidden group px-10 py-4 rounded-full font-bold text-lg shadow-xl transition-all transform hover:-translate-y-1
            ${isLoading || wordCount === 0 || wordCount > MAX_WORDS
              ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
              : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-200'}
          `}
        >
          <div className="flex items-center gap-3">
             {isLoading ? (
               <Loader2 className="animate-spin" size={24} />
             ) : (
               <div className="bg-white/20 p-1 rounded-full">
                 <Play size={16} fill="currentColor" />
               </div>
             )}
             <span>{isLoading ? 'Gerando Áudio...' : 'Converter para Voz'}</span>
          </div>
        </button>

        {/* Result Player (Floating or Inline) */}
        {audioUrl && !isLoading && (
          <div className="mt-8 w-full max-w-lg animate-fade-in-up">
            <div className="bg-slate-900 rounded-2xl p-4 shadow-2xl flex items-center gap-4 text-white">
               <button 
                 onClick={togglePlay}
                 className="w-12 h-12 rounded-full bg-indigo-500 hover:bg-indigo-400 flex items-center justify-center transition-colors shrink-0"
               >
                 {isPlaying ? <StopCircle size={24} fill="white" /> : <Play size={24} fill="white" className="ml-1" />}
               </button>
               
               <div className="flex-1 min-w-0">
                 <h4 className="font-semibold text-sm truncate">Áudio Gerado</h4>
                 <p className="text-xs text-slate-400">Pronto para reprodução</p>
               </div>

               <div className="h-8 w-px bg-slate-700 mx-2"></div>

               <a 
                 href={audioUrl} 
                 download={`vozify-${Date.now()}.wav`}
                 className="flex flex-col items-center gap-1 text-slate-300 hover:text-white transition-colors p-2"
               >
                 <Download size={20} />
                 <span className="text-[10px] font-medium">WAV</span>
               </a>
               
               {/* Hidden fallback download for MP3 if we had conversion logic, simplified to WAV per request/standard */}
            </div>
          </div>
        )}
      </div>

    </div>
  );
};
