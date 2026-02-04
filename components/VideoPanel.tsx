import React, { useState } from 'react';
import { Video, Download, Loader2, AlertCircle } from 'lucide-react';
import { generateVideo } from '../services/geminiService';

export const VideoPanel: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [loadingStep, setLoadingStep] = useState('');

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsLoading(true);
    setVideoUrl(null);
    setLoadingStep('Iniciando conexão com Veo...');

    try {
      // Fetch needs the API key appended manually for the download link usually,
      // but generateVideo service returns the direct URI. 
      // The browser will handle auth if the link is signed or we append key.
      // Based on guidance: "response.body contains MP4 bytes. You must append an API key..."
      // The service layer handles generation logic.
      
      const uri = await generateVideo(prompt);
      setLoadingStep('Finalizando...');
      
      // We need to fetch the video blob to allow safe playback/download with the key appended
      // Since the guidance says "fetch(`${downloadLink}&key=${process.env.API_KEY}`)"
      // I will do this here to get a blob url.
      const fetchUrl = `${uri}&key=${process.env.API_KEY}`;
      const res = await fetch(fetchUrl);
      if (!res.ok) throw new Error("Falha ao baixar o vídeo gerado.");
      
      const blob = await res.blob();
      const localUrl = URL.createObjectURL(blob);
      setVideoUrl(localUrl);

    } catch (error) {
      console.error(error);
      alert("Erro na geração de vídeo. Verifique se você selecionou uma chave API válida com faturamento habilitado.");
    } finally {
      setIsLoading(false);
      setLoadingStep('');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
       <div className="border-b border-slate-700 pb-4 mb-6">
        <h2 className="text-3xl font-bold text-white mb-2">Criação de Vídeo</h2>
        <p className="text-slate-400">Gere vídeos curtos de alta qualidade usando o modelo Veo. (Até 30s suportado dependendo do prompt/modelo)</p>
      </div>

       <div className="bg-amber-900/20 border border-amber-900/50 rounded-lg p-4 flex gap-3 items-start text-amber-200 mb-6">
         <AlertCircle className="shrink-0 mt-0.5" size={20} />
         <p className="text-sm">
           A geração de vídeo requer uma chave de API selecionada manualmente de um projeto com faturamento ativado. O processo pode levar alguns minutos.
         </p>
       </div>

      <div className="flex flex-col gap-6">
        {/* Input Area */}
        <div className="bg-slate-800 p-2 rounded-xl border border-slate-700 flex flex-col md:flex-row gap-2 shadow-lg">
          <input 
            type="text" 
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Descreva o vídeo (ex: Um gato cyberpunk dirigindo uma moto neon...)"
            className="flex-1 bg-transparent px-4 py-3 text-white placeholder:text-slate-500 outline-none rounded-lg focus:bg-slate-700/50 transition-colors"
            onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
          />
          <button
            onClick={handleGenerate}
            disabled={isLoading || !prompt.trim()}
            className={`
              px-6 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 whitespace-nowrap transition-all
              ${isLoading || !prompt.trim() 
                ? 'bg-slate-700 text-slate-500 cursor-not-allowed' 
                : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/20'}
            `}
          >
             {isLoading ? <Loader2 className="animate-spin" /> : <Video size={20} />}
             <span>{isLoading ? 'Gerando...' : 'Criar Vídeo'}</span>
          </button>
        </div>

        {/* Display Area */}
        <div className={`
          relative w-full aspect-video rounded-xl overflow-hidden border-2 border-dashed border-slate-700 bg-slate-800/50
          flex items-center justify-center transition-all duration-500
          ${videoUrl ? 'border-none bg-black' : ''}
        `}>
          {!videoUrl && !isLoading && (
            <div className="text-center text-slate-500 p-8">
              <Video size={48} className="mx-auto mb-4 opacity-50" />
              <p className="text-lg">Seu vídeo aparecerá aqui</p>
            </div>
          )}

          {isLoading && (
            <div className="flex flex-col items-center justify-center text-emerald-400">
               <Loader2 size={48} className="animate-spin mb-4" />
               <p className="animate-pulse text-lg font-medium">Criando Cena...</p>
               <p className="text-sm text-emerald-500/70 mt-2">{loadingStep || 'Isso pode demorar um pouco...'}</p>
            </div>
          )}

          {videoUrl && (
            <div className="group relative w-full h-full bg-black">
              <video 
                src={videoUrl} 
                controls
                className="w-full h-full object-contain"
                autoPlay
                loop
              />
               <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                 <a 
                   href={videoUrl} 
                   download={`genai-video-${Date.now()}.mp4`}
                   className="flex items-center justify-center p-3 bg-slate-900/80 text-white rounded-full hover:bg-black transition-colors backdrop-blur-sm"
                   title="Baixar Vídeo"
                 >
                   <Download size={24} />
                 </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
