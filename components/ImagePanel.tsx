import React, { useState } from 'react';
import { Image as ImageIcon, Download, Loader2 } from 'lucide-react';
import { generateImage } from '../services/geminiService';

export const ImagePanel: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsLoading(true);
    setGeneratedImage(null);
    try {
      const base64Data = await generateImage(prompt);
      setGeneratedImage(`data:image/png;base64,${base64Data}`);
    } catch (error) {
      console.error(error);
      alert("Erro ao gerar imagem. É necessário selecionar uma chave API válida.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
       <div className="border-b border-slate-700 pb-4 mb-6">
        <h2 className="text-3xl font-bold text-white mb-2">Geração de Imagem 4K</h2>
        <p className="text-slate-400">Crie visuais impressionantes em ultra-alta definição com apenas um prompt.</p>
      </div>

      <div className="flex flex-col gap-6">
        {/* Input Area */}
        <div className="bg-slate-800 p-2 rounded-xl border border-slate-700 flex flex-col md:flex-row gap-2 shadow-lg">
          <input 
            type="text" 
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Descreva a imagem que você deseja criar..."
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
                : 'bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-900/20'}
            `}
          >
             {isLoading ? <Loader2 className="animate-spin" /> : <ImageIcon size={20} />}
             <span>{isLoading ? 'Criando...' : 'Gerar Imagem'}</span>
          </button>
        </div>

        {/* Display Area */}
        <div className={`
          relative w-full aspect-video rounded-xl overflow-hidden border-2 border-dashed border-slate-700 bg-slate-800/50
          flex items-center justify-center transition-all duration-500
          ${generatedImage ? 'border-none bg-black' : ''}
        `}>
          {!generatedImage && !isLoading && (
            <div className="text-center text-slate-500 p-8">
              <ImageIcon size={48} className="mx-auto mb-4 opacity-50" />
              <p className="text-lg">Sua obra de arte aparecerá aqui</p>
            </div>
          )}

          {isLoading && (
            <div className="flex flex-col items-center justify-center text-purple-400">
               <Loader2 size={48} className="animate-spin mb-4" />
               <p className="animate-pulse">A mágica está acontecendo...</p>
            </div>
          )}

          {generatedImage && (
            <div className="group relative w-full h-full">
              <img 
                src={generatedImage} 
                alt="Generated Art" 
                className="w-full h-full object-contain"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center p-6">
                 <a 
                   href={generatedImage} 
                   download={`genai-art-${Date.now()}.png`}
                   className="flex items-center gap-2 bg-white text-black px-6 py-3 rounded-full font-bold hover:bg-slate-200 transition-colors transform translate-y-4 group-hover:translate-y-0 duration-300"
                 >
                   <Download size={20} />
                   Baixar em 4K
                 </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
